// v2/admin.js — panel de productos.
//
// Todo lo que escribe pasa por RLS: la base solo deja guardar si es_admin()
// devuelve true para el usuario de la sesion. El panel no decide permisos,
// solo los refleja.

(function () {
  "use strict";

  var TASA = 340;
  var CARPETA = "tudespensa25/productos";

  var productos = [];
  var categorias = [];
  var editando = null;
  var fotoNueva = null;   // public_id recien subido, aun sin guardar

  var $ = function (id) { return document.getElementById(id); };

  function escapar(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function precioConDescuento(precio, descuento) {
    return Math.round(precio * (1 - (descuento || 0) / 100) * 100) / 100;
  }

  // --- entrar / salir ---

  function mostrarPanel(hay) {
    $("entrar").hidden = hay;
    $("panel").hidden = !hay;
  }

  $("form-entrar").addEventListener("submit", async function (e) {
    e.preventDefault();
    var boton = $("btn-entrar");
    var error = $("error-entrar");
    error.hidden = true;
    boton.disabled = true;
    boton.textContent = "Entrando...";
    try {
      await sesion.entrar($("correo").value.trim(), $("clave").value);
      mostrarPanel(true);
      await cargar();
    } catch (err) {
      error.textContent = "No se pudo entrar. Revisa el correo y la contraseña.";
      error.hidden = false;
    } finally {
      boton.disabled = false;
      boton.textContent = "Entrar";
    }
  });

  $("btn-salir").addEventListener("click", function () {
    sesion.salir();
    mostrarPanel(false);
  });

  // --- lista ---

  function fila(p) {
    var final = precioConDescuento(Number(p.precio_usd), Number(p.descuento_pct));
    return '' +
      '<article class="admin__fila' + (p.visible ? "" : " admin__fila--oculto") + '" data-id="' + p.id + '">' +
        '<img class="admin__foto" src="' + escapar(urlCuadrada(p.imagen_id, 120)) + '" alt=""' +
             ' loading="lazy" width="48" height="48"' +
             ' onerror="this.onerror=null;this.src=\'../images/placeholder.webp\'">' +
        '<div class="admin__datos">' +
          '<span class="admin__nombre">' + escapar(p.nombre) + '</span>' +
          '<span class="admin__categoria">' + escapar((p.categorias && p.categorias.nombre) || "sin categoría") + '</span>' +
        '</div>' +
        '<div class="admin__precio">' +
          '<span class="td-precio admin__cifra">USD ' + final.toFixed(2) + '</span>' +
          (Number(p.descuento_pct) > 0
            ? '<span class="td-chip admin__chip">-' + Math.round(p.descuento_pct) + '%</span>'
            : "") +
          (p.visible ? "" : '<span class="admin__oculto">Oculto</span>') +
        '</div>' +
      '</article>';
  }

  function pintar() {
    var texto = $("buscar-admin").value.trim().toLowerCase();
    var lista = productos.filter(function (p) {
      return !texto || p.nombre.toLowerCase().indexOf(texto) !== -1;
    });
    $("lista-admin").innerHTML = lista.map(fila).join("");
    $("cuenta-admin").textContent = lista.length + " de " + productos.length;
  }

  async function cargar() {
    try {
      var res = await Promise.all([
        fetch(window.SUPABASE_URL + "/rest/v1/productos?select=id,nombre,descripcion," +
              "precio_usd,descuento_pct,imagen_id,visible,categoria_id,categorias(nombre)&order=nombre",
              { headers: await sesion.cabeceras() }).then(function (r) { return r.json(); }),
        cargarCategorias(),
      ]);
      productos = res[0];
      categorias = res[1];
      $("e-categoria").innerHTML = categorias.map(function (c) {
        return '<option value="' + c.id + '">' + escapar(c.nombre) + "</option>";
      }).join("");
      pintar();
    } catch (e) {
      console.error(e);
      $("lista-admin").innerHTML = '<p class="vacio">No se pudo cargar. Revisa tu conexión.</p>';
    }
  }

  $("buscar-admin").addEventListener("input", pintar);

  $("lista-admin").addEventListener("click", function (e) {
    var f = e.target.closest(".admin__fila");
    if (f) abrir(Number(f.dataset.id));
  });

  // --- editar ---

  function abrir(id) {
    editando = productos.filter(function (p) { return p.id === id; })[0];
    if (!editando) return;
    fotoNueva = null;

    $("cajon-titulo").textContent = editando.nombre;
    $("e-nombre").value = editando.nombre;
    $("e-descripcion").value = editando.descripcion || "";
    $("e-categoria").value = editando.categoria_id || "";
    $("e-precio").value = Number(editando.precio_usd).toFixed(2);
    $("e-descuento").value = Math.round(Number(editando.descuento_pct));
    $("e-visible").checked = !!editando.visible;

    var img = $("vista-previa");
    img.src = urlCuadrada(editando.imagen_id, 300);
    img.hidden = false;
    $("soltar-texto").textContent = "Toca para cambiar la foto";
    $("error-guardar").hidden = true;

    recalcular();
    $("cajon").showModal();
  }

  function recalcular() {
    var precio = Number($("e-precio").value) || 0;
    var desc = Number($("e-descuento").value) || 0;
    var final = precioConDescuento(precio, desc);
    $("calculado").textContent = desc > 0
      ? "Precio final: USD " + final.toFixed(2) + " · " + milesCUP(enCUP(final, TASA)) + " CUP"
      : "USD " + precio.toFixed(2) + " · " + milesCUP(enCUP(precio, TASA)) + " CUP";
  }

  $("e-precio").addEventListener("input", recalcular);
  $("e-descuento").addEventListener("input", recalcular);
  $("cajon-x").addEventListener("click", function () { $("cajon").close(); });
  $("cancelar").addEventListener("click", function () { $("cajon").close(); });

  // --- foto ---

  $("soltar").addEventListener("click", function () { $("archivo").click(); });

  $("archivo").addEventListener("change", async function (e) {
    var archivo = e.target.files[0];
    if (!archivo) return;

    $("soltar-texto").textContent = "Subiendo la foto...";
    try {
      fotoNueva = await subirFoto(archivo, editando);
      $("vista-previa").src = urlCuadrada(fotoNueva, 300);
      $("vista-previa").hidden = false;
      $("soltar-texto").textContent = "Foto lista. Pulsa Guardar para aplicarla.";
    } catch (err) {
      console.error(err);
      fotoNueva = null;
      $("soltar-texto").textContent = "No se pudo subir la foto. Inténtalo otra vez.";
    }
  });

  /**
   * Sube a Cloudinary con el preset sin firma.
   * Lleva la hora en el nombre a proposito: una subida sin firma NUNCA
   * sobrescribe, asi que reutilizar el nombre devolveria la foto vieja con
   * un 200 y parecerian que funciono.
   */
  async function subirFoto(archivo, producto) {
    var base = String(producto.id) + "-" + Date.now();
    var form = new FormData();
    form.append("file", archivo);
    form.append("upload_preset", window.CLOUDINARY_UPLOAD_PRESET);
    form.append("public_id", CARPETA + "/" + base);
    form.append("asset_folder", CARPETA);
    form.append("tags", "tudespensa25,producto");

    var res = await fetch("https://api.cloudinary.com/v1_1/" +
                          window.CLOUDINARY_CLOUD_NAME + "/image/upload",
                          { method: "POST", body: form });
    var datos = await res.json();
    if (!res.ok) throw new Error((datos.error && datos.error.message) || "fallo al subir");
    return datos.public_id;
  }

  // --- guardar ---

  $("guardar").addEventListener("click", async function () {
    if (!editando) return;
    var boton = $("guardar");
    var error = $("error-guardar");
    error.hidden = true;
    boton.disabled = true;
    boton.textContent = "Guardando...";

    var cambios = {
      nombre: $("e-nombre").value.trim(),
      descripcion: $("e-descripcion").value.trim(),
      categoria_id: Number($("e-categoria").value) || null,
      precio_usd: Number($("e-precio").value) || 0,
      descuento_pct: Number($("e-descuento").value) || 0,
      visible: $("e-visible").checked,
    };
    if (fotoNueva) cambios.imagen_id = fotoNueva;

    try {
      if (!cambios.nombre) throw new Error("El producto necesita un nombre.");

      var res = await fetch(window.SUPABASE_URL + "/rest/v1/productos?id=eq." + editando.id, {
        method: "PATCH",
        headers: Object.assign(await sesion.cabeceras(), { Prefer: "return=representation" }),
        body: JSON.stringify(cambios),
      });
      var datos = await res.json();
      if (!res.ok) throw new Error(datos.message || "no se pudo guardar");
      if (!datos.length) throw new Error("La base no dejó guardar. ¿Tu usuario es administrador?");

      Object.assign(editando, datos[0]);
      editando.categorias = categorias.filter(function (c) { return c.id === cambios.categoria_id; })[0] || null;
      pintar();
      $("cajon").close();
    } catch (e) {
      error.textContent = e.message;
      error.hidden = false;
    } finally {
      boton.disabled = false;
      boton.textContent = "Guardar";
    }
  });

  // --- arranque ---

  if (sesion.hay()) { mostrarPanel(true); cargar(); }
  else mostrarPanel(false);
})();
