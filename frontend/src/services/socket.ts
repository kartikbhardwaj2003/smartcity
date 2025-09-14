// frontend/src/services/socket.ts
import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const socket: Socket = io(URL, { autoConnect: true });

export default socket;
