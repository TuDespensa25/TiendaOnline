document.addEventListener("DOMContentLoaded", function () {
  const contadorCarrito = document.getElementById('contador-carrito');
  const contadorCarritoFlotante = document.getElementById('contador-carrito-flotante');

  function actualizarContadorCarrito() {
      const cantidad = parseInt(contadorCarrito.textContent) || 0;
      contadorCarritoFlotante.textContent = cantidad;
  }

  // Llama a la función al cargar la página y cada vez que el contador principal cambie
  actualizarContadorCarrito();

  // Observa los cambios en el contador principal y actualiza el flotante
  const observer = new MutationObserver(actualizarContadorCarrito);
  observer.observe(contadorCarrito, { childList: true, subtree: true });
});
  // En script.js o app.js
document.querySelectorAll('.btn-add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
      const combo = {
          nombre: button.parentElement.querySelector('h3').innerText,
          precio: button.parentElement.querySelector('.precio').innerText,
          imagen: button.parentElement.querySelector('img').src
      };
      agregarAlCarrito(combo); // Usa tu función existente
  });
});
// Función para inicializar el contador
function startTimer(id, endTime) {
  const timer = document.getElementById(id);
  if (!timer) {
      console.error(`Elemento con ID ${id} no encontrado.`);
      return;
  }

  const daysSpan = timer.querySelector('.days');
  const hoursSpan = timer.querySelector('.hours');
  const minutesSpan = timer.querySelector('.minutes');
  const secondsSpan = timer.querySelector('.seconds');

  function updateTimer() {
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
          clearInterval(interval);
          timer.innerHTML = "¡Oferta expirada!";
          return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      daysSpan.textContent = String(days).padStart(2, '0');
      hoursSpan.textContent = String(hours).padStart(2, '0');
      minutesSpan.textContent = String(minutes).padStart(2, '0');
      secondsSpan.textContent = String(seconds).padStart(2, '0');
  }

  const interval = setInterval(updateTimer, 1000);
  updateTimer(); // Ejecutar inmediatamente
}

// Iniciar los relojes cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date().getTime(); // Fecha y hora actual

  // Combo Verano: 2 días a partir de ahora
  const endTime1 = now + (2 * 24 * 60 * 60 * 1000); // 2 días en milisegundos

  // Combo Invierno: Fecha futura (por ejemplo, 15 de noviembre de 2024)
  const endTime2 = new Date("2024-11-15T23:59:59").getTime();

  // Combo Primavera: Fecha futura (por ejemplo, 20 de octubre de 2024)
  const endTime3 = new Date("2024-10-20T23:59:59").getTime();

  // Iniciar los contadores
  startTimer("timer1", endTime1);
  startTimer("timer2", endTime2);
  startTimer("timer3", endTime3);
});
// Función para agregar un producto al carrito
function agregarAlCarrito(nombre, precio) {
  // Obtener el carrito actual desde localStorage
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Crear un objeto para el producto
  const producto = {
      nombre: nombre,
      precio: precio,
      cantidad: 1, // Cantidad inicial
  };

  // Verificar si el producto ya está en el carrito
  const productoExistente = carrito.find((item) => item.nombre === nombre);

  if (productoExistente) {
      // Si ya existe, incrementar la cantidad
      productoExistente.cantidad += 1;
  } else {
      // Si no existe, agregarlo al carrito
      carrito.push(producto);
  }

  // Guardar el carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Actualizar el contador del carrito
  actualizarContadorCarrito();
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contador = document.getElementById('contador-carrito');
  contador.textContent = carrito.length;
}

// Asignar evento de clic a los botones "Añadir al carrito"
document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.btn-add-to-cart');
  botones.forEach((boton) => {
      boton.addEventListener('click', () => {
          const nombre = boton.getAttribute('data-nombre');
          const precio = boton.getAttribute('data-precio');
          agregarAlCarrito(nombre, precio);
      });
  });

  // Actualizar el contador del carrito al cargar la página
  actualizarContadorCarrito();
});
// Cargar los vendedores desde el archivo CSV
const vendedores = fs.readFileSync('vendedores.csv', 'utf8')
    .split('\n')
    .map(line => {
        const [codigo, whatsapp] = line.split(',');
        return { codigo, whatsapp };
    });

// Ruta para procesar el pedido
app.post('/procesar-pedido', (req, res) => {
    const { codigoVendedor, cliente } = req.body;

    const vendedor = vendedores.find(v => v.codigo === codigoVendedor);

    if (vendedor) {
        // Enviar el mensaje predeterminado al WhatsApp del vendedor
        const mensaje = `¡Hola! Se ha registrado un posible cliente recomendado: ${cliente}.`;
        enviarWhatsApp(vendedor.whatsapp, mensaje);
        res.send("Pedido procesado y mensaje enviado.");
    } else {
        res.status(404).send("Código de vendedor no encontrado.");
    }
});


function enviarWhatsApp(numero, mensaje) {
    client.messages.create({
        body: mensaje,
        from: 'whatsapp:+5354066204',  // Número de WhatsApp de Twilio
        to: `whatsapp:${numero}`  // Número de WhatsApp del vendedor
    })
    .then(message => console.log("Mensaje enviado:", message.sid))
    .catch(error => console.error("Error al enviar el mensaje:", error));
}

