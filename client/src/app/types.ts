export enum DatasetSplit {
  Train = 'train',
  Valid = 'valid',
  Test = 'test'
}

export type DatasetSplitType = `${DatasetSplit}`;

export interface ImageItem {
  filename: string;
  path: string;
}

export interface ImagesResponse {
  images: ImageItem[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}
