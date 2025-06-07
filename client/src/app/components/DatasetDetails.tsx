'use client';

import { useState } from 'react';

export enum DatasetSplit {
  Train = 'train',
  Valid = 'valid',
  Test = 'test'
}

interface DatasetDetailsProps {
  dataset: {
    name: string;
    description?: string;
    imageCount?: number;
    splitCounts?: {
      train: number;
      valid: number;
      test: number;
    };
  };
  onSplitChange?: (split: DatasetSplit) => void;
}

export default function DatasetDetails({ dataset, onSplitChange }: DatasetDetailsProps) {
  const [split, setSplit] = useState<DatasetSplit>(DatasetSplit.Train);

  const handleSplitChange = (newSplit: DatasetSplit) => {
    setSplit(newSplit);
    onSplitChange?.(newSplit);
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{dataset.name}</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        {dataset.description && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-300">{dataset.description}</p>
          </div>
        )}
        
        {dataset.imageCount !== undefined && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Images</h2>
            <p className="text-gray-300 mb-4">{dataset.imageCount} total images</p>
            
            {dataset.splitCounts && (
              <div className="grid grid-cols-3 gap-4">
                <div 
                  onClick={() => handleSplitChange(DatasetSplit.Train)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    split === DatasetSplit.Train 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <h3 className="font-medium text-gray-200">Training</h3>
                  <p className="text-2xl font-bold text-blue-400">{dataset.splitCounts.train}</p>
                </div>
                <div 
                  onClick={() => handleSplitChange(DatasetSplit.Valid)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    split === DatasetSplit.Valid 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <h3 className="font-medium text-gray-200">Validation</h3>
                  <p className="text-2xl font-bold text-yellow-400">{dataset.splitCounts.valid}</p>
                </div>
                <div 
                  onClick={() => handleSplitChange(DatasetSplit.Test)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    split === DatasetSplit.Test 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <h3 className="font-medium text-gray-200">Testing</h3>
                  <p className="text-2xl font-bold text-green-400">{dataset.splitCounts.test}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
} 