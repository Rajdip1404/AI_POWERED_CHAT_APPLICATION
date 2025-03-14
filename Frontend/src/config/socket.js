import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  if (socketInstance) return socketInstance; // Ensure only ONE instance

  socketInstance = io(import.meta.env.VITE_API_BASE_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
    transports: ["websocket"], // Ensures connection stability
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  });

  socketInstance.on("connect", () => {
    console.log("✅ Connected to socket server");
  });

  socketInstance.on("disconnect", () => {
    console.log("❌ Disconnected from socket server");
  });

  socketInstance.on("connect_error", (err) => {
    console.error("⚠️ Socket connection error:", err);
  });

  return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  if (!socketInstance) return;

  // Remove previous listener to prevent duplicate event handlers
  socketInstance.off(eventName);

  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  if (!socketInstance) return;
  socketInstance.emit(eventName, data);
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.off(); // Remove all event listeners
    socketInstance.disconnect(); // Disconnect socket
    socketInstance = null; // Reset instance
  }
};
