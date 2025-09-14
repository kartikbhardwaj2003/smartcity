import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes";
import sensorRoutes from "./routes/sensorRoutes";
import alertRoutes from "./routes/alertRoutes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;
