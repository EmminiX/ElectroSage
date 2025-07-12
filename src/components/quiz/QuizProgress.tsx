"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";

interface QuizProgressProps {
  current: number;
  total: number;
  answered: number;
}

export default function QuizProgress({ current, total, answered }: QuizProgressProps) {
  const { settings } = useAccessibility();
  const progressPercentage = (current / total) * 100;
  const answeredPercentage = (answered / total) * 100;

  return (
    <div className="flex items-center space-x-4">
      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-electric-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
          />
        </div>
        <span className="text-sm text-gray-600">
          {current}/{total}
        </span>
      </div>

      {/* Answered Indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Answered</span>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">
            {answered}/{total}
          </span>
        </div>
      </div>

      {/* Question Dots */}
      <div className="hidden sm:flex items-center space-x-1">
        {Array.from({ length: total }, (_, index) => {
          const questionNumber = index + 1;
          const isCurrent = questionNumber === current;
          const isAnswered = questionNumber <= answered;
          
          return (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                isCurrent
                  ? "bg-electric-600 ring-2 ring-electric-200"
                  : isAnswered
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: isCurrent ? 1.2 : 1,
                backgroundColor: isCurrent 
                  ? "var(--accent-color)" 
                  : isAnswered 
                    ? "#10b981" 
                    : "#d1d5db"
              }}
              transition={{ 
                duration: 0.2,
                ease: "easeOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}