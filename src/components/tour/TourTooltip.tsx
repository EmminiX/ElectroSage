"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  SkipForward, 
  RotateCcw,
  MapPin,
  Zap
} from "lucide-react";
import Button from "@/components/ui/Button";
import { TourStep } from "@/contexts/TourContext";

interface TourTooltipProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  position: { x: number; y: number; width: number; height: number };
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onClose: () => void;
  onRestart: () => void;
}

export default function TourTooltip({
  step,
  currentStep,
  totalSteps,
  position,
  onNext,
  onPrevious,
  onSkip,
  onClose,
  onRestart
}: TourTooltipProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isWelcomeOrCompletion = step.position === "center";

  // Calculate tooltip position based on step position and target element
  const getTooltipPosition = () => {
    if (isWelcomeOrCompletion) {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000
      };
    }

    // Use more accurate tooltip dimensions
    const offset = 16;
    const tooltipWidth = 320; // w-80 = 320px
    const tooltipHeight = 240; // more accurate estimated height
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let tooltipStyle: any = {
      position: "fixed" as const,
      zIndex: 1000
    };

    // Position values are the center point of the target element
    const elementCenterX = position.x;
    const elementCenterY = position.y;
    const elementWidth = position.width;
    const elementHeight = position.height;
    
    let top, left;

    // Calculate tooltip position based on step positioning preference
    switch (step.position) {
      case "top":
        // Position tooltip above the element
        top = elementCenterY - (elementHeight / 2) - tooltipHeight - offset;
        left = elementCenterX - (tooltipWidth / 2);
        break;
      case "bottom":
        // Position tooltip below the element
        top = elementCenterY + (elementHeight / 2) + offset;
        left = elementCenterX - (tooltipWidth / 2);
        
        // Special adjustment for visualizations to ensure clear separation
        if (step.id === "visualizations") {
          top = top + 20;
        }
        break;
      case "left":
        // Position tooltip to the left of the element
        top = elementCenterY - (tooltipHeight / 2);
        left = elementCenterX - (elementWidth / 2) - tooltipWidth - offset;
        
        // Special adjustment for accessibility button to appear higher
        if (step.id === "accessibility") {
          top = top - 140;
        }
        break;
      case "right":
        // Position tooltip to the right of the element
        top = elementCenterY - (tooltipHeight / 2);
        left = elementCenterX + (elementWidth / 2) + offset;
        break;
      default:
        // Fallback center positioning
        top = elementCenterY - (tooltipHeight / 2);
        left = elementCenterX - (tooltipWidth / 2);
    }

    // Enhanced viewport boundary checks with smarter repositioning
    const padding = 20;
    
    // Horizontal boundary adjustments
    if (left < padding) {
      left = padding;
    } else if (left + tooltipWidth > viewport.width - padding) {
      left = viewport.width - tooltipWidth - padding;
    }

    // Vertical boundary adjustments with priority for keeping tooltip visible
    if (top < padding) {
      // If tooltip would go above viewport, position it below the element instead
      if (step.position === "top") {
        top = elementCenterY + (elementHeight / 2) + offset;
      } else {
        top = padding;
      }
    } else if (top + tooltipHeight > viewport.height - padding) {
      // If tooltip would go below viewport, position it above the element instead
      if (step.position === "bottom") {
        top = elementCenterY - (elementHeight / 2) - tooltipHeight - offset;
      } else {
        top = viewport.height - tooltipHeight - padding;
      }
    }

    // Final safety check to ensure tooltip stays within viewport
    top = Math.max(padding, Math.min(top, viewport.height - tooltipHeight - padding));
    left = Math.max(padding, Math.min(left, viewport.width - tooltipWidth - padding));

    tooltipStyle.top = top;
    tooltipStyle.left = left;

    return tooltipStyle;
  };

  const getArrowClasses = () => {
    if (isWelcomeOrCompletion) return "";
    
    const baseClasses = "absolute w-0 h-0 border-8";
    const tooltipStyle = getTooltipPosition();
    
    // Calculate arrow position relative to target element
    const arrowX = position.x - tooltipStyle.left;
    const arrowY = position.y - tooltipStyle.top;
    
    switch (step.position) {
      case "top":
        return `${baseClasses} border-transparent border-t-white dark:border-t-gray-800 top-full`;
      case "bottom":
        return `${baseClasses} border-transparent border-b-white dark:border-b-gray-800 bottom-full`;
      case "left":
        return `${baseClasses} border-transparent border-l-white dark:border-l-gray-800 left-full`;
      case "right":
        return `${baseClasses} border-transparent border-r-white dark:border-r-gray-800 right-full`;
      default:
        return "";
    }
  };

  const getArrowStyle = () => {
    if (isWelcomeOrCompletion) return {};
    
    const tooltipStyle = getTooltipPosition();
    const elementCenterX = position.x;
    const elementCenterY = position.y;
    
    // Calculate arrow position to point to element center
    const arrowX = Math.max(8, Math.min(elementCenterX - tooltipStyle.left, 312));
    const arrowY = Math.max(8, Math.min(elementCenterY - tooltipStyle.top, 192));
    
    switch (step.position) {
      case "top":
      case "bottom":
        return { left: `${arrowX}px` };
      case "left":
      case "right":
        return { top: `${arrowY}px` };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={getTooltipPosition()}
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl ${
          isWelcomeOrCompletion ? 'w-96' : 'w-80 max-w-sm'
        }`}
      >
        {/* Arrow */}
        {!isWelcomeOrCompletion && (
          <div className={getArrowClasses()} style={getArrowStyle()} />
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {isWelcomeOrCompletion ? (
                  <div className="p-2 bg-gradient-to-br from-electric-500 to-blue-600 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {step.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: totalSteps }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i <= currentStep
                              ? 'bg-electric-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {step.content}
          </p>
          
          {step.action && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 text-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium">
                  {step.action === "click" ? "Try clicking this element!" : "Try hovering over this element!"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
              )}
              
              {isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRestart}
                  className="flex items-center space-x-1 text-gray-500"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart</span>
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!isLastStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="flex items-center space-x-1 text-gray-500"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Skip</span>
                </Button>
              )}
              
              <Button
                variant={isLastStep ? "primary" : "outline"}
                size="sm"
                onClick={onNext}
                className="flex items-center space-x-1"
              >
                <span>{isLastStep ? "Get Started!" : "Next"}</span>
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}