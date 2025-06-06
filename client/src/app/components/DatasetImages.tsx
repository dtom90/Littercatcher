'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { DatasetSplitType, ImagesResponse } from '../types';
import Pagination from './Pagination';

interface DatasetImagesProps {
  datasetId: number;
  datasetName: string;
  split: DatasetSplitType;
}

const PAGE_SIZE = 10;

const fetchImagesData = async (datasetId: number, split: DatasetSplitType, page: number) => {
  const response = await fetch(
    `http://localhost:8000/datasets/${datasetId}/images?split=${split}&page=${page}&page_size=${PAGE_SIZE}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return response.json() as Promise<ImagesResponse>;
};

const DatasetImages = ({ datasetId, datasetName, split }: DatasetImagesProps) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['datasetImages', datasetId, split, page],
    queryFn: () => fetchImagesData(datasetId, split, page),
  });

  useEffect(() => {
    setPage(1); // Reset to first page when split changes
  }, [datasetId, split]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
          <div className="space-y-4">
            {data?.images.map((image) => (
              <div key={image.filename} className="border rounded p-4 flex items-center">
                <div className="relative w-12 h-12 mr-2">
                  <Image
                    src={`/api/datasets/${encodeURIComponent(datasetName)}/images/${split}/${encodeURIComponent(image.filename)}`}
                    alt={image.filename}
                    fill
                    sizes="12px"
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="font-semibold truncate">{image.filename.split('.')[0]}</h3>
              </div>
            ))}
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
