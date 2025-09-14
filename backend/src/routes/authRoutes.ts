import { Router } from "express";
import * as authController from "../controllers/authControllers";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// ✅ all functions are referenced correctly
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);

export default router;
