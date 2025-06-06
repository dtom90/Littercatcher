import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/datasets")
async def get_datasets() -> dict[str, list[dict[str, str | int]]]:
    datasets_dir = os.path.join(os.path.dirname(__file__), "..", "datasets")
    if not os.path.exists(datasets_dir):
        return {"datasets": []}
        
    dataset_names = [name for name in os.listdir(datasets_dir) 
                    if os.path.isdir(os.path.join(datasets_dir, name))]
    
    datasets = [{"id": idx, "name": name} for idx, name in enumerate(dataset_names)]
    return {"datasets": datasets}
