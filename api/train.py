import os
import mmcv
from mmcv import Config
from mmdet.apis import set_random_seed, train_detector
from mmdet.models import build_detector
from mmdet.datasets import build_dataset
from mmdet.utils import get_device
from .config import get_config

def train_model(dataset_name: str):
    # Set random seed for reproducibility
    set_random_seed(0, deterministic=False)
    
    # Path to the dataset
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'datasets', dataset_name)
    print('dataset_path', dataset_path)
    
    # Get configuration
    cfg = Config(get_config(dataset_path))
    
    # Update config with training settings
    cfg.work_dir = 'work_dirs'
    cfg.gpu_ids = [0]
    cfg.seed = 0
    
    # Create work directory if it doesn't exist
    os.makedirs(cfg.work_dir, exist_ok=True)
    
    # Build the dataset
    datasets = [build_dataset(cfg.data.train)]
    
    # Build the detector
    model = build_detector(
        cfg.model,
        train_cfg=cfg.get('train_cfg'),
        test_cfg=cfg.get('test_cfg'))
    
    # Add an attribute for visualization convenience
    model.CLASSES = datasets[0].CLASSES
    
    # Create work directory
    mmcv.mkdir_or_exist(os.path.abspath(cfg.work_dir))
    
    # Train the model
    train_detector(
        model,
        datasets,
        cfg,
        distributed=False,
        validate=True,
        timestamp=None,
        meta=dict())

if __name__ == '__main__':
    train_model('Litter Dataset.v2i.coco-mmdetection')  # Specify your dataset name here
