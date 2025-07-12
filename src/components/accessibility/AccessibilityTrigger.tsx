"use client";

import { Settings } from 'lucide-react';

interface AccessibilityTriggerProps {
  onClick: () => void;
  className?: string;
}

export default function AccessibilityTrigger({ onClick, className = '' }: AccessibilityTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${className}`}
      aria-label="Open accessibility settings (Ctrl+A)"
      title="Accessibility Settings (Ctrl+A)"
      data-tour="accessibility-button"
    >
      <Settings className="w-6 h-6" />
    </button>
  );
}
