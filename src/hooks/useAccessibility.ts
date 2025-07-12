"use client";

import { useState, useEffect } from 'react';
import { AccessibilitySettings, ThemeSettings } from '@/data/types';

const STORAGE_KEY = 'basic-electricity-tutor-accessibility';

const defaultSettings: AccessibilitySettings & ThemeSettings = {
  fontSize: 'normal',
  fontFamily: 'lexend',
  focusMode: false,
  colorScheme: 'light',
  accentColor: '#0066FF'
};

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings & ThemeSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save accessibility settings:', error);
      }
    }
  }, [settings, isLoading]);

  // Apply settings to document root for CSS custom properties
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Font size
      const fontSizeMap = {
        'small': '14px',
        'normal': '16px',
        'large': '18px',
        'extra-large': '20px'
      };
      root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize]);
      
      // Font family
      const fontFamilyMap = {
        'lexend': '"Lexend", system-ui, sans-serif',
        'opendyslexic': '"OpenDyslexic", system-ui, sans-serif',
        'dyslexie': '"Dyslexie", system-ui, sans-serif',
        'atkinson': '"Atkinson Hyperlegible", system-ui, sans-serif'
      };
      root.style.setProperty('--base-font-family', fontFamilyMap[settings.fontFamily]);
      
      // Color scheme
      root.setAttribute('data-theme', settings.colorScheme);
      
      
      // Focus mode
      if (settings.focusMode) {
        root.classList.add('focus-mode');
      } else {
        root.classList.remove('focus-mode');
      }
      
      // Accent color
      root.style.setProperty('--accent-color', settings.accentColor);
      root.style.setProperty('--focus-color', settings.accentColor);
      
      // Convert hex to RGB for CSS custom properties
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };
      
      const rgb = hexToRgb(settings.accentColor);
      if (rgb) {
        root.style.setProperty('--accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        
        // Generate lighter and darker variants
        const lighten = (r: number, g: number, b: number, amount: number) => {
          const newR = Math.min(255, Math.round(r + (255 - r) * amount));
          const newG = Math.min(255, Math.round(g + (255 - g) * amount));
          const newB = Math.min(255, Math.round(b + (255 - b) * amount));
          return `rgb(${newR}, ${newG}, ${newB})`;
        };
        
        const darken = (r: number, g: number, b: number, amount: number) => {
          const newR = Math.max(0, Math.round(r * (1 - amount)));
          const newG = Math.max(0, Math.round(g * (1 - amount)));
          const newB = Math.max(0, Math.round(b * (1 - amount)));
          return `rgb(${newR}, ${newG}, ${newB})`;
        };
        
        root.style.setProperty('--accent-color-light', lighten(rgb.r, rgb.g, rgb.b, 0.2));
        root.style.setProperty('--accent-color-dark', darken(rgb.r, rgb.g, rgb.b, 0.2));
      }
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings & ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const getFontSizeClass = () => {
    const sizeMap = {
      'small': 'text-sm',
      'normal': 'text-base',
      'large': 'text-lg',
      'extra-large': 'text-xl'
    };
    return sizeMap[settings.fontSize];
  };

  const getFontFamilyClass = () => {
    const familyMap = {
      'lexend': 'font-lexend',
      'opendyslexic': 'font-opendyslexic',
      'dyslexie': 'font-dyslexie',
      'atkinson': 'font-atkinson'
    };
    return familyMap[settings.fontFamily];
  };

  const getThemeClasses = () => {
    const classes = [getFontSizeClass(), getFontFamilyClass()];
    
    if (settings.focusMode) classes.push('focus-mode');
    
    return classes.join(' ');
  };

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + A for accessibility panel
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        // This will be handled by the parent component
        window.dispatchEvent(new CustomEvent('toggle-accessibility-panel'));
      }
      
      // F for focus mode toggle
      if (event.key === 'f' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const activeElement = document.activeElement;
        // Only trigger if not in an input field
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          event.preventDefault();
          updateSettings({ focusMode: !settings.focusMode });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.focusMode]);

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
    getFontSizeClass,
    getFontFamilyClass,
    getThemeClasses
  };
}
