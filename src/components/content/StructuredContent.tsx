"use client";

import { useState, useEffect, useRef } from "react";
import { ReactElement } from "react";
import { motion } from "framer-motion";
import { ContentSection } from "@/data/types";
import { useProgress } from "@/contexts/ProgressContext";
import QuizContainer from "@/components/quiz/QuizContainer";
import { getRandomQuestions } from "@/data/sampleQuizzes";
import VisualizationContainer from "@/components/visualizations/VisualizationContainer";
import { enhanceContentDisplay } from "@/lib/utils/contentEnhancer";
import { Clock, BookOpen, CheckCircle, Circle, Target, Award } from "lucide-react";

interface StructuredContentProps {
  section: ContentSection;
  className?: string;
}

export default function StructuredContent({ section, className }: StructuredContentProps) {
  const { progress, updateSectionProgress, updateSubsectionProgress, getSectionProgress, calculateSectionMastery } = useProgress();
  const [showQuiz, setShowQuiz] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const sectionProgress = getSectionProgress(section.id);
  const masteryLevel = calculateSectionMastery(section.id);
  const isCompleted = sectionProgress >= 100;

  // Timer for time tracking - optimized to prevent memory leaks
  useEffect(() => {
    const startTime = Date.now();
    let timer: NodeJS.Timeout;
    
    // Update immediately, then every minute
    setTimeSpent(0);
    timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000 / 60)); // minutes
    }, 60000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [section.id]);

  // Enhance content display with formula highlighting
  useEffect(() => {
    if (contentRef.current) {
      // Wait for content to be rendered, then enhance
      const timer = setTimeout(() => {
        if (contentRef.current) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[StructuredContent] Enhancing content for section ${section.id}`);
          }
          enhanceContentDisplay(contentRef.current);
        }
      }, 500); // Give more time for KaTeX and content to render

      return () => {
        clearTimeout(timer);
      };
    }
  }, [section.htmlContent, section.id]);

  const handleMarkComplete = () => {
    const newProgress = !isCompleted ? 100 : 0;
    updateSectionProgress(section.id, newProgress);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    // Progress will be updated automatically by the quiz component
  };

  // Function to render content with subsection buttons injected after each subsection
  const renderContentWithSubsectionButtons = () => {
    if (!section.subsections || section.subsections.length === 0) {
      return (
        <div 
          className="prose prose-lg max-w-none 
            prose-headings:text-gray-900 dark:prose-headings:text-white 
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:first:mt-0
            prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6
            prose-h4:text-lg prose-h4:font-medium prose-h4:mb-2 prose-h4:mt-4
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-gray-900 dark:prose-strong:text-white 
            prose-em:text-gray-700 dark:prose-em:text-gray-300
            prose-code:text-electric-600 dark:prose-code:text-electric-400 
            prose-code:bg-electric-50 dark:prose-code:bg-electric-900/30 
            prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-a:text-electric-600 dark:prose-a:text-electric-400 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:border-electric-300
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-ul:my-4 prose-ol:my-4 prose-li:my-1
            prose-th:text-gray-900 dark:prose-th:text-white prose-th:font-semibold
            prose-td:text-gray-700 dark:prose-td:text-gray-300
            prose-figcaption:text-gray-600 dark:prose-figcaption:text-gray-400
            prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-hr:my-8
            prose-table:border-gray-300 dark:prose-table:border-gray-600
            [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20 [&_h4]:scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: section.htmlContent }}
        />
      );
    }

    // Parse HTML content and split by subsection headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(section.htmlContent, 'text/html');
    const elements = Array.from(doc.body.children);
    
    const contentSegments: ReactElement[] = [];
    let currentSegment: HTMLElement[] = [];
    let currentSubsectionIndex = 0;

    // Helper function to create slug from title (same as in parser.ts)
    const createSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    };

    // Helper function to render subsection button
    const renderSubsectionButton = (subsection: any, index: number) => {
      const subsectionKey = `${section.id}.${subsection.id}`;
      const isCompleted = progress.subsectionProgress?.[subsectionKey] || false;
      
      return (
        <div key={`button-${subsection.id}`} className="my-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              )}
              
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {isCompleted ? "Subsection Completed!" : "Mark Subsection Complete"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-64">
                  {subsection.title}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => updateSubsectionProgress(section.id, subsection.id, !isCompleted)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isCompleted
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500"
                  : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              }`}
            >
              {isCompleted ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </div>
        </div>
      );
    };

    // Process each element and check if it's a subsection heading
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      currentSegment.push(element);

      // Check if this is a heading that matches a subsection
      if (['H2', 'H3', 'H4'].includes(element.tagName)) {
        const headingText = element.textContent?.trim() || '';
        
        // Find matching subsection
        const matchingSubsection = section.subsections.find(sub => {
          const subsectionSlug = createSlug(sub.title);
          const headingSlug = createSlug(headingText);
          return subsectionSlug === headingSlug || sub.title.toLowerCase().includes(headingText.toLowerCase());
        });

        if (matchingSubsection) {
          // Look ahead to find the next subsection heading or end of content
          let nextSubsectionIndex = i + 1;
          while (nextSubsectionIndex < elements.length) {
            const nextElement = elements[nextSubsectionIndex] as HTMLElement;
            if (['H2', 'H3', 'H4'].includes(nextElement.tagName)) {
              const nextHeadingText = nextElement.textContent?.trim() || '';
              const nextMatchingSubsection = section.subsections.find(sub => {
                const subsectionSlug = createSlug(sub.title);
                const headingSlug = createSlug(nextHeadingText);
                return subsectionSlug === headingSlug || sub.title.toLowerCase().includes(nextHeadingText.toLowerCase());
              });
              if (nextMatchingSubsection) break;
            }
            currentSegment.push(elements[nextSubsectionIndex] as HTMLElement);
            nextSubsectionIndex++;
          }

          // Render the current segment
          const segmentHtml = currentSegment.map(el => el.outerHTML).join('');
          contentSegments.push(
            <div key={`segment-${currentSubsectionIndex}`}>
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:text-gray-900 dark:prose-headings:text-white 
                  prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:first:mt-0
                  prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6
                  prose-h4:text-lg prose-h4:font-medium prose-h4:mb-2 prose-h4:mt-4
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-strong:text-gray-900 dark:prose-strong:text-white 
                  prose-em:text-gray-700 dark:prose-em:text-gray-300
                  prose-code:text-electric-600 dark:prose-code:text-electric-400 
                  prose-code:bg-electric-50 dark:prose-code:bg-electric-900/30 
                  prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-a:text-electric-600 dark:prose-a:text-electric-400 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:border-electric-300
                  prose-li:text-gray-700 dark:prose-li:text-gray-300
                  prose-ul:my-4 prose-ol:my-4 prose-li:my-1
                  prose-th:text-gray-900 dark:prose-th:text-white prose-th:font-semibold
                  prose-td:text-gray-700 dark:prose-td:text-gray-300
                  prose-figcaption:text-gray-600 dark:prose-figcaption:text-gray-400
                  prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-hr:my-8
                  prose-table:border-gray-300 dark:prose-table:border-gray-600
                  [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20 [&_h4]:scroll-mt-20"
                dangerouslySetInnerHTML={{ __html: segmentHtml }}
              />
              {renderSubsectionButton(matchingSubsection, currentSubsectionIndex)}
            </div>
          );

          // Reset for next segment
          currentSegment = [];
          currentSubsectionIndex++;
          i = nextSubsectionIndex - 1; // -1 because loop will increment
        }
      }
    }

    // Add any remaining content
    if (currentSegment.length > 0) {
      const segmentHtml = currentSegment.map(el => el.outerHTML).join('');
      contentSegments.push(
        <div key={`segment-final`}>
          <div 
            className="prose prose-lg max-w-none 
              prose-headings:text-gray-900 dark:prose-headings:text-white 
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:first:mt-0
              prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6
              prose-h4:text-lg prose-h4:font-medium prose-h4:mb-2 prose-h4:mt-4
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-strong:text-gray-900 dark:prose-strong:text-white 
              prose-em:text-gray-700 dark:prose-em:text-gray-300
              prose-code:text-electric-600 dark:prose-code:text-electric-400 
              prose-code:bg-electric-50 dark:prose-code:bg-electric-900/30 
              prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-a:text-electric-600 dark:prose-a:text-electric-400 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:border-electric-300
              prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-ul:my-4 prose-ol:my-4 prose-li:my-1
              prose-th:text-gray-900 dark:prose-th:text-white prose-th:font-semibold
              prose-td:text-gray-700 dark:prose-td:text-gray-300
              prose-figcaption:text-gray-600 dark:prose-figcaption:text-gray-400
              prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-hr:my-8
              prose-table:border-gray-300 dark:prose-table:border-gray-600
              [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20 [&_h4]:scroll-mt-20"
            dangerouslySetInnerHTML={{ __html: segmentHtml }}
          />
        </div>
      );
    }

    return <>{contentSegments}</>;
  };

  const quizQuestions = getRandomQuestions(section.id, 5);

  const getMasteryIcon = () => {
    switch (masteryLevel) {
      case 'expert': return <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'advanced': return <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'intermediate': return <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default: return <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getMasteryColor = () => {
    switch (masteryLevel) {
      case 'expert': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700';
      case 'advanced': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
      case 'intermediate': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  if (showQuiz && quizQuestions.length > 0) {
    return (
      <QuizContainer
        sectionId={section.id}
        questions={quizQuestions}
        onComplete={handleQuizComplete}
        allowRetry={true}
      />
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${section.id === 'introduction' ? 'space-y-4' : 'space-y-8'} ${className}`}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-200 dark:border-gray-700 pb-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{section.title}</h1>
            {section.id !== 'introduction' && (
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{timeSpent} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getMasteryIcon()}
                  <span className="capitalize">{masteryLevel}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Indicator */}
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-lg font-bold text-electric-600 dark:text-electric-400">{sectionProgress}%</span>
            </div>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-electric-500 to-electric-600"
                initial={{ width: 0 }}
                animate={{ width: `${sectionProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Mastery Level Badge */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getMasteryColor()}`}>
          {getMasteryIcon()}
          <span className="ml-2 capitalize">{masteryLevel} Level</span>
        </div>
      </motion.div>

      {/* Visualizations - Show at top for all sections */}
      {section.visualizations && section.visualizations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VisualizationContainer
            sectionId={section.id}
            visualizations={section.visualizations}
            className={section.id === 'introduction' ? "mb-4" : "mb-6"}
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8"
      >
        {/* Render content with subsection buttons injected after each subsection */}
        {renderContentWithSubsectionButtons()}
      </motion.div>


      {/* Practice Questions Section */}
      {section.practiceQuestions && section.practiceQuestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-electric-50 to-blue-50 dark:from-electric-900/30 dark:to-blue-900/30 rounded-xl border border-electric-200 dark:border-electric-700 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Practice Questions</h3>
          <div className="space-y-3">
            {section.practiceQuestions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="text-gray-700 dark:text-gray-200">
                <span className="font-medium text-gray-900 dark:text-white">{index + 1}. </span>
                {question.question}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quiz Section - Hide for introduction */}
      {section.id !== 'introduction' && quizQuestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Test Your Knowledge</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Complete the interactive quiz to reinforce your understanding of this section.
              </p>
            </div>
            <button
              onClick={handleStartQuiz}
              className="px-6 py-3 bg-amber-600 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
            >
              Start Quiz ({quizQuestions.length} questions)
            </button>
          </div>
        </motion.div>
      )}

      {/* Section Completion - Hide for introduction */}
      {section.id !== 'introduction' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {isCompleted ? "Section Completed!" : "Mark Section Complete"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {isCompleted 
                    ? "Great work! You've completed this section." 
                    : "Mark this section as complete to track your progress."
                  }
                </div>
              </div>
            </div>
            
            <button
              onClick={handleMarkComplete}
              className={`px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 ${
                isCompleted
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
                  : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              }`}
            >
              {isCompleted ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}