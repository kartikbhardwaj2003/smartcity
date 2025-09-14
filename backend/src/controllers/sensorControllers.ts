import { Request, Response } from "express";
import prisma from "../prismaClient";

// Create Sensor
export const createSensor = async (req: Request, res: Response) => {
  try {
    const { name, type, location, metadata } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    const sensor = await prisma.sensor.create({
      data: {
        name,
        type,
        location: location ? JSON.stringify(location) : null, // ✅ store as JSON
        metadata: metadata ? JSON.stringify(metadata) : null, // ✅ store as JSON
      },
    });

    res.status(201).json(sensor);
  } catch (error: any) {
    console.error("❌ Create Sensor Error:", error);
    res.status(500).json({ error: "Failed to create sensor", details: error.message });
  }
};

// Get all sensors
export const getSensors = async (_req: Request, res: Response) => {
  try {
    const sensors = await prisma.sensor.findMany();
    res.json(sensors);
  } catch (error: any) {
    console.error("❌ Get Sensors Error:", error);
    res.status(500).json({ error: "Failed to fetch sensors", details: error.message });
  }
};
