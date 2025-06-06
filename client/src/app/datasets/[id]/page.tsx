'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Define the Dataset type based on expected API response
interface Dataset {
  id: string;
  name: string;
  description?: string;
  imageCount?: number;
  splitCounts?: {
    train: number;
    valid: number;
    test: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function DatasetPage() {
  const params = useParams();
  const datasetId = params.id as string;

  const { data: dataset, isLoading, error } = useQuery<Dataset>({
    queryKey: ['dataset', datasetId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/datasets/${datasetId}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <p>Loading dataset information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-red-500">Error loading dataset information.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-gray-300 hover:text-white mb-4 block">← Back to datasets</Link>

        <h1 className="text-4xl font-bold mb-6">{dataset?.name}</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          {dataset?.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-300">{dataset.description}</p>
            </div>
          )}
          
          {dataset?.imageCount !== undefined && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Images</h2>
              <p className="text-gray-300 mb-4">{dataset.imageCount} total images</p>
              
              {dataset.splitCounts && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-200">Training</h3>
                    <p className="text-2xl font-bold text-blue-400">{dataset.splitCounts.train}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-200">Validation</h3>
                    <p className="text-2xl font-bold text-yellow-400">{dataset.splitCounts.valid}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-200">Testing</h3>
                    <p className="text-2xl font-bold text-green-400">{dataset.splitCounts.test}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {dataset?.createdAt && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Created</h2>
              <p className="text-gray-300">{new Date(dataset.createdAt).toLocaleDateString()}</p>
            </div>
          )}
          
          {dataset?.updatedAt && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Last Updated</h2>
              <p className="text-gray-300">{new Date(dataset.updatedAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 