"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserProgress, Achievement } from "@/data/types";

interface ProgressContextType {
  progress: UserProgress;
  updateSectionProgress: (sectionId: string, completed: boolean) => void;
  updateTimeSpent: (sectionId: string, minutes: number) => void;
  markQuestionAnswered: (questionId: string, correct: boolean) => void;
  addAchievement: (achievement: Achievement) => void;
  getOverallProgress: () => number;
  getSectionProgress: (sectionId: string) => number;
  resetProgress: () => void;
}

const defaultProgress: UserProgress = {
  userId: "anonymous",
  completedSections: [],
  currentSection: "introduction",
  timeSpent: {},
  questionsAnswered: {},
  achievements: [],
  lastActivity: new Date(),
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("learning-progress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // Convert date strings back to Date objects
        parsed.lastActivity = new Date(parsed.lastActivity);
        parsed.achievements = parsed.achievements.map((ach: any) => ({
          ...ach,
          earnedAt: new Date(ach.earnedAt),
        }));
        setProgress(parsed);
      } catch (error) {
        console.warn("Failed to parse progress from localStorage");
      }
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("learning-progress", JSON.stringify(progress));
  }, [progress]);

  const updateSectionProgress = (sectionId: string, completed: boolean) => {
    setProgress((prev) => {
      const newCompleted = completed
        ? [...new Set([...prev.completedSections, sectionId])]
        : prev.completedSections.filter((id) => id !== sectionId);

      return {
        ...prev,
        completedSections: newCompleted,
        currentSection: sectionId,
        lastActivity: new Date(),
      };
    });
  };

  const updateTimeSpent = (sectionId: string, minutes: number) => {
    setProgress((prev) => ({
      ...prev,
      timeSpent: {
        ...prev.timeSpent,
        [sectionId]: (prev.timeSpent[sectionId] || 0) + minutes,
      },
      lastActivity: new Date(),
    }));
  };

  const markQuestionAnswered = (questionId: string, correct: boolean) => {
    setProgress((prev) => ({
      ...prev,
      questionsAnswered: {
        ...prev.questionsAnswered,
        [questionId]: correct,
      },
      lastActivity: new Date(),
    }));
  };

  const addAchievement = (achievement: Achievement) => {
    setProgress((prev) => {
      const exists = prev.achievements.some((ach) => ach.id === achievement.id);
      if (exists) return prev;

      return {
        ...prev,
        achievements: [...prev.achievements, achievement],
        lastActivity: new Date(),
      };
    });
  };

  const getOverallProgress = (): number => {
    // Total sections plus introduction
    const totalSections = 9; // 8 main sections + introduction
    return Math.round(
      (progress.completedSections.length / totalSections) * 100,
    );
  };

  const getSectionProgress = (sectionId: string): number => {
    return progress.completedSections.includes(sectionId) ? 100 : 0;
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem("learning-progress");
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateSectionProgress,
        updateTimeSpent,
        markQuestionAnswered,
        addAchievement,
        getOverallProgress,
        getSectionProgress,
        resetProgress,
      }}
      data-oid="1.jxbae"
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}
