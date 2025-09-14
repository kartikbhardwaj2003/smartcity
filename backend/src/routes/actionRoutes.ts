import { Router } from "express";
import { createAction, listActions } from "../controllers/actionControllers";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
router.post("/", authenticate, createAction);
router.get("/", authenticate, listActions);
export default router;
