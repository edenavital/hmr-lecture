import { WebSocketServer, WebSocket } from 'ws'

export class WebsocketWrapper {
  wss;

  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.listenForConnection();
  }

  listenForConnection() {
    this.wss.on('connection', () => {
      console.log("Client connected")

      this.wss.on('close', () => {
        console.log('Client disconnected');
      });

      this.wss.setMaxListeners(0)
    });
  }

  // Function to broadcast a message to all connected clients
  broadcast(data) {
    const jsonData = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonData);
      }
    });
  };
}