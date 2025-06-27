"use client";

import { VisualizationType } from "@/data/types";
import AtomStructure from "@/components/visualizations/atoms/AtomStructure";
import SeriesCircuit from "@/components/visualizations/circuits/SeriesCircuit";
import OhmsLaw from "@/components/visualizations/OhmsLaw";

interface VisualizationManagerProps {
  visualizations: VisualizationType[];
  className?: string;
}

export default function VisualizationManager({
  visualizations,
  className = "",
}: VisualizationManagerProps) {
  if (visualizations.length === 0) {
    return null;
  }

  const renderVisualization = (type: VisualizationType, index: number) => {
    switch (type) {
      case "atom-structure":
        return (
          <AtomStructure
            key={`${type}-${index}`}
            atomType="carbon"
            data-oid="pxekmp2"
          />
        );

      case "circuit-series":
        return <SeriesCircuit key={`${type}-${index}`} data-oid="kb72a.l" />;

      case "ohms-law":
        return <OhmsLaw key={`${type}-${index}`} data-oid="08qml59" />;

      case "voltage-demo":
        return (
          <div
            key={`${type}-${index}`}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            data-oid="env4n:-"
          >
            <h4 className="font-semibold mb-2" data-oid="m.3_1o_">
              Voltage Demonstration
            </h4>
            <p className="text-sm text-gray-600" data-oid="_gdvi6l">
              Interactive voltage visualization would be displayed here.
            </p>
          </div>
        );

      case "current-flow":
        return (
          <div
            key={`${type}-${index}`}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
            data-oid="jc618x3"
          >
            <h4 className="font-semibold mb-2" data-oid="vg76uz4">
              Current Flow Animation
            </h4>
            <p className="text-sm text-gray-600" data-oid="do3uf6_">
              Animated current flow visualization would be displayed here.
            </p>
          </div>
        );

      case "resistance-demo":
        return (
          <div
            key={`${type}-${index}`}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
            data-oid="4j_k6np"
          >
            <h4 className="font-semibold mb-2" data-oid="64.f-c0">
              Resistance Demonstration
            </h4>
            <p className="text-sm text-gray-600" data-oid="-6r-wxu">
              Interactive resistance visualization would be displayed here.
            </p>
          </div>
        );

      default:
        return (
          <div
            key={`${type}-${index}`}
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
            data-oid="6-5n-8t"
          >
            <h4 className="font-semibold mb-2" data-oid="tbw.fpw">
              Visualization: {type}
            </h4>
            <p className="text-sm text-gray-600" data-oid="h00tkyl">
              This visualization is not yet implemented.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`} data-oid="opquv.z">
      <h3 className="text-lg font-semibold text-gray-800" data-oid=":tiyxve">
        Interactive Visualizations
      </h3>
      <div className="grid grid-cols-1 gap-4" data-oid="15r_y3-">
        {visualizations.map((viz, index) => renderVisualization(viz, index))}
      </div>
    </div>
  );
}
