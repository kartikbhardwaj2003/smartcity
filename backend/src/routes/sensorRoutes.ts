import { Router } from "express";
import { createSensor, getSensors } from "../controllers/sensorControllers";

const router = Router();

router.post("/", createSensor);
router.get("/", getSensors);

export default router;
