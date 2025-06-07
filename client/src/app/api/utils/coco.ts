import { promises as fs } from 'fs';

export interface COCOInfo {
  year: string;
  version: string;
  description: string;
  contributor: string;
  url: string;
  date_created: string;
}

export interface COCOLicense {
  id: number;
  url: string;
  name: string;
}

export interface COCOAnnotation {
  id: number;
  image_id: number;
  category_id: number;
  bbox: number[]; // [x, y, width, height]
  area: number;
  segmentation: number[][] | []; // Can be empty array or array of polygon points
  iscrowd: number;
}

export interface COCOImage {
  id: number;
  width: number;
  height: number;
  file_name: string;
  license: number;
  date_captured: string;
  extra?: {
    name: string;
  };
  annotations?: COCOAnnotation[];
}

export interface COCOCategory {
  id: number;
  name: string;
}

export interface COCODataset {
  info: COCOInfo;
  licenses: COCOLicense[];
  images: COCOImage[];
  annotations: COCOAnnotation[];
  categories: COCOCategory[];
}

export interface ParsedCOCO {
  info: COCOInfo;
  licenses: COCOLicense[];
  imagesMap: Map<number, COCOImage>;
}

/**
 * Parses a COCO format JSON file and returns a structured representation
 * @param filePath Path to the COCO JSON file
 * @returns Structured representation of the COCO dataset
 */
export async function parseCOCOFile(filePath: string): Promise<ParsedCOCO> {
  const jsonData: COCODataset = JSON.parse(
    await fs.readFile(filePath, 'utf-8')
  );

  const imagesMap = new Map<number, COCOImage>();
  jsonData.images.forEach(image => {
    imagesMap.set(image.id, image);
  });

  jsonData.annotations.forEach(annotation => {
    imagesMap.get(annotation.image_id)?.annotations?.push(annotation);
  });

  return {
    info: jsonData.info,
    licenses: jsonData.licenses,
    imagesMap,
  };
}
