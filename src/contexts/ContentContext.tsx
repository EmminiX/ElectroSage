'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ContentSection, ContentResponse } from '@/data/types';

interface ContentContextType {
  sections: ContentSection[];
  currentSection: ContentSection | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  navigateToSection: (sectionId: string) => void;
  setCurrentSection: (section: ContentSection) => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  getNextSection: () => ContentSection | null;
  getPreviousSection: () => ContentSection | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [currentSection, setCurrentSection] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content');
      
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      
      const data: ContentResponse = await response.json();
      setSections(data.sections);
      
      // Set first section as current
      if (data.sections.length > 0) {
        setCurrentSection(data.sections[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const navigateToSection = useCallback((sectionId: string) => {
    console.log('ContentContext: Navigating to section', sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setCurrentSection(section);
    } else {
      console.error('Section not found:', sectionId, sections.map(s => s.id));
    }
  }, [sections]);

  const getNextSection = useCallback((): ContentSection | null => {
    if (!currentSection) return null;
    
    const currentIndex = sections.findIndex(s => s.id === currentSection.id);
    if (currentIndex < sections.length - 1) {
      return sections[currentIndex + 1];
    }
    return null;
  }, [currentSection, sections]);

  const getPreviousSection = useCallback((): ContentSection | null => {
    if (!currentSection) return null;
    
    const currentIndex = sections.findIndex(s => s.id === currentSection.id);
    if (currentIndex > 0) {
      return sections[currentIndex - 1];
    }
    return null;
  }, [currentSection, sections]);

  const navigateNext = useCallback(() => {
    const nextSection = getNextSection();
    if (nextSection) {
      setCurrentSection(nextSection);
    }
  }, [getNextSection]);

  const navigatePrevious = useCallback(() => {
    const previousSection = getPreviousSection();
    if (previousSection) {
      setCurrentSection(previousSection);
    }
  }, [getPreviousSection]);

  const value: ContentContextType = useMemo(() => ({
    sections,
    currentSection,
    loading,
    isLoading: loading,
    error,
    navigateToSection,
    setCurrentSection,
    navigateNext,
    navigatePrevious,
    getNextSection,
    getPreviousSection,
  }), [sections, currentSection, loading, error, navigateToSection, navigateNext, navigatePrevious, getNextSection, getPreviousSection]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
