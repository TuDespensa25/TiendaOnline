"use strict";

// Tasa de cambio: 1 USD equivale a 340.0 CUP (ajusta según necesites)
const tasaCambio = 340.0;

// Lista de productos adaptada y clasificada
const productos = [
  // Alimentos/Cárnicos
  {
    id: 1,
    nombre: "Pierna de Cerdo",
    precio: 3.80,
    imagen: "pierna.jpg",
    description: "x lb",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 2,
    nombre: "Caja de Pollo",
    precio: 48,
    imagen: "pollocaja.jpg",
    description: "caja de 33 lb",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 3,
    nombre: "Caja de Pollo",
    precio: 58,
    imagen: "pollocaja.jpg",
    description: "caja de 40 lb",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 4,
    nombre: "Lomo de cerdo deshuesado",
    precio: 5.20,
    imagen: "lomo.jpg",
    description: "x Lb Importado",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 5,
    nombre: "Masas de Cerdo",
    precio: 19,
    imagen: "masas.jpg",
    description: "bolsa sellada al vacio de 4lb",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 6,
    nombre: "Bistec de cerdo",
    precio: 10.5,
    imagen: "bistec.jpg",
    description: "bandeja de bistec sellada al vacio 2.2 lb",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 7,
    nombre: "Pollo x Lb",
    precio: 1.6,
    imagen: "pollo.jpg",
    description: "Bolsa sellada segun pedido",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 8,
    nombre: "Jamon vicky",
    precio: 3.50,
    imagen: "vicky.jpg",
    description: "tubo sellado segun pedido",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 9,
    nombre: "Lomo ahumado",
    precio: 6.5,
    imagen: "ahumado.jpg",
    description: "porcionado y sellado x lb según pedido",
    categoria: "Alimentos/Cárnicos",
    descuento: 25,
  },
  {
    id: 10,
    nombre: "Lomo Ahumado",
    precio: 8,
    imagen: "ahumado.jpg",
    description: "bandeja sellada al vacio de 1.2 lb lasqueado",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 11,
    nombre: "Pechuga de pollo",
    precio: 5.20,
    imagen: "pechuga.jpg",
    description: "x Lb de bistec de pechuga sellada",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 12,
    nombre: "Jamón Embuchado",
    precio: 4.00,
    imagen: "embuchado.jpg",
    description: "Porción sellada según peso requerido por el cliente",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 13,
    nombre: "Picadillo Mixto",
    precio: 2.50,
    imagen: "picadillo.jpg",
    description: "unidad de 400 gr",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 14,
    nombre: "Salchichas",
    precio: 2.80,
    imagen: "perritos.jpg",
    description: "paquete de 12 unidades",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 15,
    nombre: "Chorizo Tipo vela",
    precio: 3.60,
    imagen: "vela.jpg",
    description: "x lb porcion sellada segun pedido del cliente",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 16,
    nombre: "Atún",
    precio: 13,
    imagen: "atun.jpg",
    description: "Lata de 1 Kg en aceite",
    categoria: "Alimentos/Cárnicos"
  },
  // Alimentos/Líquidos
  {
    id: 17,
    nombre: "Cerveza Cristal",
    precio: 22,
    imagen: "cristal.jpg",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 18,
    nombre: "Cerveza Bucanero",
    precio: 22,
    imagen: "bucanero.jpg",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 19,
    nombre: "Cerveza Economica",
    precio: 18,
    imagen: "timber.jpg",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 20,
    nombre: "Vino Acantus",
    precio: 5,
    imagen: "acantus.jpg",
    description: "Rosado, tinto, Blanco",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 21,
    nombre: "Vino Espumoso",
    precio: 10,
    imagen: "espumoso.jpg",
    description: "Varons d Valls 750 ml",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 22,
    nombre: "Ron Habana Club",
    precio: 7.70,
    imagen: "3años.jpg",
    description: "Añejo 3 años 750 ml",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 23,
    nombre: "Malta Guajira",
    precio: 6.50,
    imagen: "guajira.jpg",
    description: "Blister de 6 uds de 500 ml",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 24,
    nombre: "Jugo",
    precio: 14.40,
    imagen: "200ml.jfif",
    description: "Caja de 24 uds de 200 ml",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 25,
    nombre: "Jugo",
    precio: 1.60,
    imagen: "naranja.jpg",
    description: "Jugo La estancia Sabor Naranja 1 L",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 26,
    nombre: "Jugo",
    precio: 6.50,
    imagen: "multifrutas.jpg",
    description: "Blister de 6 uds 330 ml Multifrutas de lata",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 27,
    nombre: "Malta Morena",
    precio: 18,
    imagen: "morena.jpg",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 28,
    nombre: "Refresco",
    precio: 1,
    imagen: "refrescolata.jpg",
    description: "Lata 330 ml",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 29,
    nombre: "Refresco",
    precio: 1.90,
    imagen: "1.5lt.jpg",
    description: "Pomo de 1.5 Lt",
    categoria: "Alimentos/Líquidos"
  },
  {
    id: 30,
    nombre: "Café",
    precio: 6.90,
    imagen: "aroma.jpg",
    description: "Paquete de 250 gr",
    categoria: "Alimentos/Líquidos"
  },
  // Alimentos/Otros
  {
    id: 31,
    nombre: "pasta de tomate Sabrosísimo",
    precio: 3.20,
    imagen: "800gr.jpg",
    description: "Pasta doble concentrado 800 gr",
    categoria: "Alimentos/Otros"
  },
  {
    id: 32,
    nombre: "Pasta de tomate Vima",
    precio: 5.99,
    imagen: "vima.jpg",
    description: "Tomates frescos de huerta",
    categoria: "Alimentos/Otros"
  },
  {
    id: 33,
    nombre: "Mayonesa Celorio",
    precio: 6.50,
    imagen: "mayonesa.jpg",
    description: "Pomo de 450 gr",
    categoria: "Alimentos/Otros"
  },
  {
    id: 34,
    nombre: "Pasta de Bocadito Aldaketa",
    precio: 5.8,
    imagen: "bocadito.jpg",
    description: "Pomo de 450 gr",
    categoria: "Alimentos/Otros"
  },
  {
    id: 35,
    nombre: "Spaguetis",
    precio: 1.55,
    imagen: "spaguetis.jpg",
    description: "Bolsa de 500 gr",
    categoria: "Alimentos/Otros"
  },
  {
    id: 36,
    nombre: "Codito",
    precio: 1.55,
    imagen: "coditos.jpg",
    description: "Bolsa de 500 gr",
    categoria: "Alimentos/Otros"
  },
  {
    id: 37,
    nombre: "Fideos",
    precio: 1.90,
    imagen: "fideos.jpg",
    description: "bolsa de 500 gr",
    categoria: "Alimentos/Otros"
  },
  {
    id: 38,
    nombre: "Sopa Intantanea",
    precio: 1.50,
    imagen: "sopa.jpg",
    description: "Sabor pollo sobre 75 gr",
    categoria: "Alimentos/Otros"
  },
  {
    id: 39,
    nombre: "Aceite de girasol",
    precio: 2.80,
    imagen: "aceite.jpg",
    description: "Botella de 900 ml",
    categoria: "Alimentos/Otros"
  },
  {
    id: 40,
    nombre: "Cartón de huevos",
    precio: 12,
    imagen: "huevo.jpg",
    description: "30 uds frescos",
    categoria: "Alimentos/Otros"
  },
  // Lácteos
  {
    id: 41,
    nombre: "Queso Gouda",
    precio: 13.5,
    imagen: "queso.jpg",
    description: "Porción de 1 kg sellado",
    categoria: "Alimentos/Lácteos"
  },
  {
    id: 42,
    nombre: "Yogurt Probiótico",
    precio: 15,
    imagen: "yogurt.jpg",
    description: "Cubeta de 4L",
    categoria: "Alimentos/Lácteos"
  },
  {
    id: 43,
    nombre: "Queso Crema",
    precio: 4.20,
    imagen: "crema.jpg",
    description: "Pote de 300 gr",
    categoria: "Alimentos/Lácteos"
  },
  {
    id: 44,
    nombre: "Helado",
    precio: 12,
    imagen: "helado.jpg",
    description: "Caja de 4L",
    categoria: "Alimentos/Lácteos"
  },
  {
    id: 45,
    nombre: "Leche en Polvo",
    precio: 10,
    imagen: "lechepolvo.jpg",
    description: "Bolsa de 1 kg",
    categoria: "Alimentos/Lácteos"
  },
  {
    id: 46,
    nombre: "Leche Condensada",
    precio: 1.90,
    imagen: "condensada.jpg",
    description: "Lata con abre fácil",
    categoria: "Alimentos/Lácteos"
  },
  // Del Agro
  {
    id: 47,
    nombre: "Ajo",
    precio: 4.7,
    imagen: "ajo.jpg",
    description: "Bolsa de 10 cabezas",
    categoria: "Alimentos/Del Agro"
  },
  {
    id: 48,
    nombre: "Malanga",
    precio: 4.20,
    imagen: "malanga.jpg",
    description: "bolsa de 5 lb",
    categoria: "Alimentos/Del Agro"
  },
  {
    id: 49,
    nombre: "cebolla",
    precio: 4.20,
    imagen: "cebolla.jpg",
    description: "bolsa de 20 uds",
    categoria: "Alimentos/Del Agro"
  },
  {
    id: 50,
    nombre: "Tomate",
    precio: 7.40,
    imagen: "tomates.jpg",
    description: "bolsa de 5 lb",
    categoria: "Alimentos/Del Agro"
  },
  {
    id: 51,
    nombre: "Col",
    precio: 1.70,
    imagen: "col.jpg",
    description: "bolsa con 1 unidad sellada",
    categoria: "Alimentos/Del Agro"
  },
  {
    id: 52,
    nombre: "Boniato",
    precio: 2.40,
    imagen: "boniato.jpg",
    description: "bolsa de 5 lb",
    categoria: "Alimentos/Del Agro"
  },
  // Del Hogar
  {
    id: 53,
    nombre: "Frazada de limpiar suelo",
    precio: 2.4,
    imagen: "frazada.jpg",
    description: "2 unidad",
    categoria: "Del Hogar"
  },
  {
    id: 54,
    nombre: "Detergente para ropa",
    precio: 5.2,
    imagen: "4en1.jpg",
    description: "Pomo de 1 L",
    categoria: "Del Hogar"
  },
  {
    id: 55,
    nombre: "Detergente polvo Multiuso",
    precio: 2.4,
    imagen: "detergente.jpg",
    description: "bolsa de 500 gr",
    categoria: "Del Hogar"
  },
  {
    id: 56,
    nombre: "Jabon De Olor",
    precio: 1.2,
    imagen: "jabon.jpg",
    description: "por unidades",
    categoria: "Del Hogar"
  },
  {
    id: 57,
    nombre: "Papel Higienico",
    precio: 2.2,
    imagen: "papel.jpg",
    description: "bolsa con 4 unidad sellada",
    categoria: "Del Hogar"
  },
  {
    id: 58,
    nombre: "Perlas de olor para ropa",
    precio: 3.5,
    imagen: "perlas.jpg",
    description: "frasco de 200 gr",
    categoria: "Del Hogar"
  },
  {
    id: 59,
    nombre: "Suavizante para ropa",
    precio: 6,
    imagen: "suavizante.jpg",
    description: "Pomo de 1 lt",
    categoria: "Del Hogar"
  },
  {
    id: 60,
    nombre: "Toallitas humedas multiuso premiun",
    precio: 3.8,
    imagen: "toallas.jpg",
    description: "Paquete de 120 udst",
    categoria: "Del Hogar"
  },
  {
    id: 61,
    nombre: "Pastillas de inodoro",
    precio: 2.40,
    imagen: "pastillas.jpg",
    description: "4 uds",
    categoria: "Del Hogar"
  },
  // De Electrodomésticos
  {
    id: 62,
    nombre: "Ventilador de pedestal",
    precio: 60,
    imagen: "ventilador.jpg",
    description: "Ventilador tipo ciclón Milexus",
    categoria: "De Electrodomésticos"
  },
  {
    id: 63,
    nombre: "Split milexus",
    precio: 380,
    imagen: "split.jpg",
    description: "Milexus 1200 btu",
    categoria: "De Electrodomésticos"
  },
  {
    id: 64,
    nombre: "Frezeer",
    precio: 350,
    imagen: "nevera.jpg",
    description: "Milexus 5pies",
    categoria: "De Electrodomésticos"
  },
  {
    id: 65,
    nombre: "Tv de 32",
    precio: 260,
    imagen: "32.jpg",
    description: "Tv inteligente 32 pulgadas",
    categoria: "De Electrodomésticos"
  },
  {
    id: 66,
    nombre: "Tv de 55",
    precio: 450,
    imagen: "55.jpg",
    description: "Tv inteligente Milexus 55 pulgadas",
    categoria: "De Electrodomésticos"
  },
  {
    id: 67,
    nombre: "Batidora Milexus",
    precio: 45,
    imagen: "batidora.jpg",
    description: "Batidora 2 en 1 (+ moledor de sazones)",
    categoria: "De Electrodomésticos"
  },
  {
    id: 68,
    nombre: "Cefetera Milexus",
    precio: 45,
    imagen: "cafetera.jpg",
    description: "Cafetera Electrica de 6 tazas",
    categoria: "De Electrodomésticos"
  },
  // Del Confi
  {
    id: 69,
    nombre: "Choco Biscuit",
    precio: 3.20,
    imagen: "chocobiscuit.jpg",
    description: "18 gr",
    categoria: "Alimentos/Del Confi",
    descuento: 15,
  },
  {
    id: 70,
    nombre: "Bolita de chocolate",
    precio: 3.20,
    imagen: "bolitas.jpg",
    description: "bolsa de 500 gr",
    categoria: "Alimentos/Del Confi"
  },
  {
    id: 71,
    nombre: "Best Chocolate",
    precio: 3.20,
    imagen: "conitos.jpg",
    description: "Pomo de conitos 595 gr",
    categoria: "Alimentos/Del Confi"
  },
  {
    id: 72,
    nombre: "Galletas kidi vai vai",
    precio: 3.20,
    imagen: "kidi.jpg",
    description: "Paquete de 12 uds",
    categoria: "Alimentos/Del Confi"
  },
  {
    id: 73,
    nombre: "Galletas Soda",
    precio: 3.20,
    imagen: "soda.jpg",
    description: "Paquete de 8 uds",
    categoria: "Alimentos/Del Confi"
  },
  {
    id: 74,
    nombre: "Generador Eléctrico",
    precio: 350,
    imagen: "pulsarr.jpg",
    description: "Generador eléctrico Pulsar 1200 w",
    categoria: "De Electrodomésticos"
  }
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
 * Se muestran: imagen, nombre, categoría y precios.
 * En caso de descuento, se muestra el precio original tachado y el nuevo precio.
 * La descripción no se muestra en la tarjeta, solo se usará en el modal.
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

// Renderiza la sección de ofertas (productos con descuento)
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
    carrito = JSON.parse(guardado);
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

// Envía el pedido por WhatsApp y vacía el carrito
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

// Vacía el carrito y actualiza la interfaz y localStorage
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

// Modal para mostrar la descripción del producto
function mostrarDescripcionProducto(producto) {
  const modal = document.getElementById("modal-descripcion");
  const modalNombre = modal.querySelector(".modal-nombre");
  const modalDescripcion = modal.querySelector(".modal-descripcion");
  modalNombre.textContent = producto.nombre;
  modalDescripcion.textContent = producto.description;
  modal.style.display = "block";
}

// Event delegation
document.addEventListener("click", (e) => {
  // Si se hace clic en "Agregar al carrito", se llama a agregarAlCarrito y se detiene el resto
  if (e.target.matches(".btn-agregar")) {
    const id = parseInt(e.target.dataset.id, 10);
    agregarAlCarrito(id);
    return;
  }
  // Si se hace clic en alguna parte de la tarjeta de producto, muestra el modal con descripción
  const productoDiv = e.target.closest(".producto");
  if (productoDiv) {
    const prodId = parseInt(productoDiv.dataset.id, 10);
    const producto = productos.find(p => p.id === prodId);
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

// Cerrar modal de descripción al hacer clic en la "x"
document.querySelector("#modal-descripcion .close").addEventListener("click", () => {
  document.getElementById("modal-descripcion").style.display = "none";
});

// Cerrar modal de descripción si se hace clic fuera del contenido
window.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-descripcion");
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
});

// Actualiza el total si cambia el método de pago
function actualizarTotalSegunMetodo() {
  renderizarCarrito();
}

// Cierra el modal de pedido si se hace clic fuera de su contenido
window.addEventListener("click", (e) => {
  const modalPedido = document.getElementById("modal-pedido");
  if (modalPedido && e.target === modalPedido) {
    cerrarModalPedido();
  }
});

// Compartir la página (Web Share API)
function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    })
    .then(() => console.log("Página compartida exitosamente"))
    .catch(error => console.error("Error al compartir:", error));
  } else {
    alert("La función de compartir no es soportada en este navegador.");
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarCarritoDesdeLocalStorage();
  // En index.html
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
    renderizarOfertas();
  }
  // En cart.html
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
