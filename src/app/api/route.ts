import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts } from '@/app/data/notion'; 

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor') || undefined;

  try {
    const data = await getBlogPosts(cursor);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}