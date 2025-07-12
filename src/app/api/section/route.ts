import { NextResponse } from 'next/server';
import { loadSectionById } from '@/lib/content/parser';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }
    
    const section = loadSectionById(id);
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error loading section:', error);
    return NextResponse.json(
      { error: 'Failed to load section' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
