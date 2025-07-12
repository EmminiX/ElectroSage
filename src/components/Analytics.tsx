'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
    gtag?: (...args: any[]) => void;
  }
}

// Plausible Analytics Events
export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }
};

// Educational tracking events
export const trackEducationalEvent = {
  sectionStart: (sectionName: string) => 
    trackEvent('Section Started', { section: sectionName }),
  
  sectionComplete: (sectionName: string) => 
    trackEvent('Section Completed', { section: sectionName }),
  
  visualizationUsed: (vizName: string) => 
    trackEvent('Visualization Used', { visualization: vizName }),
  
  aiTutorQuestion: (sectionName: string) => 
    trackEvent('AI Tutor Question', { section: sectionName }),
  
  podcastPlay: (episodeName: string) => 
    trackEvent('Podcast Played', { episode: episodeName }),
  
  voiceInput: () => 
    trackEvent('Voice Input Used'),
  
  resourceClick: (resourceName: string) => 
    trackEvent('External Resource Clicked', { resource: resourceName }),
  
  quizComplete: (sectionName: string, score: number) => 
    trackEvent('Quiz Completed', { section: sectionName, score }),
  
  circuitBuilt: (complexity: string) => 
    trackEvent('Circuit Built', { complexity }),
  
  accessibilityFeature: (feature: string) => 
    trackEvent('Accessibility Feature Used', { feature }),
};

// Performance tracking
export const trackPerformance = {
  pageLoad: (pageName: string, loadTime: number) =>
    trackEvent('Page Load Performance', { page: pageName, loadTime }),
  
  interactionDelay: (interaction: string, delay: number) =>
    trackEvent('Interaction Delay', { interaction, delay }),
  
  visualizationLoad: (vizName: string, loadTime: number) =>
    trackEvent('Visualization Load Time', { visualization: vizName, loadTime }),
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string, context?: string) => {
  trackEvent('Error Occurred', { 
    type: errorType, 
    message: errorMessage,
    context 
  });
};

// Custom hook for page view tracking
export const usePageTracking = () => {
  useEffect(() => {
    // Plausible automatically tracks page views, but we can add custom logic here
    const handleRouteChange = () => {
      // Custom page tracking logic if needed
    };

    // Track initial page load
    trackEvent('Page View');

    return () => {
      // Cleanup if needed
    };
  }, []);
};

// Component for adding analytics to the app
export default function Analytics() {
  usePageTracking();
  
  return null; // This component doesn't render anything
}