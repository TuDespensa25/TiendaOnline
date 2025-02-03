"use strict";

// Datos de productos
const productos = [
  {
    id: 1,
    nombre: "Tv Milexus 55 pulgadas",
    precio: 450,
    categoria: "Electrodomésticos",
    imagen: "images/55.jpg"
  },
  {
    id: 2,
    nombre: "Ventilador de pedestal",
    precio: 60,
    categoria: "Electrodomésticos",
    imagen: "images/ventilador.jpg",
    description: "Ventilador tipo ciclón Milexus"
  },
  {
    id: 61,
    nombre: "Split Milexus",
    precio: 380,
    categoria: "Electrodomésticos",
    imagen: "images/split.jpg",
    description: "Milexus 1200 btu"
  },
  {
    id: 62,
    nombre: "Freezer",
    precio: 350,
    categoria: "Electrodomésticos",
    imagen: "images/nevera.jpg",
    description: "Milexus 5 pies"
  },
  {
    id: 63,
    nombre: "Tv de 32",
    precio: 260,
    categoria: "Electrodomésticos",
    imagen: "images/32.jpg",
    description: "Tv inteligente 32 pulgadas"
  },
  {
    id: 64,
    nombre: "Tv de 55",
    precio: 450,
    categoria: "Electrodomésticos",
    imagen: "images/55.jpg",
    description: "Tv inteligente Milexus 55 pulgadas"
  },
  {
    id: 65,
    nombre: "Batidora Milexus",
    precio: 45,
    categoria: "Electrodomésticos",
    imagen: "images/batidora.jpg",
    description: "Batidora 2 en 1 (+ moledor de sazones)"
  },
  {
    id: 66,
    nombre: "Cafetera Milexus",
    precio: 45,
    categoria: "Electrodomésticos",
    imagen: "images/cafetera.jpg",
    description: "Cafetera Eléctrica de 6 tazas"
  },
  {
    id: 3,
    nombre: "Producto 2",
    precio: 50,
    categoria: "Alimentos",
    imagen: "images/producto2.jpg"
  },
  {
    id: 4,
    nombre: "Producto 3",
    precio: 30,
    categoria: "Aseo",
    imagen: "images/producto3.jpg"
  }
];

// Variables globales y caching de algunos elementos
let carrito = [];
const productosContainer = document.getElementById("productos");
const contadorCarritoElem = document.getElementById("contador-carrito");

// Función para renderizar productos
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
    div.innerHTML = `
      <div class="etiqueta-categoria ${prod.categoria}">${prod.categoria}</div>
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
    `;
    fragment.appendChild(div);
  });
  productosContainer.innerHTML = "";
  productosContainer.appendChild(fragment);
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  const enCarrito = carrito.find(p => p.id === id);
  if (enCarrito) {
    enCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  mostrarMensaje(`¡${producto.nombre} agregado al carrito!`);
  actualizarContadorCarrito();
  guardarCarritoEnLocalStorage();
}

// Mostrar mensaje emergente
function mostrarMensaje(msg) {
  const mensajeElem = document.createElement("div");
  mensajeElem.className = "mensaje-carrito";
  mensajeElem.textContent = msg;
  document.body.appendChild(mensajeElem);
  setTimeout(() => mensajeElem.remove(), 2000);
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
  const total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  if (contadorCarritoElem) contadorCarritoElem.textContent = total;
}

// Guardar y cargar carrito en localStorage
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

// Renderizar carrito en cart.html
function renderizarCarrito() {
  const itemsCarrito = document.getElementById("items-carrito");
  if (!itemsCarrito) return;
  itemsCarrito.innerHTML = "";
  let totalPedido = 0;
  carrito.forEach(prod => {
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <div class="item-info">
        <h4>${prod.nombre}</h4>
        <p>$${prod.precio} x ${prod.cantidad}</p>
      </div>
      <div class="contador-cantidad">
        <button class="btn-cambiar" data-id="${prod.id}" data-delta="-1">-</button>
        <input type="text" value="${prod.cantidad}" disabled>
        <button class="btn-cambiar" data-id="${prod.id}" data-delta="1">+</button>
      </div>
      <button class="eliminar-item" data-id="${prod.id}">🗑️</button>
    `;
    itemsCarrito.appendChild(div);
    totalPedido += prod.precio * prod.cantidad;
  });
  const totalElem = document.getElementById("total-pedido");
  if (totalElem) totalElem.textContent = totalPedido.toFixed(2);
}

// Cambiar cantidad de un producto en el carrito
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

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarritoEnLocalStorage();
  renderizarCarrito();
  actualizarContadorCarrito();
}
// Redirigir a la página principal
function redirigirAPaginaPrincipal() {
  window.location.href = "index.html";
}

// Event delegation para elementos dinámicos
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-agregar")) {
    const id = parseInt(e.target.dataset.id, 10);
    agregarAlCarrito(id);
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
});

// Inicialización
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
  }

  // Si estamos en cart.html
  if (document.getElementById("items-carrito")) {
    renderizarCarrito();
    const btnWhatsapp = document.getElementById("pedir-whatsapp");
    if (btnWhatsapp) btnWhatsapp.addEventListener("click", enviarPedidoPorWhatsapp);
    const btnSeguir = document.getElementById("seguir-comprando");
    if (btnSeguir) btnSeguir.addEventListener("click", redirigirAPaginaPrincipal);
  }
});
// Abrir modal al hacer clic en "Procesar Pedido"
const btnProcesarPedido = document.getElementById("pedir-whatsapp");
const modal = document.getElementById("modal-pedido");
const cerrarModal = document.querySelector(".cerrar-modal");

if (btnProcesarPedido) {
  btnProcesarPedido.addEventListener("click", (e) => {
    e.preventDefault(); // Evita que el botón recargue la página
    modal.style.display = "flex"; // Muestra el modal
  });
}

// Cerrar modal al hacer clic en la "X"
if (cerrarModal) {
  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Enviar pedido por WhatsApp al enviar el formulario
const formularioPedido = document.getElementById("formulario-pedido");

if (formularioPedido) {
  formularioPedido.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que el formulario se envíe

    // Obtener los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const nota = document.getElementById("nota").value;
    const metodoPago = document.getElementById("metodo-pago").value;

    // Crear el mensaje para WhatsApp
    let mensaje = `Hola, quiero hacer el siguiente pedido:\n\n`;
    mensaje += `*Nombre:* ${nombre}\n`;
    mensaje += `*Dirección:* ${direccion}\n`;
    mensaje += `*Teléfono:* ${telefono}\n`;
    mensaje += `*Método de Pago:* ${metodoPago}\n`;
    mensaje += `*Nota:* ${nota || "Ninguna"}\n\n`;
    mensaje += `*Productos:*\n`;

    // Agregar los productos del carrito al mensaje
    carrito.forEach((prod) => {
      mensaje += `${prod.nombre} - ${prod.cantidad} x $${prod.precio}\n`;
    });

    // Calcular el total
    const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    mensaje += `\n*Total:* $${total.toFixed(2)}`;

    // Codificar el mensaje para la URL de WhatsApp
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Abrir WhatsApp con el mensaje
    const urlWhatsapp = `https://wa.me/+5354066204?text=${mensajeCodificado}`;
    window.open(urlWhatsapp, "_blank");

    // Cerrar el modal
    modal.style.display = "none";
  });
}