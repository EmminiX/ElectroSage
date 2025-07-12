"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for element to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "hover" | "none";
  optional?: boolean;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  isCompleted: boolean;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  skipTour: () => void;
  restartTour: () => void;
  goToStep: (stepIndex: number) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to ElectroSage Academy! 🎓",
    content: "Let's take a quick tour to show you all the amazing features that will help you master electrical engineering. This will only take 2 minutes!",
    target: "body",
    position: "center"
  },
  {
    id: "navigation",
    title: "Course Navigation 📚",
    content: "Use this sidebar to navigate between the 8 course sections. Each section builds on the previous one, from atomic structure to advanced circuits.",
    target: "[data-tour='navigation-sidebar']",
    position: "right"
  },
  {
    id: "podcast",
    title: "Educational Podcasts 🎧",
    content: "Access our podcast collection! Each section has a dedicated episode with in-depth discussions and real-world applications.",
    target: "[data-tour='podcast-button']",
    position: "bottom",
    action: "click"
  },
  {
    id: "content",
    title: "Interactive Learning Content 📖",
    content: "This is where you'll read course material, interact with 14 different visualizations, and test your knowledge with quizzes.",
    target: "[data-tour='content-area']",
    position: "left"
  },
  {
    id: "visualizations",
    title: "Interactive Visualizations ⚡",
    content: "Each section includes interactive visualizations to help you understand electrical concepts. When available, use the dropdown menu to explore different animations!",
    target: "[data-tour='visualization-header']",
    position: "bottom"
  },
  {
    id: "ai-chat",
    title: "ElectroSage AI Tutor 🤖",
    content: "Meet your AI tutor! Ask questions and get guided through problems using the Socratic method. ElectroSage helps you discover answers rather than just giving them.",
    target: "[data-tour='chat-interface']",
    position: "left"
  },
  {
    id: "progress",
    title: "Progress Tracking 📊",
    content: "Your learning progress is tracked automatically. See your overall completion percentage and section-specific progress here.",
    target: "[data-tour='progress-indicator']",
    position: "bottom"
  },
  {
    id: "accessibility",
    title: "Accessibility Features ♿",
    content: "We care about inclusive learning! Click here to access font options, contrast settings, and other accessibility features.",
    target: "[data-tour='accessibility-button']",
    position: "left"
  },
  {
    id: "about",
    title: "Need Help? 💡",
    content: "Visit the About page for detailed guides on how to use the platform, keyboard shortcuts, FAQ, and tips for optimal learning.",
    target: "[data-tour='about-button']",
    position: "bottom"
  },
  {
    id: "resources",
    title: "External Learning Resources 🌐",
    content: "Expand your knowledge with our curated collection of external resources! Find reference materials, online calculators, circuit simulators, and educational videos from trusted sources.",
    target: "[data-tour='resources-button']",
    position: "bottom",
    action: "click"
  },
  {
    id: "completion",
    title: "You're All Set! 🚀",
    content: "That's it! You're ready to start your electrical engineering journey. Remember: engage with ElectroSage AI, explore visualizations, and don't hesitate to ask questions. Happy learning!",
    target: "body",
    position: "center"
  }
];

interface TourProviderProps {
  children: ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check if user has completed the tour before
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("electrosage-tour-completed");
    setIsCompleted(hasCompletedTour === "true");
  }, []);

  // Auto-start tour for first-time users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("electrosage-tour-seen");
    if (!hasSeenTour && !isCompleted) {
      // Start tour after a brief delay for page to load
      const timer = setTimeout(() => {
        startTour();
        localStorage.setItem("electrosage-tour-seen", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    setIsCompleted(true);
    localStorage.setItem("electrosage-tour-completed", "true");
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const skipTour = () => {
    endTour();
  };

  const restartTour = () => {
    setIsCompleted(false);
    localStorage.removeItem("electrosage-tour-completed");
    startTour();
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < tourSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps: tourSteps,
        isCompleted,
        startTour,
        endTour,
        nextStep,
        previousStep,
        skipStep,
        skipTour,
        restartTour,
        goToStep,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}