"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { AccessibilitySettings, ThemeSettings } from "@/data/types";

interface AccessibilityContextType {
  accessibility: AccessibilitySettings;
  theme: ThemeSettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
}

const defaultAccessibility: AccessibilitySettings = {
  fontSize: "normal",
  fontFamily: "lexend",
  focusMode: false,
};

const defaultTheme: ThemeSettings = {
  colorScheme: "light",
  accentColor: "#0ea5e9",
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(
  null,
);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [accessibility, setAccessibility] =
    useState<AccessibilitySettings>(defaultAccessibility);
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAccessibility = localStorage.getItem("accessibility-settings");
    const savedTheme = localStorage.getItem("theme-settings");

    if (savedAccessibility) {
      try {
        setAccessibility(JSON.parse(savedAccessibility));
      } catch (error) {
        console.warn(
          "Failed to parse accessibility settings from localStorage",
        );
      }
    }

    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.warn("Failed to parse theme settings from localStorage");
      }
    }
  }, []);

  // Helper function to convert hex to RGB
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }, []);

  // Helper function to lighten color
  const lightenColor = useCallback((hex: string, percent: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const r = Math.min(255, rgb.r + (255 - rgb.r) * percent / 100);
    const g = Math.min(255, rgb.g + (255 - rgb.g) * percent / 100);
    const b = Math.min(255, rgb.b + (255 - rgb.b) * percent / 100);
    
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }, [hexToRgb]);

  // Helper function to darken color
  const darkenColor = useCallback((hex: string, percent: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const r = Math.max(0, rgb.r - rgb.r * percent / 100);
    const g = Math.max(0, rgb.g - rgb.g * percent / 100);
    const b = Math.max(0, rgb.b - rgb.b * percent / 100);
    
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }, [hexToRgb]);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Apply font family to body element
    const fontClasses = ['font-lexend', 'font-opendyslexic', 'font-dyslexie', 'font-atkinson'];
    fontClasses.forEach(cls => body.classList.remove(cls));
    body.classList.add(`font-${accessibility.fontFamily}`);

    // Apply font size using CSS variable
    const fontSizeMap = {
      small: "0.875rem",     // 14px
      normal: "1rem",        // 16px  
      large: "1.125rem",     // 18px
      "extra-large": "1.25rem", // 20px
    };
    root.style.setProperty('--base-font-size', fontSizeMap[accessibility.fontSize]);
    
    // Apply font family using CSS variable
    const fontFamilyMap = {
      lexend: "'Lexend', system-ui, sans-serif",
      opendyslexic: "'OpenDyslexic', system-ui, sans-serif", 
      dyslexie: "'Dyslexie', system-ui, sans-serif",
      atkinson: "'Atkinson Hyperlegible', system-ui, sans-serif"
    };
    root.style.setProperty('--base-font-family', fontFamilyMap[accessibility.fontFamily]);


    // Focus mode
    if (accessibility.focusMode) {
      body.classList.add("focus-mode");
    } else {
      body.classList.remove("focus-mode");
    }

    // Theme using data attribute with auto-detection
    if (theme.colorScheme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (theme.colorScheme === "auto") {
      // Auto-detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", "light");
    }

    // Set accent color CSS variables
    root.style.setProperty("--accent-color", theme.accentColor);
    
    // Calculate RGB values for the accent color
    const rgb = hexToRgb(theme.accentColor);
    if (rgb) {
      root.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      // Calculate lighter and darker variants
      root.style.setProperty("--accent-color-light", lightenColor(theme.accentColor, 20));
      root.style.setProperty("--accent-color-dark", darkenColor(theme.accentColor, 20));
    }
  }, [accessibility, theme, darkenColor, lightenColor, hexToRgb]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme.colorScheme !== "auto") return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.setAttribute("data-theme", e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.colorScheme]);


  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    const newSettings = { ...accessibility, ...settings };
    setAccessibility(newSettings);
    localStorage.setItem("accessibility-settings", JSON.stringify(newSettings));
  };

  const updateTheme = (settings: Partial<ThemeSettings>) => {
    const newSettings = { ...theme, ...settings };
    setTheme(newSettings);
    localStorage.setItem("theme-settings", JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setAccessibility(defaultAccessibility);
    setTheme(defaultTheme);
    localStorage.removeItem("accessibility-settings");
    localStorage.removeItem("theme-settings");
  };

  return (
    <AccessibilityContext.Provider
      value={{
        accessibility,
        theme,
        updateAccessibility,
        updateTheme,
        resetSettings,
      }}
      data-oid="f5nwbml"
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider",
    );
  }
  return context;
}
