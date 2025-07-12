"use client";

import { useState } from 'react';
import { Lightbulb, Info, Calculator, Zap } from 'lucide-react';
import { QuizQuestion } from '@/data/types';

interface QuestionRendererProps {
  question: QuizQuestion;
  answer: any;
  onAnswerChange: (answer: any) => void;
  onHintUsed?: () => void;
  showExplanation?: boolean;
  disabled?: boolean;
}

export default function QuestionRenderer({ 
  question, 
  answer, 
  onAnswerChange, 
  onHintUsed,
  showExplanation = false,
  disabled = false 
}: QuestionRendererProps) {
  const [showHint, setShowHint] = useState(false);

  const handleHintClick = () => {
    setShowHint(true);
    onHintUsed?.();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => !disabled && onAnswerChange(option)}
                disabled={disabled}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answer === option
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-sm'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    answer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answer === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="flex gap-4">
            {['True', 'False'].map((option) => (
              <button
                key={option}
                onClick={() => !disabled && onAnswerChange(option === 'True')}
                disabled={disabled}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  (answer === true && option === 'True') || (answer === false && option === 'False')
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-sm'}`}
              >
                <div className="text-center">
                  <div className={`text-2xl mb-2 ${
                    (answer === true && option === 'True') || (answer === false && option === 'False')
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400'
                  }`}>
                    {option === 'True' ? '✓' : '✗'}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {question.question.split('___').map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <input
                        type="text"
                        value={answer || ''}
                        onChange={(e) => !disabled && onAnswerChange(e.target.value)}
                        disabled={disabled}
                        className="mx-2 px-3 py-1 border-b-2 border-blue-500 bg-transparent focus:outline-none focus:border-blue-600 min-w-[120px] text-center font-medium"
                        placeholder="Your answer"
                      />
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>
        );

      case 'calculation':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">Calculation Required</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{question.question}</p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Answer:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      value={answer || ''}
                      onChange={(e) => !disabled && onAnswerChange(parseFloat(e.target.value) || '')}
                      disabled={disabled}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter your calculation result"
                    />
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {/* Unit could be extracted from question or metadata */}
                      (numeric value)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'drag-drop':
        // Simplified drag-drop for now - would need more complex implementation
        return (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">Drag and drop functionality coming soon...</p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              For now, please select from the options below:
            </div>
            {question.options && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !disabled && onAnswerChange(option)}
                    disabled={disabled}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      answer === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                    } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'circuit':
        // Circuit analysis questions - similar to multiple choice but with circuit context
        const circuitOptions = ['battery', 'resistor', 'switch', 'wire', 'led', 'capacitor', 'inductor'];
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-800 dark:text-blue-300">Circuit Analysis</span>
              </div>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Analyze the circuit and select the correct component or answer.
              </p>
            </div>
            
            {question.options ? (
              // Use provided options if available
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !disabled && onAnswerChange(option)}
                    disabled={disabled}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      answer === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                    } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-sm'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                        answer === option
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {answer === option && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Fallback to common circuit components
              <div className="grid grid-cols-2 gap-3">
                {circuitOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !disabled && onAnswerChange(option)}
                    disabled={disabled}
                    className={`p-3 rounded-lg border-2 transition-all capitalize ${
                      answer === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                    } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-gray-500 dark:text-gray-400">
            Question type &quot;{question.type}&quot; not yet implemented.
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
            {question.question}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            {question.points && question.points > 1 && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                {question.points} pts
              </span>
            )}
          </div>
        </div>

        {question.topic && (
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Topic: {question.topic}</span>
          </div>
        )}
      </div>

      {/* Visual aid */}
      {question.visualAid && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <img 
            src={question.visualAid} 
            alt="Question visual aid" 
            className="max-w-full h-auto rounded"
          />
        </div>
      )}

      {/* Question content */}
      <div className="space-y-4">
        {renderQuestionContent()}
      </div>

      {/* Hint section */}
      {question.hints && question.hints.length > 0 && (
        <div className="space-y-3">
          {!showHint && !disabled ? (
            <button
              onClick={handleHintClick}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              <Lightbulb className="w-4 h-4" />
              Need a hint?
            </button>
          ) : showHint && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Hint:</h4>
                  <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                    {question.hints[0]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Explanation (shown after answering if enabled) */}
      {showExplanation && question.explanation && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Explanation:</h4>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}