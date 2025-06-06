'use client';

import { useQuery } from '@tanstack/react-query';

// Define the Dataset type based on expected API response
interface Dataset {
  id: string;
  name: string;
  // Add other fields as needed
}

export default function Home() {
  const { data, isLoading, error } = useQuery<{ datasets: Dataset[] }>({
    queryKey: ['datasets'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/datasets');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Datasets</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading datasets.</p>}
      {data?.datasets && (
        <ul className="mt-4 space-y-2">
          {data.datasets.map((dataset) => (
            <li key={dataset.id} className="p-4 bg-gray-800 text-white rounded">
              {dataset.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
