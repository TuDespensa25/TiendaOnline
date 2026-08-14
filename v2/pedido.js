// v2/pedido.js — carrito y cierre por WhatsApp.
//
// El pedido se guarda en Supabase ANTES de abrir WhatsApp. Si se hiciera al
// reves, un mensaje que el cliente no llega a enviar dejaria la venta sin
// registrar y al vendedor sin su comision.

(function () {
  "use strict";

  var TASA = 340;
  var WHATSAPP = "5352000000"; // TODO: numero real del negocio

  var catalogo = {};   // id -> producto
  var municipios = [];
  var enviando = false;

  var $ = function (id) { return document.getElementById(id); };

  function escapar(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** Une las lineas del carrito con el catalogo. Descarta lo que ya no existe. */
  function detalle() {
    return carrito.lineas()
      .map(function (l) {
        var p = catalogo[l.id];
        if (!p) return null;
        var final = precioFinal(p);
        return {
          id: l.id,
          cantidad: l.cantidad,
          producto: p,
          unitario: final,
          subtotal: Math.round(final * l.cantidad * 100) / 100,
          ahorro: Math.round((Number(p.precio_usd) - final) * l.cantidad * 100) / 100,
        };
      })
      .filter(Boolean);
  }

  function totales(lineas) {
    var t = lineas.reduce(function (a, l) { return a + l.subtotal; }, 0);
    var a = lineas.reduce(function (a2, l) { return a2 + l.ahorro; }, 0);
    return { total: Math.round(t * 100) / 100, ahorro: Math.round(a * 100) / 100 };
  }

  function pintar() {
    var lineas = detalle();
    var hay = lineas.length > 0;

    $("vacio").hidden = hay;
    $("bloque-entrega").hidden = !hay;
    $("resumen").hidden = !hay;
    $("pie").hidden = !hay;

    $("lineas").innerHTML = lineas.map(function (l) {
      return '' +
        '<article class="linea">' +
          '<img class="linea__foto" src="' + escapar(urlCuadrada(l.producto.imagen_id, 200)) + '"' +
               ' alt="" loading="lazy" width="64" height="64"' +
               ' onerror="this.onerror=null;this.src=\'../images/placeholder.webp\'">' +
          '<div class="linea__datos">' +
            '<h2 class="linea__nombre">' + escapar(l.producto.nombre) + '</h2>' +
            '<span class="linea__unitario">USD ' + l.unitario.toFixed(2) + ' c/u</span>' +
            '<div class="contador">' +
              '<button class="contador__btn" data-menos="' + l.id + '" aria-label="Quitar uno">−</button>' +
              '<span class="contador__n">' + l.cantidad + '</span>' +
              '<button class="contador__btn" data-mas="' + l.id + '" aria-label="Añadir uno">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="linea__derecha">' +
            '<span class="td-precio linea__subtotal">USD ' + l.subtotal.toFixed(2) + '</span>' +
            '<button class="linea__quitar" data-quitar="' + l.id + '" aria-label="Quitar del pedido">Quitar</button>' +
          '</div>' +
        '</article>';
    }).join("");

    var t = totales(lineas);
    $("subtotal").textContent = "USD " + t.total.toFixed(2);
    $("fila-ahorro").hidden = t.ahorro <= 0;
    $("ahorro").textContent = "-USD " + t.ahorro.toFixed(2);
    $("total").textContent = "USD " + t.total.toFixed(2);
    $("total-cup").textContent = milesCUP(enCUP(t.total, TASA)) + " CUP";
  }

  function pintarProvincias() {
    var provs = [];
    municipios.forEach(function (m) {
      if (provs.indexOf(m.provincia) === -1) provs.push(m.provincia);
    });
    var guardado = Number(localStorage.getItem("municipio")) || null;
    var elegido = municipios.filter(function (m) { return m.id === guardado; })[0];

    $("provincia").innerHTML = provs.map(function (p) {
      return '<option' + (elegido && elegido.provincia === p ? " selected" : "") + ">" + escapar(p) + "</option>";
    }).join("");
    pintarMunicipios(elegido && elegido.id);
  }

  function pintarMunicipios(preferido) {
    var prov = $("provincia").value;
    var lista = municipios.filter(function (m) { return m.provincia === prov; });
    $("municipio").innerHTML = lista.map(function (m) {
      return '<option value="' + m.id + '"' + (m.id === preferido ? " selected" : "") + ">" + escapar(m.nombre) + "</option>";
    }).join("");
  }

  function mensajeWhatsApp(lineas, t, numeroPedido) {
    var partes = ["*Pedido " + numeroPedido + " — TuDespensa25*", ""];
    lineas.forEach(function (l) {
      partes.push("• " + l.cantidad + "x " + l.producto.nombre + " — USD " + l.subtotal.toFixed(2));
    });
    partes.push("");
    partes.push("*Total: USD " + t.total.toFixed(2) + "* (" + milesCUP(enCUP(t.total, TASA)) + " CUP)");
    partes.push("");
    partes.push("Entrega: " + $("provincia").value + ", " +
                $("municipio").options[$("municipio").selectedIndex].text);
    partes.push("Recibe: " + $("nombre").value.trim() + " · " + $("telefono").value.trim());
    return partes.join("\n");
  }

  async function enviar() {
    if (enviando) return;

    var nombre = $("nombre").value.trim();
    var telefono = $("telefono").value.trim();
    if (!nombre) { $("nombre").focus(); alert("Escribe el nombre de quien recibe el pedido."); return; }
    if (!telefono) { $("telefono").focus(); alert("Escribe un teléfono de contacto en Cuba."); return; }

    var lineas = detalle();
    if (!lineas.length) return;

    enviando = true;
    var boton = $("enviar");
    var texto = $("enviar-texto");
    boton.disabled = true;
    texto.textContent = "Guardando el pedido...";

    try {
      var res = await fetch(window.SUPABASE_URL + "/rest/v1/rpc/crear_pedido", {
        method: "POST",
        headers: {
          apikey: window.SUPABASE_ANON_KEY,
          Authorization: "Bearer " + window.SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_municipio: Number($("municipio").value),
          p_nombre: nombre,
          p_telefono: telefono,
          p_ref: refVendedor(),
          p_items: lineas.map(function (l) {
            return { producto_id: l.id, cantidad: l.cantidad };
          }),
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      var numero = await res.json();

      var t = totales(lineas);
      var url = "https://wa.me/" + WHATSAPP + "?text=" +
                encodeURIComponent(mensajeWhatsApp(lineas, t, numero));

      carrito.vaciar();
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert("No se pudo registrar el pedido. Revisa tu conexión e inténtalo de nuevo.");
      boton.disabled = false;
      texto.textContent = "Enviar pedido por WhatsApp";
      enviando = false;
    }
  }

  // --- eventos ---

  $("lineas").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var d = b.dataset;
    var id = Number(d.mas || d.menos || d.quitar);
    if (!id) return;

    var actual = carrito.lineas().filter(function (l) { return l.id === id; })[0];
    if (d.mas) carrito.fijar(id, actual.cantidad + 1);
    else if (d.menos) carrito.fijar(id, actual.cantidad - 1);
    else carrito.quitar(id);
    pintar();
  });

  $("provincia").addEventListener("change", function () { pintarMunicipios(); });
  $("enviar").addEventListener("click", enviar);

  // --- arranque ---

  guardarRef();

  Promise.all([cargarProductos(null), cargarMunicipios()])
    .then(function (r) {
      r[0].forEach(function (p) { catalogo[p.id] = p; });
      municipios = r[1];
      pintarProvincias();
      pintar();
    })
    .catch(function (e) {
      console.error(e);
      $("vacio").hidden = false;
      $("vacio").textContent = "No se pudo cargar el pedido. Revisa tu conexión.";
    });
})();
