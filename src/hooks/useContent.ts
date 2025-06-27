'use client'

import { useState, useEffect } from 'react'
import { ContentSection, ContentResponse } from '@/data/types'

export function useContent() {
  const [sections, setSections] = useState<ContentSection[]>([])
  const [currentSection, setCurrentSection] = useState<ContentSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content')
      
      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }
      
      const data: ContentResponse = await response.json()
      setSections(data.sections)
      
      // Set first section as current
      if (data.sections.length > 0) {
        setCurrentSection(data.sections[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const navigateToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (section) {
      setCurrentSection(section)
    }
  }

  const getNextSection = (): ContentSection | null => {
    if (!currentSection) return null
    
    const currentIndex = sections.findIndex(s => s.id === currentSection.id)
    if (currentIndex < sections.length - 1) {
      return sections[currentIndex + 1]
    }
    return null
  }

  const getPreviousSection = (): ContentSection | null => {
    if (!currentSection) return null
    
    const currentIndex = sections.findIndex(s => s.id === currentSection.id)
    if (currentIndex > 0) {
      return sections[currentIndex - 1]
    }
    return null
  }

  const navigateNext = () => {
    const nextSection = getNextSection()
    if (nextSection) {
      setCurrentSection(nextSection)
    }
  }

  const navigatePrevious = () => {
    const previousSection = getPreviousSection()
    if (previousSection) {
      setCurrentSection(previousSection)
    }
  }

  return {
    sections,
    currentSection,
    loading,
    error,
    navigateToSection,
    navigateNext,
    navigatePrevious,
    getNextSection,
    getPreviousSection
  }
}
