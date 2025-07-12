"use client";

import { useState } from "react";
import { BookOpen, Menu, User, BarChart3, HelpCircle, Podcast, Play, Globe } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useContent } from "@/contexts/ContentContext";
import { usePodcast } from "@/contexts/PodcastContext";
import { useTour } from "@/contexts/TourContext";
import ResourcesPopup from "@/components/resources/ResourcesPopup";

interface HeaderProps {
  onToggleAccessibility?: () => void;
  showAccessibilityPanel?: boolean;
}

export default function Header({ onToggleAccessibility, showAccessibilityPanel }: HeaderProps) {
  const [showSections, setShowSections] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const { getOverallProgress, progress, getSectionProgress } = useProgress();
  const { sections, currentSection, navigateToSection } = useContent();
  const { isPlayerVisible, showPlayer, hidePlayer } = usePodcast();
  const { startTour, restartTour, isCompleted } = useTour();

  const overallProgress = getOverallProgress();

  return (
    <header
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 relative"
      data-oid="eregg3n"
    >
      <div className="flex items-center justify-between" data-oid="b-nft:.">
        <div className="flex items-center gap-4" data-oid="1_rt4m0">
          <div className="flex items-center gap-2" data-oid="jmzz9oa">
            <BookOpen
              className="w-6 h-6 text-electric-600"
              data-oid="_bax17d"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white" data-oid="g3fx:qy">
              ElectroSage Academy
            </h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSections(!showSections)}
            className="flex items-center gap-2"
            data-oid="61wi4_t"
            data-tour="sections-button"
          >
            <Menu className="w-4 h-4" data-oid="2r3en0q" />
            Sections
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={isCompleted ? restartTour : startTour}
            className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <Play className="w-4 h-4" />
            {isCompleted ? "Retake Tour" : "Take Tour"}
          </Button>

          <Link href="/about">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              data-tour="about-button"
            >
              <HelpCircle className="w-4 h-4" />
              About
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={isPlayerVisible ? hidePlayer : showPlayer}
            className={`flex items-center gap-2 ${isPlayerVisible ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''}`}
            data-tour="podcast-button"
          >
            <Podcast className="w-4 h-4" />
            Podcast
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResources(true)}
            className="flex items-center gap-2"
            data-tour="resources-button"
          >
            <Globe className="w-4 h-4" />
            Resources
          </Button>
        </div>

        <div className="flex items-center gap-2" data-oid="lccf-qo">
          {/* Progress indicator */}
          <div
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
            data-oid=":qeufog"
            data-tour="progress-indicator"
          >
            <BarChart3
              className="w-4 h-4 text-electric-600"
              data-oid="ce9.yk6"
            />
            <span
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
              data-oid="v5_abi9"
            >
              {overallProgress}%
            </span>
          </div>

        </div>
      </div>

      {/* Section Dropdown */}
      {showSections && (
        <div
          className="absolute top-full left-4 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 w-80"
          data-oid="75twxa:"
        >
          <div className="p-2" data-oid="61p_ppk">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2" data-oid="xiufta:">
              Learning Sections
            </h3>
            <div className="max-h-60 overflow-y-auto" data-oid="o_btm23">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    navigateToSection(section.id);
                    setShowSections(false);
                  }}
                  className={`w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                    currentSection?.id === section.id
                      ? "bg-electric-50 dark:bg-electric-900 text-electric-700 dark:text-electric-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  data-oid="_znvqso"
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Click outside to close dropdowns */}
      {showSections && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowSections(false);
          }}
          data-oid="1he3ncb"
        />
      )}

      {/* Resources Popup */}
      <ResourcesPopup
        isOpen={showResources}
        onClose={() => setShowResources(false)}
      />
    </header>
  );
}
