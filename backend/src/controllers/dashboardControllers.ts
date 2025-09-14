import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getSummary = async (_req: Request, res: Response) => {
  try {
    const sensorsCount = await prisma.sensor.count();
    const alertsCount = await prisma.alert.count();
    const actionsCount = await prisma.action.count();

    // latest reading overall (optional)
    const latestReading = await prisma.sensorReading.findFirst({
      orderBy: { createdAt: "desc" }
    });

    res.json({ sensorsCount, alertsCount, actionsCount, latestReading });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

export const getLatestPerSensor = async (_req: Request, res: Response) => {
  try {
    const sensors = await prisma.sensor.findMany();
    const promises = sensors.map(async (s) => {
      const latest = await prisma.sensorReading.findFirst({
        where: { sensorId: s.id },
        orderBy: { createdAt: "desc" }
      });
      return { sensor: s, latest };
    });
    const rows = await Promise.all(promises);
    res.json(rows);
  } catch (err) {
    console.error("Dashboard latest per sensor error:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getRecentAlerts = async (_req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
      take: 50
    });
    res.json(alerts);
  } catch (err) {
    console.error("Dashboard recent alerts error:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};
