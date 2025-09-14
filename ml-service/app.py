from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class PredictRequest(BaseModel):
    sensor_id: str
    value: float

@app.post("/predict")
def predict(req: PredictRequest):
    # Dummy anomaly logic (replace with real model later)
    anomaly = req.value > 80
    return {
        "anomaly": anomaly,
        "confidence": round(random.uniform(0.7, 0.99), 2)
    }
