"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import { QuizQuestion } from "@/data/types";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Calculator, CheckCircle, AlertCircle } from "lucide-react";

interface CalculationProps {
  question: QuizQuestion;
  answer?: number;
  onAnswer: (answer: number) => void;
  disabled?: boolean;
}

export default function Calculation({ 
  question, 
  answer, 
  onAnswer, 
  disabled = false 
}: CalculationProps) {
  const { settings, getThemeClasses } = useAccessibility();
  const [inputValue, setInputValue] = useState(answer?.toString() || '');
  const [isValid, setIsValid] = useState(true);
  const [unit, setUnit] = useState('');

  // Extract unit from question if present
  useEffect(() => {
    const unitMatch = question.question.match(/\(([^)]+)\)$/);
    if (unitMatch) {
      setUnit(unitMatch[1]);
    }
  }, [question.question]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Validate input
    const numericValue = parseFloat(value);
    if (value === '' || isNaN(numericValue)) {
      setIsValid(false);
      return;
    }
    
    setIsValid(true);
    onAnswer(numericValue);
  };

  const formatNumber = (num: number): string => {
    // Handle scientific notation for very large or small numbers
    if (Math.abs(num) >= 1000000 || (Math.abs(num) < 0.001 && num !== 0)) {
      return num.toExponential(3);
    }
    // Handle decimal numbers
    if (num % 1 !== 0) {
      return num.toFixed(3);
    }
    return num.toString();
  };

  const tolerance = 0.01; // 1% tolerance for floating point calculations
  const correctAnswer = Number(question.correctAnswer);
  const userAnswer = Number(inputValue);
  const isAnswerClose = Math.abs(userAnswer - correctAnswer) / Math.abs(correctAnswer) <= tolerance;

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

      {/* Calculator Input */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Calculator className="w-5 h-5 text-electric-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-900">
            Enter your calculation result
          </h4>
        </div>

        <div className="space-y-4">
          {/* Input Field */}
          <div className="relative">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={disabled}
              placeholder="Enter your answer..."
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-electric-500 ${
                !isValid
                  ? 'border-red-300 bg-red-50 text-red-900'
                  : inputValue && isAnswerClose
                    ? 'border-green-300 bg-green-50 text-green-900'
                    : 'border-gray-300 bg-white text-gray-900'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              step="any"
              aria-describedby="calculation-help"
            />
            
            {unit && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                {unit}
              </div>
            )}
          </div>

          {/* Validation Feedback */}
          {inputValue && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center space-x-2 text-sm ${
                !isValid
                  ? 'text-red-600'
                  : isAnswerClose
                    ? 'text-green-600'
                    : 'text-amber-600'
              }`}
            >
              {!isValid ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Please enter a valid number</span>
                </>
              ) : isAnswerClose ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Answer looks correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Double-check your calculation</span>
                </>
              )}
            </motion.div>
          )}

          {/* Help Text */}
          <div id="calculation-help" className="text-sm text-gray-500">
            <p className="mb-2">
              <strong>Tips:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use decimal notation for fractional results (e.g., 3.14)</li>
              <li>Scientific notation is accepted (e.g., 1.5e-3)</li>
              <li>Round your answer to 3 decimal places if needed</li>
              {unit && <li>Answer should be in {unit}</li>}
            </ul>
          </div>

          {/* Quick Reference Formulas */}
          {question.topic && question.topic.toLowerCase().includes('ohm') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-2">Quick Reference</h5>
              <div className="text-sm text-blue-800 space-y-1">
                <div><strong>Ohm&apos;s Law:</strong> V = I × R</div>
                <div><strong>Power:</strong> P = V × I = I²R = V²/R</div>
                <div><strong>Where:</strong> V = Voltage (V), I = Current (A), R = Resistance (Ω), P = Power (W)</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Answer Display */}
      {answer !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-electric-50 border border-electric-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-electric-600 mr-2" />
            <span className="text-sm font-medium text-electric-800">
              Your answer: {formatNumber(answer)} {unit}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}