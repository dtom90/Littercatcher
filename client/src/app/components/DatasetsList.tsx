'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

// Define the Dataset type based on expected API response
interface Dataset {
  id: string;
  name: string;
  // Add other fields as needed
}

export default function DatasetsList() {
  const { data, isLoading, error } = useQuery<{ datasets: Dataset[] }>({
    queryKey: ['datasets'],
    queryFn: async () => {
      const res = await fetch('/api/datasets');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading datasets.</p>}
      {data?.datasets && (
        <ul className="mt-4 space-y-2">
          {data.datasets.map((dataset) => (
            <Link 
              key={dataset.id} 
              href={`/datasets/${dataset.id}`} 
              className="p-4 bg-gray-800 text-white rounded block hover:bg-gray-700"
            >
              <span>{dataset.name}</span>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
}
