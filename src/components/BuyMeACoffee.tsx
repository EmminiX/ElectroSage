'use client';

import { Coffee, Heart } from 'lucide-react';
import { trackSocialMedia } from '@/components/Analytics';

interface BuyMeACoffeeProps {
  variant?: 'default' | 'compact' | 'icon' | 'footer';
  className?: string;
}

export default function BuyMeACoffee({ variant = 'default', className = '' }: BuyMeACoffeeProps) {
  const handleClick = () => {
    trackSocialMedia.click('buymeacoffee', 'support-button');
    window.open('https://buymeacoffee.com/emmix', '_blank', 'noopener,noreferrer');
  };

  const baseClasses = "inline-flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-md hover:shadow-lg focus:ring-yellow-500 ${className}`}
        title="Buy me a coffee ☕"
        aria-label="Support the project - Buy me a coffee"
      >
        <Coffee className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} px-3 py-2 text-sm rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-md hover:shadow-lg focus:ring-yellow-500 ${className}`}
        aria-label="Support the project - Buy me a coffee"
      >
        <Coffee className="w-4 h-4" />
        <span>Coffee</span>
      </button>
    );
  }

  if (variant === 'footer') {
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} px-4 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white border border-gray-600 hover:border-gray-500 shadow-sm hover:shadow-md focus:ring-gray-500 ${className}`}
        aria-label="Support the project - Buy me a coffee"
      >
        <Coffee className="w-4 h-4" />
        <span>Buy me a coffee</span>
        <Heart className="w-3 h-3 text-red-400" />
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl focus:ring-yellow-500 group ${className}`}
      aria-label="Support the project - Buy me a coffee"
    >
      <Coffee className="w-5 h-5 group-hover:animate-bounce" />
      <span>Buy me a coffee</span>
      <Heart className="w-4 h-4 text-red-200 group-hover:text-red-100" />
    </button>
  );
}

// Floating variant for corner placement
export function FloatingBuyMeACoffee() {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div className="relative">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap">
            Support the project ☕
            <div className="absolute top-full right-4 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
        
        {/* Button */}
        <BuyMeACoffee 
          variant="default" 
          className="shadow-2xl hover:shadow-yellow-400/20 animate-pulse hover:animate-none"
        />
      </div>
    </div>
  );
}

// Inline text variant for content areas
export function InlineBuyMeACoffee() {
  const handleClick = () => {
    trackSocialMedia.click('buymeacoffee', 'inline-link');
    window.open('https://buymeacoffee.com/emmix', '_blank', 'noopener,noreferrer');
  };

  return (
    <span className="inline-flex items-center gap-1">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-700 underline decoration-dotted underline-offset-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 rounded"
        aria-label="Support the project - Buy me a coffee"
      >
        <Coffee className="w-4 h-4" />
        <span className="font-medium">buy me a coffee</span>
      </button>
      <Heart className="w-3 h-3 text-red-500" />
    </span>
  );
}