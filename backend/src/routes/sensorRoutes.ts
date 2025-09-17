// backend/src/routes/sensorRoutes.ts
import { Router } from "express";
import {
  createSensor,
  getSensors,
  updateSensor,
  deleteSensor,
  createReading,
  getSensorReadings,
} from "../controllers/sensorControllers";

const router = Router();

// Core sensor CRUD
router.post("/", createSensor);
router.get("/", getSensors);
router.put("/:id", updateSensor);
router.delete("/:id", deleteSensor);

// Readings
router.post("/:id/readings", createReading);
router.get("/:id/readings", getSensorReadings);

export default router;
