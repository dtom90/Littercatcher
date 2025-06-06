import { promises as fs } from 'fs';

export interface COCOAnnotation {
  id: number;
  image_id: number;
  category_id: number;
  segmentation: number[][];
  area: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  iscrowd: number;
}

export interface COCOImage {
  id: number;
  width: number;
  height: number;
  file_name: string;
  license: number;
  date_captured: string;
}

export interface COCOCategory {
  id: number;
  name: string;
  supercategory: string;
}

export interface COCODataset {
  images: COCOImage[];
  annotations: COCOAnnotation[];
  categories: COCOCategory[];
}

export interface ParsedCOCO {
  annotationsByImage: Map<number, COCOAnnotation[]>;
  categoryMap: Map<number, COCOCategory>;
  images: COCOImage[];
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

  const annotationsByImage = new Map<number, COCOAnnotation[]>();
  jsonData.annotations.forEach(annotation => {
    const imageAnnotations = annotationsByImage.get(annotation.image_id) || [];
    imageAnnotations.push(annotation);
    annotationsByImage.set(annotation.image_id, imageAnnotations);
  });

  const categoryMap = new Map<number, COCOCategory>();
  jsonData.categories.forEach(category => {
    categoryMap.set(category.id, category);
  });

  return {
    annotationsByImage,
    categoryMap,
    images: jsonData.images
  };
}
