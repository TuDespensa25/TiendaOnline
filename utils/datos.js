// utils/datos.js — lee el catalogo de Supabase.
//
// Sin librerias: la API REST de Supabase son dos cabeceras y un fetch. Meter
// supabase-js aqui obligaria a un bundler, y el proyecto no tiene ninguno.
//
// Script clasico, no modulo, para convivir con el resto del codigo.

(function () {
  "use strict";

  function cabeceras() {
    var k = window.SUPABASE_ANON_KEY;
    return { apikey: k, Authorization: "Bearer " + k };
  }

  async function pedir(ruta) {
    var res = await fetch(window.SUPABASE_URL + "/rest/v1/" + ruta, { headers: cabeceras() });
    if (!res.ok) {
      var detalle = await res.text();
      throw new Error("Supabase " + res.status + ": " + detalle.slice(0, 200));
    }
    return res.json();
  }

  var CAMPOS = "id,nombre,descripcion,precio_usd,descuento_pct,imagen_id,reciente," +
               "categorias(nombre)";

  /**
   * Productos visibles. Si se pasa un municipio, solo los que se venden alli.
   * El filtro va con !inner para que Postgres descarte de una vez los que no
   * tienen fila de disponibilidad, en vez de traerlos con la lista vacia.
   */
  window.cargarProductos = function (municipioId) {
    var ruta = "productos?select=" + CAMPOS;
    if (municipioId) {
      ruta = "productos?select=" + CAMPOS + ",producto_municipios!inner(municipio_id)" +
             "&producto_municipios.municipio_id=eq." + encodeURIComponent(municipioId);
    }
    return pedir(ruta + "&visible=eq.true&order=id");
  };

  window.cargarCategorias = function () {
    return pedir("categorias?select=id,nombre&activa=eq.true&order=orden");
  };

  window.cargarMunicipios = function () {
    return pedir("municipios?select=id,nombre,provincia&activo=eq.true&order=provincia,nombre");
  };

  /** Precio ya con el descuento aplicado, redondeado a centavos. */
  window.precioFinal = function (producto) {
    var d = Number(producto.descuento_pct) || 0;
    return Math.round(Number(producto.precio_usd) * (1 - d / 100) * 100) / 100;
  };

  /** Los precios se muestran en USD; el equivalente en CUP va debajo. */
  window.enCUP = function (usd, tasa) {
    return Math.round(usd * (tasa || 340));
  };

  /** 15912 -> "15 912". Separador fino para que no se lea como decimal. */
  window.milesCUP = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  window.testDatos = function () {
    var fallos = [];
    function ok(c, m) { if (!c) fallos.push(m); }

    ok(precioFinal({ precio_usd: 52, descuento_pct: 10 }) === 46.8, "52 con 10% deberia dar 46.80");
    ok(precioFinal({ precio_usd: 2.4, descuento_pct: 20 }) === 1.92, "2.40 con 20% deberia dar 1.92");
    ok(precioFinal({ precio_usd: 14.4, descuento_pct: 0 }) === 14.4, "sin descuento no cambia");
    ok(precioFinal({ precio_usd: 0.9, descuento_pct: 30 }) === 0.63, "0.90 con 30% deberia dar 0.63");
    ok(precioFinal({ precio_usd: 1.1, descuento_pct: 20 }) === 0.88, "1.10 con 20% deberia dar 0.88");
    ok(enCUP(46.8) === 15912, "46.80 deberia dar 15912 CUP");
    ok(milesCUP(15912) === "15 912", "los miles deberian separarse");
    ok(milesCUP(653) === "653", "tres cifras no llevan separador");

    if (fallos.length) { console.error("testDatos FALLA:", fallos); return fallos; }
    console.log("testDatos OK");
    return "OK";
  };
})();
