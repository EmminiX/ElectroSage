"use client";

import React from 'react';
import { Circle, CheckCircle, Clock, Target } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressIndicatorProps {
  sectionId: string;
  size?: ProgressSize;
  showLabel?: boolean;
  showTimeSpent?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-6 h-6',
    text: 'text-xs',
    icon: 'w-6 h-6',
    strokeWidth: 2
  },
  md: {
    container: 'w-8 h-8',
    text: 'text-sm',
    icon: 'w-8 h-8',
    strokeWidth: 2
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-base',
    icon: 'w-12 h-12',
    strokeWidth: 3
  }
};

export default function ProgressIndicator({
  sectionId,
  size = 'md',
  showLabel = false,
  showTimeSpent = false,
  className = ''
}: ProgressIndicatorProps) {
  const { progress, getSectionProgress } = useProgress();
  
  const completionPercentage = getSectionProgress(sectionId);
  const timeSpent = progress.timeSpent[sectionId] || 0;
  const config = sizeConfig[size];
  
  const isCompleted = progress.completedSections.includes(sectionId);
  const isStarted = completionPercentage > 0;
  const subsectionProgress = progress.subsectionProgress?.[sectionId] || {};
  const totalSubsections = Object.keys(subsectionProgress).length;
  const completedSubsections = Object.values(subsectionProgress).filter(Boolean).length;

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return `<1m`;
    if (minutes < 60) return `${Math.floor(minutes)}m`;
    return `${Math.floor(minutes / 60)}h ${Math.floor(minutes % 60)}m`;
  };

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600 dark:text-green-400';
    if (isStarted) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-400 dark:text-gray-500';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isStarted) return `${Math.round(completionPercentage)}% complete`;
    return 'Not started';
  };

  const renderProgressCircle = () => {
    if (isCompleted) {
      return (
        <CheckCircle 
          className={`${config.icon} text-green-600 dark:text-green-400`}
          aria-hidden="true"
        />
      );
    }

    if (!isStarted) {
      return (
        <Circle 
          className={`${config.icon} text-gray-400 dark:text-gray-500`}
          aria-hidden="true"
        />
      );
    }

    // Partial progress circle
    const circumference = 2 * Math.PI * 14; // radius of 14 for consistent sizing
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

    return (
      <div className={`${config.container} relative`}>
        <svg 
          className={`${config.container} transform -rotate-90`}
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-blue-600 dark:text-blue-400 transition-all duration-500"
          />
        </svg>
        {size !== 'sm' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${config.text} font-medium text-blue-600 dark:text-blue-400`}>
              {Math.round(completionPercentage)}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="flex-shrink-0"
        role="img"
        aria-label={`Progress: ${getStatusText()}`}
      >
        {renderProgressCircle()}
      </div>
      
      {(showLabel || showTimeSpent) && (
        <div className="flex-1 min-w-0">
          {showLabel && (
            <div className={`${config.text} font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          )}
          
          {showTimeSpent && timeSpent > 0 && (
            <div className={`${config.text} text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1`}>
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>{formatTime(timeSpent)}</span>
            </div>
          )}
          
          {showLabel && totalSubsections > 1 && (
            <div className={`${config.text} text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1`}>
              <Target className="w-3 h-3" aria-hidden="true" />
              <span>
                {completedSubsections} of {totalSubsections} subsections
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}