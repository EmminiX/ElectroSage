"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { UserProgress, Achievement, QuizResult, MasteryLevel } from "@/data/types";
import { useContent } from "@/contexts/ContentContext";

interface ProgressContextType {
  progress: UserProgress;
  updateSectionProgress: (sectionId: string, progressPercent: number) => void;
  updateSubsectionProgress: (sectionId: string, subsectionId: string, completed: boolean) => void;
  updateTimeSpent: (sectionId: string, minutes: number) => void;
  markQuestionAnswered: (questionId: string, correct: boolean) => void;
  recordQuizResult: (sectionId: string, result: QuizResult) => void;
  updateQuizScore: (sectionId: string, result: QuizResult) => void;
  updateMasteryLevel: (sectionId: string, level: MasteryLevel) => void;
  addAchievement: (achievement: Achievement) => void;
  getOverallProgress: () => number;
  getSectionProgress: (sectionId: string) => number;
  calculateSectionMastery: (sectionId: string) => MasteryLevel;
  resetProgress: () => void;
}

const defaultProgress: UserProgress = {
  userId: "anonymous",
  completedSections: [],
  sectionProgress: {},
  currentSection: "introduction",
  timeSpent: {},
  questionsAnswered: {},
  quizScores: {},
  achievements: [],
  masteryLevels: {},
  learningStreak: 0,
  lastActivity: new Date(),
  subsectionProgress: {},
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const { sections } = useContent();

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("learning-progress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // Convert date strings back to Date objects
        parsed.lastActivity = new Date(parsed.lastActivity);
        parsed.achievements = parsed.achievements?.map((ach: any) => ({
          ...ach,
          earnedAt: new Date(ach.earnedAt),
        })) || [];
        
        // Handle quiz scores date conversion
        Object.keys(parsed.quizScores || {}).forEach(key => {
          if (parsed.quizScores[key]?.completedAt) {
            parsed.quizScores[key].completedAt = new Date(parsed.quizScores[key].completedAt);
          }
        });
        
        // Ensure all new fields exist with defaults
        const migratedProgress: UserProgress = {
          ...defaultProgress,
          ...parsed,
          sectionProgress: parsed.sectionProgress || {},
          quizScores: parsed.quizScores || {},
          masteryLevels: parsed.masteryLevels || {},
          learningStreak: parsed.learningStreak || 0,
        };
        
        setProgress(migratedProgress);
      } catch (error) {
        console.warn("Failed to parse progress from localStorage", error);
      }
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("learning-progress", JSON.stringify(progress));
  }, [progress]);

  // Helper to validate progress values
  const validateProgress = (progress: number): number => {
    return Math.round(Math.max(0, Math.min(100, progress)));
  };

  // Update section progress with validation and completion logic
  const updateSectionProgress = useCallback((sectionId: string, progressPercent: number) => {
    setProgress((prev) => {
      const validated = validateProgress(progressPercent);
      const newSectionProgress = { ...prev.sectionProgress, [sectionId]: validated };
      // Only mark as completed if progress is exactly 100%
      const isCompleted = validated >= 100;
      const newCompleted = isCompleted
        ? [...new Set([...prev.completedSections, sectionId])]
        : prev.completedSections.filter((id) => id !== sectionId);
      return {
        ...prev,
        sectionProgress: newSectionProgress,
        completedSections: newCompleted,
        currentSection: sectionId,
        lastActivity: new Date(),
      };
    });
  }, []);

  // Update subsection progress and recalculate section progress
  const updateSubsectionProgress = useCallback((sectionId: string, subsectionId: string, completed: boolean) => {
    setProgress((prev) => {
      const subsectionKey = `${sectionId}.${subsectionId}`;
      const newSubsectionProgress = {
        ...prev.subsectionProgress,
        [subsectionKey]: completed
      };
      // Find all subsections for this section
      const sectionSubsections = sections.find(s => s.id === sectionId)?.subsections || [];
      const completedSubsections = sectionSubsections.filter(sub =>
        newSubsectionProgress[`${sectionId}.${sub.id}`]
      ).length;
      const sectionProgress = sectionSubsections.length > 0
        ? Math.round((completedSubsections / sectionSubsections.length) * 100)
        : 0;
      return {
        ...prev,
        subsectionProgress: newSubsectionProgress,
        sectionProgress: { ...prev.sectionProgress, [sectionId]: sectionProgress },
        // Only mark as completed if sectionProgress is 100%
        completedSections: sectionProgress >= 100
          ? [...new Set([...prev.completedSections, sectionId])]
          : prev.completedSections.filter((id) => id !== sectionId),
        lastActivity: new Date(),
      };
    });
  }, [sections]);

  const recordQuizResult = useCallback((sectionId: string, result: QuizResult) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: { ...prev.quizScores, [sectionId]: result },
      lastActivity: new Date(),
    }));
  }, []);

  // Alias for updateQuizScore (same functionality as recordQuizResult)
  const updateQuizScore = useCallback((sectionId: string, result: QuizResult) => {
    recordQuizResult(sectionId, result);
  }, [recordQuizResult]);

  const updateMasteryLevel = useCallback((sectionId: string, level: MasteryLevel) => {
    setProgress((prev) => ({
      ...prev,
      masteryLevels: { ...prev.masteryLevels, [sectionId]: level },
      lastActivity: new Date(),
    }));
  }, []);

  const updateTimeSpent = useCallback((sectionId: string, minutes: number) => {
    setProgress((prev) => ({
      ...prev,
      timeSpent: {
        ...prev.timeSpent,
        [sectionId]: (prev.timeSpent[sectionId] || 0) + minutes,
      },
      lastActivity: new Date(),
    }));
  }, []);

  const markQuestionAnswered = useCallback((questionId: string, correct: boolean) => {
    setProgress((prev) => ({
      ...prev,
      questionsAnswered: {
        ...prev.questionsAnswered,
        [questionId]: correct,
      },
      lastActivity: new Date(),
    }));
  }, []);

  const addAchievement = useCallback((achievement: Achievement) => {
    setProgress((prev) => {
      const exists = prev.achievements.some((ach) => ach.id === achievement.id);
      if (exists) return prev;

      return {
        ...prev,
        achievements: [...prev.achievements, achievement],
        lastActivity: new Date(),
      };
    });
  }, []);

  // Calculate overall progress using all sections
  const getOverallProgress = useCallback((): number => {
    if (sections.length === 0) return 0;
    const totalSections = sections.length;
    const completedSections = progress.completedSections.length;
    // Sum partial progress for incomplete sections
    const partialProgress = Object.entries(progress.sectionProgress)
      .filter(([sectionId]) => !progress.completedSections.includes(sectionId))
      .reduce((sum, [_, prog]) => sum + prog, 0);
    const totalProgress = (completedSections * 100 + partialProgress) / totalSections;
    return Math.min(Math.round(totalProgress), 100);
  }, [progress.completedSections, progress.sectionProgress, sections.length]);

  const getSectionProgress = useCallback((sectionId: string): number => {
    return Math.round(progress.sectionProgress[sectionId] || 0);
  }, [progress.sectionProgress]);

  const calculateSectionMastery = useCallback((sectionId: string): MasteryLevel => {
    const sectionProgress = progress.sectionProgress[sectionId] || 0;
    const quizScore = progress.quizScores[sectionId];
    const timeSpent = progress.timeSpent[sectionId] || 0;
    
    // Calculate mastery based on multiple factors
    let masteryScore = 0;
    
    // Progress weight: 40%
    masteryScore += (sectionProgress / 100) * 0.4;
    
    // Quiz performance weight: 40%
    if (quizScore) {
      masteryScore += (quizScore.score / quizScore.totalQuestions) * 0.4;
    }
    
    // Time engagement weight: 20% (more time = better understanding, up to a point)
    const optimalTime = 30; // minutes
    const timeRatio = Math.min(timeSpent / optimalTime, 1);
    masteryScore += timeRatio * 0.2;
    
    // Determine mastery level
    if (masteryScore >= 0.9) return 'expert';
    if (masteryScore >= 0.75) return 'advanced';
    if (masteryScore >= 0.5) return 'intermediate';
    return 'beginner';
  }, [progress.sectionProgress, progress.quizScores, progress.timeSpent]);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem("learning-progress");
  }, []);

  const contextValue = useMemo(
    () => ({
      progress,
      updateSectionProgress,
      updateSubsectionProgress,
      updateTimeSpent,
      markQuestionAnswered,
      recordQuizResult,
      updateQuizScore,
      updateMasteryLevel,
      addAchievement,
      getOverallProgress,
      getSectionProgress,
      calculateSectionMastery,
      resetProgress,
    }),
    [progress, updateSectionProgress, updateSubsectionProgress, updateTimeSpent, markQuestionAnswered, recordQuizResult, updateQuizScore, updateMasteryLevel, addAchievement, getOverallProgress, getSectionProgress, calculateSectionMastery, resetProgress]
  );

  return (
    <ProgressContext.Provider value={contextValue} data-oid="1.jxbae">
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
