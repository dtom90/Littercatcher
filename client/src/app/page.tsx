'use client';

import DatasetsList from './components/DatasetsList';
// import ModelsList from './components/ModelsList';

export default function Home() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold">Datasets</h1>
      <DatasetsList />

      {/* <h1 className="text-4xl font-bold mt-8">Models</h1>
      <ModelsList /> */}
    </div>
  );
}
