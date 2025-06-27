import { ContentSection, PracticeQuestion, VisualizationType } from '@/data/types'
import { marked } from 'marked'

export function parseMarkdownContent(content: string): ContentSection[] {
  const parsedSections: ContentSection[] = []
  
  // First, add the introduction as section 0
  const introMatch = content.match(/^## Introduction[\s\S]*?(?=^## Section \d+:|$)/m)
  if (introMatch) {
    const introContent = introMatch[0]
    const htmlContent = convertToHTML(introContent)
    
    parsedSections.push({
      id: 'introduction',
      title: 'Introduction to Basic Electricity',
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
    
    // Convert markdown-like content to basic HTML
    const htmlContent = convertToHTML(sectionContent)
    
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
  
  // Look for practice questions section
  const practiceMatch = content.match(/\*\*Practice Questions\*\*:([\s\S]*?)(?=\n\n[A-Z]|\n\n\d+\.|\n\n##|$)/i)
  
  if (practiceMatch) {
    const practiceSection = practiceMatch[1]
    
    // Split by numbered questions
    const questionMatches = practiceSection.match(/\d+\.\s+([^?]+\?)/g)
    
    if (questionMatches) {
      questionMatches.forEach((question, index) => {
        const cleanQuestion = question.replace(/^\d+\.\s+/, '').trim()
        
        questions.push({
          id: `q-${index + 1}`,
          question: cleanQuestion,
          type: 'text', // Default type
          answer: '', // Would need to be manually added or extracted
          explanation: ''
        })
      })
    }
  }
  
  return questions
}

function detectVisualizations(content: string): VisualizationType[] {
  const visualizations: VisualizationType[] = []
  
  // Detect visualization needs based on content keywords
  const detectionMap: { [key: string]: VisualizationType } = {
    'atom': 'atom-structure',
    'atomic structure': 'atom-structure',
    'electron shells': 'atom-structure',
    'series circuit': 'circuit-series',
    'parallel circuit': 'circuit-parallel',
    'ohm\'s law': 'ohms-law',
    'current flow': 'current-flow',
    'voltage': 'voltage-demo',
    'resistance': 'resistance-demo',
    'capacitor': 'capacitor-demo',
    'inductor': 'inductor-demo',
    'transformer': 'transformer-demo',
    'ac waveform': 'ac-waveform',
    '3-phase': '3-phase-system',
    'safety': 'safety-demo'
  }

  const lowerContent = content.toLowerCase()
  
  Object.entries(detectionMap).forEach(([keyword, vizType]) => {
    if (lowerContent.includes(keyword) && !visualizations.includes(vizType)) {
      visualizations.push(vizType)
    }
  })

  // Look for specific visual aid instructions
  const visualAidMatches = content.match(/>\s*\*\*Visual Aid Instruction:\*\*([^>]+)/gi)
  if (visualAidMatches) {
    // Add more specific visualizations based on instructions
    visualAidMatches.forEach(match => {
      const instruction = match.toLowerCase()
      if (instruction.includes('3d model') && instruction.includes('atom')) {
        if (!visualizations.includes('atom-structure')) {
          visualizations.push('atom-structure')
        }
      }
      if (instruction.includes('circuit') || instruction.includes('ohm')) {
        if (!visualizations.includes('ohms-law')) {
          visualizations.push('ohms-law')
        }
      }
    })
  }

  return visualizations
}

function convertToHTML(content: string): string {
  // Use the `marked` markdown parser for proper semantic HTML conversion.
  // The library automatically handles headings, lists, code blocks, tables, etc.
  // We can extend or configure marked later (e.g. add math or syntax-highlighting plugins).
  return marked.parse(content)
}

  // Convert headers
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mb-3 text-gray-900">$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-4 text-gray-900">$1</h2>')
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
  
  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
  
  // Convert code blocks
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
  
  // Convert lists
  html = html.replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
  
  // Convert numbered lists
  html = html.replace(/^\d+\.\s+(.*$)/gm, '<li class="ml-4 mb-1 list-decimal">$1</li>')
  
  // Convert blockquotes and special sections
  html = html.replace(/^>\s*\*\*([^:]+):\*\*(.*$)/gm, 
    '<div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4"><strong class="text-blue-800">$1:</strong><span class="text-blue-700">$2</span></div>')
  
  html = html.replace(/^>\s*\*\*([^*]+)\*\*:\s*(.*$)/gm, 
    '<div class="bg-amber-50 border-l-4 border-amber-400 p-4 my-4"><strong class="text-amber-800">$1:</strong> <span class="text-amber-700">$2</span></div>')
  
  // Convert regular blockquotes
  html = html.replace(/^>\s*(.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
  
  // Convert paragraphs
  html = html.replace(/^(?!<|>|\s*$)(.+$)/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>')
  
  // Clean up extra spaces and line breaks
  html = html.replace(/\n\s*\n/g, '\n')
  
  return html
}
