'use client';

import { useQuery } from '@tanstack/react-query';
import DatasetDetails from '../../components/DatasetDetails';
import DatasetImages from '../../components/DatasetImages';
import Link from 'next/link';
import { useState } from 'react';
import { DatasetSplit } from '../../components/DatasetDetails';
import { useParams } from 'next/navigation';

export default function DatasetPage() {
  const { id } = useParams();
  const datasetId = Number(id);
  const [split, setSplit] = useState<DatasetSplit>(DatasetSplit.Train);
  const { data: dataset, isLoading, error } = useQuery({
    queryKey: ['dataset', id],
    queryFn: async () => {
      const res = await fetch(`/api/datasets/${id}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading dataset.</p>;
  if (!dataset) return <p>Dataset not found.</p>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-gray-300 hover:text-white mb-4 block">← Back to datasets</Link>
        <DatasetDetails dataset={dataset} onSplitChange={setSplit} />
        <DatasetImages datasetId={datasetId} split={split} />
      </div>
    </div>
  );
}
