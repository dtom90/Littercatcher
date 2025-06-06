import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { datasetBasePath, datasets } from '@/app/api/datasets';

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

  const { searchParams } = new URL(request.url);
  
  const split = searchParams.get('split');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('page_size') || '20');
  
  // Validate split parameter
  if (!split || !['train', 'valid', 'test'].includes(split)) {
    return NextResponse.json(
      { error: 'Invalid split parameter' },
      { status: 400 }
    );
  }
  
  // Validate pagination parameters
  if (page < 1 || pageSize < 1 || pageSize > 100) {
    return NextResponse.json(
      { error: 'Invalid pagination parameters' },
      { status: 400 }
    );
  }
  
  const datasetDir = path.join(datasetBasePath, datasetDetails.directory);
  const splitPath = path.join(datasetDir, split);
  
  if (!fs.existsSync(splitPath)) {
    return NextResponse.json(
      { error: `Path '${splitPath}' not found in dataset` },
      { status: 404 }
    );
  }
  
  // Get all image files
  const imageFiles = fs.readdirSync(splitPath)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  
  // Calculate pagination
  const totalImages = imageFiles.length;
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  
  // Get paginated images
  const paginatedImages = imageFiles.slice(startIdx, endIdx);
  
  // Create response
  const images = paginatedImages.map(filename => ({
    filename,
    path: `/images/datasets/${datasetDetails.directory}/${split}/${filename}`
  }));
  
  return NextResponse.json({
    images,
    total: totalImages,
    page,
    page_size: pageSize,
    has_more: endIdx < totalImages
  });
}
