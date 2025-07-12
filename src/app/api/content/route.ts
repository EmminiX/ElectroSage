import { NextRequest, NextResponse } from 'next/server'
import { parseContentFromSections } from '@/lib/content/parser'
import { ContentResponse } from '@/data/types'

export async function GET(request: NextRequest) {
  try {
    // Use the new section-based parser for better performance
    const sections = parseContentFromSections()
    
    const response: ContentResponse = {
      sections,
      totalSections: sections.length
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error parsing content:', error)
    return NextResponse.json(
      { error: 'Failed to parse content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sectionId } = await request.json()
    
    // Use the new section-based parser
    const sections = parseContentFromSections()
    
    // Find specific section
    const section = sections.find(s => s.id === sectionId)
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ section })
  } catch (error) {
    console.error('Error fetching section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    )
  }
}
