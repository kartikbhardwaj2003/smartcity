from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI(title="Smart City ML Service")

# ====== Request Schemas ======
class Reading(BaseModel):
    sensorId: str
    value: float

class AnomalyRequest(BaseModel):
    readings: List[Reading]

# ====== Routes ======

@app.get("/")
def root():
    return {"message": "ML Service running 🚀"}

@app.post("/detect-anomalies")
def detect_anomalies(req: AnomalyRequest):
    if not req.readings:
        raise HTTPException(status_code=400, detail="No readings provided")

    values = np.array([r.value for r in req.readings])

    mean = values.mean()
    std = values.std()

    anomalies = []
    for r in req.readings:
        if abs(r.value - mean) > 2 * std:   # z-score rule
            anomalies.append({"sensorId": r.sensorId, "value": r.value})

    return {
        "mean": mean,
        "std": std,
        "total_readings": len(values),
        "anomalies": anomalies,
    }
