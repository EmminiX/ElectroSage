"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import Footer from "./Footer";

export default function AutoHideFooter() {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-hide timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHovering) {
        setIsVisible(false);
      }
    }, 4000); // Hide after 4 seconds

    return () => clearTimeout(timer);
  }, [isHovering]);

  // Mouse position tracking for bottom hover detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;
      const bottomThreshold = 8; // Show footer when mouse is within 8px of bottom

      const nearBottom = mouseY >= windowHeight - bottomThreshold;
      
      if (nearBottom && !isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      // Hide footer when mouse leaves the window (unless actively hovering footer)
      if (!isHovering) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, isHovering]);

  return (
    <>
      {/* Footer */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className="fixed bottom-0 left-0 right-0 z-40"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Indicator - Shows when footer is hidden */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, delay: 0.5 }}
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-30"
          >
            <motion.div
              className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-t-lg shadow-lg cursor-pointer flex items-center space-x-2 text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVisible(true)}
            >
              <ChevronUp className="w-4 h-4" />
              <span>Educational Projects</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Zone - Invisible area at bottom to trigger footer */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-8 z-20 pointer-events-none"
        style={{ 
          background: 'transparent'
        }}
      />
    </>
  );
}