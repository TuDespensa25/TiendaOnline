"use strict";

// Tasa de cambio: 1 USD equivale a 340.0 CUP (ajusta según necesites)
const tasaCambio = 340.0;

// Lista de productos adaptada y clasificada
const productos = [
  
    // Alimentos/Cárnicos
    {
      id: 1,
      nombre: " Cerdo al corte ",
      precio: 3.80,
      imagen: "pierna.svg",
      description: "Pierna de cerdo, paleta según disponibilidad",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 2,
      nombre: "Caja de Pollo",
      precio: 52,
      imagen: "pollocaja.svg",
      description: "caja de 40 lb de muslo y contramuslo 4 paquetes de 10 lb",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 3,
      nombre: "Paquete de pollo 10 lb ",
      precio: 13,
      imagen: "pollopqte.svg",
      description: "paquete de 10 lb de muslo y contra muslo",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 4,
      nombre: "Lomo de cerdo deshuesado",
      precio: 5.20,
      imagen: "lomo.svg",
      description: "Lomo de cerdo x Lb Importado",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 5,
      nombre: "Masas de Cerdo",
      precio: 19,
      imagen: "masas.svg",
      description: "bolsa sellada al vacio de 4lb",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 6,
      nombre: "Bistec de cerdo",
      precio: 10.5,
      imagen: "bistec.svg",
      description: "Bandeja de bistec sellada al vacio 2.2 lb",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 8,
      nombre: "Jamon vicky",
      precio: 3.20,
      imagen: "vicky.svg",
      description: "por lb sellado al vacio ",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 9,
      nombre: "Lomo ahumado",
      precio: 6.5,
      imagen: "ahumado.svg",
      description: "porcionado y sellado x lb según pedido",
      categoria: "Alimentos/Cárnicos",
      descuento: 25,
    },
    {
      id: 10,
      nombre: "Lomo Ahumado",
      precio: 8,
      imagen: "ahumado.svg",
      description: "bandeja sellada al vacio de 1.2 lb lasqueado",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 11,
      nombre: "Pechuga de pollo",
      precio: 5.20,
      imagen: "pechuga.svg",
      description: "x Lb de bistec de pechuga sellada",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 12,
      nombre: "Jamón Embuchado",
      precio: 4.00,
      imagen: "embuchado.svg",
      description: "Porción sellada según peso requerido por el cliente",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 13,
      nombre: "Picadillo Mixto",
      precio: 2.40,
      imagen: "picadillo.svg",
      description: "unidad de 400 gr",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 14,
      nombre: "Salchichas",
      precio: 2.80,
      imagen: "perritos.svg",
      description: "paquete de 12 unidades",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 15,
      nombre: "Chorizo Tipo vela",
      precio: 3.20,
      imagen: "vela.svg",
      description: "x lb porcion sellada segun pedido del cliente",
      categoria: "Alimentos/Cárnicos"
    },
    {
      id: 16,
      nombre: "Atún",
      precio: 13,
      imagen: "atun.svg",
      description: "Lata de 1 Kg en aceite",
      categoria: "Alimentos/Cárnicos"
    },
    // Alimentos/Líquidos
    {
      id: 17,
      nombre: "Cerveza Cristal",
      precio: 22,
      imagen: "cristal.svg",
      description: "Caja de 24 uds",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 18,
      nombre: "Cerveza Bucanero",
      precio: 22,
      imagen: "bucanero.svg",
      description: "Caja de 24 uds",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 19,
      nombre: "Cerveza Economica",
      precio: 18,
      imagen: "timber.svg",
      description: "Caja de 24 uds",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 20,
      nombre: "Vino Acantus",
      precio: 5,
      imagen: "acantus.svg",
      description: "Botella de vino rosado, tinto o Blanco",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 21,
      nombre: "Vino Espumoso",
      precio: 10,
      imagen: "espumoso.svg",
      description: "botella de vino espumoso Varons d Valls 750 ml",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 22,
      nombre: "Ron Habana Club",
      precio: 7.70,
      imagen: "3años.svg",
      description: "Añejo 3 años 750 ml",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 23,
      nombre: "Malta Guajira",
      precio: 6.50,
      imagen: "guajira.svg",
      description: "Blister de 6 uds de 500 ml",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 24,
      nombre: "Jugo",
      precio: 14.40,
      imagen: "200ml.svg",
      description: "Caja de 24 uds de 200 ml",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 25,
      nombre: "Jugo",
      precio: 1.60,
      imagen: "naranja.svg",
      description: "Jugo La estancia Sabor Naranja 1 L",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 26,
      nombre: "Jugo",
      precio: 6.50,
      imagen: "multifrutas.svg",
      description: "Blister de 6 uds 330 ml Multifrutas de lata",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 27,
      nombre: "Malta Morena",
      precio: 18,
      imagen: "morena.svg",
      description: "Caja de 24 uds",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 28,
      nombre: "Refresco",
      precio: 1,
      imagen: "refrescolata.svg",
      description: "Lata 330 ml",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 29,
      nombre: "Refresco",
      precio: 1.90,
      imagen: "1.5lt.svg",
      description: "Pomo de 1.5 Lt",
      categoria: "Alimentos/Líquidos"
    },
    {
      id: 30,
      nombre: "Café",
      precio: 6.90,
      imagen: "aroma.svg",
      description: "Paquete de 250 gr",
      categoria: "Alimentos/Líquidos"
    },
    // Alimentos/Otros
    {
      id: 31,
      nombre: "pasta de tomate Sabrosísimo",
      precio: 3.20,
      imagen: "800gr.svg",
      description: "Pasta doble concentrado 800 gr",
      categoria: "Alimentos/Otros"
    },
    {
      id: 32,
      nombre: "Pasta de tomate Vima",
      precio: 5.99,
      imagen: "vima.svg",
      description: "Tomates frescos de huerta",
      categoria: "Alimentos/Otros"
    },
    {
      id: 33,
      nombre: "Mayonesa Celorio",
      precio: 6.50,
      imagen: "mayonesa.svg",
      description: "Pomo de 450 gr",
      categoria: "Alimentos/Otros"
    },
    {
      id: 34,
      nombre: "Pasta de Bocadito Aldaketa",
      precio: 5.8,
      imagen: "bocadito.svg",
      description: "Pomo de 450 gr",
      categoria: "Alimentos/Otros"
    },
    {
      id: 35,
      nombre: "Spaguetis",
      precio: 1.55,
      imagen: "spaguetis.svg",
      description: "Bolsa de 500 gr",
      categoria: "Alimentos/Otros"
    },
    {
      id: 36,
      nombre: "Codito",
      precio: 1.55,
      imagen: "coditos.svg",
      description: "Bolsa de 500 gr",
      categoria: "Alimentos/Otros"
    },
    {
      id: 37,
      nombre: "Fideos",
      precio: 1.90,
      imagen: "fideos.svg",
      description: "bolsa de 500 gr",
      categoria: "Alimentos/Otros"
    },
    {
      id: 38,
      nombre: "Sopa Intantanea",
      precio: 1.50,
      imagen: "sopa.svg",
      description: "Sabor pollo sobre 75 gr",
      categoria: "Alimentos/Otros"
    },
    {
      id: 39,
      nombre: "Aceite de girasol",
      precio: 2.80,
      imagen: "aceite.svg",
      description: "Botella de 900 ml",
      categoria: "Alimentos/Otros"
    },
    {
      id: 40,
      nombre: "Cartón de huevos",
      precio: 10,
      imagen: "huevo.svg",
      description: "30 uds frescos 100 % orgánicos",
      categoria: "Alimentos/Otros"
    },
    // Lácteos
    {
      id: 41,
      nombre: "Queso Gouda",
      precio: 13.5,
      imagen: "queso.svg",
      description: "Porción de 1 kg sellado",
      categoria: "Alimentos/Lácteos"
    },
    {
      id: 42,
      nombre: "Yogurt Probiótico",
      precio: 15,
      imagen: "yogurt.svg",
      description: "Cubeta de 4L",
      categoria: "Alimentos/Lácteos"
    },
    {
      id: 43,
      nombre: "Queso Crema",
      precio: 4.20,
      imagen: "crema.svg",
      description: "Pote de 300 gr",
      categoria: "Alimentos/Lácteos"
    },
    {
      id: 44,
      nombre: "Helado",
      precio: 12,
      imagen: "helado.svg",
      description: "Caja de 4L",
      categoria: "Alimentos/Lácteos"
    },
    {
      id: 45,
      nombre: "Leche en Polvo",
      precio: 10,
      imagen: "lechepolvo.svg",
      description: "Bolsa de 1 kg",
      categoria: "Alimentos/Lácteos"
    },
    {
      id: 46,
      nombre: "Leche Condensada",
      precio: 1.90,
      imagen: "condensada.svg",
      description: "Lata con abre fácil",
      categoria: "Alimentos/Lácteos"
    },
    // Del Agro
    {
      id: 47,
      nombre: "Ajo",
      precio: 4.7,
      imagen: "ajo.svg",
      description: "Bolsa de 10 cabezas",
      categoria: "Alimentos/Del Agro"
    },
    {
      id: 48,
      nombre: "Malanga",
      precio: 4.20,
      imagen: "malanga.svg",
      description: "bolsa de 5 lb",
      categoria: "Alimentos/Del Agro"
    },
    {
      id: 49,
      nombre: "cebolla",
      precio: 4.20,
      imagen: "cebolla.svg",
      description: "bolsa de 20 uds",
      categoria: "Alimentos/Del Agro"
    },
    {
      id: 50,
      nombre: "Tomate",
      precio: 7.40,
      imagen: "tomates.svg",
      description: "bolsa de 5 lb",
      categoria: "Alimentos/Del Agro"
    },
    {
      id: 51,
      nombre: "Col",
      precio: 1.70,
      imagen: "col.svg",
      description: "bolsa con 1 unidad sellada",
      categoria: "Alimentos/Del Agro"
    },
    {
      id: 52,
      nombre: "Boniato",
      precio: 2.40,
      imagen: "boniato.svg",
      description: "bolsa de 5 lb",
      categoria: "Alimentos/Del Agro"
    },
    // Del Hogar
    {
      id: 53,
      nombre: "Frazada de limpiar suelo",
      precio: 2.4,
      imagen: "frazada.svg",
      description: "2 unidad",
      categoria: "Del Hogar"
    },
    {
      id: 54,
      nombre: "Detergente para ropa",
      precio: 5.2,
      imagen: "4en1.svg",
      description: "Pomo de 1 L",
      categoria: "Del Hogar"
    },
    {
      id: 55,
      nombre: "Detergente polvo Multiuso",
      precio: 2.4,
      imagen: "detergente.svg",
      description: "bolsa de 500 gr",
      categoria: "Del Hogar"
    },
    {
      id: 56,
      nombre: "Jabon De Olor",
      precio: 1.2,
      imagen: "jabon.svg",
      description: "por unidades",
      categoria: "Del Hogar"
    },
    {
      id: 57,
      nombre: "Papel Higienico",
      precio: 2.2,
      imagen: "papel.svg",
      description: "bolsa con 4 unidad sellada",
      categoria: "Del Hogar"
    },
    {
      id: 58,
      nombre: "Perlas de olor para ropa",
      precio: 3.5,
      imagen: "perlas.svg",
      description: "frasco de 200 gr",
      categoria: "Del Hogar"
    },
    {
      id: 59,
      nombre: "Suavizante para ropa",
      precio: 6,
      imagen: "suavizante.svg",
      description: "Pomo de 1 lt",
      categoria: "Del Hogar"
    },
    {
      id: 60,
      nombre: "Toallitas humedas multiuso premiun",
      precio: 3.8,
      imagen: "toallas.svg",
      description: "Paquete de 120 udst",
      categoria: "Del Hogar"
    },
    {
      id: 61,
      nombre: "Pastillas de inodoro",
      precio: 2.40,
      imagen: "pastillas.svg",
      description: "4 uds",
      categoria: "Del Hogar"
    },
    // De Electrodomésticos
    {
      id: 62,
      nombre: "Ventilador de pedestal",
      precio: 60,
      imagen: "ventilador.svg",
      description: "Ventilador tipo ciclón Milexus",
      categoria: "De Electrodomésticos"
    },
    {
      id: 63,
      nombre: "Split milexus",
      precio: 380,
      imagen: "split.svg",
      description: "Milexus 1200 btu",
      categoria: "De Electrodomésticos"
    },
    {
      id: 64,
      nombre: "Frezeer",
      precio: 350,
      imagen: "nevera.svg",
      description: "Milexus 5pies",
      categoria: "De Electrodomésticos"
    },
    {
      id: 65,
      nombre: "Tv de 32",
      precio: 260,
      imagen: "32.svg",
      description: "Tv inteligente 32 pulgadas",
      categoria: "De Electrodomésticos"
    },
    {
      id: 66,
      nombre: "Tv de 55",
      precio: 450,
      imagen: "55.svg",
      description: "Tv inteligente Milexus 55 pulgadas",
      categoria: "De Electrodomésticos"
    },
    {
      id: 67,
      nombre: "Batidora Milexus",
      precio: 45,
      imagen: "batidora.svg",
      description: "Batidora 2 en 1 (+ moledor de sazones)",
      categoria: "De Electrodomésticos"
    },
    {
      id: 68,
      nombre: "Cefetera Milexus",
      precio: 45,
      imagen: "cafetera.svg",
      description: "Cafetera Electrica de 6 tazas",
      categoria: "De Electrodomésticos"
    },
    // Del Confi
    {
      id: 69,
      nombre: "Choco Biscuit",
      precio: 3.20,
      imagen: "chocobiscuit.svg",
      description: "18 gr",
      categoria: "Alimentos/Del Confi",
      descuento: 15,
    },
    {
      id: 70,
      nombre: "Bolita de chocolate",
      precio: 3.20,
      imagen: "bolitas.svg",
      description: "bolsa de 500 gr",
      categoria: "Alimentos/Del Confi"
    },
    {
      id: 71,
      nombre: "Best Chocolate",
      precio: 3.20,
      imagen: "conitos.svg",
      description: "Pomo de conitos 595 gr",
      categoria: "Alimentos/Del Confi"
    },
    {
      id: 72,
      nombre: "Galletas kidi vai vai",
      precio: 3.20,
      imagen: "kidi.svg",
      description: "Paquete de 12 uds",
      categoria: "Alimentos/Del Confi"
    },
    {
      id: 73,
      nombre: "Galletas Soda",
      precio: 3.20,
      imagen: "soda.svg",
      description: "Paquete de 8 uds",
      categoria: "Alimentos/Del Confi"
    },
    
  ];

// Variables globales y caching de elementos
let carrito = [];
const productosContainer = document.getElementById("productos-container");
const contadorCarritoElem = document.getElementById("contador-carrito");

// Función que retorna el total en USD (sin conversión)
function calcularTotalUSD() {
  return carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
}

/**
 * RENDERIZAR PRODUCTOS
 * - Muestra el nombre, la categoría y la imagen.
 * - Si tiene descuento, se muestra el precio original TACHADO y el precio nuevo.
 * - Si no tiene descuento, se muestra solo un precio.
 * - Se elimina la descripción en la tarjeta (para que solo aparezca en el modal).
 */
function renderizarProductos(categoria = "todas") {
  if (!productosContainer) return;
  const fragment = document.createDocumentFragment();
  const filtrados = categoria === "todas"
    ? productos
    : productos.filter(p => p.categoria === categoria);

  filtrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.dataset.id = prod.id;
    div.dataset.categoria = prod.categoria;

    const categoriaSinBarra = prod.categoria.replace(/[^a-zA-Z0-9]/g, '-');

    // Caso especial: Servicios
    if (prod.categoria === "Servicios") {
      div.innerHTML = `
        <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
        <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
        <h3>${prod.nombre}</h3>
        <a href="https://wa.me/+5354066204?text=${encodeURIComponent("Me interesa una cotización para " + prod.nombre)}" 
           target="_blank" class="btn-cotizacion">Cotización del Servicio</a>
      `;
    } else {
      if (prod.descuento && prod.descuento > 0) {
        const descuento = prod.descuento;
        const precioOriginal = prod.precio;
        const precioNuevo = precioOriginal * (1 - descuento / 100);
        div.innerHTML = `
          <div class="img-container">
              <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
              <div class="discount-label">Descuento ${descuento}%</div>
          </div>
          <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
          <h3>${prod.nombre}</h3>
          <p class="precio-original">USD ${precioOriginal.toFixed(2)}</p>
          <p class="precio-nuevo">USD ${precioNuevo.toFixed(2)}</p>
          <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
        `;
      } else {
        div.innerHTML = `
          <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
          <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
          <h3>${prod.nombre}</h3>
          <p class="precio-nuevo">USD ${prod.precio.toFixed(2)}</p>
          <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
        `;
      }
    }
    fragment.appendChild(div);
  });

  productosContainer.innerHTML = "";
  productosContainer.appendChild(fragment);
}

// Renderiza la sección de ofertas
function renderizarOfertas() {
  const ofertasContainer = document.querySelector(".ofertas-container");
  if (!ofertasContainer) return;
  const ofertas = productos.filter(p => p.descuento && p.descuento > 0);
  const fragment = document.createDocumentFragment();

  ofertas.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    const descuento = prod.descuento;
    const precioOriginal = prod.precio;
    const precioNuevo = precioOriginal * (1 - descuento / 100);
    const categoriaSinBarra = prod.categoria.replace(/[^a-zA-Z0-9]/g, '-');

    div.innerHTML = `
      <div class="img-container">
          <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
          <div class="discount-label">Descuento ${descuento}%</div>
      </div>
      <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
      <h3>${prod.nombre}</h3>
      <p class="precio-original">USD ${precioOriginal.toFixed(2)}</p>
      <p class="precio-nuevo">USD ${precioNuevo.toFixed(2)}</p>
      <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
    `;
    fragment.appendChild(div);
  });
  ofertasContainer.innerHTML = "";
  ofertasContainer.appendChild(fragment);
}

// Agrega producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  let precioCarrito = producto.precio;
  if (producto.descuento && producto.descuento > 0) {
    precioCarrito = producto.precio * (1 - producto.descuento / 100);
  }

  const enCarrito = carrito.find(p => p.id === id);
  if (enCarrito) {
    enCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, precio: precioCarrito, cantidad: 1 });
  }

  mostrarMensaje(`¡${producto.nombre} agregado al carrito!`);
  actualizarContadorCarrito();
  guardarCarritoEnLocalStorage();
}

// Muestra mensaje emergente
function mostrarMensaje(msg) {
  const mensajeElem = document.createElement("div");
  mensajeElem.className = "mensaje-carrito";
  mensajeElem.textContent = msg;
  document.body.appendChild(mensajeElem);
  setTimeout(() => mensajeElem.remove(), 2000);
}

// Actualiza el contador del carrito
function actualizarContadorCarrito() {
  const total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  if (contadorCarritoElem) contadorCarritoElem.textContent = total;
}

// Guarda y carga el carrito desde localStorage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
  const guardado = localStorage.getItem("carrito");
  if (guardado) {
    carrito = JSON.parse(guardado) || [];
    actualizarContadorCarrito();
  }
}

// Renderiza el carrito en cart.html
function renderizarCarrito() {
  const itemsCarrito = document.getElementById("items-carrito");
  if (!itemsCarrito) return;
  itemsCarrito.innerHTML = "";
  if (carrito.length === 0) {
    itemsCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    const totalElem = document.getElementById("total-pedido");
    if (totalElem) totalElem.textContent = "USD 0.00";
    return;
  }
  const totalUSD = calcularTotalUSD();
  carrito.forEach(prod => {
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <img src="images/${prod.imagen}" alt="${prod.nombre}">
      <div class="item-info">
          <h4>${prod.nombre}</h4>
          <p>USD ${prod.precio.toFixed(2)} x ${prod.cantidad}</p>
      </div>
      <div class="contador-cantidad">
          <button class="btn-cambiar" data-id="${prod.id}" data-delta="-1">-</button>
          <input type="text" value="${prod.cantidad}" disabled>
          <button class="btn-cambiar" data-id="${prod.id}" data-delta="1">+</button>
      </div>
      <button class="eliminar-item" data-id="${prod.id}">🗑️</button>
    `;
    itemsCarrito.appendChild(div);
  });

  const totalElem = document.getElementById("total-pedido");
  let totalTexto;
  const metodoSelect = document.getElementById("metodo-pago");
  if (metodoSelect && metodoSelect.value === "Pago en CUP") {
    const totalCUP = totalUSD * tasaCambio;
    totalTexto = 'CUP ' + totalCUP.toFixed(2);
  } else {
    totalTexto = 'USD ' + totalUSD.toFixed(2);
  }
  if (totalElem) totalElem.textContent = totalTexto;
}

// Cambia la cantidad de un producto en el carrito
function cambiarCantidad(id, delta) {
  const prod = carrito.find(p => p.id === id);
  if (!prod) return;
  prod.cantidad += delta;
  if (prod.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }
  guardarCarritoEnLocalStorage();
  renderizarCarrito();
  actualizarContadorCarrito();
}

// Elimina un producto del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarritoEnLocalStorage();
  renderizarCarrito();
  actualizarContadorCarrito();
}

// Redirige a index.html
function redirigirAPaginaPrincipal() {
  window.location.href = "index.html";
}

function validarFormulario() {
  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = document.getElementById("telefono").value;

  if (!nombre || !direccion || !telefono) {
    alert("Por favor, complete todos los campos.");
    return false;
  }

  if (!/^\d{8}$/.test(telefono)) {
    alert("El número de teléfono no es válido. Debe tener 8 dígitos.");
    return false;
  }

  return true;
}

// Envía el pedido por WhatsApp y vacía el carrito con el formato solicitado
function enviarPedidoPorWhatsapp() {
  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = document.getElementById("telefono").value;
  const metodoPago = document.getElementById("metodo-pago").value;

  const totalUSD = calcularTotalUSD();
  let totalMensaje;
  let moneda;
  if (metodoPago.indexOf("CUP") !== -1) {
    totalMensaje = totalUSD * tasaCambio;
    moneda = "CUP";
  } else {
    totalMensaje = totalUSD;
    moneda = "USD";
  }
  const totalTexto = totalMensaje.toFixed(2) + " " + moneda;

  let mensaje = `🛒 Nuevo Pedido\n\n`;
  mensaje += `👤 Datos del Cliente:\n\n`;
  mensaje += `• Nombre: ${nombre}\n`;
  mensaje += `• Teléfono: ${telefono}\n`;
  mensaje += `• Dirección: ${direccion}\n`;
  mensaje += `• Método de Pago: ${metodoPago}\n\n`;
  mensaje += `💳 Información de Pago:\n`;
  mensaje += `Total a pagar: ${totalTexto}\n`;
  mensaje += `Por favor realice la transferencia y envíe el comprobante por este medio.\n\n`;
  mensaje += `🛍 Productos:\n\n`;
  carrito.forEach(prod => {
    let productTotal = prod.cantidad * prod.precio;
    if (moneda === "CUP") {
      productTotal *= tasaCambio;
    }
    mensaje += `• ${prod.cantidad}x ${prod.nombre} - ${productTotal.toFixed(2)} ${moneda}\n`;
  });
  mensaje += `\n💰 Total a Pagar: ${totalTexto} de 24 a 48 horas pedido completado`;

  try {
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsapp = `https://wa.me/+5354066204?text=${mensajeCodificado}`;
    window.open(urlWhatsapp, "_blank");

    alert("¡Pedido enviado correctamente! Gracias por su compra.");
    cerrarModalPedido();
    vaciarCarrito();
    limpiarFormulario();
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    alert("Hubo un error al procesar su pedido. Por favor, intente de nuevo.");
  }
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("direccion").value = "";
  document.getElementById("telefono").value = "";
  if (document.getElementById("nota")) {
    document.getElementById("nota").value = "";
  }
}

// Vacía el carrito y actualiza la interfaz y el localStorage
function vaciarCarrito() {
  carrito = [];
  guardarCarritoEnLocalStorage();
  actualizarContadorCarrito();
  if (document.getElementById("items-carrito")) {
    renderizarCarrito();
  }
}

// Cierra el modal de pedido
function cerrarModalPedido() {
  const modal = document.getElementById("modal-pedido");
  if (modal) modal.style.display = "none";
}

// ---------------------------
// Modal para mostrar descripción del producto
// ---------------------------
function mostrarDescripcionProducto(producto) {
  const modal = document.getElementById("modal-descripcion");
  if (!modal) return;
  const modalNombre = modal.querySelector(".modal-nombre");
  const modalDescripcion = modal.querySelector(".modal-descripcion");

  modalNombre.textContent = producto.nombre;
  modalDescripcion.textContent = producto.description;

  modal.style.display = "block";
}

// ---------------------------
// Event delegation
// ---------------------------
document.addEventListener("click", (e) => {
  // Si se hace clic en el botón "Agregar al carrito"
  if (e.target.matches(".btn-agregar")) {
    const id = parseInt(e.target.dataset.id, 10);
    agregarAlCarrito(id);
    return;
  }
  
  // Si se hace clic en cualquier parte de un producto para mostrar descripción
  const productoDiv = e.target.closest(".producto");
  if (productoDiv) {
    const prodId = parseInt(productoDiv.dataset.id, 10);
    const producto = productos.find((p) => p.id === prodId);
    if (producto) {
      mostrarDescripcionProducto(producto);
    }
  }

  if (e.target.matches(".btn-cambiar")) {
    const id = parseInt(e.target.dataset.id, 10);
    const delta = parseInt(e.target.dataset.delta, 10);
    cambiarCantidad(id, delta);
  }
  if (e.target.matches(".eliminar-item")) {
    const id = parseInt(e.target.dataset.id, 10);
    eliminarDelCarrito(id);
  }
  if (e.target.matches("#seguir-comprando")) {
    redirigirAPaginaPrincipal();
  }
  if (e.target.matches(".cerrar-modal")) {
    cerrarModalPedido();
  }
});

// Cerrar el modal de descripción al hacer clic en la "x"
const modalDescripcionClose = document.querySelector("#modal-descripcion .close");
if (modalDescripcionClose) {
  modalDescripcionClose.addEventListener("click", () => {
    const modal = document.getElementById("modal-descripcion");
    if (modal) modal.style.display = "none";
  });
}

// Cerrar el modal de descripción si se hace clic fuera del contenido
window.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-descripcion");
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
});

// Actualiza el total en el carrito si se cambia el método de pago
function actualizarTotalSegunMetodo() {
  renderizarCarrito();
}

// Cerrar el modal de pedido si se hace clic fuera de su contenido
window.addEventListener("click", (e) => {
  const modalPedido = document.getElementById("modal-pedido");
  if (modalPedido && e.target === modalPedido) {
    cerrarModalPedido();
  }
});

// ---------------------------
// Compartir la página (Web Share API)
// ---------------------------
function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    })
    .then(() => console.log("Página compartida exitosamente"))
    .catch((error) => console.error("Error al compartir:", error));
  } else {
    alert("La función de compartir no es soportada en este navegador.");
  }
}

// ---------------------------
// Inicialización
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  cargarCarritoDesdeLocalStorage();

  // Si estamos en index.html
  if (productosContainer) {
    renderizarProductos();
    const filtros = document.querySelectorAll(".filtro-btn");
    filtros.forEach(btn => {
      btn.addEventListener("click", () => {
        filtros.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderizarProductos(btn.dataset.categoria);
      });
    });
    // Renderiza la sección de ofertas
    renderizarOfertas();
  }

  // Si estamos en cart.html
  if (document.getElementById("items-carrito")) {
    renderizarCarrito();
    const btnWhatsapp = document.getElementById("pedir-whatsapp");
    if (btnWhatsapp) {
      btnWhatsapp.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("modal-pedido").style.display = "block";
      });
    }
    const formularioPedido = document.getElementById("formulario-pedido");
    if (formularioPedido) {
      formularioPedido.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validarFormulario()) {
          enviarPedidoPorWhatsapp();
        }
      });
    }
    const metodoSelect = document.getElementById("metodo-pago");
    if (metodoSelect) {
      metodoSelect.addEventListener("change", actualizarTotalSegunMetodo);
    }
  }

  // Validación del input de teléfono (solo números)
  const telefonoInput = document.getElementById("telefono");
  if (telefonoInput) {
    telefonoInput.addEventListener("input", () => {
      if (!/^\d*$/.test(telefonoInput.value)) {
        telefonoInput.setCustomValidity("Solo se permiten números.");
      } else {
        telefonoInput.setCustomValidity("");
      }
    });
  }
});
