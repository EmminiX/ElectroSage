"use client";

import React, { useState, useEffect, useRef } from "react";
import { VisualizationProps, AtomicStructureData } from "./types";
import { Atom, Play, Pause, RotateCcw, Zap } from "lucide-react";

interface AtomicPreset {
  id: string;
  name: string;
  description: string;
  element: string;
  symbol: string;
  atomicNumber: number;
  massNumber: number;
  conductivity: 'insulator' | 'semiconductor' | 'conductor';
  valenceElectrons: number;
  color: string;
}

const ATOMIC_PRESETS: AtomicPreset[] = [
  {
    id: 'hydrogen',
    name: 'Hydrogen',
    description: 'H - Simplest element, 1 proton, 1 electron',
    element: 'hydrogen',
    symbol: 'H',
    atomicNumber: 1,
    massNumber: 1,
    conductivity: 'insulator',
    valenceElectrons: 1,
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'carbon',
    name: 'Carbon', 
    description: 'C - Basis of organic chemistry, 4 valence electrons',
    element: 'carbon',
    symbol: 'C',
    atomicNumber: 6,
    massNumber: 12,
    conductivity: 'semiconductor',
    valenceElectrons: 4,
    color: 'bg-gray-100 border-gray-300'
  },
  {
    id: 'copper',
    name: 'Copper',
    description: 'Cu - Excellent conductor, 1 valence electron',
    element: 'copper',
    symbol: 'Cu',
    atomicNumber: 29,
    massNumber: 63,
    conductivity: 'conductor',
    valenceElectrons: 1,
    color: 'bg-amber-100 border-amber-300'
  },
  {
    id: 'silicon',
    name: 'Silicon',
    description: 'Si - Semiconductor material, 4 valence electrons',
    element: 'silicon',
    symbol: 'Si',
    atomicNumber: 14,
    massNumber: 28,
    conductivity: 'semiconductor',
    valenceElectrons: 4,
    color: 'bg-purple-100 border-purple-300'
  }
];

interface AtomicStructureVisualizationProps extends VisualizationProps {
  element?: string;
  atomicNumber?: number;
  showLabels?: boolean;
  animated?: boolean;
}

const ELEMENTS = {
  hydrogen: { protons: 1, neutrons: 0, electrons: 1, shells: [[1]] },
  helium: { protons: 2, neutrons: 2, electrons: 2, shells: [[2]] },
  lithium: { protons: 3, neutrons: 4, electrons: 3, shells: [[2], [1]] },
  carbon: { protons: 6, neutrons: 6, electrons: 6, shells: [[2], [4]] },
  oxygen: { protons: 8, neutrons: 8, electrons: 8, shells: [[2], [6]] },
  sodium: { protons: 11, neutrons: 12, electrons: 11, shells: [[2], [8], [1]] },
  silicon: { protons: 14, neutrons: 14, electrons: 14, shells: [[2], [8], [4]] },
  copper: {
    protons: 29,
    neutrons: 34,
    electrons: 29,
    shells: [[2], [8], [18], [1]],
  },
};

export default function AtomicStructureVisualization({
  element = "carbon",
  showLabels = true,
  animated = true,
  interactive = true,
  size = "medium",
  className = "",
  onInteraction,
}: AtomicStructureVisualizationProps) {
  const [selectedPreset, setSelectedPreset] = useState<AtomicPreset>(ATOMIC_PRESETS[1]); // Default to carbon
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const atomData =
    ELEMENTS[selectedPreset.element as keyof typeof ELEMENTS] || ELEMENTS.carbon;
  
  // Use selected preset values
  const selectedElement = selectedPreset.element;
  const symbol = selectedPreset.symbol;
  const atomicNumber = selectedPreset.atomicNumber;
  const massNumber = selectedPreset.massNumber;
  const conductivity = selectedPreset.conductivity;
  const valenceElectrons = selectedPreset.valenceElectrons;
  
  // Calculate derived values
  const totalElectrons = atomData.electrons;
  const totalProtons = atomData.protons;
  const totalNeutrons = atomData.neutrons;
  const numberOfShells = atomData.shells.length;
  const atomicMass = totalProtons + totalNeutrons;

  const sizeMap = {
    small: { width: 300, height: 300, scale: 0.8 },
    medium: { width: 400, height: 400, scale: 1 },
    large: { width: 500, height: 500, scale: 1.2 },
  };

  const { width, height, scale } = sizeMap[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const nucleusRadius = 20 * scale;

      // Draw nucleus
      ctx.fillStyle = "#4F46E5";
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw protons and neutrons in nucleus
      const particleRadius = 4 * scale;
      const totalNuclearParticles = atomData.protons + atomData.neutrons;

      for (let i = 0; i < totalNuclearParticles; i++) {
        const angle = (i / totalNuclearParticles) * 2 * Math.PI;
        const x = centerX + Math.cos(angle) * (nucleusRadius * 0.6);
        const y = centerY + Math.sin(angle) * (nucleusRadius * 0.6);

        ctx.fillStyle = i < atomData.protons ? "#EF4444" : "#6B7280";
        ctx.beginPath();
        ctx.arc(x, y, particleRadius, 0, 2 * Math.PI);
        ctx.fill();

        if (showLabels && scale > 0.8) {
          ctx.fillStyle = "white";
          ctx.font = `${8 * scale}px Arial`;
          ctx.textAlign = "center";
          ctx.fillText(i < atomData.protons ? "P" : "N", x, y + 2);
        }
      }

      // Draw electron shells and electrons
      atomData.shells.forEach((shell, shellIndex) => {
        const shellRadius = (60 + shellIndex * 40) * scale;

        // Draw shell orbit
        ctx.strokeStyle = "#E5E7EB";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw electrons
        shell.forEach((_, electronIndex) => {
          const totalElectronsInShell = shell.length;
          const baseAngle =
            (electronIndex / totalElectronsInShell) * 2 * Math.PI;
          const animationOffset = isAnimating
            ? animationTime * 0.02 * (shellIndex + 1)
            : 0;
          const angle = baseAngle + animationOffset;

          const x = centerX + Math.cos(angle) * shellRadius;
          const y = centerY + Math.sin(angle) * shellRadius;

          ctx.fillStyle = "#10B981";
          ctx.beginPath();
          ctx.arc(x, y, 6 * scale, 0, 2 * Math.PI);
          ctx.fill();

          if (showLabels && scale > 0.8) {
            ctx.fillStyle = "white";
            ctx.font = `${8 * scale}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText("e⁻", x, y + 2);
          }
        });
      });

      // Draw labels
      if (showLabels) {
        ctx.fillStyle = "#1F2937";
        ctx.font = `${16 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(
          selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1),
          centerX,
          30,
        );

        ctx.font = `${12 * scale}px Arial`;
        ctx.fillText(`Protons: ${atomData.protons}`, centerX, height - 60);
        ctx.fillText(`Neutrons: ${atomData.neutrons}`, centerX, height - 40);
        ctx.fillText(`Electrons: ${atomData.electrons}`, centerX, height - 20);
      }

      if (isAnimating) {
        animationTime++;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedPreset, selectedElement, showLabels, isAnimating, scale, width, height, atomData.electrons, atomData.neutrons, atomData.protons, atomData.shells]);

  const togglePlayPause = () => {
    setIsAnimating(!isAnimating);
    onInteraction?.({ action: "toggle", isAnimating: !isAnimating });
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    onInteraction?.({ action: "reset" });
  };

  const getConductivityColor = (conductivity: string) => {
    switch (conductivity) {
      case 'conductor': return 'text-green-600';
      case 'semiconductor': return 'text-yellow-600';
      case 'insulator': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConductivityDescription = (conductivity: string) => {
    switch (conductivity) {
      case 'conductor': return 'Electrons move freely, excellent for wiring';
      case 'semiconductor': return 'Controlled electron flow, used in electronics';
      case 'insulator': return 'Electrons tightly bound, blocks current flow';
      default: return 'Unknown conductivity';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Atom className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Atomic Structure
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayPause}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isAnimating 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAnimating ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={resetAnimation}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Preset Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Element:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ATOMIC_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (!isAnimating) {
                  setSelectedPreset(preset);
                }
              }}
              disabled={isAnimating}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedPreset.id === preset.id
                  ? `${preset.color} border-current shadow-md`
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium text-gray-900 mb-1">{preset.name} ({preset.symbol})</div>
              <div className="text-sm text-gray-600 mb-2">{preset.description}</div>
              <div className="text-xs text-gray-500">
                Atomic #: {preset.atomicNumber} | Conductivity: <span className={getConductivityColor(preset.conductivity)}>{preset.conductivity.toUpperCase()}</span>
              </div>
            </button>
          ))}
        </div>
        {isAnimating && (
          <div className="text-xs text-gray-500 mt-2">
            Stop animation to change element
          </div>
        )}
      </div>

      <div className="flex justify-center mb-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded bg-gray-50"
        />
      </div>

      {/* Real-time readings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Atomic Number</div>
          <div className="text-lg font-bold text-purple-600">{atomicNumber}</div>
          <div className="text-xs text-gray-500">Number of protons</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Mass Number</div>
          <div className="text-lg font-bold text-blue-600">{atomicMass}</div>
          <div className="text-xs text-gray-500">Protons + neutrons</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Valence Electrons</div>
          <div className="text-lg font-bold text-green-600">{valenceElectrons}</div>
          <div className="text-xs text-gray-500">Outer shell electrons</div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Electron Shells</div>
          <div className="text-lg font-bold text-orange-600">{numberOfShells}</div>
          <div className="text-xs text-gray-500">Energy levels</div>
        </div>
      </div>

      {/* Particle Count Display */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-sm font-medium text-red-700 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            Protons
          </div>
          <div className="text-lg font-bold text-red-600">{totalProtons}</div>
          <div className="text-xs text-gray-600">Positive charge (+)</div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            Neutrons
          </div>
          <div className="text-lg font-bold text-gray-600">{totalNeutrons}</div>
          <div className="text-xs text-gray-600">Neutral charge (0)</div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-700 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Electrons
          </div>
          <div className="text-lg font-bold text-green-600">{totalElectrons}</div>
          <div className="text-xs text-gray-600">Negative charge (-)</div>
        </div>
      </div>

      {/* Conductivity Information */}
      <div className="mb-6">
        <div className={`p-3 rounded-lg border ${
          conductivity === 'conductor' ? 'bg-green-50 border-green-200' :
          conductivity === 'semiconductor' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className={`text-sm font-medium mb-1 ${
            conductivity === 'conductor' ? 'text-green-700' :
            conductivity === 'semiconductor' ? 'text-yellow-700' :
            'text-red-700'
          }`}>
            Electrical Conductivity: <span className={getConductivityColor(conductivity)}>{conductivity.toUpperCase()}</span>
          </div>
          <div className="text-sm text-gray-700">
            {getConductivityDescription(conductivity)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Valence electrons: {valenceElectrons} (determines electrical properties)
          </div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
            <Atom className="w-4 h-4" />
            How Atomic Structure Works:
          </h4>
          <p className="text-sm text-purple-800 mb-2">
            Atoms consist of a nucleus (protons + neutrons) surrounded by electron shells. 
            The number of valence electrons determines how readily the element conducts electricity.
          </p>
          <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded font-mono">
            {selectedPreset.symbol}: {totalProtons}p + {totalNeutrons}n + {totalElectrons}e⁻ | Element: {selectedPreset.name}
          </div>
        </div>
        
        {/* Dynamic Status Display */}
        <div className={`p-3 rounded-lg border ${
          !isAnimating ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            !isAnimating ? 'text-gray-700' : 'text-green-800'
          }`}>
            Status: {!isAnimating ? 'Atom Ready' : 'Electron Orbits Active'}
          </h4>
          <div className={`text-sm ${
            !isAnimating ? 'text-gray-600' : 'text-green-700'
          }`}>
            {!isAnimating ? 
              `${selectedPreset.name} atom ready. Click "Start" to see electron orbital motion.` :
              `${selectedPreset.name} - Electrons orbiting in ${numberOfShells} shell${numberOfShells > 1 ? 's' : ''}`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Atomic Structure Concepts:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Nucleus:</strong> Contains protons (+) and neutrons (0) - determines atomic mass</li>
          <li>• <strong>Electron Shells:</strong> Energy levels where electrons orbit the nucleus</li>
          <li>• <strong>Valence Electrons:</strong> Outer shell electrons that determine chemical/electrical properties</li>
          <li>• <strong>Conductivity:</strong> Based on how easily valence electrons can move</li>
          <li>• <strong>Atomic Number:</strong> Number of protons - defines the element</li>
          <li>• <strong>Neutral Atom:</strong> Equal number of protons and electrons</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Element Comparison:</h4>
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div className="font-medium text-gray-700">Element</div>
          <div className="font-medium text-gray-700">Symbol</div>
          <div className="font-medium text-gray-700">Atomic #</div>
          <div className="font-medium text-gray-700">Valence e⁻</div>
          <div className="font-medium text-gray-700">Shells</div>
          <div className="font-medium text-gray-700">Conductivity</div>
          
          {ATOMIC_PRESETS.map((preset) => {
            const elementData = ELEMENTS[preset.element as keyof typeof ELEMENTS];
            
            return (
              <React.Fragment key={preset.id}>
                <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.name}
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.symbol}
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.atomicNumber}
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.valenceElectrons}
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {elementData?.shells.length || 0}
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  <span className={getConductivityColor(preset.conductivity)}>{preset.conductivity.slice(0,4).toUpperCase()}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
