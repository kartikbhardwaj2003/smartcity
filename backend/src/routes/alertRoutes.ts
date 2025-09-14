import { Router } from "express";
import { createAlert, getAlerts, resolveAlert } from "../controllers/alertControllers";

const router = Router();

router.post("/", createAlert);
router.get("/", getAlerts);
router.put("/:id/resolve", resolveAlert);

export default router;
