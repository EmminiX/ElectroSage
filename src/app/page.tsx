"use client";

import { useState, useEffect, useCallback } from "react";
import ThreePanelLayout from "@/components/layout/ThreePanelLayout";
import NavigationSidebar from "@/components/navigation/NavigationSidebar";
import ContentDisplay from "@/components/ContentDisplay";
import ChatInterface from "@/components/ChatInterface";
import VisualizationContainer from "@/components/visualizations/VisualizationContainer";
import Header from "@/components/layout/Header";
import AutoHideFooter from "@/components/layout/AutoHideFooter";
import { ContentProvider, useContent } from "@/contexts/ContentContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";


function MainPageContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    sections,
    currentSection,
    navigateToSection,
    setCurrentSection,
    isLoading: contentLoading,
  } = useContent();
  const {
    progress,
    updateSectionProgress,
    getOverallProgress,
    getSectionProgress
  } = useProgress();

  // Enhanced keyboard navigation
  const { navigationState, shortcuts } = useKeyboardNavigation({
    enableSectionNavigation: true,
    enableNumberShortcuts: true,
    enableHomeShortcut: true,
    enableAccessibilityShortcuts: true,
  });

  const handleSectionSelect = useCallback((sectionId: string, subsectionId?: string) => {
    navigateToSection(sectionId);
    // Update progress context to track current section
    updateSectionProgress(sectionId, getSectionProgress(sectionId));

    // If subsection is specified, scroll to it (we'll implement this later)
    if (subsectionId) {
      // TODO: Scroll to subsection
      console.log("Navigate to subsection:", subsectionId);
    }
  }, [navigateToSection, updateSectionProgress, getSectionProgress]);

  // Sidebar toggle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + N for navigation toggle
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarCollapsed]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (contentLoading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        data-oid="kld:2a."
      >
        <div className="text-center" data-oid="jcskkkc">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"
            data-oid="4_ju2m2"
          ></div>
          <p className="text-gray-600" data-oid="tx4ksr2">
            Loading course content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      data-oid="yknu538"
    >
      {/* Skip Navigation Link */}
      <a href="#main-content" className="skip-link" data-oid="p2va1yk">
        Skip to main content
      </a>

      {/* Header */}
      <Header />

      {/* Main Content Area - Full Height (footer is now floating) */}
      <div className="flex-1 flex overflow-hidden">
        <ThreePanelLayout
          sidebarCollapsed={sidebarCollapsed}
          sidebar={
            <NavigationSidebar
              sections={sections}
              currentSectionId={currentSection?.id || "introduction"}
              onSectionSelect={handleSectionSelect}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={handleToggleSidebar}
              data-oid="zzs:l:a"
              data-tour="navigation-sidebar"
            />
          }
          content={<ContentDisplay data-oid="w0-mi65" data-tour="content-area" />}
          chat={<ChatInterface data-oid="qx6so:h" data-tour="chat-interface" />}
          data-oid="iu5myde"
        />
      </div>

      {/* Auto-Hide Footer */}
      <AutoHideFooter />
    </div>
  );
}

export default function MainPage() {
  return (
    <ContentProvider>
      <MainPageContent />
    </ContentProvider>
  );
}
