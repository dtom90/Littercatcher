import { NextResponse } from 'next/server';
import { datasetBasePath, datasets } from '@/app/api/datasets';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const datasetId = parseInt(id);
  const datasetDetails = datasets.datasets.find(d => d.id === datasetId);
  
  if (!datasetDetails) {
    return NextResponse.json(
      { error: `Dataset with id ${id} not found` },
      { status: 404 }
    );
  }
  
  // Count images in train, valid, and test directories
  const splitCounts = { train: 0, valid: 0, test: 0 };
  let imageCount = 0;
  
  for (const split of ['train', 'valid', 'test']) {
    const splitPath = path.join(datasetBasePath, datasetDetails.directory, split);
    if (fs.existsSync(splitPath)) {
      const count = fs.readdirSync(splitPath)
        .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
        .length;
      splitCounts[split as keyof typeof splitCounts] = count;
      imageCount += count;
    }
  }
  
  return NextResponse.json({
    ...datasetDetails,
    imageCount,
    splitCounts
  });
}
