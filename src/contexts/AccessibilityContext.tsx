"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
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
  highContrast: false,
  reducedMotion: false,
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

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Font family
    root.className = root.className.replace(
      /font-\w+/,
      `font-${accessibility.fontFamily}`,
    );

    // Font size
    const fontSizeMap = {
      small: "14px",
      normal: "16px",
      large: "18px",
      "extra-large": "20px",
    };
    root.style.fontSize = fontSizeMap[accessibility.fontSize];

    // High contrast
    if (accessibility.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Reduced motion
    if (accessibility.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Focus mode
    if (accessibility.focusMode) {
      root.classList.add("focus-mode");
    } else {
      root.classList.remove("focus-mode");
    }

    // Theme
    if (theme.colorScheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.style.setProperty("--accent-color", theme.accentColor);
  }, [accessibility, theme]);

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
