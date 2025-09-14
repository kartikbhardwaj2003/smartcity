import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createAction = async (req: Request, res: Response) => {
  try {
    const { sensorId, description } = req.body;
    const user = (req as any).user;
    if (!user || !user.id) return res.status(401).json({ error: "Unauthorized" });

    const action = await prisma.action.create({
      data: { sensorId, description, createdById: user.id }
    });
    res.status(201).json(action);
  } catch (err) {
    console.error("Create action error:", err);
    res.status(500).json({ error: "Failed to create action" });
  }
};

export const listActions = async (_req: Request, res: Response) => {
  try {
    const actions = await prisma.action.findMany({ orderBy: { createdAt: "desc" } });
    res.json(actions);
  } catch (err) {
    console.error("List actions error:", err);
    res.status(500).json({ error: "Failed to list actions" });
  }
};
