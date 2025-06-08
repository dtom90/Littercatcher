'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import DatasetDetails, { DatasetSplit } from '@/app/components/DatasetDetails';
import DatasetImages from '@/app/components/DatasetImages';

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
        <BackButton />
        <DatasetDetails dataset={dataset} onSplitChange={setSplit} />
        <DatasetImages datasetId={datasetId} split={split} />
      </div>
    </div>
  );
}
