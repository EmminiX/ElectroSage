"use client";

import { useEffect, useCallback, useMemo } from 'react';
import { useContent } from '@/contexts/ContentContext';

interface KeyboardNavigationOptions {
  enableSectionNavigation?: boolean;
  enableNumberShortcuts?: boolean;
  enableHomeShortcut?: boolean;
  enableAccessibilityShortcuts?: boolean;
}

interface NavigationState {
  currentIndex: number;
  totalSections: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentSectionId: string;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableSectionNavigation = true,
    enableNumberShortcuts = true,
    enableHomeShortcut = true,
    enableAccessibilityShortcuts = true,
  } = options;

  const {
    sections,
    currentSection,
    navigateNext,
    navigatePrevious,
    navigateToSection,
  } = useContent();

  const navigationState: NavigationState = useMemo(() => {
    const currentIndex = sections.findIndex(s => s.id === currentSection?.id);
    return {
      currentIndex,
      totalSections: sections.length,
      canGoNext: currentIndex < sections.length - 1,
      canGoPrevious: currentIndex > 0,
      currentSectionId: currentSection?.id || '',
    };
  }, [sections, currentSection]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't interfere with form inputs, textareas, or contentEditable elements
    const target = event.target as HTMLElement;
    const isInputElement = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true' ||
                          target.closest('[contenteditable="true"]');

    if (isInputElement) return;

    // Don't interfere when modifier keys are pressed (except specific combos)
    const hasModifier = event.metaKey || event.altKey;
    const isCtrlShortcut = event.ctrlKey && !event.metaKey && !event.altKey;

    // Section Navigation (Arrow Keys)
    if (enableSectionNavigation && !hasModifier && !isCtrlShortcut) {
      switch (event.key) {
        case 'ArrowLeft':
          if (navigationState.canGoPrevious) {
            event.preventDefault();
            navigatePrevious();
          }
          break;
        case 'ArrowRight':
          if (navigationState.canGoNext) {
            event.preventDefault();
            navigateNext();
          }
          break;
      }
    }

    // Home shortcut
    if (enableHomeShortcut && event.key === 'Home' && !hasModifier && !isCtrlShortcut) {
      event.preventDefault();
      navigateToSection('introduction');
    }

    // Number shortcuts (1-9)
    if (enableNumberShortcuts && !hasModifier && !isCtrlShortcut) {
      const numberPressed = parseInt(event.key);
      if (numberPressed >= 1 && numberPressed <= 9) {
        const targetIndex = numberPressed - 1;
        if (targetIndex < sections.length) {
          event.preventDefault();
          navigateToSection(sections[targetIndex].id);
        }
      }
    }

    // Accessibility shortcuts (Ctrl+A for accessibility panel)
    if (enableAccessibilityShortcuts && isCtrlShortcut) {
      switch (event.key.toLowerCase()) {
        case 'a':
          event.preventDefault();
          // Trigger accessibility panel toggle
          const accessibilityButton = document.querySelector('[data-accessibility-trigger]') as HTMLButtonElement;
          if (accessibilityButton) {
            accessibilityButton.click();
          }
          break;
      }
    }
  }, [
    enableSectionNavigation,
    enableNumberShortcuts,
    enableHomeShortcut,
    enableAccessibilityShortcuts,
    navigationState,
    navigateNext,
    navigatePrevious,
    navigateToSection,
    sections,
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Return navigation state and helper functions
  return {
    navigationState,
    shortcuts: {
      sectionNavigation: enableSectionNavigation ? 'Use ← → arrow keys to navigate between sections' : null,
      numberShortcuts: enableNumberShortcuts ? 'Press 1-9 to jump to specific sections' : null,
      homeShortcut: enableHomeShortcut ? 'Press Home to return to introduction' : null,
      accessibilityShortcuts: enableAccessibilityShortcuts ? 'Press Ctrl+A to toggle accessibility panel' : null,
    },
    // Helper functions for programmatic navigation
    goToNext: navigationState.canGoNext ? navigateNext : null,
    goToPrevious: navigationState.canGoPrevious ? navigatePrevious : null,
    goToSection: navigateToSection,
    goHome: () => navigateToSection('introduction'),
  };
}