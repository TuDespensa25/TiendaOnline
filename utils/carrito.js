// utils/carrito.js — el carrito vive en el navegador hasta que se envia.
//
// Guarda SOLO id y cantidad, nunca el precio. Si guardara el precio, el que
// tuviera el producto en el carrito desde ayer pagaria el de ayer, y ademas
// seria un numero que el cliente puede editar. El precio se resuelve contra
// el catalogo al pintar, y contra la base al crear el pedido.

(function () {
  "use strict";

  var CLAVE = "carrito";
  var CLAVE_REF = "ref_vendedor";

  function leer() {
    try {
      var v = JSON.parse(localStorage.getItem(CLAVE) || "[]");
      return Array.isArray(v) ? v.filter(function (i) { return i && i.id; }) : [];
    } catch (e) {
      return [];
    }
  }

  function guardar(lineas) {
    localStorage.setItem(CLAVE, JSON.stringify(lineas));
  }

  window.carrito = {
    lineas: leer,

    agregar: function (id, cantidad) {
      var lineas = leer();
      var linea = lineas.filter(function (i) { return i.id === id; })[0];
      if (linea) linea.cantidad += cantidad || 1;
      else lineas.push({ id: id, cantidad: cantidad || 1 });
      guardar(lineas);
      return lineas;
    },

    fijar: function (id, cantidad) {
      var lineas = leer();
      if (cantidad <= 0) {
        lineas = lineas.filter(function (i) { return i.id !== id; });
      } else {
        var linea = lineas.filter(function (i) { return i.id === id; })[0];
        if (linea) linea.cantidad = cantidad;
      }
      guardar(lineas);
      return lineas;
    },

    quitar: function (id) { return window.carrito.fijar(id, 0); },

    vaciar: function () { guardar([]); },

    unidades: function () {
      return leer().reduce(function (a, i) { return a + i.cantidad; }, 0);
    },
  };

  /**
   * Guarda el ?ref= de un vendedor la primera vez que llega y lo conserva.
   * Hoy se pierde en cuanto el cliente navega, y con el la comision.
   * Gana el primero: quien trajo al cliente fue quien compartio el enlace.
   */
  window.guardarRef = function (busqueda) {
    var params = new URLSearchParams(busqueda !== undefined ? busqueda : location.search);
    var ref = (params.get("ref") || "").trim();
    if (ref && !localStorage.getItem(CLAVE_REF)) {
      localStorage.setItem(CLAVE_REF, ref);
    }
    return localStorage.getItem(CLAVE_REF) || "";
  };

  window.refVendedor = function () { return localStorage.getItem(CLAVE_REF) || ""; };

  window.testCarrito = function () {
    var previo = localStorage.getItem(CLAVE);
    var previoRef = localStorage.getItem(CLAVE_REF);
    var fallos = [];
    function ok(c, m) { if (!c) fallos.push(m); }

    window.carrito.vaciar();
    window.carrito.agregar(2);
    window.carrito.agregar(2);
    window.carrito.agregar(5, 3);
    ok(window.carrito.unidades() === 5, "2+3 unidades deberian ser 5");
    ok(window.carrito.lineas().length === 2, "deberian quedar 2 lineas");

    window.carrito.fijar(2, 1);
    ok(window.carrito.unidades() === 4, "al bajar a 1 deberian quedar 4");

    window.carrito.quitar(5);
    ok(window.carrito.lineas().length === 1, "quitar deberia dejar 1 linea");
    ok(window.carrito.lineas()[0].precio === undefined, "el carrito NO debe guardar precios");

    window.carrito.fijar(2, 0);
    ok(window.carrito.lineas().length === 0, "cantidad 0 deberia borrar la linea");

    localStorage.removeItem(CLAVE_REF);
    ok(guardarRef("?ref=yanet") === "yanet", "deberia guardar el ref");
    ok(guardarRef("?ref=otro") === "yanet", "el primer ref manda, no lo pisa el segundo");
    ok(guardarRef("") === "yanet", "sin ref en la url conserva el guardado");

    localStorage.removeItem(CLAVE_REF);
    ok(guardarRef("?nada=1") === "", "sin ref y sin guardado, vacio");

    if (previo === null) localStorage.removeItem(CLAVE); else localStorage.setItem(CLAVE, previo);
    if (previoRef === null) localStorage.removeItem(CLAVE_REF); else localStorage.setItem(CLAVE_REF, previoRef);

    if (fallos.length) { console.error("testCarrito FALLA:", fallos); return fallos; }
    console.log("testCarrito OK");
    return "OK";
  };
})();
