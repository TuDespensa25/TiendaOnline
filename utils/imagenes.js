// utils/imagenes.js — construye las URLs de imagen de producto.
//
// En la base de datos guardamos solo el public_id ("tudespensa25/productos/pollocaja"),
// nunca la URL entera. Asi el tamano y el formato se deciden aqui, en un sitio,
// y cambiarlos manana no obliga a tocar 153 filas.
//
// Las tres transformaciones que hacen el trabajo:
//   f_auto       el navegador recibe AVIF o WebP segun lo que soporte
//   q_auto       Cloudinary elige la calidad segun lo que muestre la foto
//   w_N,c_limit  redimensiona sin ampliar nunca por encima del original
//
// Script clasico, no modulo ES, para poder convivir con app.js tal como esta.

(function () {
  "use strict";

  var PLACEHOLDER = "images/placeholder.webp";

  // Anchos reales de uso. La tarjeta se ve a ~180px; pedimos 400 para que se
  // vea nitida en pantallas retina sin descargar la foto entera.
  var ANCHO = { tarjeta: 400, carrito: 200, modal: 1000 };

  function cloudName() {
    return window.CLOUDINARY_CLOUD_NAME || "";
  }

  function urlImagen(publicId, ancho) {
    var cloud = cloudName();
    if (!publicId || !cloud) return PLACEHOLDER;

    // Si ya es una URL completa (una foto de otro sitio) se deja pasar tal cual.
    if (/^https?:\/\//.test(publicId)) return publicId;

    var w = ancho || ANCHO.tarjeta;
    return "https://res.cloudinary.com/" + cloud +
           "/image/upload/f_auto,q_auto,w_" + w + ",c_limit/" + publicId;
  }

  // Deja que el navegador elija segun la densidad de pantalla.
  function srcSetImagen(publicId, ancho) {
    if (!publicId || !cloudName() || /^https?:\/\//.test(publicId)) return "";
    var w = ancho || ANCHO.tarjeta;
    return urlImagen(publicId, w) + " 1x, " + urlImagen(publicId, w * 2) + " 2x";
  }

  window.ANCHO_IMAGEN = ANCHO;
  window.urlImagen = urlImagen;
  window.srcSetImagen = srcSetImagen;

  // Auto-comprobacion: se ejecuta sola con ?test-imagenes en la URL.
  window.testImagenes = function () {
    var previo = window.CLOUDINARY_CLOUD_NAME;
    window.CLOUDINARY_CLOUD_NAME = "demo";
    var fallos = [];
    function ok(cond, msg) { if (!cond) fallos.push(msg); }

    ok(urlImagen("tudespensa25/productos/pollocaja") ===
       "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400,c_limit/tudespensa25/productos/pollocaja",
       "la url de tarjeta no es la esperada");
    ok(urlImagen("x", ANCHO.modal).indexOf("w_1000,c_limit") !== -1, "el modal deberia pedir 1000px");
    ok(urlImagen(null) === PLACEHOLDER, "sin id deberia caer en el placeholder");
    ok(urlImagen("") === PLACEHOLDER, "vacio deberia caer en el placeholder");
    ok(urlImagen("https://otro.com/a.jpg") === "https://otro.com/a.jpg", "una URL entera se deja pasar");
    ok(srcSetImagen("x").indexOf("w_800,c_limit") !== -1, "el 2x deberia pedir el doble de ancho");
    ok(srcSetImagen("https://otro.com/a.jpg") === "", "una URL entera no lleva srcset");

    window.CLOUDINARY_CLOUD_NAME = previo;
    if (fallos.length) { console.error("testImagenes FALLA:", fallos); return fallos; }
    console.log("testImagenes OK");
    return "OK";
  };

  if (location.search.indexOf("test-imagenes") !== -1) window.testImagenes();
})();
