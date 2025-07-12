"use client";

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Lightbulb, Clock, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Quiz, QuizQuestion, QuizSession } from '@/data/types';
import { useProgress } from '@/contexts/ProgressContext';
import QuestionRenderer from './QuestionRenderer';
import QuizResults from './QuizResults';

interface QuizInterfaceProps {
  quiz: Quiz;
  onComplete: (session: QuizSession) => void;
  onExit?: () => void;
}

export default function QuizInterface({ quiz, onComplete, onExit }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [hintsUsed, setHintsUsed] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const [session, setSession] = useState<QuizSession>({
    id: `quiz-${Date.now()}`,
    quizId: quiz.id,
    userId: 'current-user',
    startTime: new Date(),
    answers: {},
    timeSpent: 0,
    completed: false,
    hintsUsed: []
  });
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const hasAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;

  // Timer effect
  useEffect(() => {
    if (!timeRemaining || showResults) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, showResults]);

  // Update time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setSession(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAnswerChange = useCallback((questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const handleHintUsed = useCallback((questionId: string) => {
    setHintsUsed(prev => {
      if (!prev.includes(questionId)) {
        return [...prev, questionId];
      }
      return prev;
    });
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = useCallback(() => {
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const points = question.points || 1;
      totalPoints += points;

      if (userAnswer !== undefined) {
        let isCorrect = false;
        
        if (Array.isArray(question.correctAnswer)) {
          if (Array.isArray(userAnswer)) {
            isCorrect = question.correctAnswer.every(ans => userAnswer.includes(ans)) &&
                       userAnswer.every(ans => (question.correctAnswer as string[]).includes(ans));
          } else {
            isCorrect = question.correctAnswer.includes(userAnswer);
          }
        } else {
          isCorrect = userAnswer === question.correctAnswer;
        }
        
        if (isCorrect) {
          correct++;
          earnedPoints += points;
        }
      }
    });

    return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  }, [quiz.questions, answers]);

  const handleQuizComplete = useCallback(() => {
    const score = calculateScore();
    const completedSession: QuizSession = {
      ...session,
      endTime: new Date(),
      answers,
      score,
      completed: true,
      hintsUsed
    };
    
    setSession(completedSession);
    setShowResults(true);
    // Notify parent for progress tracking but don't trigger exit
    onComplete(completedSession);
  }, [answers, hintsUsed, session, onComplete, calculateScore]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setHintsUsed([]);
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : null);
    setSession({
      id: `quiz-${Date.now()}`,
      quizId: quiz.id,
      userId: 'current-user',
      startTime: new Date(),
      answers: {},
      timeSpent: 0,
      completed: false,
      hintsUsed: []
    });
    setShowResults(false);
  };

  if (showResults) {
    return (
      <QuizResults 
        quiz={quiz}
        session={session}
        onRetake={quiz.allowRetake ? handleRetake : undefined}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h2>
          <div className="flex items-center gap-4">
            {timeRemaining && (
              <div className={`flex items-center gap-1 ${timeRemaining <= 60 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
            )}
            {onExit && (
              <button
                onClick={onExit}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Exit quiz"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {quiz.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">{quiz.description}</p>
        )}
      </div>

      {/* Question */}
      <div className="mb-8">
        <QuestionRenderer
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          onHintUsed={() => handleHintUsed(currentQuestion.id)}
          showExplanation={false}
          disabled={false}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {/* Question navigation dots */}
          <div className="flex gap-1">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : answers[quiz.questions[index].id] !== undefined
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={handleNext}
          disabled={!hasAnswered}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Complete Quiz' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quiz info footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Time spent: {formatTime(session.timeSpent)}</span>
          <span>
            Answered: {Object.keys(answers).length} / {quiz.questions.length}
          </span>
          {hintsUsed.length > 0 && (
            <span>Hints used: {hintsUsed.length}</span>
          )}
        </div>
      </div>
    </div>
  );
}