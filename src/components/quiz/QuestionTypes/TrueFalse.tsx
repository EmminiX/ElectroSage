"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { QuizQuestion } from "@/data/types";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Check, X, CheckCircle, XCircle } from "lucide-react";

interface TrueFalseProps {
  question: QuizQuestion;
  answer?: boolean;
  onAnswer: (answer: boolean) => void;
  disabled?: boolean;
}

export default function TrueFalse({ 
  question, 
  answer, 
  onAnswer, 
  disabled = false 
}: TrueFalseProps) {
  const { settings, getThemeClasses } = useAccessibility();

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

      {/* True/False Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* True Option */}
        <motion.button
          onClick={() => !disabled && onAnswer(true)}
          disabled={disabled}
          className={`p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-500 ${
            answer === true
              ? 'border-green-500 bg-green-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          aria-pressed={answer === true}
          aria-label="Select True"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              answer === true
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {answer === true ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Check className="w-6 h-6" />
              )}
            </div>
            <div className={`text-lg font-semibold ${
              answer === true ? 'text-green-700' : 'text-gray-700'
            }`}>
              True
            </div>
            <div className="text-sm text-gray-500 text-center">
              The statement is correct
            </div>
          </div>
        </motion.button>

        {/* False Option */}
        <motion.button
          onClick={() => !disabled && onAnswer(false)}
          disabled={disabled}
          className={`p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-500 ${
            answer === false
              ? 'border-red-500 bg-red-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          aria-pressed={answer === false}
          aria-label="Select False"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              answer === false
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {answer === false ? (
                <XCircle className="w-6 h-6" />
              ) : (
                <X className="w-6 h-6" />
              )}
            </div>
            <div className={`text-lg font-semibold ${
              answer === false ? 'text-red-700' : 'text-gray-700'
            }`}>
              False
            </div>
            <div className="text-sm text-gray-500 text-center">
              The statement is incorrect
            </div>
          </div>
        </motion.button>
      </div>

      {/* Keyboard Instructions */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
        <p>
          <strong>Keyboard navigation:</strong> Use Tab to navigate between True/False options, 
          Space or Enter to select.
        </p>
      </div>

      {/* Selected Answer Indicator */}
      {answer !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border ${
            answer 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center">
            {answer ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm font-medium">
              You selected: {answer ? 'True' : 'False'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}