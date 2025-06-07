'use client';

import DatasetsList from './components/DatasetsList';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Datasets</h1>
      <DatasetsList />
    </div>
  );
}
