'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

// Define the Model type based on expected API response
interface Model {
  id: string;
  name: string;
}

export default function ModelsList() {
  const { data, isLoading, error } = useQuery<{ models: Model[] }>({
    queryKey: ['models'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/models');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading models.</p>}
      {data?.models && (
        <ul className="mt-4 space-y-2">
          {data.models.map((model) => (
            <Link 
              key={model.id} 
              href={`/models/${model.id}`} 
              className="p-4 bg-gray-800 text-white rounded block hover:bg-gray-700"
            >
              <div className="flex justify-between items-center">
                <span>{model.name}</span>
              </div>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
}
