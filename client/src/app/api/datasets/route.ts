import { NextResponse } from 'next/server';
import { datasets } from '../datasets';

export async function GET() {
  try {
    return NextResponse.json(datasets);
  } catch (error) {
    console.error('Error reading datasets configuration:', error);
    return NextResponse.json(
      { error: 'Failed to read datasets configuration' },
      { status: 500 }
    );
  }
}
