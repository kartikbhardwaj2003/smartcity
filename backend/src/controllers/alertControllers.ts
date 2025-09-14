import { Request, Response } from "express";
import prisma from "../prismaClient";

// Create an alert
export const createAlert = async (req: Request, res: Response) => {
  try {
    const { sensorId, level, message, metadata } = req.body;

    if (!level || !message) {
      return res.status(400).json({ error: "Level and message are required" });
    }

    // ✅ ensure sensor exists before linking alert
    if (sensorId) {
      const sensor = await prisma.sensor.findUnique({ where: { id: sensorId } });
      if (!sensor) {
        return res.status(400).json({ error: "Invalid sensorId, sensor not found" });
      }
    }

    const alert = await prisma.alert.create({
      data: {
        sensorId,
        level,
        message,
        metadata,
      },
    });

    res.status(201).json(alert);
  } catch (error: any) {
    console.error("❌ Create Alert Error:", error);
    res.status(500).json({ error: "Failed to create alert", details: error.message });
  }
};

// Get all alerts
export const getAlerts = async (_req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
      include: { sensor: true }, // include sensor details
    });

    res.json(alerts);
  } catch (error: any) {
    console.error("❌ Get Alerts Error:", error);
    res.status(500).json({ error: "Failed to fetch alerts", details: error.message });
  }
};

// Resolve alert
export const resolveAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { resolvedBy } = req.body;

    // ✅ check alert exists
    const existing = await prisma.alert.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Alert not found" });
    }

    const alert = await prisma.alert.update({
      where: { id },
      data: {
        resolvedAt: new Date(),
        resolvedBy: resolvedBy || "System",
      },
    });

    res.json({ message: "Alert resolved", alert });
  } catch (error: any) {
    console.error("❌ Resolve Alert Error:", error);
    res.status(500).json({ error: "Failed to resolve alert", details: error.message });
  }
};
