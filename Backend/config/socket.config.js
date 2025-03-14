import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Project from "../models/project.model.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      const projectId = socket.handshake.query?.projectId;
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error("Invalid Project ID"));
      }

      socket.project = await Project.findById(projectId);

      if (!token) {
        return next(new Error("Unauthorized - No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return next(new Error("Unauthorized - Invalid token"));
      }

      socket.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  });

  // Handle socket connection
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.user);

    socket.join(socket.project._id.toString()); // Join project room

    socket.on("project-message", (data) => {
      console.log("📩 Project Message:", data);
      socket.broadcast
        .to(socket.project._id.toString())
        .emit("project-message", data);
    });

    socket.on("sendMessage", (data) => {
      console.log("📩 Message received:", data);
      io.to(socket.project._id.toString()).emit("message", {
        user: socket.user.name,
        text: data.text,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected");
    });
  });

  return io;
};

export default initializeSocket;
