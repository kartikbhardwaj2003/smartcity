import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import authRouter from "./routes/authRoutes";
import sensorRouter from "./routes/sensorRoutes";
import alertRouter from "./routes/alertRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/sensors", sensorRouter);
app.use("/api/alerts", alertRouter);

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Setup HTTP + Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
