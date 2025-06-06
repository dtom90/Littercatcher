import path from "path";
import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { parseCOCOFile } from './utils/coco';

export const datasetBasePath = path.join(process.cwd(), 'public', 'images', 'datasets');

// Read the datasets.yaml file
const yamlPath = path.join(datasetBasePath, 'datasets.yaml');
const yamlContent = await fs.readFile(yamlPath, 'utf8');

export const datasets: Datasets = yaml.load(yamlContent) as Datasets;

interface Dataset {
  id: number;
  name: string;
  directory: string;
  source: string;
}

interface Datasets {
  datasets: Dataset[];
}

for (const dataset of datasets.datasets) {
  for (const split of ['train', 'valid', 'test']) {
    const cocoData = await parseCOCOFile(path.join(datasetBasePath, dataset.directory, split, '_annotations.coco.json'));
    console.log(cocoData);
  }
}
