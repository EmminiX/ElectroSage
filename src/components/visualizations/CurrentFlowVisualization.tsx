"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VisualizationProps } from "./types";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

interface ParallelCircuitPreset {
  id: string;
  name: string;
  description: string;
  voltage: number; // V
  resistance1: number; // Ω
  resistance2: number; // Ω
  color: string;
}

const PARALLEL_CIRCUIT_PRESETS: ParallelCircuitPreset[] = [
  {
    id: 'equal-resistors',
    name: 'Equal Resistors',
    description: '12V, 10Ω each - Current splits equally',
    voltage: 12,
    resistance1: 10,
    resistance2: 10,
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'different-resistors',
    name: 'Different Resistors',
    description: '12V, 5Ω & 20Ω - Unequal current division',
    voltage: 12,
    resistance1: 5,
    resistance2: 20,
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'low-resistance-path',
    name: 'Low Resistance Path',
    description: '9V, 2Ω & 50Ω - Most current takes easy path',
    voltage: 9,
    resistance1: 2,
    resistance2: 50,
    color: 'bg-orange-100 border-orange-300'
  },
  {
    id: 'three-branch',
    name: 'Three Branch Circuit',
    description: '15V, 6Ω, 12Ω & 4Ω - Multiple current paths',
    voltage: 15,
    resistance1: 6,
    resistance2: 12,
    color: 'bg-purple-100 border-purple-300'
  }
];

interface CurrentFlowVisualizationProps extends VisualizationProps {
  circuitType?: "series" | "parallel";
  voltage?: number;
  resistance?: number;
  showElectrons?: boolean;
  animationSpeed?: number;
}

interface Electron {
  x: number;
  y: number;
  progress: number;
  pathIndex: number;
}

const PARALLEL_CIRCUIT_PATHS = [
  // Branch 1 - Top path
  { start: { x: 50, y: 150 }, end: { x: 130, y: 150 }, type: "wire", branch: "main" },
  { start: { x: 130, y: 150 }, end: { x: 130, y: 80 }, type: "wire", branch: "1" },
  { start: { x: 130, y: 80 }, end: { x: 270, y: 80 }, type: "resistor1", branch: "1" },
  { start: { x: 270, y: 80 }, end: { x: 270, y: 150 }, type: "wire", branch: "1" },
  
  // Branch 2 - Bottom path  
  { start: { x: 130, y: 150 }, end: { x: 130, y: 220 }, type: "wire", branch: "2" },
  { start: { x: 130, y: 220 }, end: { x: 270, y: 220 }, type: "resistor2", branch: "2" },
  { start: { x: 270, y: 220 }, end: { x: 270, y: 150 }, type: "wire", branch: "2" },
  
  // Return and battery
  { start: { x: 270, y: 150 }, end: { x: 350, y: 150 }, type: "wire", branch: "main" },
  { start: { x: 350, y: 150 }, end: { x: 50, y: 150 }, type: "battery", branch: "main" },
];

export default function CurrentFlowVisualization({
  circuitType = "parallel",
  voltage = 12,
  resistance = 10,
  showElectrons = true,
  animationSpeed = 1,
  interactive = true,
  size = "medium",
  className = "",
  onInteraction,
}: CurrentFlowVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [electrons, setElectrons] = useState<Electron[]>([]);
  const [animTime, setAnimTime] = useState(0);
  const [currentAnimationSpeed, setCurrentAnimationSpeed] = useState(animationSpeed);
  const [selectedPreset, setSelectedPreset] = useState<ParallelCircuitPreset>(PARALLEL_CIRCUIT_PRESETS[0]);

  const sizeMap = {
    small: { width: 300, height: 280, scale: 0.7 },
    medium: { width: 400, height: 320, scale: 1 },
    large: { width: 500, height: 400, scale: 1.3 },
  };

  const { width, height, scale } = sizeMap[size];
  const paths = PARALLEL_CIRCUIT_PATHS;
  
  // Use selected preset values
  const currentVoltage = selectedPreset.voltage;
  const resistance1 = selectedPreset.resistance1;
  const resistance2 = selectedPreset.resistance2;
  
  // Calculate parallel circuit values
  const current1 = currentVoltage / resistance1;
  const current2 = currentVoltage / resistance2;
  const totalCurrent = current1 + current2;
  const equivalentResistance = (resistance1 * resistance2) / (resistance1 + resistance2);
  const power1 = currentVoltage * current1;
  const power2 = currentVoltage * current2;
  const totalPower = power1 + power2;

  useEffect(() => {
    // Create electrons for both branches based on their current
    const electronCount1 = Math.min(8, Math.max(2, Math.floor(current1 * 1.5)));
    const electronCount2 = Math.min(8, Math.max(2, Math.floor(current2 * 1.5)));
    const newElectrons: Electron[] = [];
    
    // Branch 1 electrons
    for (let i = 0; i < electronCount1; i++) {
      newElectrons.push({
        x: 0,
        y: 0,
        progress: (i / electronCount1) * 100,
        pathIndex: 1, // Branch 1
      });
    }
    
    // Branch 2 electrons
    for (let i = 0; i < electronCount2; i++) {
      newElectrons.push({
        x: 0,
        y: 0,
        progress: (i / electronCount2) * 100,
        pathIndex: 2, // Branch 2
      });
    }
    
    setElectrons(newElectrons);
  }, [selectedPreset, current1, current2]);

  const calculateElectronPosition = useCallback((progress: number, branch: number) => {
    // Get paths for specific branch
    const branchPaths = branch === 1 
      ? paths.filter(p => p.branch === "main" || p.branch === "1")
      : paths.filter(p => p.branch === "main" || p.branch === "2");

    const totalPathLength = branchPaths.reduce((sum, path) => {
      const dx = path.end.x - path.start.x;
      const dy = path.end.y - path.start.y;
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    let currentLength = 0;
    const targetLength = (progress / 100) * totalPathLength;

    for (let i = 0; i < branchPaths.length; i++) {
      const path = branchPaths[i];
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

    return branchPaths[0].start;
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
        // Draw resistor 1 (top branch)
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const length = 40 * scale;
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
        // Draw resistor 2 (bottom branch)
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const length = 40 * scale;
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
        ctx.moveTo(midX - 5 * scale, midY - 15 * scale);
        ctx.lineTo(midX - 5 * scale, midY + 15 * scale);
        ctx.stroke();

        // Negative terminal
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(midX + 5 * scale, midY - 10 * scale);
        ctx.lineTo(midX + 5 * scale, midY + 10 * scale);
        ctx.stroke();

        // Battery labels and voltage
        ctx.fillStyle = "#059669";
        ctx.font = `${10 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("+", midX - 15 * scale, midY + 4 * scale);
        ctx.fillText("−", midX + 15 * scale, midY + 4 * scale);
        ctx.font = `${8 * scale}px Arial`;
        ctx.fillText(`${currentVoltage}V`, midX, midY + 25 * scale);
      }
    });
  }, [paths, scale, resistance1, resistance2, currentVoltage]);

  const drawCurrentArrows = useCallback((ctx: CanvasRenderingContext2D, localAnimTime: number) => {
    if (!isPlaying) return;

    const arrowSpacing = 80 * scale;
    // Slower arrow animation for better visibility
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
          // Different speeds based on branch current
          const branchCurrent = electron.pathIndex === 1 ? current1 : current2;
          const newProgress = (electron.progress + (branchCurrent * currentAnimationSpeed * 0.15)) % 100;
          const position = calculateElectronPosition(newProgress, electron.pathIndex);
          
          return {
            ...electron,
            progress: newProgress,
            x: position.x,
            y: position.y,
          };
        });

        // Draw electrons with branch-specific colors
        localElectrons.forEach((electron) => {
          const color = electron.pathIndex === 1 ? "#3B82F6" : "#8B5CF6"; // Blue for branch 1, purple for branch 2
          const trailColor = electron.pathIndex === 1 ? "rgba(59, 130, 246, 0.3)" : "rgba(139, 92, 246, 0.3)";
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(electron.x * scale, electron.y * scale, 3 * scale, 0, 2 * Math.PI);
          ctx.fill();

          // Draw electron trail
          ctx.fillStyle = trailColor;
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
  }, [isPlaying, current1, current2, currentAnimationSpeed, showElectrons, scale, width, height, calculateElectronPosition, drawCircuit, drawCurrentArrows]);

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
            Current Flow - Parallel Circuit
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
          {PARALLEL_CIRCUIT_PRESETS.map((preset) => (
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
                Req: {((preset.resistance1 * preset.resistance2) / (preset.resistance1 + preset.resistance2)).toFixed(1)}Ω | 
                Total: {(preset.voltage * (preset.voltage / preset.resistance1 + preset.voltage / preset.resistance2)).toFixed(1)}W
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
          <div className="text-sm font-medium text-gray-600">Voltage</div>
          <div className="text-lg font-bold text-green-600">{currentVoltage} V</div>
          <div className="text-xs text-gray-500">Same across branches</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Total Current</div>
          <div className="text-lg font-bold text-blue-600">{totalCurrent.toFixed(2)} A</div>
          <div className="text-xs text-gray-500">I₁ + I₂</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Branch 1 Current</div>
          <div className="text-lg font-bold text-red-600">{current1.toFixed(2)} A</div>
          <div className="text-xs text-gray-500">{currentVoltage}V ÷ {resistance1}Ω</div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Branch 2 Current</div>
          <div className="text-lg font-bold text-purple-600">{current2.toFixed(2)} A</div>
          <div className="text-xs text-gray-500">{currentVoltage}V ÷ {resistance2}Ω</div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            How Parallel Circuits Work:
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            In parallel circuits, components share the same voltage but split the current. 
            Each branch provides an independent path for current flow.
          </p>
          <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded font-mono">
            1/Rtotal = 1/R1 + 1/R2 | Current: {selectedPreset.name} configuration
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
              `${selectedPreset.name} ready. Click "Start" to see current division in action.` :
              `${selectedPreset.name} - Current splits: ${((current1/totalCurrent)*100).toFixed(1)}% to R1, ${((current2/totalCurrent)*100).toFixed(1)}% to R2`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Parallel Circuit Laws:</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Voltage:</strong> Same across all branches (V₁ = V₂ = Vsource)</li>
          <li>• <strong>Current Division:</strong> Splits inversely with resistance (lower R = higher I)</li>
          <li>• <strong>Total Current:</strong> Sum of all branch currents (Itotal = I₁ + I₂)</li>
          <li>• <strong>Equivalent Resistance:</strong> Always less than smallest resistor</li>
          <li>• <strong>Power:</strong> Each branch gets full voltage, total power = P₁ + P₂</li>
          <li>• <strong>Independence:</strong> Each branch operates independently</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Circuit Comparison:</h4>
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div className="font-medium text-gray-700">Configuration</div>
          <div className="font-medium text-gray-700">Voltage</div>
          <div className="font-medium text-gray-700">R₁ Current</div>
          <div className="font-medium text-gray-700">R₂ Current</div>
          <div className="font-medium text-gray-700">Total Current</div>
          <div className="font-medium text-gray-700">Total Power</div>
          
          {PARALLEL_CIRCUIT_PRESETS.map((preset) => {
            const i1 = preset.voltage / preset.resistance1;
            const i2 = preset.voltage / preset.resistance2;
            const itotal = i1 + i2;
            const ptotal = preset.voltage * itotal;
            
            return (
              <React.Fragment key={preset.id}>
                <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.name}
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.voltage}V
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {i1.toFixed(2)}A
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {i2.toFixed(2)}A
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {itotal.toFixed(2)}A
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {ptotal.toFixed(1)}W
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}