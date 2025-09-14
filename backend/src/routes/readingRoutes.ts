import { Router } from "express";
import { createReading, getReadings } from "../controllers/readingControllers";

const router = Router();

// POST new reading for sensor
router.post("/:id/readings", createReading);

// GET all readings for sensor
router.get("/:id/readings", getReadings);

export default router;
