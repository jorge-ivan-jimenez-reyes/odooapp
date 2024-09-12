const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Inicializar Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Crear una aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configurar el servidor HTTP
const server = http.createServer(app);

// Configurar el servidor WebSocket
const wss = new WebSocket.Server({ server });

// Configurar WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Escuchar mensajes del cliente
  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);
    
    // Enviar un mensaje de vuelta al cliente
    ws.send('Mensaje recibido por el servidor');
    
    // Broadcast a todos los clientes conectados
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });

    // Lógica para enviar notificación push a través de Firebase
    const pushToken = JSON.parse(message).token; // Debes enviar el token del cliente en el mensaje
    const notificationMessage = {
      notification: {
        title: 'Notificación desde WebSocket',
        body: `Mensaje: ${message}`,
      },
      token: pushToken,
    };

    admin.messaging().send(notificationMessage)
      .then(response => {
        console.log('Notificación enviada:', response);
      })
      .catch(error => {
        console.error('Error enviando notificación:', error);
      });
  });

  // Escuchar cuando el cliente se desconecta
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Ruta para registrar tokens de clientes
app.post('/register', (req, res) => {
  const { token } = req.body;
  console.log('Token registrado:', token);

  // Almacenar el token en tu base de datos o sistema
  res.send('Token registrado');
});

// Ruta Express normal
app.get('/', (req, res) => {
  res.send('Servidor Express con WebSockets y Firebase Cloud Messaging.');
});

// Iniciar el servidor en el puerto 8080
server.listen(8080, () => {
  console.log('Servidor escuchando en http://localhost:8080');
});