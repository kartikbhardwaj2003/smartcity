import { Server as IOServer } from "socket.io";
import http from "http";

let io: IOServer | null = null;

export function initSocket(server: http.Server) {
  io = new IOServer(server, { cors: { origin: "*" } });
  io.on("connection", (s) => {
    console.log("Socket connected:", s.id);
  });
  return io;
}

export function getIO(): IOServer {
  if (!io) throw new Error("Socket.IO not initialized. Call initSocket(server) first.");
  return io;
}
