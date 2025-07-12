"use client";

import { ReactNode, useState, useEffect } from "react";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { PodcastProvider, usePodcast } from "@/contexts/PodcastContext";
import { TourProvider } from "@/contexts/TourContext";
import AccessibilityTrigger from "@/components/accessibility/AccessibilityTrigger";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import PodcastPlayer from "@/components/podcast/PodcastPlayer";
import TourOverlay from "@/components/tour/TourOverlay";

interface ClientLayoutProps {
  children: ReactNode;
}

function ClientLayoutContent({ children }: ClientLayoutProps) {
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const { isPlayerVisible, isPlayerMinimized, toggleMinimize } = usePodcast();

  // Keyboard shortcut for accessibility panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + A for accessibility panel
      if ((event.ctrlKey || event.metaKey) && event.key === "a") {
        event.preventDefault();
        setShowAccessibilityPanel(!showAccessibilityPanel);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAccessibilityPanel]);

  return (
    <main id="main" className="relative" data-oid="bwiob7a">
      {children}
      
      {/* Accessibility Features */}
      <AccessibilityTrigger
        onClick={() => setShowAccessibilityPanel(true)}
      />
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
      />

      {/* Podcast Player - iPhone Dynamic Island Style */}
      {isPlayerVisible && (
        <div className={`fixed z-50 ${
          isPlayerMinimized 
            ? 'top-4 right-4 sm:right-8 md:right-12 lg:right-16 xl:right-20' 
            : 'top-20 left-1/2 transform -translate-x-1/2 w-80'
        }`}>
          <PodcastPlayer
            isMinimized={isPlayerMinimized}
            onToggleMinimize={toggleMinimize}
          />
        </div>
      )}

      {/* Tour Overlay */}
      <TourOverlay />
    </main>
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AccessibilityProvider>
      <ContentProvider>
        <ProgressProvider>
          <PodcastProvider>
            <TourProvider>
              <ClientLayoutContent>{children}</ClientLayoutContent>
            </TourProvider>
          </PodcastProvider>
        </ProgressProvider>
      </ContentProvider>
    </AccessibilityProvider>
  );
}
