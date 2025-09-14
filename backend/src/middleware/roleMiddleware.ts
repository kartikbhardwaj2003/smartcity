// src/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const authorize =
  (requiredRole: "ADMIN" | "USER") =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden — admin only" });
    }

    // if requiredRole === "USER", any logged-in user allowed
    next();
  };
