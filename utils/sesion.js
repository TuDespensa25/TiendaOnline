// utils/sesion.js — entrar y salir del panel, sin libreria.
//
// La API de Supabase Auth son dos endpoints y un token. Lo unico que hay que
// hacer bien es refrescar el token antes de que caduque: si no, a la hora el
// panel empieza a dar errores raros que parecen fallos de permisos.

(function () {
  "use strict";

  var CLAVE = "sesion_admin";

  function guardada() {
    try { return JSON.parse(localStorage.getItem(CLAVE) || "null"); }
    catch (e) { return null; }
  }

  function guardar(s) {
    if (!s) { localStorage.removeItem(CLAVE); return null; }
    // caduca_en absoluto, que expires_in es relativo al momento de emitirlo
    s.caduca_en = Date.now() + (s.expires_in || 3600) * 1000;
    localStorage.setItem(CLAVE, JSON.stringify(s));
    return s;
  }

  async function auth(ruta, cuerpo) {
    var res = await fetch(window.SUPABASE_URL + "/auth/v1/" + ruta, {
      method: "POST",
      headers: { apikey: window.SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    var datos = await res.json();
    if (!res.ok) throw new Error(datos.error_description || datos.msg || "No se pudo entrar");
    return datos;
  }

  window.sesion = {
    entrar: async function (correo, clave) {
      return guardar(await auth("token?grant_type=password", { email: correo, password: clave }));
    },

    salir: function () { guardar(null); },

    hay: function () { return !!guardada(); },

    correo: function () {
      var s = guardada();
      return (s && s.user && s.user.email) || "";
    },

    /**
     * Token valido. Lo renueva solo si le queda menos de un minuto, para no
     * dejar al usuario a medio guardar un producto con la sesion caducada.
     */
    token: async function () {
      var s = guardada();
      if (!s) return null;
      if (Date.now() < s.caduca_en - 60000) return s.access_token;
      try {
        return guardar(await auth("token?grant_type=refresh_token",
                                  { refresh_token: s.refresh_token })).access_token;
      } catch (e) {
        guardar(null);
        return null;
      }
    },

    /** Cabeceras para llamar a la API como el usuario, no como anon. */
    cabeceras: async function () {
      var t = await window.sesion.token();
      return {
        apikey: window.SUPABASE_ANON_KEY,
        Authorization: "Bearer " + (t || window.SUPABASE_ANON_KEY),
        "Content-Type": "application/json",
      };
    },
  };

  window.testSesion = function () {
    var previo = localStorage.getItem(CLAVE);
    var fallos = [];
    function ok(c, m) { if (!c) fallos.push(m); }

    localStorage.removeItem(CLAVE);
    ok(sesion.hay() === false, "sin sesion guardada, hay() deberia ser false");
    ok(sesion.correo() === "", "sin sesion no hay correo");

    guardar({ access_token: "t", refresh_token: "r", expires_in: 3600,
              user: { email: "a@b.c" } });
    ok(sesion.hay() === true, "con sesion guardada, hay() deberia ser true");
    ok(sesion.correo() === "a@b.c", "deberia devolver el correo");
    var s = JSON.parse(localStorage.getItem(CLAVE));
    ok(s.caduca_en > Date.now() + 3500000, "caduca_en deberia ser absoluto y futuro");

    sesion.salir();
    ok(sesion.hay() === false, "salir deberia borrar la sesion");

    if (previo) localStorage.setItem(CLAVE, previo);
    if (fallos.length) { console.error("testSesion FALLA:", fallos); return fallos; }
    console.log("testSesion OK");
    return "OK";
  };
})();
