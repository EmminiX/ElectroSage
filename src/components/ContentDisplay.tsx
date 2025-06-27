"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/hooks/useContent";
import { useProgress } from "@/contexts/ProgressContext";
import Button from "@/components/ui/Button";
import VisualizationManager from "@/components/VisualizationManager";
import { CheckCircle, Circle, Clock } from "lucide-react";

export default function ContentDisplay() {
  const {
    currentSection,
    navigateNext,
    navigatePrevious,
    loading,
    error,
    sections,
  } = useContent();
  const { updateSectionProgress, getSectionProgress, updateTimeSpent } =
    useProgress();
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Track time when section changes
  useEffect(() => {
    if (currentSection) {
      setTimeStarted(new Date());
      setIsCompleted(getSectionProgress(currentSection.id) === 100);
    }

    return () => {
      if (timeStarted && currentSection) {
        const timeSpent = Math.round(
          (new Date().getTime() - timeStarted.getTime()) / 60000,
        ); // minutes
        updateTimeSpent(currentSection.id, timeSpent);
      }
    };
  }, [currentSection?.id]);

  const handleMarkComplete = () => {
    if (currentSection) {
      updateSectionProgress(currentSection.id, !isCompleted);
      setIsCompleted(!isCompleted);
    }
  };

  if (loading)
    return (
      <div className="p-4" data-oid="nm.zlc:">
        <p className="text-gray-700" data-oid="6zqahs6">
          Loading content...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-4" data-oid="9wrac28">
        <p className="text-red-500" data-oid="vy-56b2">
          {error}
        </p>
      </div>
    );

  return (
    <div className="p-4 space-y-6" data-oid="60pkkxf">
      <div data-oid="wkye6f8">
        <h2 className="text-2xl font-semibold mb-4" data-oid="knp:2_z">
          {currentSection?.title}
        </h2>
        <div
          dangerouslySetInnerHTML={{
            __html: currentSection?.htmlContent || "",
          }}
          data-oid="x-hyko."
        />
      </div>

      {currentSection?.visualizations &&
        currentSection.visualizations.length > 0 && (
          <VisualizationManager
            visualizations={currentSection.visualizations}
            data-oid="hu74xcj"
          />
        )}

      {/* Section completion status */}
      <div className="bg-gray-50 p-4 rounded-lg border" data-oid="mvj8abo">
        <div className="flex items-center justify-between" data-oid="6ddc.zc">
          <div className="flex items-center gap-2" data-oid="u:obxzz">
            {isCompleted ? (
              <CheckCircle
                className="w-5 h-5 text-green-600"
                data-oid="yzkzmlv"
              />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" data-oid="xhiafdv" />
            )}
            <span className="text-sm font-medium" data-oid=":c:g7ua">
              {isCompleted ? "Section Completed" : "Mark as Complete"}
            </span>
          </div>
          <Button
            variant={isCompleted ? "secondary" : "primary"}
            size="sm"
            onClick={handleMarkComplete}
            data-oid="b.fifam"
          >
            {isCompleted ? "Mark Incomplete" : "Mark Complete"}
          </Button>
        </div>
      </div>

      <div
        className="flex justify-between pt-4 border-t border-gray-200"
        data-oid="_u.9i_i"
      >
        <Button
          variant="outline"
          onClick={navigatePrevious}
          disabled={!currentSection}
          data-oid="j3yupoq"
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={navigateNext}
          disabled={!currentSection}
          data-oid="o8rs8bl"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
