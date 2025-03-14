import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import initializeSocket from "./config/socket.config.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.io
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
