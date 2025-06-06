'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { DatasetSplitType, ImageItem, ImagesResponse } from '../types';
import Pagination from './Pagination';

interface DatasetImagesProps {
  datasetId: number;
  split: DatasetSplitType;
}

const PAGE_SIZE = 5;

const fetchImagesData = async (datasetId: number, split: DatasetSplitType, page: number) => {
  const response = await fetch(
    `/api/datasets/${datasetId}/images?split=${split}&page=${page}&page_size=${PAGE_SIZE}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return response.json() as Promise<ImagesResponse>;
};

const DatasetImages = ({ datasetId, split }: DatasetImagesProps) => {
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['datasetImages', datasetId, split, page],
    queryFn: () => fetchImagesData(datasetId, split, page),
  });

  useEffect(() => {
    setPage(1); // Reset to first page when split changes
    setSelectedImage(null);
  }, [datasetId, split]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedImage(null);
  };

  if (error) {
    return <div className="p-4 text-red-500">{error instanceof Error ? error.message : 'An error occurred'}</div>;
  }

  return (
    <div className="p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex items-center">
            <div className="flex-1 space-y-4 mr-4">
              {data?.images.map((image) => (
                <button key={image.filename} className="w-full border rounded p-4 flex items-center hover:bg-gray-600 cursor-pointer" onClick={() => setSelectedImage(image)}>
                  <div className="relative w-12 h-12 mr-2">
                    <Image
                      src={image.path}
                      alt={image.filename}
                      fill
                      sizes="12px"
                      className="object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold truncate">{image.filename.split('.')[0]}</h3>
                </button>
              ))}
            </div>
            <div className="flex-1 mt-4 w-full h-full border rounded p-4">
              {selectedImage ?
                <div className="relative w-full h-[400px]">
                  <Image
                    src={selectedImage.path}
                    alt={selectedImage.filename}
                    fill
                    sizes="100%"
                    className="object-contain"
                  />
                </div>
              : <span className="text-gray-500 text-center">Select an image</span>}
            </div>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalItems={data?.total ?? 0}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DatasetImages;
