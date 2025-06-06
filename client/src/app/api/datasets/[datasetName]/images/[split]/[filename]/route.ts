import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { datasetName: string; split: string; filename: string } }
) {
  try {
    console.log('Route handler called');
    console.log('Full params object:', params);
    console.log('Params type:', typeof params);
    console.log('Request URL:', request.url);
    
    const { datasetName, split, filename } = params;
    
    // Construct the path to the image file
    const imagePath = path.join(process.cwd(), '..', 'datasets', datasetName, split, filename);
    console.log(imagePath);

    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);

    // Determine the content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    }[ext] || 'application/octet-stream';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}
