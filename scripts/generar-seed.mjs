/**
 * Lee los productos que hoy viven dentro de app.js y genera
 * supabase/02-datos.sql con las categorias, los municipios, los 153 productos
 * y en que municipio se vende cada uno.
 *
 *   node scripts/generar-seed.mjs
 *
 * No toca nada: solo escribe el .sql para que lo pegues en Supabase.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = join(RAIZ, "supabase", "02-datos.sql");

/** Escapa una cadena para SQL: la comilla simple se duplica. */
export function sql(v) {
  if (v === null || v === undefined || v === "") return "null";
  return `'${String(v).replace(/'/g, "''")}'`;
}

/** Extrae los objetos de producto del array de app.js. */
function leerProductos(fuente) {
  const ini = fuente.indexOf("const productos = [");
  const fin = fuente.indexOf("const productosContainer");
  const bloque = fuente.slice(ini, fin);

  // Cada objeto de primer nivel; los corchetes internos (municipios) se
  // permiten dentro para no cortar el objeto por la mitad.
  const objetos = bloque.match(/\{(?:[^{}]|\[[^\]]*\])*\}/g) || [];

  return objetos
    .map((o) => {
      const campo = (re) => (o.match(re) || [])[1];
      const nombre = campo(/nombre:\s*"((?:[^"\\]|\\.)*)"/);
      if (!nombre) return null;

      const municipios = (() => {
        const m = o.match(/municipios:\s*\[([^\]]*)\]/);
        return m ? [...new Set(m[1].match(/\d+/g) || [])].map(Number) : [];
      })();

      return {
        id: Number(campo(/\bid:\s*(\d+)/)),
        nombre: nombre.trim(),
        precio: Number(campo(/precio:\s*([\d.]+)/) ?? 0),
        imagen: campo(/imagen:\s*"([^"]*)"/) || null,
        descripcion: (campo(/description:\s*"((?:[^"\\]|\\.)*)"/) || "").trim(),
        categoria: (campo(/categoria:\s*"([^"]*)"/) || "Sin categoria").trim(),
        descuento: Number(campo(/descuento:\s*([\d.]+)/) ?? 0),
        reciente: Number(campo(/\breciente:\s*(\d+)/) ?? 0) === 1,
        tiempoLimite: campo(/tiempoLimite:\s*(\d+)/) ? Number(campo(/tiempoLimite:\s*(\d+)/)) : null,
        municipios,
      };
    })
    .filter((p) => p && Number.isFinite(p.id));
}

/** Extrae provincias y municipios del objeto ubicaciones de app.js. */
function leerMunicipios(fuente) {
  const ini = fuente.indexOf("provincias: {");
  const bloque = fuente.slice(ini, fuente.indexOf("provinciaSeleccionada"));
  const salida = [];
  const reProv = /"([^"]+)":\s*\{\s*id:\s*\d+,\s*municipios:\s*\{([^}]*)\}/g;
  let m;
  while ((m = reProv.exec(bloque))) {
    const provincia = m[1];
    for (const [, nombre, id] of m[2].matchAll(/"([^"]+)":\s*(\d+)/g)) {
      salida.push({ id: Number(id), provincia, nombre });
    }
  }
  return salida;
}

/** Fila SQL de un producto. */
function filaProducto(p, mapa) {
  const imagen = p.imagen && mapa[p.imagen] ? mapa[p.imagen].publicId : null;
  return `  (${p.id}, ${sql(p.nombre)}, ${sql(p.descripcion)}, ` +
    `(select id from categorias where nombre = ${sql(p.categoria)}), ` +
    `${p.precio.toFixed(2)}, ${p.descuento.toFixed(2)}, ${sql(imagen)}, ${p.reciente})`;
}

const CABECERA_PRODUCTOS =
  "insert into productos (id, nombre, descripcion, categoria_id, precio_usd, descuento_pct, imagen_id, reciente) values";

/**
 * Ademas del archivo entero, escribe el mismo contenido troceado.
 * Un pegado que se corta a media lista da "syntax error at end of input",
 * asi que ninguna parte pasa de unos 12 KB.
 */
async function escribirPartes({ categorias, municipios, productos, mapa, filas }) {
  const TROZO = 40;
  const partes = [];

  partes.push([
    "parte-1-categorias-y-municipios.sql",
    [
      "begin;",
      "",
      "insert into categorias (nombre, orden) values",
      categorias.map((c, i) => `  (${sql(c)}, ${i + 1})`).join(",\n") + ";",
      "",
      "insert into municipios (id, provincia, nombre) values",
      municipios.map((m) => `  (${m.id}, ${sql(m.provincia)}, ${sql(m.nombre)})`).join(",\n") + ";",
      "",
      "commit;",
    ].join("\n"),
  ]);

  for (let i = 0; i < productos.length; i += TROZO) {
    const lote = productos.slice(i, i + TROZO);
    const n = partes.length + 1;
    partes.push([
      `parte-${n}-productos-${i + 1}-a-${i + lote.length}.sql`,
      ["begin;", "", CABECERA_PRODUCTOS,
       lote.map((p) => filaProducto(p, mapa)).join(",\n") + ";", "", "commit;"].join("\n"),
    ]);
  }

  partes.push([
    `parte-${partes.length + 1}-disponibilidad.sql`,
    [
      "begin;",
      "",
      "insert into producto_municipios (producto_id, municipio_id)",
      "select p.id, m.id",
      "from (values",
      filas.join(",\n"),
      ") as p(id, municipios)",
      "cross join lateral unnest(p.municipios) as m(id);",
      "",
      "commit;",
    ].join("\n"),
  ]);

  const dir = join(RAIZ, "supabase", "por-partes");
  await mkdir(dir, { recursive: true });
  console.log(`\nsupabase/por-partes/  (ejecutar en orden):`);
  for (const [nombre, contenido] of partes) {
    await writeFile(join(dir, nombre), contenido, "utf8");
    console.log(`  ${nombre.padEnd(38)} ${(contenido.length / 1024).toFixed(1)} KB`);
  }
}

async function main() {
  const fuente = await readFile(join(RAIZ, "app.js"), "utf8");
  const mapa = JSON.parse(await readFile(join(RAIZ, "scripts", "mapa-cloudinary.json"), "utf8"));

  const productos = leerProductos(fuente);
  const municipios = leerMunicipios(fuente);
  const idsVivos = new Set(municipios.map((m) => m.id));

  const categorias = [...new Set(productos.map((p) => p.categoria))].sort();
  const idCategoria = new Map(categorias.map((c, i) => [c, i + 1]));

  const sinImagen = [];
  const sinMunicipio = [];
  const idsMuertos = new Set();

  const L = [];
  L.push("-- TuDespensa25 — datos iniciales. GENERADO, no editar a mano.");
  L.push("-- Se regenera con: node scripts/generar-seed.mjs");
  L.push(`-- Origen: app.js (${productos.length} productos) + scripts/mapa-cloudinary.json`);
  L.push("");
  L.push("begin;");
  L.push("");

  L.push("-- categorias -------------------------------------------------------");
  // Sin "overriding system value": no insertamos id, lo genera la tabla.
  L.push("insert into categorias (nombre, orden) values");
  L.push(categorias.map((c, i) => `  (${sql(c)}, ${i + 1})`).join(",\n") + ";");
  L.push("");

  L.push("-- municipios -------------------------------------------------------");
  L.push("insert into municipios (id, provincia, nombre) values");
  L.push(
    municipios.map((m) => `  (${m.id}, ${sql(m.provincia)}, ${sql(m.nombre)})`).join(",\n") + ";"
  );
  L.push("");

  L.push("-- productos --------------------------------------------------------");
  L.push(
    "insert into productos (id, nombre, descripcion, categoria_id, precio_usd, descuento_pct, imagen_id, reciente) values"
  );
  L.push(
    productos
      .map((p) => {
        const imagen = p.imagen && mapa[p.imagen] ? mapa[p.imagen].publicId : null;
        if (!imagen) sinImagen.push(p.nombre);
        return `  (${p.id}, ${sql(p.nombre)}, ${sql(p.descripcion)}, ` +
          `(select id from categorias where nombre = ${sql(p.categoria)}), ` +
          `${p.precio.toFixed(2)}, ${p.descuento.toFixed(2)}, ${sql(imagen)}, ${p.reciente});`
            .replace(/;$/, "");
      })
      .join(",\n") + ";"
  );
  L.push("");

  L.push("-- en que municipio se vende cada producto ---------------------------");
  // Una linea por producto con su lista de municipios, en vez de una linea por
  // pareja: son las mismas filas al final, pero el archivo baja de 1593 lineas
  // a 155 y deja de ser un pegado enorme en el editor de Supabase.
  const filas = [];
  let parejas = 0;
  for (const p of productos) {
    const vivos = p.municipios.filter((id) => {
      if (!idsVivos.has(id)) { idsMuertos.add(id); return false; }
      return true;
    });
    if (vivos.length === 0) { sinMunicipio.push(p.nombre); continue; }
    parejas += vivos.length;
    filas.push(`  (${p.id}, '{${vivos.join(",")}}'::smallint[])`);
  }
  L.push("insert into producto_municipios (producto_id, municipio_id)");
  L.push("select p.id, m.id");
  L.push("from (values");
  L.push(filas.join(",\n"));
  L.push(") as p(id, municipios)");
  L.push("cross join lateral unnest(p.municipios) as m(id);");
  L.push("");
  L.push("commit;");
  L.push("");

  if (sinMunicipio.length) {
    L.push("-- ------------------------------------------------------------------");
    L.push("-- ATENCION: estos productos no se venden en ningun municipio, asi que");
    L.push("-- no le aparecen a ningun cliente que haya elegido el suyo. Es como");
    L.push("-- estan hoy en app.js; se replica tal cual para no cambiar tu tienda");
    L.push("-- sin decidirlo tu.");
    sinMunicipio.forEach((n) => L.push(`--   · ${n}`));
    L.push("--");
    L.push("-- Si quieres que se vendan en toda la zona de reparto, ejecuta esto:");
    L.push("--");
    L.push("-- insert into producto_municipios (producto_id, municipio_id)");
    L.push("-- select p.id, m.id from productos p cross join municipios m");
    L.push("-- where p.nombre in (" + sinMunicipio.map((n) => sql(n)).join(", ") + ")");
    L.push("-- on conflict do nothing;");
    L.push("-- ------------------------------------------------------------------");
  }

  await mkdir(join(RAIZ, "supabase"), { recursive: true });
  await writeFile(SALIDA, L.join("\n"), "utf8");
  await escribirPartes({ categorias, municipios, productos, mapa, filas });

  console.log(`escrito supabase/02-datos.sql`);
  console.log(`  categorias:  ${categorias.length}`);
  console.log(`  municipios:  ${municipios.length}`);
  console.log(`  productos:   ${productos.length}`);
  console.log(`  disponibilidad: ${parejas} parejas en ${filas.length} lineas`);
  if (idsMuertos.size)
    console.log(`  ids de municipio inexistentes descartados: ${[...idsMuertos].sort((a, b) => a - b).join(", ")}`);
  if (sinImagen.length) console.log(`  SIN imagen (${sinImagen.length}): ${sinImagen.join(", ")}`);
  if (sinMunicipio.length) console.log(`  SIN municipio (${sinMunicipio.length}): ${sinMunicipio.join(", ")}`);
}

function autoComprobacion() {
  if (sql("Pollo") !== "'Pollo'") throw new Error("sql() basico mal");
  if (sql("Marta's") !== "'Marta''s'") throw new Error("sql() no escapa la comilla");
  if (sql(null) !== "null" || sql("") !== "null") throw new Error("sql() deberia dar null");

  const falso = `const productos = [
    { id: 1, nombre: "Res \\"premium\\"", precio: 14.40, imagen: "res.webp",
      description: "Bolsa de 1 Kg", categoria: "Carnicos", reciente: 1,
      municipios: [ 1, 2, 2, 99 ] },
    { id: 2, nombre: "Col", precio: 1.5, imagen: "col.svg",
      description: "", categoria: "Agro", descuento: 20 },
  ];
  const productosContainer = null;`;
  const p = leerProductos(falso);
  if (p.length !== 2) throw new Error(`esperaba 2 productos, salieron ${p.length}`);
  if (p[0].municipios.join(",") !== "1,2,99") throw new Error("no deduplico los municipios");
  if (p[0].reciente !== true) throw new Error("reciente mal leido");
  if (p[1].municipios.length !== 0) throw new Error("sin municipios deberia dar vacio");
  if (p[1].descuento !== 20) throw new Error("descuento mal leido");
  if (p[0].precio !== 14.4) throw new Error("precio mal leido");

  const falsoUbic = `provincias: {
    "Artemisa": { id: 1, municipios: { "Bauta": 8, "Mariel": 11, } },
    "Pinar Del Río": { id: 2, municipios: { "Consolación": 13, } }
  },
  provinciaSeleccionada: null`;
  const m = leerMunicipios(falsoUbic);
  if (m.length !== 3) throw new Error(`esperaba 3 municipios, salieron ${m.length}`);
  if (m[2].provincia !== "Pinar Del Río") throw new Error("provincia mal asignada");
  console.log("auto-comprobacion OK");
}

if (process.argv.includes("--test")) autoComprobacion();
else await main();
