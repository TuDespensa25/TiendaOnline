/**
 * Sube las imagenes de /images a Cloudinary conservando el nombre de archivo
 * como public_id, y escribe el mapa nombre -> public_id que luego alimenta
 * la tabla de productos en Supabase.
 *
 * Usa un upload preset SIN FIRMA, asi que no hace falta ninguna clave secreta:
 * los dos valores que necesita ya viajan en el navegador y no son secretos.
 * Se leen del entorno para no dejarlos escritos aqui dentro.
 *
 *   export CLOUDINARY_CLOUD_NAME=...
 *   export CLOUDINARY_UPLOAD_PRESET=...
 *
 *   node scripts/migrar-cloudinary.mjs                 # ensayo, no sube nada
 *   node scripts/migrar-cloudinary.mjs --subir --solo placeholder.webp
 *   node scripts/migrar-cloudinary.mjs --subir         # sube todas
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR_IMAGENES = join(RAIZ, "images");
const MAPA = join(RAIZ, "scripts", "mapa-cloudinary.json");

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
const CARPETA = process.env.CLOUDINARY_FOLDER || "tudespensa25/productos";

const args = process.argv.slice(2);
const SUBIR = args.includes("--subir");
const SOLO = args.includes("--solo") ? args[args.indexOf("--solo") + 1] : null;

/**
 * public_id a partir del nombre de archivo, normalizado a ASCII.
 * Los acentos y los puntos rompen las URLs de Cloudinary: el ultimo punto lo
 * interpreta como la extension, asi que "banner17.m" se serviria mal.
 *   pollocaja.webp   -> pollocaja
 *   3años.webp       -> 3anos
 *   banner17.m.webp  -> banner17-m
 */
export function publicIdDe(archivo) {
  return basename(archivo, extname(archivo))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** public_id con la ruta incluida: tudespensa25/productos/pollocaja */
export function idCompleto(archivo, carpeta = CARPETA) {
  return `${carpeta}/${publicIdDe(archivo)}`;
}

/** Dos archivos distintos no pueden acabar con el mismo public_id. */
export function colisiones(archivos) {
  const porId = new Map();
  for (const a of archivos) {
    const id = publicIdDe(a);
    porId.set(id, [...(porId.get(id) || []), a]);
  }
  return [...porId.entries()].filter(([, v]) => v.length > 1);
}

async function subirUna(archivo) {
  const datos = await readFile(join(DIR_IMAGENES, archivo));
  const form = new FormData();
  form.append("file", new Blob([datos]), archivo);
  form.append("upload_preset", PRESET);
  // La ruta va DENTRO del public_id, no en "folder". En cuentas con carpetas
  // dinamicas, "folder" solo coloca el asset en el panel y deja el public_id
  // pelado, asi que dos imagenes de proyectos distintos podrian chocar en la
  // raiz. Metiendo la ruta en el id funciona igual en los dos modos.
  form.append("public_id", idCompleto(archivo));
  // Ademas del id, esto lo coloca en su carpeta dentro del panel de Cloudinary.
  form.append("asset_folder", CARPETA);
  form.append("tags", "tudespensa25,producto");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: form,
  });

  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(cuerpo?.error?.message || `HTTP ${res.status}`);
  return cuerpo;
}

async function main() {
  if (!CLOUD || !PRESET) {
    console.error("Faltan CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET en el entorno.");
    process.exit(1);
  }

  let archivos = (await readdir(DIR_IMAGENES)).filter((f) => /\.(webp|png|jpe?g)$/i.test(f));
  if (SOLO) archivos = archivos.filter((f) => f === SOLO);

  console.log(`carpeta destino: ${CARPETA}`);
  console.log(`archivos: ${archivos.length}\n`);

  const choques = colisiones(archivos);
  if (choques.length) {
    console.error("PARADO: varios archivos comparten public_id y se pisarian:");
    choques.forEach(([id, files]) => console.error(`  ${id}  <-  ${files.join(", ")}`));
    process.exit(1);
  }

  if (!SUBIR) {
    console.log("ENSAYO. No se ha subido nada. Anade --subir para hacerlo de verdad.");
    console.log("public_id que se crearian:");
    archivos.slice(0, 5).forEach((f) => console.log(`  ${f}  ->  ${idCompleto(f)}`));
    if (archivos.length > 5) console.log(`  ...y ${archivos.length - 5} mas`);
    return;
  }

  const mapa = {};
  const fallos = [];
  let yaExistian = 0;
  for (const [i, archivo] of archivos.entries()) {
    try {
      const local = (await readFile(join(DIR_IMAGENES, archivo))).length;
      const r = await subirUna(archivo);
      mapa[archivo] = { publicId: r.public_id, bytes: r.bytes, ancho: r.width, alto: r.height };

      const avisos = [];
      // Si el preset trae "Disallow public ID" activado, el public_id vuelve
      // con un nombre aleatorio y el mapa deja de ser predecible.
      if (r.public_id !== idCompleto(archivo)) avisos.push("public_id CAMBIADO por el preset");
      // Sin firma, Cloudinary no sobrescribe nunca: si el id ya existia te
      // devuelve el asset viejo como si todo hubiera ido bien. El tamano lo delata.
      if (r.bytes !== local) { avisos.push(`YA EXISTIA, no se ha reemplazado (${r.bytes}B en la nube vs ${local}B local)`); yaExistian++; }

      const cola = avisos.length ? `   <-- ${avisos.join(" · ")}` : "";
      console.log(`[${i + 1}/${archivos.length}] ${archivo} -> ${r.public_id}${cola}`);
    } catch (e) {
      fallos.push({ archivo, error: e.message });
      console.error(`[${i + 1}/${archivos.length}] FALLO ${archivo}: ${e.message}`);
    }
  }

  await writeFile(MAPA, JSON.stringify(mapa, null, 2), "utf8");
  console.log(`\nsubidas: ${Object.keys(mapa).length}   fallos: ${fallos.length}`);
  if (yaExistian) {
    console.log(`ATENCION: ${yaExistian} ya estaban en Cloudinary y NO se han reemplazado.`);
    console.log("Sin firma no se puede sobrescribir. Para reemplazarlas, borralas");
    console.log("primero desde el panel de Cloudinary y vuelve a ejecutar.");
  }
  console.log("mapa escrito en scripts/mapa-cloudinary.json");
  if (fallos.length) console.log(fallos);
}

function autoComprobacion() {
  const casos = [
    ["pollocaja.webp", "pollocaja"],
    ["3años.webp", "3anos"],
    ["humaré.webp", "humare"],
    ["banner17.m.webp", "banner17-m"],
    ["1.5lt.webp", "1-5lt"],
    ["res.png", "res"],
  ];
  for (const [entrada, esperado] of casos) {
    const real = publicIdDe(entrada);
    if (real !== esperado) throw new Error(`publicIdDe(${entrada}) dio ${real}, esperaba ${esperado}`);
  }
  if (idCompleto("pollocaja.webp", "x/y") !== "x/y/pollocaja") throw new Error("idCompleto mal");
  if (colisiones(["a.webp", "A.png", "b.webp"]).length !== 1) {
    throw new Error("no detecto la colision a/A");
  }
  if (colisiones(["uno.webp", "dos.webp"]).length !== 0) {
    throw new Error("invento una colision donde no la hay");
  }
  console.log("auto-comprobacion OK");
}

if (args.includes("--test")) autoComprobacion();
else await main();
