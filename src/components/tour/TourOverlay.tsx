"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTour } from "@/contexts/TourContext";
import TourTooltip from "./TourTooltip";

export default function TourOverlay() {
  const {
    isActive,
    currentStep,
    steps,
    nextStep,
    previousStep,
    skipStep,
    skipTour,
    restartTour
  } = useTour();

  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const currentTourStep = steps[currentStep];

  // Find and track the target element
  const updateTargetElement = useCallback(() => {
    if (!isActive || !currentTourStep) return;

    const element = document.querySelector(currentTourStep.target);
    setTargetElement(element);

    if (element) {
      const rect = element.getBoundingClientRect();
      
      // Always pass the element's center coordinates
      // The TourTooltip component will handle positioning the tooltip relative to this center point
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      setTargetPosition({
        x,
        y,
        width: rect.width,
        height: rect.height
      });
    } else {
      // Fallback for center position when no element found
      setTargetPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        width: 0,
        height: 0
      });
    }
  }, [isActive, currentTourStep]);

  // Update target element when step changes
  useEffect(() => {
    updateTargetElement();
  }, [updateTargetElement]);

  // Update position on window resize or scroll
  useEffect(() => {
    if (!isActive) return;

    const handleUpdate = () => {
      updateTargetElement();
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isActive, updateTargetElement]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          skipTour();
          break;
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousStep();
          break;
        case 's':
        case 'S':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            skipStep();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, nextStep, previousStep, skipStep, skipTour]);

  // Auto-scroll target element into view
  useEffect(() => {
    if (targetElement && currentTourStep?.position !== 'center') {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [targetElement, currentTourStep]);

  if (!isActive || !currentTourStep) {
    return null;
  }

  const getSpotlightStyle = () => {
    if (currentTourStep.position === 'center' || !targetElement) {
      return {};
    }

    const rect = targetElement.getBoundingClientRect();
    const padding = 8;
    
    return {
      clipPath: `polygon(
        0% 0%, 
        0% 100%, 
        ${rect.left - padding}px 100%, 
        ${rect.left - padding}px ${rect.top - padding}px, 
        ${rect.right + padding}px ${rect.top - padding}px, 
        ${rect.right + padding}px ${rect.bottom + padding}px, 
        ${rect.left - padding}px ${rect.bottom + padding}px, 
        ${rect.left - padding}px 100%, 
        100% 100%, 
        100% 0%
      )`
    };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-auto"
      >
        {/* Backdrop with spotlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          style={getSpotlightStyle()}
          onClick={(e) => {
            // Only close if clicking on backdrop, not on highlighted element
            if (e.target === e.currentTarget) {
              skipTour();
            }
          }}
        />

        {/* Highlighted element border/glow */}
        {targetElement && currentTourStep.position !== 'center' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute border-2 border-electric-400 rounded-lg shadow-lg shadow-electric-400/50 pointer-events-none"
            style={{
              left: targetElement.getBoundingClientRect().left - 4,
              top: targetElement.getBoundingClientRect().top - 4,
              width: targetElement.getBoundingClientRect().width + 8,
              height: targetElement.getBoundingClientRect().height + 8,
            }}
          />
        )}

        {/* Pulsing effect for highlighted element */}
        {targetElement && currentTourStep.position !== 'center' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bg-electric-400 rounded-lg pointer-events-none"
            style={{
              left: targetElement.getBoundingClientRect().left - 8,
              top: targetElement.getBoundingClientRect().top - 8,
              width: targetElement.getBoundingClientRect().width + 16,
              height: targetElement.getBoundingClientRect().height + 16,
            }}
          />
        )}

        {/* Tooltip */}
        <TourTooltip
          step={currentTourStep}
          currentStep={currentStep}
          totalSteps={steps.length}
          position={targetPosition}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={skipStep}
          onClose={skipTour}
          onRestart={restartTour}
        />

        {/* Keyboard hints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 left-4 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg"
        >
          <div className="space-y-1">
            <div>Press <kbd className="bg-gray-700 px-1 rounded">→</kbd> or <kbd className="bg-gray-700 px-1 rounded">Enter</kbd> for next</div>
            <div>Press <kbd className="bg-gray-700 px-1 rounded">←</kbd> for previous</div>
            <div>Press <kbd className="bg-gray-700 px-1 rounded">Esc</kbd> to exit tour</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}