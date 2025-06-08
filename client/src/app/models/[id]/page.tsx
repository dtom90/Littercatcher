'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import BackButton from '@/app/components/BackButton';

interface ModelDetails {
  id: string;
  name: string;
  path: string;
  created_at: string;
}

export default function ModelDetailsPage() {
  const params = useParams();
  const modelId = params.id as string;

  const { data, isLoading, error } = useQuery<ModelDetails>({
    queryKey: ['model', modelId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/models/${modelId}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading model details.</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Path</h2>
            <p className="text-gray-300">{data.path}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Created</h3>
              <p className="text-gray-300">{new Date(data.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
