"use client";

import React, { useState, Suspense, lazy, useMemo, useCallback } from "react";
import { VisualizationType } from "@/data/types";
import { VisualizationProps } from "./types";
import VisualizationErrorBoundary from "./VisualizationErrorBoundary";
import { Eye, EyeOff, Maximize2, Minimize2, Loader2 } from "lucide-react";

// Lazy load visualization components
const AtomicStructureVisualization = lazy(() => import("./AtomicStructureVisualization"));
const CircuitDiagramBuilder = lazy(() => import("./CircuitDiagramBuilder"));
const OhmsLawCalculator = lazy(() => import("./OhmsLawCalculator"));
const CurrentFlowVisualization = lazy(() => import("./CurrentFlowVisualization"));
const SeriesCircuitVisualization = lazy(() => import("./SeriesCircuitVisualization"));
const VoltageVisualization = lazy(() => import("./VoltageVisualization"));
const ResistanceVisualization = lazy(() => import("./ResistanceVisualization"));
const ACWaveformVisualization = lazy(() => import("./ACWaveformVisualization"));
const CapacitorVisualization = lazy(() => import("./CapacitorVisualization"));
const InductorVisualization = lazy(() => import("./InductorVisualization"));
const TransformerVisualization = lazy(() => import("./TransformerVisualization"));
const SafetyVisualization = lazy(() => import("./SafetyVisualization"));
const ComponentLibrary = lazy(() => import("./ComponentLibrary"));

// Enhanced loading fallback component with better UX
const LoadingFallback = React.memo(() => (
  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded">
    <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-500 dark:text-blue-400" />
    <div className="text-center">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loading visualization...</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">This may take a moment</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

interface VisualizationContainerProps {
  sectionId?: string;
  visualizations?: VisualizationType[];
  className?: string;
}

// Minimal fallback visualizations for sections that don't have parser results
// This ensures every section has at least some basic visualizations
const FALLBACK_VISUALIZATIONS: Record<string, VisualizationType[]> = {
  // Introduction gets ALL visualizations as a showcase
  "introduction": [
    "atomic-structure", "voltage-demo", "current-flow", "resistance-demo",
    "circuit-series", "circuit-parallel", "ohms-law", "ac-waveform", 
    "circuit-diagram", "component-library", "safety-demo",
    "capacitor-demo", "inductor-demo", "transformer-demo"
  ],
  "section-1": ["atomic-structure", "voltage-demo", "current-flow"],
  "section-2": ["voltage-demo", "current-flow", "resistance-demo", "ohms-law"],
  "section-3": ["circuit-series", "circuit-parallel", "ohms-law", "circuit-diagram"],
  "section-4": ["voltage-demo", "resistance-demo", "ac-waveform", "ohms-law"],
  "section-5": ["ohms-law", "resistance-demo", "ac-waveform"],
  "section-6": ["voltage-demo", "safety-demo", "current-flow"],
  "section-7": ["circuit-diagram", "component-library", "safety-demo"],
  "section-8": ["circuit-diagram", "component-library", "capacitor-demo", "inductor-demo", "transformer-demo"],
};

const VISUALIZATION_INFO: Record<
  VisualizationType,
  {
    title: string;
    description: string;
    component: React.ComponentType<any>;
  }
> = {
  "atomic-structure": {
    title: "Atomic Structure",
    description: "Interactive model showing protons, neutrons, and electrons",
    component: AtomicStructureVisualization,
  },
  "circuit-diagram": {
    title: "Circuit Builder",
    description: "Build and simulate electrical circuits",
    component: CircuitDiagramBuilder,
  },
  "circuit-series": {
    title: "Series Circuit",
    description: "Series circuit demonstration with voltage division",
    component: SeriesCircuitVisualization,
  },
  "circuit-parallel": {
    title: "Parallel Circuit", 
    description: "Parallel circuit demonstration",
    component: (props: any) => <CurrentFlowVisualization {...props} circuitType="parallel" />,
  },
  "ohms-law": {
    title: "Ohm's Law Calculator",
    description: "Calculate voltage, current, and resistance",
    component: OhmsLawCalculator,
  },
  "current-flow": {
    title: "Current Flow Animation",
    description: "Visualize electron flow and current in circuits",
    component: CurrentFlowVisualization,
  },
  "voltage-demo": {
    title: "Voltage Demonstration",
    description: "Interactive voltage and electric field visualization",
    component: VoltageVisualization,
  },
  "resistance-demo": {
    title: "Resistance Effects",
    description: "See how resistance affects current and generates heat",
    component: ResistanceVisualization,
  },
  "waveform": {
    title: "AC Waveforms",
    description: "Interactive AC voltage and current waveforms",
    component: ACWaveformVisualization,
  },
  "ac-waveform": {
    title: "AC Waveform Analysis",
    description: "Analyze AC voltage and current patterns",
    component: ACWaveformVisualization,
  },
  "capacitor-demo": {
    title: "Capacitor Charging",
    description: "Interactive capacitor charging/discharging demonstration",
    component: CapacitorVisualization,
  },
  "inductor-demo": {
    title: "Inductor Effects",
    description: "Magnetic field and inductance effects visualization",
    component: InductorVisualization,
  },
  "transformer-demo": {
    title: "Transformer Operation",
    description: "Interactive transformer voltage transformation demo",
    component: TransformerVisualization,
  },
  "3-phase-system": {
    title: "Three-Phase System",
    description: "Three-phase power system visualization",
    component: () => <div className="p-4">3-phase demo coming soon</div>,
  },
  "safety-demo": {
    title: "Electrical Safety",
    description: "Interactive electrical safety scenarios and best practices",
    component: SafetyVisualization,
  },
  "component-library": {
    title: "Component Library",
    description: "Browse and select electronic components",
    component: ComponentLibrary,
  },
};

export default function VisualizationContainer({
  sectionId,
  visualizations,
  className = "",
}: VisualizationContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType | null>(null);

  // Get available visualizations for current section
  // Prioritize visualizations prop from API, fall back to local mapping
  const availableVisualizations = useMemo(() => {
    if (visualizations && visualizations.length > 0) {
      // Filter out any visualization types that don't exist in VISUALIZATION_INFO
      const filtered = visualizations.filter(viz => viz in VISUALIZATION_INFO);
      // Log for debugging in development
      if (process.env.NODE_ENV === 'development' && filtered.length !== visualizations.length) {
        console.warn('Some visualization types not found in VISUALIZATION_INFO:', 
          visualizations.filter(viz => !(viz in VISUALIZATION_INFO)));
      }
      return filtered;
    }
    const fallback = sectionId ? FALLBACK_VISUALIZATIONS[sectionId] || [] : [];
    if (process.env.NODE_ENV === 'development' && fallback.length > 0) {
      console.info(`Using fallback visualizations for section ${sectionId}:`, fallback);
    }
    return fallback;
  }, [visualizations, sectionId]);

  // Set default active visualization with better memoization
  const currentVisualization = useMemo(() => {
    const active = activeVisualization || availableVisualizations[0];
    // Ensure the visualization exists in our info map
    return active && VISUALIZATION_INFO[active] ? active : null;
  }, [activeVisualization, availableVisualizations]);

  const VisualizationComponent = useMemo(
    () => currentVisualization ? VISUALIZATION_INFO[currentVisualization]?.component : null,
    [currentVisualization]
  );

  // Memoized visualization change handler to prevent unnecessary re-renders
  const handleVisualizationChange = useCallback((newViz: VisualizationType) => {
    if (newViz !== currentVisualization) {
      setActiveVisualization(newViz);
    }
  }, [currentVisualization]);

  // Memoize toggle handlers to prevent unnecessary re-renders
  const toggleVisibility = useCallback(() => setIsVisible((v) => !v), []);
  const toggleExpanded = useCallback(() => setIsExpanded((e) => !e), []);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isExpanded) {
      e.preventDefault();
      setIsExpanded(false);
    } else if (e.key === ' ' || e.key === 'Enter') {
      // Prevent space/enter from scrolling the page when buttons are focused
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        target.click();
      }
    }
  }, [isExpanded]);

  // If no visualizations available for this section, don't render
  if (availableVisualizations.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`No visualizations available for section: ${sectionId}`);
    }
    return null;
  }

  // Safety check: if current visualization is null, don't render content
  if (!currentVisualization) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Current visualization is null despite having available visualizations');
    }
    return null;
  }

  // Generate IDs for ARIA attributes
  const containerId = `visualization-${sectionId || 'default'}`;
  const titleId = `${containerId}-title`;
  const descriptionId = `${containerId}-description`;

  if (!isVisible) {
    return (
      <div
        className={`fixed bottom-4 right-4 z-50 ${className}`}
        data-oid="w:ntxmb"
      >
        <button
          onClick={toggleVisibility}
          className="p-3 bg-blue-600 dark:bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Show visualizations"
          aria-expanded="false"
          aria-controls={containerId}
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ${
        isExpanded ? "fixed inset-4 z-50" : "w-full max-w-2xl"
      } ${className}`}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      id={containerId}
    >
      <h2 id={titleId} className="sr-only">
        Interactive Visualization Panel
      </h2>
      <p id={descriptionId} className="sr-only">
        Interactive visualization for {VISUALIZATION_INFO[currentVisualization]?.title || 'current content'}
      </p>
      
      {/* Header */}
      <div 
        className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between"
        role="toolbar"
        aria-label="Visualization controls"
        aria-controls={`${containerId}-content`}
        data-tour="visualization-header"
      >
        <h3 className="font-medium text-gray-900 dark:text-white">
          {isVisible ? 'Interactive Visualization' : 'Visualization (Hidden)'}
        </h3>
        <div className="flex items-center space-x-2">
          {/* Visualization Selector */}
          {availableVisualizations.length > 1 && (
            <select
              value={currentVisualization}
              onChange={(e) => handleVisualizationChange(e.target.value as VisualizationType)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
              aria-label="Select visualization type"
              aria-describedby={descriptionId}
              data-tour="visualization-dropdown"
            >
              {availableVisualizations.map((viz) => (
                <option key={viz} value={viz}>
                  {VISUALIZATION_INFO[viz].title}
                </option>
              ))}
            </select>
          )}
          
          <button
            onClick={toggleExpanded}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
            aria-label={isExpanded ? 'Minimize visualization' : 'Maximize visualization'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={toggleVisibility}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
            aria-label="Hide visualization"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div 
        id={`${containerId}-content`}
        className={`p-4 ${isExpanded ? 'h-[calc(100%-3.5rem)]' : ''}`}
      >
        <VisualizationErrorBoundary visualizationType={currentVisualization}>
          <Suspense fallback={<LoadingFallback />}>
            {VisualizationComponent && <VisualizationComponent />}
          </Suspense>
        </VisualizationErrorBoundary>
      </div>
    </div>
  );
}
