"use client";

import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '@/data/types';

const STORAGE_KEY = 'basic-electricity-tutor-progress';

const defaultProgress: UserProgress = {
  userId: 'local-user',
  completedSections: [],
  sectionProgress: {},
  currentSection: 'introduction',
  timeSpent: {},
  questionsAnswered: {},
  quizScores: {},
  achievements: [],
  masteryLevels: {},
  learningStreak: 0,
  lastActivity: new Date()
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.lastActivity = new Date(parsed.lastActivity);
        parsed.achievements = parsed.achievements.map((achievement: any) => ({
          ...achievement,
          earnedAt: new Date(achievement.earnedAt)
        }));
        setProgress(parsed);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  }, [progress, isLoading]);

  const updateCurrentSection = (sectionId: string) => {
    setProgress(prev => ({
      ...prev,
      currentSection: sectionId,
      lastActivity: new Date()
    }));
  };

  const markSectionCompleted = (sectionId: string) => {
    setProgress(prev => {
      if (prev.completedSections.includes(sectionId)) {
        return prev; // Already completed
      }
      
      return {
        ...prev,
        completedSections: [...prev.completedSections, sectionId],
        lastActivity: new Date()
      };
    });
  };

  const markSubsectionCompleted = (subsectionId: string) => {
    setProgress(prev => ({
      ...prev,
      questionsAnswered: {
        ...prev.questionsAnswered,
        [subsectionId]: true
      },
      lastActivity: new Date()
    }));
  };

  const addTimeSpent = (sectionId: string, timeInSeconds: number) => {
    setProgress(prev => ({
      ...prev,
      timeSpent: {
        ...prev.timeSpent,
        [sectionId]: (prev.timeSpent[sectionId] || 0) + timeInSeconds
      },
      lastActivity: new Date()
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getCompletionPercentage = (totalSections: number) => {
    return Math.round((progress.completedSections.length / totalSections) * 100);
  };

  const getTotalTimeSpent = () => {
    return Object.values(progress.timeSpent).reduce((total, time) => total + time, 0);
  };

  const getSectionTimeSpent = (sectionId: string) => {
    return progress.timeSpent[sectionId] || 0;
  };

  const isSectionCompleted = (sectionId: string) => {
    return progress.completedSections.includes(sectionId);
  };

  const isSubsectionCompleted = (subsectionId: string) => {
    return progress.questionsAnswered[subsectionId] || false;
  };

  return {
    progress,
    isLoading,
    updateCurrentSection,
    markSectionCompleted,
    markSubsectionCompleted,
    addTimeSpent,
    resetProgress,
    getCompletionPercentage,
    getTotalTimeSpent,
    getSectionTimeSpent,
    isSectionCompleted,
    isSubsectionCompleted
  };
}
