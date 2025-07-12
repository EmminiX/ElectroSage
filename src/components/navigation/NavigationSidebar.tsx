"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Circle,
  Menu,
  X,
} from "lucide-react";
import { ContentSection, UserProgress } from "@/data/types";
import { useProgress } from "@/contexts/ProgressContext";

interface NavigationSidebarProps {
  sections: ContentSection[];
  currentSectionId: string;
  onSectionSelect: (sectionId: string, subsectionId?: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  "data-oid"?: string;
  "data-tour"?: string;
}

export default function NavigationSidebar({
  sections,
  currentSectionId,
  onSectionSelect,
  isCollapsed = false,
  onToggleCollapse,
  "data-oid": dataOid,
  "data-tour": dataTour,
}: NavigationSidebarProps) {
  const { progress, getSectionProgress, getOverallProgress } = useProgress();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  // Auto-expand current section
  useEffect(() => {
    const currentSection = sections.find((s) => s.id === currentSectionId);
    if (currentSection) {
      setExpandedSections((prev) => new Set([...prev, currentSection.id]));
    }
  }, [currentSectionId, sections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const isSectionCompleted = (sectionId: string) => {
    return progress.completedSections.includes(sectionId);
  };

  const isSubsectionCompleted = (subsectionId: string) => {
    return progress.questionsAnswered[subsectionId] || false;
  };

  const overallProgress = getOverallProgress();

  // Utility function for highlighting elements
  const highlightElement = (targetElement: HTMLElement) => {
    // Apply prominent highlight effect using CSS classes
    targetElement.classList.add('subsection-highlight');
    
    // Remove any existing fade timeout
    const existingTimeout = (targetElement as any)._highlightTimeout;
    if (existingTimeout) clearTimeout(existingTimeout);
    
    // Start fade-out process after 4 seconds (let the animation play)
    const fadeTimeout = setTimeout(() => {
      targetElement.classList.add('subsection-highlight-fade');
      
      // Completely remove classes after fade animation completes
      setTimeout(() => {
        targetElement.classList.remove('subsection-highlight', 'subsection-highlight-fade');
      }, 1200); // Match the CSS transition duration
    }, 4000); // Show highlight for 4 seconds
    
    // Store timeout reference for cleanup
    (targetElement as any)._highlightTimeout = fadeTimeout;
  };

  const handleSectionSelect = (sectionId: string, subsectionId?: string) => {
    console.log('NavigationSidebar: Selecting section', sectionId, subsectionId);
    onSectionSelect(sectionId, subsectionId);
    
    // Implement scroll-to functionality for subsections
    if (subsectionId) {
      // Find the corresponding section and subsection to get the heading title
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        const subsection = section.subsections.find(sub => sub.id === subsectionId);
        if (subsection) {
          // Create slug from subsection title (same logic as parser)
          const headingId = subsection.title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .trim();
          
          // Add a small delay to allow content to load, then scroll
          setTimeout(() => {
            const headingElement = document.getElementById(headingId);
            if (headingElement) {
              // Find the parent heading element (h2, h3, etc.) to highlight the entire section
              let targetElement = headingElement;
              
              // If the heading is nested, find the closest heading element
              if (!['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(headingElement.tagName)) {
                const parentHeading = headingElement.closest('h1, h2, h3, h4, h5, h6');
                if (parentHeading) targetElement = parentHeading as HTMLElement;
              }
              
              // Scroll to the element with better positioning
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
              });
              
              // Apply highlight using utility function
              highlightElement(targetElement);
              
              // Prevent over-scrolling by checking scroll position after animation
              setTimeout(() => {
                const contentContainer = document.querySelector('[data-oid="pxvijni"]') as HTMLElement;
                if (contentContainer) {
                  const maxScroll = contentContainer.scrollHeight - contentContainer.clientHeight;
                  if (contentContainer.scrollTop > maxScroll - 20) {
                    contentContainer.scrollTo({
                      top: Math.max(0, maxScroll - 20),
                      behavior: 'smooth'
                    });
                  }
                }
              }, 800); // Wait for smooth scroll to complete
              
            } else {
              console.warn(`Heading element not found for ID: ${headingId}`);
            }
          }, 100);
        }
      }
    } else {
      // Handle highlighting for main sections (when no subsection is specified)
      setTimeout(() => {
        // Look for the main section heading - could be h1 or h2
        const sectionHeadings = document.querySelectorAll('h1, h2');
        let targetHeading: HTMLElement | null = null;
        
        // Find the section title by text content matching
        const section = sections.find(s => s.id === sectionId);
        if (section) {
          for (const heading of Array.from(sectionHeadings)) {
            const headingText = heading.textContent?.trim().toLowerCase();
            const sectionTitle = section.title.trim().toLowerCase();
            
            // Check if the heading text contains or matches the section title
            if (headingText && (
              headingText.includes(sectionTitle) || 
              sectionTitle.includes(headingText) ||
              headingText === sectionTitle
            )) {
              targetHeading = heading as HTMLElement;
              break;
            }
          }
          
          // If we found a matching heading, scroll to it and highlight
          if (targetHeading) {
            targetHeading.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });
            
            // Apply highlight using utility function
            highlightElement(targetHeading);
            
            // Prevent over-scrolling by checking scroll position after animation
            setTimeout(() => {
              const contentContainer = document.querySelector('[data-oid="pxvijni"]') as HTMLElement;
              if (contentContainer) {
                const maxScroll = contentContainer.scrollHeight - contentContainer.clientHeight;
                if (contentContainer.scrollTop > maxScroll - 20) {
                  contentContainer.scrollTo({
                    top: Math.max(0, maxScroll - 20),
                    behavior: 'smooth'
                  });
                }
              }
            }, 800); // Wait for smooth scroll to complete
          }
        }
      }, 100);
    }
  };

  if (isCollapsed) {
    return (
      <div
        className="w-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 shadow-sm transition-all duration-300 ease-in-out"
        data-oid={dataOid || "d95n28r"}
        data-tour={dataTour}
      >
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-electric-50 dark:hover:bg-electric-900/20 rounded-lg transition-all duration-200 group focus:ring-2 focus:ring-electric-500 focus:outline-none"
          aria-label="Expand navigation"
          data-oid="4:hgqxq"
        >
          <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-electric-600 dark:group-hover:text-electric-400 transition-colors" data-oid="eq771kx" />
        </button>

        {/* Progress indicator */}
        <div
          className="mt-4 flex flex-col items-center space-y-3 px-2"
          data-oid="c_cp51n"
        >
          <div
            className="relative w-8 h-8 rounded-full bg-gradient-to-br from-electric-100 to-electric-200 dark:from-electric-800 dark:to-electric-700 flex items-center justify-center shadow-sm"
            data-oid="yqj_6lm"
          >
            <span
              className="text-[10px] font-bold text-electric-700 dark:text-electric-300"
              data-oid="b0008fa"
            >
              {overallProgress}%
            </span>
            <div 
              className="absolute inset-0 rounded-full border border-electric-500 dark:border-electric-400"
              style={{
                background: `conic-gradient(var(--accent-color) ${overallProgress * 3.6}deg, transparent 0deg)`
              }}
            />
          </div>

          {/* Section dots */}
          <div className="flex flex-col space-y-1.5" data-oid="0t6nj23">
            {sections.map((section, index) => {
              const sectionProgress = getSectionProgress(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionSelect(section.id)}
                  className={`relative w-2.5 h-2.5 rounded-full transition-all duration-300 transform hover:scale-125 focus:scale-125 focus:outline-none group ${
                    section.id === currentSectionId
                      ? "bg-electric-600 shadow-md"
                      : sectionProgress >= 100
                        ? "bg-green-500 shadow-sm"
                        : sectionProgress > 0
                          ? "bg-amber-400"
                          : "bg-gray-300"
                  }`}
                  title={`${section.title} - ${sectionProgress}% complete`}
                  data-oid="4lztl_1"
                >
                  {sectionProgress > 0 && sectionProgress < 100 && (
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#f59e0b ${sectionProgress * 3.6}deg, transparent 0deg)`
                      }}
                    />
                  )}
                  <span className="sr-only">{section.title} - {sectionProgress}% complete</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-sm transition-all duration-300 ease-in-out mb-12"
      data-oid={dataOid || "avveord"}
      data-tour={dataTour}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700" data-oid="f1gxcq1">
        <div className="flex items-center justify-between" data-oid="7n7h80j">
          <div className="flex items-center space-x-3" data-oid="qe498w1">
            <BookOpen className="w-5 h-5 text-electric-600" data-oid="u3u8h.l" />
            <h2 className="font-semibold text-gray-900 dark:text-white" data-oid="-:.tzq2">
              Course Navigation
            </h2>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-electric-50 rounded-lg transition-all duration-200 group focus:ring-2 focus:ring-electric-500 focus:outline-none"
            aria-label="Collapse navigation"
            data-oid="54_c6wv"
          >
            <X className="w-4 h-4 text-gray-500 group-hover:text-electric-600 transition-colors" data-oid="4lh3vsr" />
          </button>
        </div>

        {/* Overall Progress */}
        <div className="mt-4" data-oid="uvbwjju">
          <div
            className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2"
            data-oid="y-4.lck"
          >
            <span className="font-medium" data-oid="6s6.83-">Overall Progress</span>
            <span className="font-bold text-electric-700 dark:text-electric-400" data-oid="g_:zwme">{overallProgress}%</span>
          </div>
          <div
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner"
            data-oid="0f5o0fv"
          >
            <div
              className="bg-gradient-to-r from-electric-500 to-electric-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${overallProgress}%` }}
              data-oid="meudh9v"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {progress.completedSections.length} of {sections.length} sections completed
          </div>
        </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto" data-oid="0g1zfgw">
        <nav className="p-2" data-oid="fzt-:6n">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const isActive = section.id === currentSectionId;
            const isCompleted = isSectionCompleted(section.id);
            const sectionProgress = getSectionProgress(section.id);

            return (
              <div key={section.id} className="mb-1" data-oid="5.fg0ob">
                {/* Section Header */}
                <div
                  className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                    isActive
                      ? "bg-gradient-to-r from-electric-50 to-electric-100 dark:from-electric-900 dark:to-electric-800 text-electric-800 dark:text-electric-200 border-electric-200 dark:border-electric-700 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  }`}
                  data-oid="_h05:sd"
                >
                  <button
                    onClick={() => handleSectionSelect(section.id)}
                    className="flex items-center flex-1 text-left focus:outline-none"
                    data-oid="sw53lpt"
                  >
                    <span className="mr-3" data-oid="zni:11n">
                      {isCompleted ? (
                        <CheckCircle
                          className="w-5 h-5 text-green-500"
                          data-oid="4gxl44q"
                        />
                      ) : sectionProgress > 0 ? (
                        <div className="relative w-5 h-5">
                          <Circle className="w-5 h-5 text-gray-300" />
                          <div 
                            className="absolute inset-0 w-5 h-5 rounded-full"
                            style={{
                              background: `conic-gradient(#f59e0b ${sectionProgress * 3.6}deg, transparent 0deg)`,
                              mask: 'radial-gradient(circle at center, transparent 30%, black 31%)'
                            }}
                          />
                        </div>
                      ) : (
                        <Circle
                          className="w-5 h-5 text-gray-400"
                          data-oid="s1ftzr4"
                        />
                      )}
                    </span>

                    <span
                      className="flex-1 text-sm font-medium"
                      data-oid="f33y88a"
                    >
                      {section.title}
                    </span>

                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-md ${
                      sectionProgress >= 100 
                        ? "bg-green-100 text-green-700"
                        : sectionProgress > 0 
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                    }`}>
                      {sectionProgress}%
                    </span>
                  </button>

                  {section.subsections.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(section.id);
                      }}
                      className="ml-2 p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-electric-500"
                      aria-label={isExpanded ? "Collapse subsections" : "Expand subsections"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 transition-transform duration-200" data-oid="zoq6x05" />
                      ) : (
                        <ChevronRight
                          className="w-4 h-4 transition-transform duration-200"
                          data-oid="dz8:dow"
                        />
                      )}
                    </button>
                  )}
                  
                  {sectionProgress > 0 && sectionProgress < 100 && (
                    <div className="absolute bottom-0 left-3 right-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                        style={{ width: `${sectionProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Subsections */}
                {isExpanded && section.subsections.length > 0 && (
                  <div className="ml-8 mt-2 space-y-1 animate-in slide-in-from-top duration-200" data-oid="9egon0t">
                    {section.subsections.map((subsection) => {
                      const isSubCompleted = isSubsectionCompleted(
                        subsection.id,
                      );

                      return (
                        <button
                          key={subsection.id}
                          onClick={() =>
                            handleSectionSelect(section.id, subsection.id)
                          }
                          className="flex items-center w-full p-2 text-left rounded-lg hover:bg-electric-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-electric-500"
                          data-oid="w9a:6gu"
                        >
                          <span className="mr-3" data-oid="h:s:5gy">
                            {isSubCompleted ? (
                              <CheckCircle
                                className="w-4 h-4 text-green-500"
                                data-oid="5iv5da:"
                              />
                            ) : (
                              <Circle
                                className="w-4 h-4 text-gray-400"
                                data-oid="x18g29i"
                              />
                            )}
                          </span>
                          <span
                            className="text-sm text-gray-600 hover:text-electric-700 transition-colors"
                            data-oid="gardauo"
                          >
                            {subsection.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
