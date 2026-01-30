import os
from ultralytics import YOLO
import json

NUM_EPOCHS = 10

def train_model(dataset_name: str):
    # Get absolute path to the dataset
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client', 'public', 'images', 'datasets', dataset_name))
    yaml_path = os.path.join(dataset_path, 'data.yaml')
    print('Dataset path:', dataset_path)
    print('YAML path:', yaml_path)
    
    # Initialize YOLO model
    model = YOLO('yolov8n.pt')  # Load a pretrained YOLOv8 nano model
    
    # Set custom runs directory
    runs_dir = os.path.join(os.path.dirname(__file__), 'runs')
    os.makedirs(runs_dir, exist_ok=True)
    
    try:
      print('Training model...')
      # Train the model
      results = model.train(
          data=yaml_path,
          format='coco',
          epochs=NUM_EPOCHS,
          project=runs_dir,
          name=f'{dataset_name}_train'
      )
      
      # Save the trained model
      model_save_path = os.path.join(os.path.dirname(__file__), 'models', f'{dataset_name}_model.pt')
      os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
      model.save(model_save_path)
      print(f"\nModel saved to: {model_save_path}")

      # Save the results
      results_path = os.path.join(runs_dir, f'{dataset_name}_train', 'results.json')
      with open(results_path, 'w') as f:
          json.dump(results, f)
    
      # Validate the model
      # val_results = model.val()
      # print("\nValidation Results:")
      # print(f"mAP50: {val_results.box.map50:.3f}")
      # print(f"mAP50-95: {val_results.box.map:.3f}")
      
      return model, results
    
    except Exception as e:
        print(f"Error during training: {str(e)}")
        raise

if __name__ == '__main__':
    train_model('Litter Dataset.v1i.coco-mmdetection')
