const express = require('express');
const Twilio = require('twilio');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();

// Configuración de Twilio
const accountSid = 'tu_account_sid';  // Obtén esto de Twilio
const authToken = 'tu_auth_token';  // Obtén esto de Twilio
const client = new Twilio(accountSid, authToken);

// Middleware para parsear JSON
app.use(express.json());

// Función para leer el CSV y obtener el WhatsApp del vendedor
function obtenerVendedor(codigoVendedor) {
    return new Promise((resolve, reject) => {
        const vendedores = [];
        fs.createReadStream('vendedores.csv')  // Archivo CSV con los vendedores
            .pipe(csvParser())
            .on('data', (row) => {
                vendedores.push({ codigo: row.codigo, whatsapp: row.whatsapp });
            })
            .on('end', () => {
                const vendedor = vendedores.find(v => v.codigo === codigoVendedor);
                if (vendedor) {
                    resolve(vendedor);
                } else {
                    reject('Vendedor no encontrado');
                }
            });
    });
}

// Ruta para procesar el pedido y enviar el mensaje
app.post('/procesar-pedido', async (req, res) => {
    const { codigoVendedor, cliente } = req.body;
    try {
        const vendedor = await obtenerVendedor(codigoVendedor);
        const mensaje = `¡Hola! Se ha registrado un posible cliente recomendado: ${cliente}.`;
        enviarWhatsApp(vendedor.whatsapp, mensaje);
        res.send("Pedido procesado y mensaje enviado.");
    } catch (error) {
        res.status(404).send(error);
    }
});

// Función para enviar el mensaje por WhatsApp usando Twilio
function enviarWhatsApp(numero, mensaje) {
    client.messages.create({
        body: mensaje,
        from: 'whatsapp:+1415XXXXXXX',  // Número de WhatsApp de Twilio (cámbialo por el tuyo)
        to: `whatsapp:${numero}`  // Número de WhatsApp del vendedor
    })
    .then(message => console.log("Mensaje enviado:", message.sid))
    .catch(error => console.error("Error al enviar el mensaje:", error));
}

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});

