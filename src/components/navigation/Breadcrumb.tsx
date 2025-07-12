"use client";

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

interface BreadcrumbItem {
  id: string;
  title: string;
  path?: string;
  isClickable: boolean;
}

interface BreadcrumbProps {
  className?: string;
}

export default function Breadcrumb({ className = '' }: BreadcrumbProps) {
  const { currentSection, navigateToSection } = useContent();

  const buildBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        id: 'home',
        title: 'Home',
        path: 'introduction',
        isClickable: true
      }
    ];

    if (currentSection && currentSection.id !== 'introduction') {
      items.push({
        id: currentSection.id,
        title: currentSection.title || 'Current Section',
        isClickable: false
      });
    }

    return items;
  };

  const breadcrumbItems = buildBreadcrumbItems();

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.isClickable && item.path) {
      navigateToSection(item.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: BreadcrumbItem) => {
    if ((e.key === 'Enter' || e.key === ' ') && item.isClickable) {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4 ${className}`}
      role="navigation"
    >
      <ol className="flex items-center space-x-2" role="list">
        {breadcrumbItems.map((item, index) => (
          <li key={item.id} className="flex items-center" role="listitem">
            {index > 0 && (
              <ChevronRight 
                className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" 
                aria-hidden="true"
              />
            )}
            
            {item.isClickable ? (
              <button
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                aria-label={`Navigate to ${item.title}`}
              >
                {item.id === 'home' && (
                  <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                )}
                <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                  {item.title}
                </span>
              </button>
            ) : (
              <span 
                className="flex items-center gap-1 px-2 py-1 text-gray-900 dark:text-gray-100 font-medium"
                aria-current="page"
              >
                {item.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}