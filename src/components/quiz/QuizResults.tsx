"use client";

import { CheckCircle, XCircle, Clock, Target, Award, RotateCcw, ArrowRight, TrendingUp } from 'lucide-react';
import { Quiz, QuizSession } from '@/data/types';

interface QuizResultsProps {
  quiz: Quiz;
  session: QuizSession;
  onRetake?: () => void;
  onExit?: () => void;
  onContinue?: () => void;
}

export default function QuizResults({ quiz, session, onRetake, onExit, onContinue }: QuizResultsProps) {
  const score = session.score || 0;
  const passed = score >= quiz.passingScore;
  const totalQuestions = quiz.questions.length;
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  const timeSpent = session.timeSpent;
  const hintsUsed = session.hintsUsed.length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceMessage = () => {
    if (score >= 95) return "Outstanding! You've mastered this topic!";
    if (score >= 85) return "Excellent work! You have a strong understanding.";
    if (score >= 75) return "Good job! You're doing well with this material.";
    if (score >= 65) return "Not bad! Some areas need more practice.";
    if (score >= 50) return "You're getting there! Keep studying and try again.";
    return "Don't worry! Review the material and give it another try.";
  };

  const getDetailedFeedback = () => {
    const feedback = [];
    
    if (score >= quiz.passingScore) {
      feedback.push("✅ You've successfully passed this quiz!");
    } else {
      feedback.push(`❌ You need ${quiz.passingScore}% to pass. You scored ${score.toFixed(1)}%.`);
    }

    if (hintsUsed === 0) {
      feedback.push("🎯 Perfect! You didn't need any hints.");
    } else if (hintsUsed <= 2) {
      feedback.push("💡 Good problem-solving! You used hints wisely.");
    } else {
      feedback.push("💭 Consider reviewing the material to reduce hint dependency.");
    }

    // Time-based feedback
    const avgTimePerQuestion = timeSpent / totalQuestions;
    if (avgTimePerQuestion < 30) {
      feedback.push("⚡ Lightning fast! Make sure you're reading carefully.");
    } else if (avgTimePerQuestion > 120) {
      feedback.push("🐌 Take your time, but try to trust your first instincts more.");
    } else {
      feedback.push("⏱️ Good pacing! You took appropriate time to think.");
    }

    // Topic-based improvement suggestions
    const wrongTopics = quiz.questions
      .filter(question => {
        const userAnswer = session.answers[question.id];
        const isCorrect = Array.isArray(question.correctAnswer) 
          ? question.correctAnswer.includes(userAnswer)
          : userAnswer === question.correctAnswer;
        return !isCorrect;
      })
      .map(q => q.topic);

    if (wrongTopics.length > 0) {
      const uniqueTopics = [...new Set(wrongTopics)];
      if (uniqueTopics.length <= 2) {
        feedback.push(`📚 Focus on: ${uniqueTopics.join(', ')} for improvement.`);
      } else {
        feedback.push(`📚 Review the section material, focusing on key concepts.`);
      }
    }

    return feedback;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          {passed ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {passed ? 'Congratulations!' : 'Quiz Complete'}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {getPerformanceMessage()}
        </p>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
            {score.toFixed(1)}%
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            {correctAnswers} out of {totalQuestions} questions correct
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(timeSpent)}</div>
            </div>
            <div>
              <Target className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Accuracy</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{((correctAnswers / totalQuestions) * 100).toFixed(0)}%</div>
            </div>
            <div>
              <Award className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Hints Used</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{hintsUsed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Detailed Feedback
        </h3>
        {getDetailedFeedback().map((feedback, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl">{feedback.charAt(0)}</div>
            <p className="text-gray-700 dark:text-gray-300 flex-1">{feedback.substring(2)}</p>
          </div>
        ))}
      </div>

      {/* Question Breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Question Breakdown
        </h3>
        <div className="space-y-2">
          {quiz.questions.map((question, index) => {
            const userAnswer = session.answers[question.id];
            const isCorrect = Array.isArray(question.correctAnswer) 
              ? question.correctAnswer.includes(userAnswer)
              : userAnswer === question.correctAnswer;

            return (
              <div key={question.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Question {index + 1}: {question.question.substring(0, 60)}...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {question.difficulty} • {question.topic}
                  </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {question.points || 1} pt{(question.points || 1) > 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetake && (
          <button
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
        )}
        
        {onContinue && passed && (
          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Continue Learning
          </button>
        )}

        {onExit && (
          <button
            onClick={onExit}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Course
          </button>
        )}
      </div>

      {/* Progress Message */}
      {passed && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
            <Award className="w-5 h-5" />
            <span className="font-medium">Achievement Unlocked!</span>
          </div>
          <p className="text-green-700 dark:text-green-400 text-sm mt-1">
            You&apos;ve successfully completed &quot;{quiz.title}&quot; and can now progress to the next section.
          </p>
        </div>
      )}
    </div>
  );
}