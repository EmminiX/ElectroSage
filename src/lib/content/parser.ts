import { ContentSection, PracticeQuestion, VisualizationType } from '@/data/types'
import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { visit } from 'unist-util-visit'

// Helper function to create slug from text
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// Rehype plugin to add IDs to headings for scroll-to functionality
function rehypeAddHeadingIds() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        // Extract text content from heading
        const textContent = extractTextFromNode(node)
        const id = createSlug(textContent)
        
        // Add id attribute
        if (!node.properties) node.properties = {}
        node.properties.id = id
      }
    })
  }
}

// Helper function to extract text content from a node
function extractTextFromNode(node: any): string {
  if (node.type === 'text') return node.value
  if (node.children) {
    return node.children.map(extractTextFromNode).join('')
  }
  return ''
}

// Configure the remark processor for semantic HTML generation
const processor = remark()
  .use(remarkParse)
  .use(remarkGfm) // GitHub Flavored Markdown (tables, strikethrough, etc.)
  .use(remarkMath) // Math expressions
  .use(remarkRehype, {
    allowDangerousHtml: false,
    clobberPrefix: 'user-content-'
  })
  .use(rehypeKatex) // Render math with KaTeX
  .use(rehypeAddHeadingIds) // Add IDs to headings for scroll-to functionality
  .use(rehypeStringify, {
    allowDangerousHtml: false
  })

/**
 * Parse markdown content from individual section files
 * This replaces the old monolithic parsing approach
 */
export function parseContentFromSections(): ContentSection[] {
  const sectionsDir = join(process.cwd(), 'content', 'sections')
  const sections: ContentSection[] = []
  
  try {
    // Get all section files
    const files = readdirSync(sectionsDir)
      .filter((file: string) => file.endsWith('.md'))
      .sort() // Ensure proper ordering (00-introduction.md, 01-..., etc.)
    
    for (const file of files) {
      const filePath = join(sectionsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // Extract section info from filename and content
      const fileMatch = file.match(/^(\d+)-(.+)\.md$/)
      if (!fileMatch) continue
      
      const sectionNumber = fileMatch[1]
      const sectionSlug = fileMatch[2]
      
      // Parse the section
      const section = parseSingleSection(content, sectionNumber, sectionSlug)
      if (section) {
        sections.push(section)
      }
    }
  } catch (error) {
    console.error('Error reading sections directory:', error)
    // Fallback to old parsing method if sections don't exist
    return parseMarkdownContentLegacy()
  }
  
  return sections
}

/**
 * Parse a single section file into a ContentSection
 */
function parseSingleSection(content: string, sectionNumber: string, sectionSlug: string): ContentSection | null {
  try {
    // Extract title from content
    const titleMatch = content.match(/^#\s+(.+)/m) || content.match(/^##\s+Section\s+\d+:\s+(.+)/m)
    const title = titleMatch ? titleMatch[1].trim() : sectionSlug.replace(/-/g, ' ')
    
    // Generate semantic HTML using remark
    const htmlContent = processor.processSync(content).toString()
    
    // Extract practice questions
    const practiceQuestions = extractPracticeQuestions(content)
    
    // Detect required visualizations
    const visualizations = detectVisualizations(content)
    
    // Extract subsections (h3 headings)
    const subsections = extractSubsections(content)
    
    return {
      id: sectionNumber === '00' ? 'introduction' : `section-${parseInt(sectionNumber)}`,
      title,
      content,
      htmlContent,
      subsections,
      practiceQuestions,
      visualizations
    }
  } catch (error) {
    console.error(`Error parsing section ${sectionNumber}:`, error)
    return null
  }
}

/**
 * Extract subsections from markdown content
 */
function extractSubsections(content: string): Array<{id: string, title: string, content: string, htmlContent: string, visualizations: VisualizationType[]}> {
  const subsections: Array<{id: string, title: string, content: string, htmlContent: string, visualizations: VisualizationType[]}> = []
  const h3Regex = /^### (.+)$/gm
  let match
  let index = 0
  
  while ((match = h3Regex.exec(content)) !== null) {
    const title = match[1].trim()
    const id = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    
    // Extract content for this subsection (from this h3 to next h3 or end)
    const startIndex = match.index
    const nextH3Match = content.indexOf('\n### ', startIndex + 1)
    const endIndex = nextH3Match === -1 ? content.length : nextH3Match
    const subsectionContent = content.slice(startIndex, endIndex).trim()
    
    subsections.push({
      id: `subsection-${index}-${id}`,
      title,
      content: subsectionContent,
      htmlContent: processor.processSync(subsectionContent).toString(),
      visualizations: detectVisualizations(subsectionContent)
    })
    index++
  }
  
  return subsections
}

/**
 * Load a specific section by ID
 */
export function loadSectionById(sectionId: string): ContentSection | null {
  const sectionsDir = join(process.cwd(), 'content', 'sections')
  
  try {
    let filename: string
    
    if (sectionId === 'introduction') {
      filename = '00-introduction.md'
    } else {
      const sectionMatch = sectionId.match(/section-(\d+)/)
      if (!sectionMatch) return null
      
      const sectionNumber = sectionMatch[1].padStart(2, '0')
      const files = readdirSync(sectionsDir)
      filename = files.find((file: string) => file.startsWith(`${sectionNumber}-`)) || ''
    }
    
    if (!filename) return null
    
    const filePath = join(sectionsDir, filename)
    const content = readFileSync(filePath, 'utf-8')
    const sectionNumber = filename.split('-')[0]
    const sectionSlug = filename.replace(/^\d+-/, '').replace(/\.md$/, '')
    
    return parseSingleSection(content, sectionNumber, sectionSlug)
  } catch (error) {
    console.error(`Error loading section ${sectionId}:`, error)
    return null
  }
}

/**
 * Legacy parser for backward compatibility
 * This is the original parseMarkdownContent function
 */
function parseMarkdownContentLegacy(): ContentSection[] {
  try {
    const contentPath = join(process.cwd(), 'content', 'ElectroSage_Academy_Content.md')
    const content = readFileSync(contentPath, 'utf-8')
    return parseMarkdownContent(content)
  } catch (error) {
    console.error('Error with legacy parsing:', error)
    return []
  }
}

export function parseMarkdownContent(content: string): ContentSection[] {
  const parsedSections: ContentSection[] = []
  
  // First, add the introduction as section 0
  const introMatch = content.match(/^## Introduction[\s\S]*?(?=^## Section \d+:|$)/m)
  if (introMatch) {
    const introContent = introMatch[0]
    const htmlContent = processor.processSync(introContent).toString()
    
    parsedSections.push({
      id: 'introduction',
      title: 'Introduction to Electrical Engineering',
      content: introContent,
      htmlContent,
      subsections: [],
      practiceQuestions: [],
      visualizations: []
    })
  }
  
  // Extract all sections that start with "## Section X:"
  const sectionRegex = /^## Section (\d+): ([^\n]+)\n\n([\s\S]*?)(?=\n## Section \d+:|$)/gm
  let match
  
  while ((match = sectionRegex.exec(content)) !== null) {
    const sectionNumber = match[1]
    const sectionTitle = match[2].trim()
    const sectionContent = match[3].trim()
    
    // Extract practice questions
    const practiceQuestions = extractPracticeQuestions(sectionContent)
    
    // Detect required visualizations based on content
    const visualizations = detectVisualizations(sectionContent)
    
    // Convert markdown to semantic HTML using remark
    const htmlContent = processor.processSync(sectionContent).toString()
    
    parsedSections.push({
      id: `section-${sectionNumber}`,
      title: sectionTitle,
      content: sectionContent,
      htmlContent,
      subsections: [],
      practiceQuestions,
      visualizations
    })
  }
  
  return parsedSections
}

function extractPracticeQuestions(content: string): PracticeQuestion[] {
  const questions: PracticeQuestion[] = []
  
  // Look for "Practice Questions:" section
  const practiceMatch = content.match(/\*\*Practice Questions\*\*:\s*([\s\S]*?)(?=\n\n##|\n\n\*\*|$)/i)
  if (!practiceMatch) return questions
  
  const practiceContent = practiceMatch[1]
  const questionRegex = /^\d+\.\s+(.+?)(?=\n\d+\.|\n\n|$)/gm
  let match
  let index = 1
  
  while ((match = questionRegex.exec(practiceContent)) !== null) {
    questions.push({
      id: `q${index}`,
      question: match[1].trim(),
      type: 'open-ended',
      difficulty: 'medium'
    })
    index++
  }
  
  return questions
}

/**
 * Intelligent visualization detection with context-aware scoring
 * Limits visualizations per section to prevent dropdown overcrowding
 */
function detectVisualizations(content: string): VisualizationType[] {
  const contentLower = content.toLowerCase()
  const visualizationScores: Record<VisualizationType, number> = {} as any
  
  // Helper function to add score for a visualization type
  const addScore = (type: VisualizationType, score: number, reason?: string) => {
    if (!visualizationScores[type]) visualizationScores[type] = 0
    visualizationScores[type] += score
  }

  // ATOMIC STRUCTURE DETECTION
  if (contentLower.includes('atomic structure')) addScore('atomic-structure', 10)
  if (contentLower.includes('atom') && (contentLower.includes('electron') || contentLower.includes('proton'))) addScore('atomic-structure', 8)
  if (contentLower.includes('valence') && contentLower.includes('electron')) addScore('atomic-structure', 7)
  if (contentLower.includes('nuclear') || contentLower.includes('nucleus')) addScore('atomic-structure', 6)

  // VOLTAGE DEMONSTRATIONS
  if (contentLower.includes('voltage') && (contentLower.includes('demo') || contentLower.includes('visual'))) addScore('voltage-demo', 10)
  if (contentLower.includes('potential difference')) addScore('voltage-demo', 9)
  if (contentLower.includes('electrical pressure')) addScore('voltage-demo', 8)
  if (contentLower.includes('voltage') && contentLower.includes('measurement')) addScore('voltage-demo', 7)
  // Reduce voltage-demo score if it's just incidental mention
  if (contentLower.includes('voltage') && !contentLower.includes('demo') && !contentLower.includes('potential')) addScore('voltage-demo', 3)

  // CURRENT FLOW VISUALIZATIONS
  if (contentLower.includes('current flow')) addScore('current-flow', 10)
  if (contentLower.includes('electron flow')) addScore('current-flow', 9)
  if (contentLower.includes('conventional current')) addScore('current-flow', 8)
  if (contentLower.includes('current') && contentLower.includes('direction')) addScore('current-flow', 7)
  
  // RESISTANCE DEMONSTRATIONS
  if (contentLower.includes('resistance') && (contentLower.includes('demo') || contentLower.includes('heat'))) addScore('resistance-demo', 10)
  if (contentLower.includes('power dissipation')) addScore('resistance-demo', 9)
  if (contentLower.includes('resistor') && contentLower.includes('material')) addScore('resistance-demo', 8)
  if (contentLower.includes('ohm') && contentLower.includes('law')) addScore('resistance-demo', 6)
  
  // CIRCUIT SERIES
  if (contentLower.includes('series circuit')) addScore('circuit-series', 10)
  if (contentLower.includes('circuit fundamentals') || contentLower.includes('circuit elements')) addScore('circuit-series', 8)
  
  // CIRCUIT PARALLEL  
  if (contentLower.includes('parallel circuit')) addScore('circuit-parallel', 10)
  if (contentLower.includes('current division') || contentLower.includes('voltage division')) addScore('circuit-parallel', 9)
  
  // OHM'S LAW CALCULATOR
  if (contentLower.includes("ohm's law")) addScore('ohms-law', 10)
  if (contentLower.includes('v = ir') || contentLower.includes('v=ir')) addScore('ohms-law', 9)
  if (contentLower.includes('power formula') && contentLower.includes('electrical')) addScore('ohms-law', 8)
  if (contentLower.includes('calculate') && (contentLower.includes('voltage') || contentLower.includes('current') || contentLower.includes('resistance'))) addScore('ohms-law', 6)
  
  // AC WAVEFORM (be very specific to avoid false positives)
  if (contentLower.includes('ac waveform') || contentLower.includes('alternating current waveform')) addScore('ac-waveform', 10)
  if (contentLower.includes('frequency') && contentLower.includes('amplitude')) addScore('ac-waveform', 9)
  if (contentLower.includes('oscilloscope')) addScore('ac-waveform', 8)
  if (contentLower.includes('sine wave') || contentLower.includes('sinusoidal')) addScore('ac-waveform', 7)
  // Don't trigger on just "AC" or generic mentions
  
  // CIRCUIT DIAGRAM BUILDER
  if (contentLower.includes('circuit diagram') || contentLower.includes('circuit builder')) addScore('circuit-diagram', 10)
  if (contentLower.includes('schematic') && contentLower.includes('circuit')) addScore('circuit-diagram', 9)
  if (contentLower.includes('wiring diagram')) addScore('circuit-diagram', 8)
  if (contentLower.includes('electronic circuit') && contentLower.includes('design')) addScore('circuit-diagram', 7)
  if (contentLower.includes('semiconductor') && contentLower.includes('circuit')) addScore('circuit-diagram', 6)
  
  // COMPONENT LIBRARY (be more specific)
  if (contentLower.includes('component library') || contentLower.includes('electronic components')) addScore('component-library', 10)
  if (contentLower.includes('resistor') && contentLower.includes('color code')) addScore('component-library', 9)
  if (contentLower.includes('diode') || contentLower.includes('transistor')) addScore('component-library', 8)
  if (contentLower.includes('semiconductor devices')) addScore('component-library', 7)
  
  // SAFETY DEMONSTRATION
  if (contentLower.includes('electrical safety')) addScore('safety-demo', 10)
  if (contentLower.includes('shock') && contentLower.includes('electrical')) addScore('safety-demo', 9)
  if (contentLower.includes('gfci') || contentLower.includes('ground fault')) addScore('safety-demo', 8)
  if (contentLower.includes('grounding') && contentLower.includes('safety')) addScore('safety-demo', 7)
  if (contentLower.includes('arc flash')) addScore('safety-demo', 6)
  
  // ELECTRIC FIELD (now part of voltage demo)
  if (contentLower.includes('electric field')) addScore('voltage-demo', 10)
  if (contentLower.includes('coulomb') && contentLower.includes('law')) addScore('voltage-demo', 9)
  if (contentLower.includes('charge interaction')) addScore('voltage-demo', 8)
  if (contentLower.includes('static electricity')) addScore('voltage-demo', 6)

  // Convert scores to sorted array
  // Special handling for Introduction section - show all available visualizations as a playground
  const isIntroduction = contentLower.includes('introduction') || 
                         contentLower.includes('table of contents') || 
                         contentLower.includes('basic electricity') && contentLower.includes('modern world')
  
  if (isIntroduction) {
    // For Introduction: Return all available visualizations as a playground for user exploration
    const allVisualizations: VisualizationType[] = [
      'atomic-structure',
      'voltage-demo', 
      'current-flow',
      'resistance-demo',
      'circuit-series',
      'circuit-parallel',
      'ohms-law',
      'ac-waveform',
      'circuit-diagram',
      'component-library',
      'safety-demo',
      'capacitor-demo',
      'inductor-demo',
      'transformer-demo'
    ]
    
    if (process.env.NODE_ENV === 'development') {
      console.info(`🎮 Introduction section detected - providing ALL ${allVisualizations.length} visualizations as playground`)
    }
    
    return allVisualizations
  }
  
  // For all other sections: Keep focused approach with top 4 most relevant
  const sortedVisualizations = Object.entries(visualizationScores)
    .filter(([_, score]) => score >= 5) // Minimum threshold
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4) // Maximum 4 visualizations per section
    .map(([type]) => type as VisualizationType)
  
  return sortedVisualizations
}
