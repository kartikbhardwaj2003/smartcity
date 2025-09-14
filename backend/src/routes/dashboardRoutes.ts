import { Router } from "express";
import { getSummary, getLatestPerSensor, getRecentAlerts } from "../controllers/dashboardControllers";
import { authenticate } from "../middleware/authMiddleware";
const router = Router();

router.get("/summary", authenticate, getSummary);
router.get("/sensors/latest", authenticate, getLatestPerSensor);
router.get("/alerts/recent", authenticate, getRecentAlerts);

export default router;
