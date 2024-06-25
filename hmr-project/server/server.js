import http from 'http'
import { PORT } from './consts.js'
import { app } from './app.js';
import { WebsocketWrapper, FileWatchWrapper } from './services/index.js'
// Create an HTTP server
const server = http.createServer(app);

// Initialize websocket
const wss = new WebsocketWrapper(server);

// File watcher
const watcher = new FileWatchWrapper(wss);
watcher.trackClientChanges();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
});