"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VisualizationProps } from "./types";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

interface SeriesCircuitPreset {
  id: string;
  name: string;
  description: string;
  voltage: number; // V
  resistance1: number; // Ω
  resistance2: number; // Ω
  resistance3?: number; // Ω (optional third resistor)
  color: string;
}

const SERIES_CIRCUIT_PRESETS: SeriesCircuitPreset[] = [
  {
    id: 'equal-resistors',
    name: 'Equal Resistors',
    description: '12V, 3Ω each - Voltage splits equally',
    voltage: 12,
    resistance1: 3,
    resistance2: 3,
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'different-resistors',
    name: 'Different Resistors',
    description: '15V, 5Ω & 10Ω - Unequal voltage division',
    voltage: 15,
    resistance1: 5,
    resistance2: 10,
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'high-resistance-limit',
    name: 'High Resistance Limit',
    description: '12V, 2Ω & 100Ω - High resistance dominates',
    voltage: 12,
    resistance1: 2,
    resistance2: 100,
    color: 'bg-orange-100 border-orange-300'
  },
  {
    id: 'three-resistor-chain',
    name: 'Three Resistor Chain',
    description: '18V, 2Ω, 4Ω & 6Ω - Multiple voltage drops',
    voltage: 18,
    resistance1: 2,
    resistance2: 4,
    resistance3: 6,
    color: 'bg-purple-100 border-purple-300'
  }
];

interface SeriesCircuitVisualizationProps extends VisualizationProps {
  voltage?: number;
  resistance?: number;
  showElectrons?: boolean;
  animationSpeed?: number;
}

interface Electron {
  x: number;
  y: number;
  progress: number;
}

const SERIES_CIRCUIT_PATHS = [
  // Main loop path
  { start: { x: 50, y: 150 }, end: { x: 130, y: 150 }, type: "wire", segment: "bottom" },
  { start: { x: 130, y: 150 }, end: { x: 180, y: 150 }, type: "resistor1", segment: "bottom" },
  { start: { x: 180, y: 150 }, end: { x: 230, y: 150 }, type: "wire", segment: "bottom" },
  { start: { x: 230, y: 150 }, end: { x: 280, y: 150 }, type: "resistor2", segment: "bottom" },
  { start: { x: 280, y: 150 }, end: { x: 330, y: 150 }, type: "wire", segment: "bottom" },
  { start: { x: 330, y: 150 }, end: { x: 330, y: 80 }, type: "wire", segment: "right" },
  { start: { x: 330, y: 80 }, end: { x: 50, y: 80 }, type: "wire", segment: "top" },
  { start: { x: 50, y: 80 }, end: { x: 50, y: 150 }, type: "battery", segment: "left" },
];

const SERIES_CIRCUIT_PATHS_THREE = [
  // Three resistor path
  { start: { x: 50, y: 150 }, end: { x: 110, y: 150 }, type: "wire", segment: "bottom" },
  { start: { x: 110, y: 150 }, end: { x: 150, y: 150 }, type: "resistor1", segment: "bottom" },
  { start: { x: 150, y: 150 }, end: { x: 190, y: 150 }, type: "wire", segment: "bottom" },
  { start: { x: 190, y: 150 }, end: { x: 230, y: 150 }, type: "resistor2", segment: "bottom" },
  { start: { x: 230, y: 150 }, end: { x: 270, y: 150 }, type: "wire", segment: "bottom" },
  { start: { x: 270, y: 150 }, end: { x: 310, y: 150 }, type: "resistor3", segment: "bottom" },
  { start: { x: 310, y: 150 }, end: { x: 350, y: 150 }, type: "wire", segment: "bottom" },
  { start: { x: 350, y: 150 }, end: { x: 350, y: 80 }, type: "wire", segment: "right" },
  { start: { x: 350, y: 80 }, end: { x: 50, y: 80 }, type: "wire", segment: "top" },
  { start: { x: 50, y: 80 }, end: { x: 50, y: 150 }, type: "battery", segment: "left" },
];

export default function SeriesCircuitVisualization({
  voltage = 12,
  resistance = 10,
  showElectrons = true,
  animationSpeed = 1,
  interactive = true,
  size = "medium",
  className = "",
  onInteraction,
}: SeriesCircuitVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [electrons, setElectrons] = useState<Electron[]>([]);
  const [animTime, setAnimTime] = useState(0);
  const [currentAnimationSpeed, setCurrentAnimationSpeed] = useState(animationSpeed);
  const [selectedPreset, setSelectedPreset] = useState<SeriesCircuitPreset>(SERIES_CIRCUIT_PRESETS[0]);

  const sizeMap = {
    small: { width: 350, height: 280, scale: 0.7 },
    medium: { width: 450, height: 320, scale: 1 },
    large: { width: 550, height: 400, scale: 1.3 },
  };

  const { width, height, scale } = sizeMap[size];
  const paths = selectedPreset.resistance3 ? SERIES_CIRCUIT_PATHS_THREE : SERIES_CIRCUIT_PATHS;
  
  // Use selected preset values
  const currentVoltage = selectedPreset.voltage;
  const resistance1 = selectedPreset.resistance1;
  const resistance2 = selectedPreset.resistance2;
  const resistance3 = selectedPreset.resistance3 || 0;
  
  // Calculate series circuit values
  const totalResistance = resistance1 + resistance2 + (resistance3 || 0);
  const current = currentVoltage / totalResistance;
  const voltage1 = current * resistance1;
  const voltage2 = current * resistance2;
  const voltage3 = resistance3 ? current * resistance3 : 0;
  const power1 = current * voltage1;
  const power2 = current * voltage2;
  const power3 = resistance3 ? current * voltage3 : 0;
  const totalPower = power1 + power2 + power3;

  useEffect(() => {
    // Create electrons for the series circuit
    const electronCount = Math.min(12, Math.max(4, Math.floor(current * 8)));
    const newElectrons: Electron[] = [];
    
    for (let i = 0; i < electronCount; i++) {
      newElectrons.push({
        x: 0,
        y: 0,
        progress: (i / electronCount) * 100,
      });
    }
    
    setElectrons(newElectrons);
  }, [selectedPreset, current]);

  const calculateElectronPosition = useCallback((progress: number) => {
    const totalPathLength = paths.reduce((sum, path) => {
      const dx = path.end.x - path.start.x;
      const dy = path.end.y - path.start.y;
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    let currentLength = 0;
    const targetLength = (progress / 100) * totalPathLength;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const dx = path.end.x - path.start.x;
      const dy = path.end.y - path.start.y;
      const pathLength = Math.sqrt(dx * dx + dy * dy);

      if (currentLength + pathLength >= targetLength) {
        const segmentProgress = (targetLength - currentLength) / pathLength;
        return {
          x: path.start.x + dx * segmentProgress,
          y: path.start.y + dy * segmentProgress,
        };
      }
      currentLength += pathLength;
    }

    return paths[0].start;
  }, [paths]);

  const drawCircuit = useCallback((ctx: CanvasRenderingContext2D) => {
    paths.forEach((path) => {
      const startX = path.start.x * scale;
      const startY = path.start.y * scale;
      const endX = path.end.x * scale;
      const endY = path.end.y * scale;

      if (path.type === "wire") {
        // Draw wire
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      } else if (path.type === "resistor1") {
        // Draw resistor 1
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const length = 30 * scale;
        const height = 12 * scale;

        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 2 * scale;
        ctx.fillStyle = "#FEF2F2";
        
        ctx.fillRect(midX - length/2, midY - height/2, length, height);
        ctx.strokeRect(midX - length/2, midY - height/2, length, height);

        // Resistor symbol and value
        ctx.fillStyle = "#EF4444";
        ctx.font = `${8 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(`R1: ${resistance1}Ω`, midX, midY + 2 * scale);
        
        // Voltage drop label
        ctx.fillStyle = "#059669";
        ctx.font = `${7 * scale}px Arial`;
        ctx.fillText(`${voltage1.toFixed(1)}V`, midX, midY - 15 * scale);

        // Connect wires to resistor
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX - length/2, midY);
        ctx.moveTo(midX + length/2, midY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      } else if (path.type === "resistor2") {
        // Draw resistor 2
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const length = 30 * scale;
        const height = 12 * scale;

        ctx.strokeStyle = "#8B5CF6";
        ctx.lineWidth = 2 * scale;
        ctx.fillStyle = "#F3E8FF";
        
        ctx.fillRect(midX - length/2, midY - height/2, length, height);
        ctx.strokeRect(midX - length/2, midY - height/2, length, height);

        // Resistor symbol and value
        ctx.fillStyle = "#8B5CF6";
        ctx.font = `${8 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(`R2: ${resistance2}Ω`, midX, midY + 2 * scale);
        
        // Voltage drop label
        ctx.fillStyle = "#059669";
        ctx.font = `${7 * scale}px Arial`;
        ctx.fillText(`${voltage2.toFixed(1)}V`, midX, midY - 15 * scale);

        // Connect wires to resistor
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX - length/2, midY);
        ctx.moveTo(midX + length/2, midY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      } else if (path.type === "resistor3" && resistance3) {
        // Draw resistor 3 (only for three resistor configuration)
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const length = 30 * scale;
        const height = 12 * scale;

        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 2 * scale;
        ctx.fillStyle = "#FFFBEB";
        
        ctx.fillRect(midX - length/2, midY - height/2, length, height);
        ctx.strokeRect(midX - length/2, midY - height/2, length, height);

        // Resistor symbol and value
        ctx.fillStyle = "#F59E0B";
        ctx.font = `${8 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(`R3: ${resistance3}Ω`, midX, midY + 2 * scale);
        
        // Voltage drop label
        ctx.fillStyle = "#059669";
        ctx.font = `${7 * scale}px Arial`;
        ctx.fillText(`${voltage3.toFixed(1)}V`, midX, midY - 15 * scale);

        // Connect wires to resistor
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX - length/2, midY);
        ctx.moveTo(midX + length/2, midY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      } else if (path.type === "battery") {
        // Draw battery
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        ctx.strokeStyle = "#059669";
        ctx.lineWidth = 5 * scale;
        
        // Positive terminal
        ctx.beginPath();
        ctx.moveTo(midX - 15 * scale, midY - 5 * scale);
        ctx.lineTo(midX + 15 * scale, midY - 5 * scale);
        ctx.stroke();

        // Negative terminal
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(midX - 10 * scale, midY + 5 * scale);
        ctx.lineTo(midX + 10 * scale, midY + 5 * scale);
        ctx.stroke();

        // Battery labels and voltage
        ctx.fillStyle = "#059669";
        ctx.font = `${10 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("+", midX - 20 * scale, midY + 4 * scale);
        ctx.fillText("−", midX + 20 * scale, midY + 4 * scale);
        ctx.font = `${8 * scale}px Arial`;
        ctx.fillText(`${currentVoltage}V`, midX, midY + 20 * scale);
      }
    });
  }, [paths, scale, resistance1, resistance2, resistance3, currentVoltage, voltage1, voltage2, voltage3]);

  const drawCurrentArrows = useCallback((ctx: CanvasRenderingContext2D, localAnimTime: number) => {
    if (!isPlaying) return;

    const arrowSpacing = 80 * scale;
    const arrowOffset = (localAnimTime * currentAnimationSpeed * 0.6) % arrowSpacing;

    paths.forEach((path) => {
      const dx = path.end.x - path.start.x;
      const dy = path.end.y - path.start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const unitX = dx / length;
      const unitY = dy / length;

      for (let i = arrowOffset; i < length * scale; i += arrowSpacing) {
        const x = (path.start.x * scale) + (unitX * i);
        const y = (path.start.y * scale) + (unitY * i);

        // Draw arrow
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        
        const arrowLength = 8 * scale;
        const arrowHeadLength = 4 * scale;
        
        // Arrow shaft
        ctx.moveTo(x - unitX * arrowLength / 2, y - unitY * arrowLength / 2);
        ctx.lineTo(x + unitX * arrowLength / 2, y + unitY * arrowLength / 2);
        
        // Arrow head
        const perpX = -unitY;
        const perpY = unitX;
        
        ctx.moveTo(x + unitX * arrowLength / 2, y + unitY * arrowLength / 2);
        ctx.lineTo(
          x + unitX * arrowLength / 2 - unitX * arrowHeadLength + perpX * arrowHeadLength / 2,
          y + unitY * arrowLength / 2 - unitY * arrowHeadLength + perpY * arrowHeadLength / 2
        );
        
        ctx.moveTo(x + unitX * arrowLength / 2, y + unitY * arrowLength / 2);
        ctx.lineTo(
          x + unitX * arrowLength / 2 - unitX * arrowHeadLength - perpX * arrowHeadLength / 2,
          y + unitY * arrowLength / 2 - unitY * arrowHeadLength - perpY * arrowHeadLength / 2
        );
        
        ctx.stroke();
      }
    });
  }, [isPlaying, currentAnimationSpeed, paths, scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localAnimTime = 0;
    let localElectrons = [...electrons];

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw circuit components
      drawCircuit(ctx);

      // Update and draw electrons
      if (showElectrons && isPlaying) {
        localElectrons = localElectrons.map((electron) => {
          const newProgress = (electron.progress + (current * currentAnimationSpeed * 0.2)) % 100;
          const position = calculateElectronPosition(newProgress);
          
          return {
            ...electron,
            progress: newProgress,
            x: position.x,
            y: position.y,
          };
        });

        // Draw electrons
        localElectrons.forEach((electron) => {
          ctx.fillStyle = "#3B82F6";
          ctx.beginPath();
          ctx.arc(electron.x * scale, electron.y * scale, 3 * scale, 0, 2 * Math.PI);
          ctx.fill();

          // Draw electron trail
          ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
          ctx.beginPath();
          ctx.arc(electron.x * scale, electron.y * scale, 6 * scale, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // Draw current flow arrows
      drawCurrentArrows(ctx, localAnimTime);

      if (isPlaying) {
        localAnimTime += 1;
        setAnimTime(localAnimTime);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, current, currentAnimationSpeed, showElectrons, scale, width, height, calculateElectronPosition, drawCircuit, drawCurrentArrows]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    onInteraction?.({ action: "toggle", isPlaying: !isPlaying });
  };

  const resetAnimation = () => {
    setAnimTime(0);
    setElectrons(prev => prev.map((e, i) => ({ ...e, progress: (i / prev.length) * 100 })));
    onInteraction?.({ action: "reset" });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Current Flow - Series Circuit
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayPause}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isPlaying 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isPlaying ? 'Stop' : 'Start'}
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
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Circuit Configuration:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SERIES_CIRCUIT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (!isPlaying) {
                  setSelectedPreset(preset);
                }
              }}
              disabled={isPlaying}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedPreset.id === preset.id
                  ? `${preset.color} border-current shadow-md`
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium text-gray-900 mb-1">{preset.name}</div>
              <div className="text-sm text-gray-600 mb-2">{preset.description}</div>
              <div className="text-xs text-gray-500">
                Total R: {(preset.resistance1 + preset.resistance2 + (preset.resistance3 || 0))}Ω | 
                Current: {(preset.voltage / (preset.resistance1 + preset.resistance2 + (preset.resistance3 || 0))).toFixed(2)}A
              </div>
            </button>
          ))}
        </div>
        {isPlaying && (
          <div className="text-xs text-gray-500 mt-2">
            Stop animation to change circuit configuration
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
          <div className="text-sm font-medium text-gray-600">Total Voltage</div>
          <div className="text-lg font-bold text-green-600">{currentVoltage} V</div>
          <div className="text-xs text-gray-500">Source voltage</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Current</div>
          <div className="text-lg font-bold text-blue-600">{current.toFixed(2)} A</div>
          <div className="text-xs text-gray-500">Same throughout</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Total Resistance</div>
          <div className="text-lg font-bold text-red-600">{totalResistance} Ω</div>
          <div className="text-xs text-gray-500">R₁ + R₂{resistance3 ? ' + R₃' : ''}</div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Total Power</div>
          <div className="text-lg font-bold text-purple-600">{totalPower.toFixed(1)} W</div>
          <div className="text-xs text-gray-500">V × I</div>
        </div>
      </div>

      {/* Voltage Division Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-sm font-medium text-red-700">R1 Voltage Drop</div>
          <div className="text-lg font-bold text-red-600">{voltage1.toFixed(1)} V</div>
          <div className="text-xs text-gray-600">{resistance1}Ω × {current.toFixed(2)}A</div>
        </div>
        
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-sm font-medium text-purple-700">R2 Voltage Drop</div>
          <div className="text-lg font-bold text-purple-600">{voltage2.toFixed(1)} V</div>
          <div className="text-xs text-gray-600">{resistance2}Ω × {current.toFixed(2)}A</div>
        </div>

        {resistance3 && (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-sm font-medium text-orange-700">R3 Voltage Drop</div>
            <div className="text-lg font-bold text-orange-600">{voltage3.toFixed(1)} V</div>
            <div className="text-xs text-gray-600">{resistance3}Ω × {current.toFixed(2)}A</div>
          </div>
        )}
      </div>

      {/* Educational Info */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            How Series Circuits Work:
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            In series circuits, components share the same current but split the voltage. 
            Each resistor creates a voltage drop proportional to its resistance.
          </p>
          <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded font-mono">
            Rtotal = R1 + R2{resistance3 ? ' + R3' : ''} | Voltage: {selectedPreset.name} configuration
          </div>
        </div>
        
        {/* Dynamic Status Display */}
        <div className={`p-3 rounded-lg border ${
          !isPlaying ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            !isPlaying ? 'text-gray-700' : 'text-green-800'
          }`}>
            Status: {!isPlaying ? 'Circuit Ready' : 'Current Flowing'}
          </h4>
          <div className={`text-sm ${
            !isPlaying ? 'text-gray-600' : 'text-green-700'
          }`}>
            {!isPlaying ? 
              `${selectedPreset.name} ready. Click "Start" to see voltage division in action.` :
              `${selectedPreset.name} - Voltage drops: R1=${voltage1.toFixed(1)}V, R2=${voltage2.toFixed(1)}V${resistance3 ? `, R3=${voltage3.toFixed(1)}V` : ''}`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Series Circuit Laws:</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Current:</strong> Same throughout entire circuit (I₁ = I₂ = Itotal)</li>
          <li>• <strong>Voltage Division:</strong> Splits proportionally with resistance (higher R = higher V)</li>
          <li>• <strong>Total Voltage:</strong> Sum of all voltage drops (Vtotal = V₁ + V₂)</li>
          <li>• <strong>Total Resistance:</strong> Sum of all resistances (Rtotal = R₁ + R₂)</li>
          <li>• <strong>Power:</strong> Each component gets different power based on its voltage drop</li>
          <li>• <strong>Failure Impact:</strong> One break stops entire circuit</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Circuit Comparison:</h4>
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div className="font-medium text-gray-700">Configuration</div>
          <div className="font-medium text-gray-700">Current</div>
          <div className="font-medium text-gray-700">R₁ Voltage</div>
          <div className="font-medium text-gray-700">R₂ Voltage</div>
          <div className="font-medium text-gray-700">Total R</div>
          <div className="font-medium text-gray-700">Total Power</div>
          
          {SERIES_CIRCUIT_PRESETS.map((preset) => {
            const totalR = preset.resistance1 + preset.resistance2 + (preset.resistance3 || 0);
            const i = preset.voltage / totalR;
            const v1 = i * preset.resistance1;
            const v2 = i * preset.resistance2;
            const p = preset.voltage * i;
            
            return (
              <React.Fragment key={preset.id}>
                <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.name}
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {i.toFixed(2)}A
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {v1.toFixed(1)}V
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {v2.toFixed(1)}V
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {totalR}Ω
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {p.toFixed(1)}W
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}