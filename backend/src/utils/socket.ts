// backend/src/utils/socket.ts
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initSocket(server: any) {
  if (!io) {
    io = new SocketIOServer(server, {
      cors: { origin: "*" }
    });
  }
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}
