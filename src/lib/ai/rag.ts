import { ContentSection } from '@/data/types'
import { parseContentFromSections, loadSectionById } from '@/lib/content/parser'

interface RAGResult {
  relevantSections: ContentSection[]
  relevantContent: string
  confidence: number
}

/**
 * Simple keyword-based relevance scoring for content sections
 */
function calculateRelevanceScore(query: string, section: ContentSection): number {
  const queryLower = query.toLowerCase()
  const contentLower = section.content.toLowerCase()
  const titleLower = section.title.toLowerCase()
  
  let score = 0
  
  // Split query into keywords
  const keywords = queryLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
  
  // Score based on keyword matches in title (higher weight)
  for (const keyword of keywords) {
    if (titleLower.includes(keyword)) {
      score += 10
    }
  }
  
  // Score based on keyword matches in content
  for (const keyword of keywords) {
    const matches = (contentLower.match(new RegExp(keyword, 'g')) || []).length
    score += matches * 2
  }
  
  // Boost for electrical terms
  const electricalTerms = [
    'voltage', 'current', 'resistance', 'ohm', 'circuit', 'electron', 'atom', 
    'conductor', 'insulator', 'safety', 'ac', 'dc', 'power', 'energy',
    'capacitor', 'inductor', 'resistor', 'diode', 'transistor', 'ground',
    'wire', 'component', 'measurement', 'multimeter', 'electrical'
  ]
  
  for (const term of electricalTerms) {
    if (queryLower.includes(term)) {
      if (contentLower.includes(term)) {
        score += 5
      }
    }
  }
  
  // Special handling for concept relationships
  const conceptMap: Record<string, string[]> = {
    'atomic': ['atom', 'electron', 'proton', 'neutron', 'charge'],
    'ohm': ['voltage', 'current', 'resistance', 'law'],
    'circuit': ['series', 'parallel', 'component', 'wire', 'connection'],
    'safety': ['shock', 'ground', 'gfci', 'hazard', 'protection'],
    'measurement': ['multimeter', 'voltage', 'current', 'test', 'meter']
  }
  
  for (const [concept, relatedTerms] of Object.entries(conceptMap)) {
    if (queryLower.includes(concept)) {
      for (const term of relatedTerms) {
        if (contentLower.includes(term)) {
          score += 3
        }
      }
    }
  }
  
  return score
}

/**
 * Retrieve relevant content sections based on user query
 */
export function getRelevantContent(userQuery: string, maxSections: number = 3): RAGResult {
  try {
    // Load all content sections
    const allSections = parseContentFromSections()
    
    // Calculate relevance scores for each section
    const scoredSections = allSections
      .map(section => ({
        section,
        score: calculateRelevanceScore(userQuery, section)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSections)
    
    const relevantSections = scoredSections.map(item => item.section)
    const totalScore = scoredSections.reduce((sum, item) => sum + item.score, 0)
    const confidence = Math.min(totalScore / 50, 1) // Normalize to 0-1 scale
    
    // Combine relevant content
    const relevantContent = relevantSections
      .map(section => {
        return `## ${section.title}\n\n${section.content.substring(0, 2000)}${section.content.length > 2000 ? '...' : ''}`
      })
      .join('\n\n---\n\n')
    
    return {
      relevantSections,
      relevantContent,
      confidence
    }
  } catch (error) {
    console.error('Error in RAG system:', error)
    return {
      relevantSections: [],
      relevantContent: '',
      confidence: 0
    }
  }
}

/**
 * Get content for a specific section by ID
 */
export function getSectionContent(sectionId: string): string {
  try {
    const section = loadSectionById(sectionId)
    return section ? section.content : ''
  } catch (error) {
    console.error(`Error loading section ${sectionId}:`, error)
    return ''
  }
}

/**
 * Search for specific concepts across all content
 */
export function searchConcepts(concepts: string[]): ContentSection[] {
  try {
    const allSections = parseContentFromSections()
    const matchingSections: ContentSection[] = []
    
    for (const section of allSections) {
      const contentLower = section.content.toLowerCase()
      const titleLower = section.title.toLowerCase()
      
      for (const concept of concepts) {
        const conceptLower = concept.toLowerCase()
        if (contentLower.includes(conceptLower) || titleLower.includes(conceptLower)) {
          if (!matchingSections.find(s => s.id === section.id)) {
            matchingSections.push(section)
          }
          break
        }
      }
    }
    
    return matchingSections
  } catch (error) {
    console.error('Error searching concepts:', error)
    return []
  }
}

/**
 * Get all available sections for reference
 */
export function getAllSections(): ContentSection[] {
  try {
    return parseContentFromSections()
  } catch (error) {
    console.error('Error loading all sections:', error)
    return []
  }
}