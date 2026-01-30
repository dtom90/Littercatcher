from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
import os
from datetime import datetime

app = FastAPI(
    title="Slobcatcher API",
    description="API for the Slobcatcher application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Slobcatcher API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/models")
async def get_models():
    # Get all models in the models directory
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    models_files = [m for m in os.listdir(models_dir) if m.endswith('.pt')]
    models = [{"id": i, "name": m} for i, m in enumerate(models_files)]
    return {"models": models} 

@app.get("/api/models/{model_id}")
async def get_model(model_id: int):
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    models_files = [m for m in os.listdir(models_dir) if m.endswith('.pt')]
    model_path = os.path.join(models_dir, models_files[model_id])
    created_at = datetime.fromtimestamp(os.path.getmtime(model_path))
    return {
      "id": model_id,
      "name": models_files[model_id],
      "path": model_path,
      "created_at": created_at.isoformat(),
    }

@app.post("/detect")
async def detect(model_id: str, image: UploadFile = File(...)):
    return {"model": model_id}
