from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import shutil
import os

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load TorchScript model (CLASSIFICATION)
model = YOLO("best.torchscript", task="classify")

custom_labels = {
    "O": "Organic Waste",
    "R": "Recyclable Waste "
}

@app.get("/")
def home():
    return {"message": "YOLO Waste Classification API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Save uploaded image temporarily
    img_path = f"temp_{file.filename}"
    with open(img_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run YOLO prediction
    results = model(img_path)[0]

    predicted_index = results.probs.top1
    predicted_label = results.names[predicted_index]
    final_label = custom_labels[predicted_label]
    confidence = float(results.probs.top1conf)

    # Delete temporary image
    os.remove(img_path)

    return {
        "label": final_label,
        "confidence": round(confidence, 3)
    }
