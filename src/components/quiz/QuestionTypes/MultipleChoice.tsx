"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { QuizQuestion } from "@/data/types";
import { useAccessibility } from "@/hooks/useAccessibility";
import { CheckCircle, Circle } from "lucide-react";

interface MultipleChoiceProps {
  question: QuizQuestion;
  answer?: string;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function MultipleChoice({ 
  question, 
  answer, 
  onAnswer, 
  disabled = false 
}: MultipleChoiceProps) {
  const { settings, getThemeClasses } = useAccessibility();

  if (!question.options) {
    return <div>Invalid multiple choice question: no options provided</div>;
  }

  return (
    <div className="space-y-6">
      {/* Question */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {question.question}
        </h3>
        {question.difficulty && (
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            question.difficulty === 'easy' 
              ? 'bg-green-100 text-green-700'
              : question.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          }`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        )}
      </div>

      {/* Visual Aid */}
      {question.visualAid && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <Image
            src={question.visualAid}
            alt="Question visual aid"
            width={600}
            height={400}
            className="max-w-full h-auto mx-auto rounded-md"
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const optionId = `option-${question.id}-${index}`;
          const isSelected = answer === option;
          
          return (
            <motion.label
              key={index}
              htmlFor={optionId}
              className={`block cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
              whileHover={!disabled ? { scale: 1.01 } : {}}
              whileTap={!disabled ? { scale: 0.99 } : {}}
            >
              <div
                className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-electric-500 bg-electric-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                } ${disabled ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center flex-1">
                  <div className="flex-shrink-0 mr-4">
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5 text-electric-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isSelected ? 'text-electric-900' : 'text-gray-900'
                    }`}>
                      {String.fromCharCode(65 + index)}. {option}
                    </div>
                  </div>
                </div>

                <input
                  type="radio"
                  id={optionId}
                  name={`question-${question.id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => !disabled && onAnswer(option)}
                  disabled={disabled}
                  className="sr-only"
                  aria-describedby={question.explanation ? `explanation-${question.id}` : undefined}
                />
              </div>
            </motion.label>
          );
        })}
      </div>

      {/* Keyboard Instructions */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
        <p>
          <strong>Keyboard navigation:</strong> Use arrow keys to navigate options, 
          Space or Enter to select.
        </p>
      </div>
    </div>
  );
}