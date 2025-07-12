"use client";

import { useContent } from "@/contexts/ContentContext";
import StructuredContent from "@/components/content/StructuredContent";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import ProgressIndicator from "@/components/progress/ProgressIndicator";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContentDisplayProps {
  "data-oid"?: string;
  "data-tour"?: string;
}

export default function ContentDisplay({ "data-oid": dataOid, "data-tour": dataTour }: ContentDisplayProps = {}) {
  const {
    currentSection,
    navigateNext,
    navigatePrevious,
    loading,
    error,
    sections,
  } = useContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 text-lg font-semibold mb-2">Error Loading Content</div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-lg font-semibold mb-2">No Section Selected</div>
          <p className="text-gray-600 dark:text-gray-300">Please select a section from the navigation menu.</p>
        </div>
      </div>
    );
  }

  const currentIndex = sections.findIndex(s => s.id === currentSection.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < sections.length - 1;

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900"
      data-oid={dataOid}
      data-tour={dataTour}
    >
      {/* Fixed Breadcrumb Navigation */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb />
            <ProgressIndicator 
              sectionId={currentSection.id}
              size="md"
              showLabel={true}
              showTimeSpent={true}
            />
          </div>
        </div>
      </div>
      
      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto content-area">
        <div className="pb-8">
          <StructuredContent section={currentSection} />
        </div>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-sm mb-4">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={navigatePrevious}
              disabled={!hasPrevious}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-electric-500 ${
                hasPrevious
                  ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Section
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Section {currentIndex + 1} of {sections.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {currentSection.title}
              </div>
            </div>

            <button
              onClick={navigateNext}
              disabled={!hasNext}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-electric-500 ${
                hasNext
                  ? "bg-electric-600 text-white hover:bg-electric-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              Next Section
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}