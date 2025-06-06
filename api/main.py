import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/datasets")
async def get_datasets() -> dict[str, list[dict[str, str | int]]]:
    datasets_dir = os.path.join(os.path.dirname(__file__), "..", "datasets")
    if not os.path.exists(datasets_dir):
        return {"datasets": []}
        
    dataset_names = [name for name in os.listdir(datasets_dir) 
                    if os.path.isdir(os.path.join(datasets_dir, name))]
    
    datasets = [{"id": idx, "name": name} for idx, name in enumerate(dataset_names)]
    return {"datasets": datasets}

@app.get("/datasets/{dataset_id}")
async def get_dataset(dataset_id: int) -> dict[str, str | int]:
    datasets_dir = os.path.join(os.path.dirname(__file__), "..", "datasets")
    if not os.path.exists(datasets_dir):
        raise HTTPException(status_code=404, detail="Datasets directory not found")
    
    dataset_names = [name for name in os.listdir(datasets_dir) 
                    if os.path.isdir(os.path.join(datasets_dir, name))]
    
    if dataset_id < 0 or dataset_id >= len(dataset_names):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    dataset_name = dataset_names[dataset_id]
    dataset_path = os.path.join(datasets_dir, dataset_name)
    
    # Get dataset metadata
    description = ""
    image_count = 0
    created_at = None
    updated_at = None
    
    # Try to read README files for description
    readme_files = ["README.dataset.txt", "README.roboflow.txt"]
    for readme_file in readme_files:
        readme_path = os.path.join(dataset_path, readme_file)
        if os.path.exists(readme_path):
            with open(readme_path, 'r') as f:
                description = f.read()
                break
    
    # Count images in train, valid, and test directories
    for split in ['train', 'valid', 'test']:
        split_path = os.path.join(dataset_path, split)
        if os.path.exists(split_path):
            image_count += len([f for f in os.listdir(split_path) 
                              if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
    
    # Get creation and update times
    if os.path.exists(dataset_path):
        created_at = datetime.fromtimestamp(os.path.getctime(dataset_path)).isoformat()
        updated_at = datetime.fromtimestamp(os.path.getmtime(dataset_path)).isoformat()
    
    return {
        "id": dataset_id,
        "name": dataset_name,
        "description": description,
        "imageCount": image_count,
        "createdAt": created_at,
        "updatedAt": updated_at
    }
