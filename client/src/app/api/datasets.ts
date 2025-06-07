import path from "path";
import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { parseCOCOFile, COCODataset } from './utils/coco';

export const datasetBasePath = path.join(process.cwd(), 'public', 'images', 'datasets');

// Read the datasets.yaml file
const yamlPath = path.join(datasetBasePath, 'datasets.yaml');
const yamlContent = await fs.readFile(yamlPath, 'utf8');

export const datasets: Datasets = yaml.load(yamlContent) as Datasets;

interface Datasets {
  datasets: Dataset[];
}

interface Dataset {
  id: number;
  name: string;
  directory: string;
  source: string;
}

enum Split {  
  TRAIN = 'train',
  VALID = 'valid',
  TEST = 'test',
}

interface SplitDataset {
  [Split.TRAIN]: COCODataset;
  [Split.VALID]: COCODataset;
  [Split.TEST]: COCODataset;
}

const datasetAnnotations = new Map<number, SplitDataset>();

for (const dataset of datasets.datasets) {
  datasetAnnotations.set(dataset.id, {
    [Split.TRAIN]: await parseCOCOFile(path.join(datasetBasePath, dataset.directory, Split.TRAIN, '_annotations.coco.json')),
    [Split.VALID]: await parseCOCOFile(path.join(datasetBasePath, dataset.directory, Split.VALID, '_annotations.coco.json')),
    [Split.TEST]: await parseCOCOFile(path.join(datasetBasePath, dataset.directory, Split.TEST, '_annotations.coco.json')),
  });
}

export async function getDatasetAnnotations(datasetId: number, split: Split) {
  return datasetAnnotations.get(datasetId)?.[split];
}

const testData = await getDatasetAnnotations(1, Split.TEST);
await fs.writeFile('dataset-test.json', JSON.stringify(testData, null, 2));
