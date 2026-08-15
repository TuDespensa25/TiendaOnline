// v2/ficha.js — un producto.

(function () {
  "use strict";

  var TASA = 340;
  var $ = function (id) { return document.getElementById(id); };

  var producto = null;
  var cantidad = 1;

  function contador() {
    var n = carrito.unidades();
    var el = $("contador-carrito");
    el.textContent = n;
    el.hidden = n === 0;
  }

  function nombreCorto(nombre) {
    var partes = String(nombre || "").split("/");
    return partes[partes.length - 1].trim();
  }

  function pintarCantidad() {
    $("cantidad").textContent = cantidad;
    var final = precioFinal(producto);
    $("agregar").textContent = "Agregar al carrito · USD " + (final * cantidad).toFixed(2);
  }

  function pintar() {
    var final = precioFinal(producto);
    var precio = Number(producto.precio_usd);
    var hayDescuento = Number(producto.descuento_pct) > 0;

    document.title = producto.nombre + " — TuDespensa25";
    $("migas").textContent = nombreCorto(producto.categorias && producto.categorias.nombre);

    var img = $("foto");
    img.src = urlCuadrada(producto.imagen_id, ANCHO_IMAGEN.modal);
    img.alt = producto.nombre;
    img.onerror = function () { img.onerror = null; img.src = "../images/placeholder.webp"; };

    $("categoria").textContent = nombreCorto(producto.categorias && producto.categorias.nombre);
    $("nombre").textContent = producto.nombre;
    $("descripcion").textContent = producto.descripcion || "";

    if (hayDescuento) {
      $("chip-descuento").textContent = "-" + Math.round(producto.descuento_pct) + "%";
      $("chip-descuento").hidden = false;
      $("precio-antes").textContent = "USD " + precio.toFixed(2);
      $("precio-antes").hidden = false;
      $("ahorro").textContent = "Ahorras USD " + (precio - final).toFixed(2);
      $("ahorro").hidden = false;
    }

    $("precio").textContent = "USD " + final.toFixed(2);
    $("precio-cup").textContent = milesCUP(enCUP(final, TASA)) + " CUP";

    pintarCantidad();
    $("cargando").hidden = true;
    $("ficha").hidden = false;
    $("pie").hidden = false;
  }

  async function pintarEntrega() {
    var id = Number(localStorage.getItem("municipio")) || null;
    if (!id) {
      $("entrega").innerHTML = 'Elige tu municipio en la tienda para ver si llega hasta ti.';
      return;
    }
    try {
      var m = (await cargarMunicipios()).filter(function (x) { return x.id === id; })[0];
      if (m) $("entrega").textContent = "Se entrega en " + m.provincia + ", " + m.nombre;
    } catch (e) { /* el dato es informativo: si falla, no se enseña nada */ }
  }

  $("menos").addEventListener("click", function () {
    if (cantidad > 1) { cantidad--; pintarCantidad(); }
  });
  $("mas").addEventListener("click", function () { cantidad++; pintarCantidad(); });

  $("agregar").addEventListener("click", function () {
    carrito.agregar(producto.id, cantidad);
    contador();
    var b = $("agregar");
    var texto = b.textContent;
    b.textContent = "Añadido al carrito";
    setTimeout(function () { b.textContent = texto; }, 1000);
  });

  // --- arranque ---

  guardarRef();
  contador();

  var id = Number(new URLSearchParams(location.search).get("id"));
  if (!id) {
    $("cargando").textContent = "No se indicó ningún producto.";
  } else {
    fetch(window.SUPABASE_URL + "/rest/v1/productos?select=id,nombre,descripcion," +
          "precio_usd,descuento_pct,imagen_id,categorias(nombre)&visible=eq.true&id=eq." + id,
          { headers: { apikey: window.SUPABASE_ANON_KEY,
                       Authorization: "Bearer " + window.SUPABASE_ANON_KEY } })
      .then(function (r) { return r.json(); })
      .then(function (filas) {
        if (!filas.length) {
          $("cargando").innerHTML = 'Ese producto ya no está. <a href="index.html">Ver la tienda</a>';
          return;
        }
        producto = filas[0];
        pintar();
        pintarEntrega();
      })
      .catch(function (e) {
        console.error(e);
        $("cargando").textContent = "No se pudo cargar el producto. Revisa tu conexión.";
      });
  }
})();
