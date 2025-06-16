const { WebSocketServer } = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket.');
    ws.on('error', console.error);

    ws.on('message', (msg) => {
      console.log('Message from client:', msg.toString());
      
      try {
        const commentsObject = JSON.parse(msg.toString());
        console.log('Parsed message:', commentsObject);

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(commentsObject));
          }
        });

      } catch (err) {
        console.error('Invalid message format:', err);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
}

module.exports = setupWebSocket;
