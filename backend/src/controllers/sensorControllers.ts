// backend/src/controllers/sensorControllers.ts
import { Request, Response } from "express";
import prisma from "../prismaClient";

/**
 * Create a sensor
 * Expected body: { name, type, location?, metadata? }
 * location can be string or { lat, lng }
 */
export const createSensor = async (req: Request, res: Response) => {
  try {
    const { name, type, location, metadata } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: "name and type are required" });
    }

    const sensor = await prisma.sensor.create({
      data: {
        name,
        type,
        location: location ?? null,
        metadata: metadata ?? null,
      },
    });

    return res.status(201).json(sensor);
  } catch (err: any) {
    console.error("❌ createSensor error:", err);
    return res.status(500).json({ error: "Failed to create sensor", details: err.message });
  }
};

/**
 * Get all sensors with 1 latest reading each
 */
export const getSensors = async (_req: Request, res: Response) => {
  try {
    const sensors = await prisma.sensor.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        readings: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });
    return res.json(sensors);
  } catch (err: any) {
    console.error("❌ getSensors error:", err);
    return res.status(500).json({ error: "Failed to fetch sensors", details: err.message });
  }
};

/**
 * Update sensor (name/type/location/metadata)
 */
export const updateSensor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, location, metadata } = req.body;

    const updated = await prisma.sensor.update({
      where: { id },
      data: {
        name,
        type,
        location: location ?? undefined,
        metadata: metadata ?? undefined,
      },
    });

    return res.json(updated);
  } catch (err: any) {
    console.error("❌ updateSensor error:", err);
    return res.status(500).json({ error: "Failed to update sensor", details: err.message });
  }
};

/**
 * Delete sensor (delete readings + alerts first to avoid FK issues)
 */
export const deleteSensor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Remove dependent rows first (readings + alerts)
    await prisma.sensorReading.deleteMany({ where: { sensorId: id } });
    await prisma.alert.deleteMany({ where: { sensorId: id } });

    const deleted = await prisma.sensor.delete({ where: { id } });
    return res.json({ message: "Sensor deleted", sensor: deleted });
  } catch (err: any) {
    console.error("❌ deleteSensor error:", err);
    return res.status(500).json({ error: "Failed to delete sensor", details: err.message });
  }
};

/**
 * Create a sensor reading (ingest)
 * POST /api/sensors/:id/readings
 * body: { value, rawPayload?, timestamp? }
 */
export const createReading = async (req: Request, res: Response) => {
  try {
    const { id: sensorId } = req.params;
    const { value, rawPayload, timestamp } = req.body;

    // Ensure sensor exists
    const sensor = await prisma.sensor.findUnique({ where: { id: sensorId } });
    if (!sensor) return res.status(404).json({ error: "Sensor not found" });

    const reading = await prisma.sensorReading.create({
      data: {
        sensorId,
        value: typeof value === "number" ? value : Number(value || 0),
        rawPayload: rawPayload ?? null,
        timestamp: timestamp ? new Date(timestamp) : undefined,
      },
    });

    // OPTIONAL: threshold-based alert logic (simple)
    try {
      if (sensor.metadata && sensor.metadata.threshold) {
        const threshold = Number(sensor.metadata.threshold);
        if (!isNaN(threshold) && typeof reading.value === "number" && reading.value > threshold) {
          await prisma.alert.create({
            data: {
              sensorId,
              level: "CRITICAL",
              message: `${sensor.name} exceeded threshold (${reading.value} > ${threshold})`,
              metadata: { value: reading.value, threshold },
            },
          });
        }
      }
    } catch (e) {
      console.warn("Alert creation failed (non-fatal):", e);
    }

    return res.status(201).json(reading);
  } catch (err: any) {
    console.error("❌ createReading error:", err);
    return res.status(500).json({ error: "Failed to create reading", details: err.message });
  }
};

/**
 * Get readings for a sensor
 * GET /api/sensors/:id/readings?from=...&to=...&limit=...
 */
export const getSensorReadings = async (req: Request, res: Response) => {
  try {
    const { id: sensorId } = req.params;
    const { from, to, limit } = req.query;

    const where: any = { sensorId };

    if (from || to) where.timestamp = {};
    if (from) where.timestamp.gte = new Date(String(from));
    if (to) where.timestamp.lte = new Date(String(to));

    const readings = await prisma.sensorReading.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit ? Number(limit) : 200,
    });

    return res.json(readings);
  } catch (err: any) {
    console.error("❌ getSensorReadings error:", err);
    return res.status(500).json({ error: "Failed to fetch readings", details: err.message });
  }
};
