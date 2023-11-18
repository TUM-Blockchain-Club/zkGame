import * as WebSocket from 'ws';

const port = process.env.PORT ?? 8080;
const server = new WebSocket.Server({ port: port as number });

console.log(`Signaling server running on port ${port}`);

interface IClient {
  ws: WebSocket;
  id: string;
}

const clients: IClient[] = [];

server.on('connection', (ws: WebSocket) => {
  const id = `client_${Math.random().toString(36).substr(2, 9)}`;
  const client: IClient = { ws, id };
  clients.push(client);

  console.log(`Client connected: ${id}`);

  ws.on('message', (message: string) => {
    console.log(`Received message from ${id}: ${message}`);
    // Broadcast message to other clients
    clients.forEach(client => {
      if (client.id !== id) {
        client.ws.send(`${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${id}`);
    // Remove client from list
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
        clients.splice(index, 1);
    }
  });
});
