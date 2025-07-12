"use client";

import { useState, useEffect } from 'react';
import { QuizQuestion, Quiz, QuizSession } from '@/data/types';
import { useProgress } from '@/contexts/ProgressContext';
import { getQuizForSection, comprehensiveQuizzes } from '@/data/sampleQuizzes';
import QuizInterface from './QuizInterface';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, Zap } from 'lucide-react';

interface QuizContainerProps {
  sectionId: string;
  questions?: QuizQuestion[];
  onComplete?: () => void;
  allowRetry?: boolean;
}

export default function QuizContainer({ 
  sectionId, 
  questions, 
  onComplete, 
  allowRetry = true 
}: QuizContainerProps) {
  const { updateQuizScore, getSectionProgress } = useProgress();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Try to get the comprehensive quiz for this section
    const sectionQuiz = getQuizForSection(sectionId);
    
    if (sectionQuiz) {
      setQuiz(sectionQuiz);
    } else if (questions && questions.length > 0) {
      // Create a fallback quiz from the provided questions
      const fallbackQuiz: Quiz = {
        id: `fallback-quiz-${sectionId}`,
        sectionId,
        title: `${sectionId} Quiz`,
        description: 'Test your understanding of this section',
        questions,
        timeLimit: Math.ceil(questions.length * 1.5), // 1.5 minutes per question
        passingScore: 70,
        allowRetake: allowRetry,
        showExplanations: true
      };
      setQuiz(fallbackQuiz);
    }
  }, [sectionId, questions, allowRetry]);

  const handleQuizComplete = (session: QuizSession) => {
    setCurrentSession(session);
    setQuizCompleted(true);

    // Update progress tracking
    if (session.score !== undefined) {
      updateQuizScore(sectionId, {
        score: session.score,
        totalQuestions: quiz?.questions.length || 0,
        timeSpent: session.timeSpent,
        completedAt: session.endTime || new Date(),
        answers: session.answers
      });

      // If they passed, update section progress
      if (session.score >= (quiz?.passingScore || 70)) {
        const currentProgress = getSectionProgress(sectionId);
        // Add 25% progress for passing the quiz (if not already at 100%)
        const newProgress = Math.min(100, currentProgress + 25);
        // Note: This would need to be implemented in ProgressContext
        // updateSectionProgress(sectionId, newProgress);
      }
    }

    // Don't call onComplete here - QuizInterface will handle showing results
    // and call completion when user exits results
  };

  const handleQuizExit = () => {
    // This will be called when user actually wants to exit the quiz
    onComplete?.();
  };

  const handleExit = () => {
    onComplete?.();
  };

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Quiz Header Info */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {quiz.description}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Trophy className="w-4 h-4" />
                <span>Passing Score: {quiz.passingScore}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm font-medium text-blue-900 dark:text-blue-300">Questions</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{quiz.questions.length}</div>
              </div>
            </div>

            {quiz.timeLimit && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="text-sm font-medium text-amber-900 dark:text-amber-300">Time Limit</div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{quiz.timeLimit} min</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm font-medium text-green-900 dark:text-green-300">Difficulty</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">Mixed</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-sm font-medium text-purple-900 dark:text-purple-300">Retakes</div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {quiz.allowRetake ? 'Allowed' : 'Not Allowed'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Interface */}
        <QuizInterface
          quiz={quiz}
          onComplete={handleQuizComplete}
          onExit={handleQuizExit}
        />
      </div>
    </motion.div>
  );
}