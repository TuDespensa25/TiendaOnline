// v2/tienda.js — pinta el catalogo leyendo de Supabase.

(function () {
  "use strict";

  var TASA = 340; // se movera a la tabla ajustes cuando el panel la edite

  var estado = {
    productos: [],
    categorias: [],
    municipios: [],
    municipio: Number(localStorage.getItem("municipio")) || null,
    categoria: null,
    busca: "",
  };

  var $ = function (id) { return document.getElementById(id); };

  function escapar(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** Nombre corto: "Alimentos/Cárnicos" se lee mejor como "Cárnicos". */
  function nombreCorto(nombre) {
    var partes = String(nombre || "").split("/");
    return partes[partes.length - 1].trim();
  }

  function tarjeta(p) {
    var final = precioFinal(p);
    var hayDescuento = Number(p.descuento_pct) > 0;
    var foto = urlCuadrada(p.imagen_id, ANCHO_IMAGEN.tarjeta);
    var srcset = srcSetImagen(p.imagen_id, ANCHO_IMAGEN.tarjeta);

    return '' +
      '<article class="producto">' +
        '<a class="producto__enlace" href="producto.html?id=' + p.id + '">' +
        '<div class="producto__foto">' +
          '<img src="' + escapar(foto) + '"' +
               (srcset ? ' srcset="' + escapar(srcset) + '"' : "") +
               ' alt="' + escapar(p.nombre) + '" loading="lazy" width="400" height="400"' +
               ' onerror="this.onerror=null;this.removeAttribute(\'srcset\');this.src=\'../images/placeholder.webp\'">' +
          (hayDescuento
            ? '<span class="producto__descuento">-' + Math.round(p.descuento_pct) + '%</span>'
            : "") +
        '</div>' +
        '<div class="producto__datos">' +
          '<span class="producto__categoria">' + escapar(nombreCorto(p.categorias && p.categorias.nombre)) + '</span>' +
          '<h3 class="producto__nombre">' + escapar(p.nombre) + '</h3>' +
          '</a>' +
          '<div class="producto__precios">' +
            (hayDescuento
              ? '<div class="td-precio-antes">USD ' + Number(p.precio_usd).toFixed(2) + '</div>'
              : "") +
            '<div class="td-precio producto__precio">USD ' + final.toFixed(2) + '</div>' +
            '<div class="td-precio-cup">' + milesCUP(enCUP(final, TASA)) + ' CUP</div>' +
          '</div>' +
          '<button class="td-boton producto__agregar" data-id="' + p.id + '">Agregar</button>' +
        '</div>' +
      '</article>';
  }

  function visibles() {
    var texto = estado.busca.trim().toLowerCase();
    return estado.productos.filter(function (p) {
      if (estado.categoria && (!p.categorias || p.categorias.nombre !== estado.categoria)) return false;
      if (texto && p.nombre.toLowerCase().indexOf(texto) === -1) return false;
      return true;
    });
  }

  var ES_COMBO = { "Combos Temporales": 1, "Combos en oferta": 1, "Combos Variados": 1 };

  function esCombo(p) {
    return !!(p.categorias && ES_COMBO[p.categorias.nombre]);
  }

  function pintarCarrusel(id, lista) {
    var seccion = $("sec-" + id);
    seccion.hidden = lista.length === 0;
    if (lista.length) $(id).innerHTML = lista.map(tarjeta).join("");
  }

  function pintar() {
    var lista = visibles();
    // Las secciones destacadas solo tienen sentido en la vista completa: si
    // el cliente ya filtro o busco, estorban y esconden lo que pidio.
    var filtrando = !!estado.categoria || !!estado.busca.trim();

    if (filtrando) {
      ["combos", "ofertas", "nuevos"].forEach(function (s) { $("sec-" + s).hidden = true; });
      $("titulo-lista").textContent = estado.categoria
        ? nombreCorto(estado.categoria)
        : "Resultados";
    } else {
      pintarCarrusel("combos", lista.filter(esCombo));
      pintarCarrusel("ofertas", lista.filter(function (p) {
        return Number(p.descuento_pct) > 0 && !esCombo(p);
      }));
      pintarCarrusel("nuevos", lista.filter(function (p) {
        return p.reciente && Number(p.descuento_pct) === 0 && !esCombo(p);
      }));
      $("titulo-lista").textContent = "Todos los productos";
    }

    $("rejilla").innerHTML = lista.map(tarjeta).join("");
    $("cuenta").textContent = lista.length + (lista.length === 1 ? " producto" : " productos");

    var vacio = $("vacio");
    vacio.hidden = lista.length > 0;
    if (!lista.length) {
      vacio.textContent = estado.municipio
        ? "No hay productos que coincidan en tu municipio."
        : "No hay productos que coincidan.";
    }
  }

  // --- banners ---

  // Cada numero es una campana distinta, con su version ancha y su version
  // vertical. La tienda vieja las cruzaba: ensenaba banner17 en escritorio y
  // banner16m en movil, que son anuncios diferentes.
  var BANNERS = [
    { id: "banner17", movil: "banner17-m", alt: "Ofertas especiales en ahumados" },
    { id: "banner14", movil: "banner14m", alt: "Ofertas especiales" },
    { id: "banner15", movil: "banner15m", alt: "Ofertas especiales" },
    { id: "banner16", movil: "banner16m", alt: "Frijoles colorados gratis por compras de 60 USD o más" },
  ];

  function pintarBanners() {
    var base = "tudespensa25/productos/";
    $("banners-pista").innerHTML = BANNERS.map(function (b, i) {
      return '<a class="banner" href="#sec-ofertas">' +
               "<picture>" +
                 '<source media="(max-width: 700px)" srcset="' +
                   escapar(urlImagen(base + b.movil, 800)) + '">' +
                 '<img src="' + escapar(urlImagen(base + b.id, 1000)) + '"' +
                      ' alt="' + escapar(b.alt) + '"' +
                      (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + ">" +
               "</picture>" +
             "</a>";
    }).join("");

    $("banners-puntos").innerHTML = BANNERS.map(function (b, i) {
      return '<button class="punto" data-i="' + i + '" aria-label="Ver anuncio ' + (i + 1) + '"' +
             (i === 0 ? ' aria-current="true"' : "") + "></button>";
    }).join("");
  }

  function moverBanner(i) {
    var pista = $("banners-pista");
    pista.scrollTo({ left: i * pista.clientWidth, behavior: "smooth" });
  }

  function pintarCategorias() {
    var usadas = {};
    estado.productos.forEach(function (p) {
      if (p.categorias) usadas[p.categorias.nombre] = true;
    });

    var botones = ['<button class="categoria" data-cat="" aria-pressed="' +
                   (estado.categoria ? "false" : "true") + '">Todas</button>'];

    estado.categorias.forEach(function (c) {
      if (!usadas[c.nombre]) return; // no ofrecer categorias vacias en este municipio
      botones.push('<button class="categoria" data-cat="' + escapar(c.nombre) + '" aria-pressed="' +
        (estado.categoria === c.nombre ? "true" : "false") + '">' + escapar(nombreCorto(c.nombre)) + "</button>");
    });

    $("categorias").innerHTML = botones.join("");
  }

  function pintarMunicipios() {
    var html = "";
    var provincia = null;
    estado.municipios.forEach(function (m) {
      if (m.provincia !== provincia) {
        provincia = m.provincia;
        html += '<div class="hoja__provincia">' + escapar(provincia) + "</div>";
      }
      html += '<button type="button" class="municipio" data-mun="' + m.id + '" aria-pressed="' +
              (estado.municipio === m.id ? "true" : "false") + '">' + escapar(m.nombre) + "</button>";
    });
    $("lista-municipios").innerHTML = html;

    var elegido = estado.municipios.filter(function (m) { return m.id === estado.municipio; })[0];
    $("lugar-actual").textContent = elegido
      ? elegido.provincia + ", " + elegido.nombre
      : "Elige tu municipio";
  }

  function contador() {
    var n = carrito.unidades();
    var el = $("contador-carrito");
    el.textContent = n;
    el.hidden = n === 0;
  }

  async function cargar() {
    $("rejilla").innerHTML = new Array(6).join("x").split("x")
      .map(function () { return '<div class="esqueleto"></div>'; }).join("");
    try {
      var res = await Promise.all([
        cargarProductos(estado.municipio),
        estado.categorias.length ? estado.categorias : cargarCategorias(),
      ]);
      estado.productos = res[0];
      estado.categorias = res[1];
      pintarCategorias();
      pintar();
    } catch (e) {
      console.error(e);
      $("rejilla").innerHTML = "";
      var vacio = $("vacio");
      vacio.hidden = false;
      vacio.textContent = "No se pudo cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.";
    }
  }

  // --- eventos ---

  $("buscar").addEventListener("input", function (e) {
    estado.busca = e.target.value;
    pintar();
  });

  $("categorias").addEventListener("click", function (e) {
    var b = e.target.closest(".categoria");
    if (!b) return;
    estado.categoria = b.dataset.cat || null;
    pintarCategorias();
    pintar();
  });

  $("rejilla").addEventListener("click", function (e) {
    var b = e.target.closest(".producto__agregar");
    if (!b) return;
    carrito.agregar(Number(b.dataset.id));
    contador();
    b.textContent = "Agregado";
    setTimeout(function () { b.textContent = "Agregar"; }, 900);
  });

  $("btn-lugar").addEventListener("click", function () { $("hoja-lugar").showModal(); });

  $("lista-municipios").addEventListener("click", function (e) {
    var b = e.target.closest(".municipio");
    if (!b) return;
    estado.municipio = Number(b.dataset.mun);
    localStorage.setItem("municipio", estado.municipio);
    pintarMunicipios();
    $("hoja-lugar").close();
    cargar();
  });

  $("banners-puntos").addEventListener("click", function (e) {
    var b = e.target.closest(".punto");
    if (b) moverBanner(Number(b.dataset.i));
  });

  // El punto activo se saca de donde esta la pista, no de un temporizador:
  // asi sigue al dedo cuando el cliente desliza a mano.
  $("banners-pista").addEventListener("scroll", function () {
    var pista = $("banners-pista");
    var i = Math.round(pista.scrollLeft / pista.clientWidth);
    [].forEach.call($("banners-puntos").children, function (p, j) {
      if (j === i) p.setAttribute("aria-current", "true");
      else p.removeAttribute("aria-current");
    });
  }, { passive: true });

  // --- arranque ---

  guardarRef();
  contador();
  pintarBanners();
  cargarMunicipios()
    .then(function (m) { estado.municipios = m; pintarMunicipios(); })
    .catch(function (e) { console.error(e); });
  cargar();
})();
