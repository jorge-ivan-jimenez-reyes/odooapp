// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Crear una aplicación Express
const app = express();

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
    
    // Enviar el mensaje a todos los clientes conectados (broadcast)
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });

  // Escuchar cuando el cliente se desconecta
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Rutas Express normales (por ejemplo, para servir una API)
app.get('/', (req, res) => {
  res.send('Hola, este es un servidor Express con WebSockets.');
});

// Iniciar el servidor en el puerto 8080
server.listen(8080, () => {
  console.log('Servidor escuchando en http://localhost:8080');
});