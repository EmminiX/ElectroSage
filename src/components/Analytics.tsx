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

// LinkedIn-specific tracking
export const trackLinkedInEvents = {
  profileView: () => trackEvent('LinkedIn Profile View'),
  shareClick: () => trackEvent('LinkedIn Share Clicked'),
  commentEngagement: () => trackEvent('LinkedIn Comment Engagement'),
  connectionRequest: () => trackEvent('LinkedIn Connection Request'),
  postImpression: () => trackEvent('LinkedIn Post Impression'),
  ctaClick: (ctaType: string) => trackEvent('LinkedIn CTA Click', { type: ctaType }),
};

// Social media tracking
export const trackSocialMedia = {
  share: (platform: string, content: string) => 
    trackEvent('Content Shared', { platform, content }),
  
  click: (platform: string, source: string) => 
    trackEvent('Social Media Click', { platform, source }),
  
  follow: (platform: string) => 
    trackEvent('Social Media Follow', { platform }),
};

// Referral tracking
export const trackReferral = (source: string, medium: string, campaign?: string) => {
  trackEvent('Referral Traffic', { 
    source, 
    medium, 
    campaign: campaign || 'unknown' 
  });
};

// Debug function to check if Plausible is loaded
export const debugPlausible = () => {
  if (typeof window !== 'undefined') {
    console.log('Plausible Debug Info:');
    console.log('- Domain:', window.location.hostname);
    console.log('- Plausible function available:', typeof window.plausible);
    console.log('- Expected domain: electrosage.emmi.zone');
    
    if (window.plausible) {
      console.log('✅ Plausible is loaded and ready');
      window.plausible('test-event', { props: { debug: true } });
    } else {
      console.log('❌ Plausible not found - checking script loading...');
      const script = document.querySelector('[data-domain="electrosage.emmi.zone"]');
      console.log('- Script element found:', !!script);
      console.log('- Script src:', script?.getAttribute('src'));
    }
  }
};

// Custom hook for page view tracking
export const usePageTracking = () => {
  useEffect(() => {
    // Debug Plausible loading
    const timer = setTimeout(() => {
      debugPlausible();
    }, 1000);

    // Track referral source
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      
      if (utmSource) {
        trackReferral(utmSource, utmMedium || 'unknown', utmCampaign || undefined);
      }
      
      // Track LinkedIn-specific parameters
      if (utmSource === 'linkedin') {
        trackLinkedInEvents.postImpression();
      }
    }

    // Track initial page load (delay slightly to ensure Plausible is loaded)
    const pageViewTimer = setTimeout(() => {
      trackEvent('Page View');
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(pageViewTimer);
    };
  }, []);
};

// Component for adding analytics to the app
export default function Analytics() {
  usePageTracking();
  
  return null; // This component doesn't render anything
}