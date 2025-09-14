import { Request, Response } from "express";
import prisma from "../prismaClient";

// Create a reading for a sensor
export const createReading = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // sensorId
    const { value, rawPayload } = req.body;

    if (!value && !rawPayload) {
      return res.status(400).json({ error: "Either value or rawPayload is required" });
    }

    // Ensure sensor exists
    const sensor = await prisma.sensor.findUnique({ where: { id } });
    if (!sensor) {
      return res.status(404).json({ error: "Sensor not found" });
    }

    const reading = await prisma.sensorReading.create({
      data: {
        sensorId: id,
        value,
        rawPayload,
      },
    });

    res.status(201).json(reading);
  } catch (error: any) {
    console.error("❌ Create Reading Error:", error);
    res.status(500).json({ error: "Failed to create reading", details: error.message });
  }
};

// Get readings for a sensor
export const getReadings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const readings = await prisma.sensorReading.findMany({
      where: { sensorId: id },
      orderBy: { timestamp: "desc" },
    });

    res.json(readings);
  } catch (error: any) {
    console.error("❌ Get Readings Error:", error);
    res.status(500).json({ error: "Failed to fetch readings", details: error.message });
  }
};
