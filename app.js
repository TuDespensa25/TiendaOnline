// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Tv Milexus 55 pulgadas",
        precio: 450,
        categoria: "electrodomesticos",
        imagen: "images/55.jpg"
    },
    {
        id: 2,
        nombre: "Ventilador de pedestal",
        precio: 60,
        imagen: "images/ventilador.jpg",
        description: "Ventilador tipo ciclón Milexus",
        categoria: "electrodomesticos"
    },
    {
        id: 61,
        name: "Split milexus ",
        price: 380,
        image: "split.jpg",
        description: "Milexus 1200 btu",
        category: "De Electrodomésticos"
    },
    {
        id: 62,
        name: "Frezeer  ",
        price: 350,
        image: "nevera.jpg",
        description: "Milexus 5pies ",
        category: "De Electrodomésticos"
    },
    {
        id:63,
        name: "Tv de 32",
        price: 260,
        image: "32.jpg",
        description: "Tv inteligente 32 pulgadas",
        category: "De Electrodomésticos"
    },
    {
        id: 64,
        name: "Tv de 55  ",
        price: 450,
        image: "55.jpg",
        description: "Tv inteligente Milexus 55 pulgadas",
        category: "De Electrodomésticos"
    },
    {
        id: 65,
        name: "Batidora Milexus ",
        price: 45,
        image: "batidora.jpg",
        description: "Batidora 2 en 1 (+ moledor de sazones)",
        category: "De Electrodomésticos"
    },
    {
        id: 66,
        name: " Cefetera Milexus ",
        price: 45,
        image: "cafetera.jpg",
        description: "Cafetera Electrica de 6 tazas",
        category: "De Electrodomésticos"
    },
    {
        id: 2,
        nombre: "Producto 2",
        precio: 50,
        categoria: "alimentos",
        imagen: "images/producto2.jpg"
    },
    {
        id: 3,
        nombre: "Producto 3",
        precio: 30,
        categoria: "aseo",
        imagen: "images/producto3.jpg"
    }
];

// Variables globales
let carrito = [];
let contadorCarrito = 0;

// Función para renderizar productos
function renderizarProductos(categoria = "todas") {
    const productosContainer = document.getElementById("productos");
    if (!productosContainer) return; // Si no existe, salir

    const fragment = document.createDocumentFragment(); // Crear un fragmento
    const productosFiltrados = categoria === "todas" ? productos : productos.filter(producto => producto.categoria === categoria);

    productosFiltrados.forEach(producto => {
        const productoHTML = `
            <div class="producto" data-categoria="${producto.categoria}">
                <div class="etiqueta-categoria ${producto.categoria}">${producto.categoria}</div>
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `;
        const div = document.createElement("div");
        div.innerHTML = productoHTML;
        fragment.appendChild(div.firstElementChild); // Agregar al fragmento
    });

    productosContainer.innerHTML = ""; // Limpiar contenedor
    productosContainer.appendChild(fragment); // Agregar todo de una vez
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const productoEnCarrito = carrito.find(p => p.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    // Mostrar mensaje emergente
    mostrarMensaje(`¡${producto.nombre} agregado al carrito!`);

    actualizarContadorCarrito();
    guardarCarritoEnLocalStorage();
}

function mostrarMensaje(mensaje) {
    const mensajeElemento = document.createElement("div");
    mensajeElemento.className = "mensaje-carrito";
    mensajeElemento.textContent = mensaje;
    document.body.appendChild(mensajeElemento);

    // Eliminar el mensaje después de 2 segundos
    setTimeout(() => {
        mensajeElemento.remove();
    }, 2000);
}
function actualizarContadorCarrito() {
    contadorCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const contadorElemento = document.getElementById("contador-carrito");
    if (contadorElemento) {
        contadorElemento.textContent = contadorCarrito;
    }
}

// Función para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

// Función para renderizar el carrito en la página del carrito
function renderizarCarrito() {
    const itemsCarrito = document.getElementById("items-carrito");
    if (!itemsCarrito) return; // Si no existe, salir

    itemsCarrito.innerHTML = "";
    let totalPedido = 0;

    carrito.forEach(producto => {
        const itemHTML = `
            <div class="item-carrito">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="item-info">
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio} x ${producto.cantidad}</p>
                </div>
                <div class="contador-cantidad">
                    <button onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                    <input type="text" value="${producto.cantidad}" disabled>
                    <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                </div>
                <button class="eliminar-item" onclick="eliminarDelCarrito(${producto.id})">🗑️</button>
            </div>
        `;
        itemsCarrito.innerHTML += itemHTML;
        totalPedido += producto.precio * producto.cantidad;
    });

    const totalElemento = document.getElementById("total-pedido");
    if (totalElemento) {
        totalElemento.textContent = totalPedido.toFixed(2);
    }
}

// Función para cambiar la cantidad de un producto en el carrito
function cambiarCantidad(id, delta) {
    const productoEnCarrito = carrito.find(p => p.id === id);
    productoEnCarrito.cantidad += delta;

    if (productoEnCarrito.cantidad <= 0) {
        eliminarDelCarrito(id);
    } else {
        guardarCarritoEnLocalStorage();
        renderizarCarrito();
        actualizarContadorCarrito();
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarritoEnLocalStorage();
    renderizarCarrito();
    actualizarContadorCarrito();
}

// Función para enviar el pedido por WhatsApp
function enviarPedidoPorWhatsapp() {
    const mensaje = carrito.map(p => `${p.nombre} - ${p.cantidad} x $${p.precio}`).join("%0A");
    const total = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    const url = `https://wa.me/+5354066204,text=Hola,%20quiero%20hacer%20el%20siguiente%20pedido:%0A${mensaje}%0ATotal:%20$${total.toFixed(2)}`;
    window.open(url, '_blank');
}

// Función para redirigir a la página principal
function redirigirAPaginaPrincipal() {
    window.location.href = "index.html";
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    cargarCarritoDesdeLocalStorage();
    renderizarProductos();

    const filtros = document.querySelectorAll(".filtro-btn");
    filtros.forEach(filtro => {
        filtro.addEventListener("click", () => {
            filtros.forEach(f => f.classList.remove("active"));
            filtro.classList.add("active");
            renderizarProductos(filtro.dataset.categoria);
        });
    });

    const pedirWhatsappBtn = document.getElementById("pedir-whatsapp");
    if (pedirWhatsappBtn) {
        pedirWhatsappBtn.addEventListener("click", enviarPedidoPorWhatsapp);
    }

    const seguirComprandoBtn = document.getElementById("seguir-comprando");
    if (seguirComprandoBtn) {
        seguirComprandoBtn.addEventListener("click", redirigirAPaginaPrincipal);
    }

    renderizarCarrito();
});