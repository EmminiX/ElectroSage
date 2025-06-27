import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseMarkdownContent } from '@/lib/content/parser'
import { ContentResponse } from '@/data/types'

export async function GET(request: NextRequest) {
  try {
    // Read the content file
    const contentPath = join(process.cwd(), 'content', 'Basic_Electricity_Tutor_Content.md')
    const content = readFileSync(contentPath, 'utf-8')
    
    // Parse the content
    const sections = parseMarkdownContent(content)
    
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
    
    // Read the content file
    const contentPath = join(process.cwd(), 'content', 'Basic_Electricity_Tutor_Content.md')
    const content = readFileSync(contentPath, 'utf-8')
    
    // Parse the content
    const sections = parseMarkdownContent(content)
    
    // Find specific section
    const section = sections.find(s => s.id === sectionId)
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    )
  }
}
