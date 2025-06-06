import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, List, Optional, Literal
from pydantic import BaseModel

class SplitCounts(BaseModel):
    train: int
    valid: int
    test: int

class DatasetResponse(BaseModel):
    id: int
    name: str
    description: str
    imageCount: int
    splitCounts: SplitCounts

class DatasetListItem(BaseModel):
    id: int
    name: str

class DatasetsResponse(BaseModel):
    datasets: List[DatasetListItem]

class ImageItem(BaseModel):
    filename: str
    path: str

class ImagesResponse(BaseModel):
    images: List[ImageItem]
    total: int
    page: int
    page_size: int
    has_more: bool

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

@app.get("/datasets", response_model=DatasetsResponse)
async def get_datasets():
    datasets_dir = os.path.join(os.path.dirname(__file__), "..", "datasets")
    if not os.path.exists(datasets_dir):
        return {"datasets": []}
        
    dataset_names = [name for name in os.listdir(datasets_dir) 
                    if os.path.isdir(os.path.join(datasets_dir, name))]
    
    datasets = [{"id": idx, "name": name} for idx, name in enumerate(dataset_names)]
    return {"datasets": datasets}

@app.get("/datasets/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(dataset_id: int):
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
    
    # Try to read README files for description
    readme_files = ["README.dataset.txt", "README.roboflow.txt"]
    for readme_file in readme_files:
        readme_path = os.path.join(dataset_path, readme_file)
        if os.path.exists(readme_path):
            with open(readme_path, 'r') as f:
                description = f.read()
                break
    
    # Count images in train, valid, and test directories
    split_counts = {'train': 0, 'valid': 0, 'test': 0}
    for split in ['train', 'valid', 'test']:
        split_path = os.path.join(dataset_path, split)
        if os.path.exists(split_path):
            count = len([f for f in os.listdir(split_path) 
                        if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
            split_counts[split] = count
            image_count += count
    
    return {
        "id": dataset_id,
        "name": dataset_name,
        "description": description,
        "imageCount": image_count,
        "splitCounts": split_counts,
    }

@app.get("/datasets/{dataset_id}/images", response_model=ImagesResponse)
async def get_dataset_images(
    dataset_id: int,
    split: Literal["train", "valid", "test"] = Query(..., description="Dataset split to get images from"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of images per page")
):
    datasets_dir = os.path.join(os.path.dirname(__file__), "..", "datasets")
    if not os.path.exists(datasets_dir):
        raise HTTPException(status_code=404, detail="Datasets directory not found")
    
    dataset_names = [name for name in os.listdir(datasets_dir) 
                    if os.path.isdir(os.path.join(datasets_dir, name))]
    
    if dataset_id < 0 or dataset_id >= len(dataset_names):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    dataset_name = dataset_names[dataset_id]
    split_path = os.path.join(datasets_dir, dataset_name, split)
    
    if not os.path.exists(split_path):
        raise HTTPException(status_code=404, detail=f"Split '{split}' not found in dataset")
    
    # Get all image files
    image_files = [f for f in os.listdir(split_path) 
                  if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    # Calculate pagination
    total_images = len(image_files)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    # Get paginated images
    paginated_images = image_files[start_idx:end_idx]
    
    # Create response
    images = [
        ImageItem(
            filename=filename,
            path=f"/datasets/{dataset_name}/{split}/{filename}"
        )
        for filename in paginated_images
    ]
    
    return ImagesResponse(
        images=images,
        total=total_images,
        page=page,
        page_size=page_size,
        has_more=end_idx < total_images
    )

