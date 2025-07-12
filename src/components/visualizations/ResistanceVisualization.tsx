"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { VisualizationProps } from "./types";
import { Gauge, Thermometer, Zap, Play, Pause, RotateCcw } from "lucide-react";

interface ResistancePreset {
  id: string;
  name: string;
  description: string;
  voltage: number; // V
  resistance: number; // Ω
  material: string;
  length: number; // meters
  thickness: number; // mm²
  color: string;
}

const RESISTANCE_PRESETS: ResistancePreset[] = [
  {
    id: 'copper-wire',
    name: 'Copper Wire',
    description: '12V, 1m copper - Low resistance, good conductor',
    voltage: 12,
    resistance: 0.5,
    material: 'Copper',
    length: 1,
    thickness: 2.5,
    color: 'bg-amber-100 border-amber-300'
  },
  {
    id: 'carbon-resistor',
    name: 'Carbon Resistor',
    description: '12V, standard 100Ω - Moderate resistance',
    voltage: 12,
    resistance: 100,
    material: 'Carbon',
    length: 0.01,
    thickness: 1.0,
    color: 'bg-gray-100 border-gray-300'
  },
  {
    id: 'rubber-insulator',
    name: 'Rubber Insulator',
    description: '12V, 10cm rubber - Very high resistance',
    voltage: 12,
    resistance: 10000,
    material: 'Rubber',
    length: 0.1,
    thickness: 5.0,
    color: 'bg-red-100 border-red-300'
  },
  {
    id: 'variable-length',
    name: 'Variable Length Wire',
    description: '9V, 5m nichrome - Length affects resistance',
    voltage: 9,
    resistance: 25,
    material: 'Nichrome',
    length: 5,
    thickness: 1.5,
    color: 'bg-purple-100 border-purple-300'
  }
];

interface ResistanceVisualizationProps extends VisualizationProps {
  voltage?: number;
  showHeat?: boolean;
  showMaterial?: boolean;
}

interface FlowParticle {
  x: number;
  y: number;
  speed: number;
  active: boolean;
  id: number;
}

export default function ResistanceVisualization({
  voltage = 12,
  showHeat = true,
  showMaterial = true,
  interactive = true,
  size = "medium",
  className = "",
  onInteraction,
}: ResistanceVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<FlowParticle[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<ResistancePreset>(RESISTANCE_PRESETS[0]);
  const [temperature, setTemperature] = useState(25); // Celsius
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeMap = {
    small: { width: 350, height: 200, scale: 0.8 },
    medium: { width: 450, height: 250, scale: 1 },
    large: { width: 550, height: 300, scale: 1.2 },
  };

  const { width, height, scale } = sizeMap[size];
  
  // Use selected preset values
  const currentVoltage = selectedPreset.voltage;
  const resistance = selectedPreset.resistance;
  const material = selectedPreset.material;
  const length = selectedPreset.length;
  const thickness = selectedPreset.thickness;
  
  // Calculate derived values
  const current = currentVoltage / resistance;
  const power = currentVoltage * current;
  const resistivity = resistance * thickness / length; // Ω⋅mm²/m
  const currentDensity = current / thickness; // A/mm²
  
  const targetTemperature = useMemo(() => {
    // More realistic heating: P = I²R converted to temperature rise
    const heatGenerated = Math.pow(current, 2) * resistance;
    const baseTemp = 25; // Room temperature
    const tempRise = heatGenerated * 8; // Scaling factor for visualization
    return Math.min(baseTemp + tempRise, 300); // Cap at 300°C for safety
  }, [current, resistance]);

  // Update temperature based on power dissipation
  useEffect(() => {
    const tempInterval = setInterval(() => {
      setTemperature(prev => {
        const diff = targetTemperature - prev;
        return prev + diff * 0.1; // Gradual temperature change
      });
    }, 100);

    return () => clearInterval(tempInterval);
  }, [targetTemperature]);

  // Initialize particles
  useEffect(() => {
    const newParticles: FlowParticle[] = [];
    const particleCount = Math.max(3, Math.min(20, Math.floor(current * 5)));

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: 50 * scale + (i * (350 * scale / particleCount)),
        y: height / 2,
        speed: current * 2 * scale,
        active: true,
        id: i,
      });
    }

    particlesRef.current = newParticles;
  }, [selectedPreset, current, scale, height]);

  const drawCircuit = useCallback((ctx: CanvasRenderingContext2D) => {
    // Draw connecting wires
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 4 * scale;

    // Left wire
    ctx.beginPath();
    ctx.moveTo(30 * scale, height / 2);
    ctx.lineTo(150 * scale, height / 2);
    ctx.stroke();

    // Right wire
    ctx.beginPath();
    ctx.moveTo(300 * scale, height / 2);
    ctx.lineTo(420 * scale, height / 2);
    ctx.stroke();

    // Battery symbol
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 6 * scale;
    
    // Positive terminal
    ctx.beginPath();
    ctx.moveTo(30 * scale, height / 2 - 20 * scale);
    ctx.lineTo(30 * scale, height / 2 + 20 * scale);
    ctx.stroke();

    // Negative terminal
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.moveTo(420 * scale, height / 2 - 15 * scale);
    ctx.lineTo(420 * scale, height / 2 + 15 * scale);
    ctx.stroke();

    // Battery labels
    ctx.fillStyle = "#059669";
    ctx.font = `bold ${14 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("+", 15 * scale, height / 2 + 5 * scale);
    ctx.fillText("−", 435 * scale, height / 2 + 5 * scale);
    ctx.fillText(`${currentVoltage}V`, 225 * scale, 30 * scale);
  }, [scale, height, currentVoltage]);

  const drawResistor = useCallback((ctx: CanvasRenderingContext2D) => {
    const resistorX = 150 * scale;
    const resistorY = height / 2;
    const resistorWidth = 150 * scale;
    const resistorHeight = Math.max(20 * scale, thickness * 3 * scale); // Height based on thickness

    // Material color mapping
    const materialColors: Record<string, string> = {
      'Copper': '#F59E0B',
      'Carbon': '#6B7280', 
      'Rubber': '#EF4444',
      'Nichrome': '#7C3AED'
    };
    
    const materialColor = materialColors[material] || '#6B7280';
    const heatIntensity = Math.min(1, (temperature - 25) / 200);
    
    let resistorColor = materialColor;
    if (showHeat && heatIntensity > 0.3) {
      // Blend with red for heating effect
      resistorColor = `rgb(${255}, ${Math.floor(100 * (1 - heatIntensity))}, ${Math.floor(100 * (1 - heatIntensity))})`;
    }

    // Draw resistor body with variable width based on length
    const visualLength = Math.max(resistorWidth * 0.5, resistorWidth * Math.min(1, length / 5));
    const resistorActualX = resistorX + (resistorWidth - visualLength) / 2;
    
    ctx.fillStyle = resistorColor;
    ctx.fillRect(resistorActualX, resistorY - resistorHeight / 2, visualLength, resistorHeight);
    
    // Draw resistor border
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(resistorActualX, resistorY - resistorHeight / 2, visualLength, resistorHeight);

    // Draw material-specific markings
    if (material === 'Carbon') {
      // Draw resistance bands for carbon resistor
      const bandWidth = visualLength / 10;
      const bandColors = ["#8B4513", "#000000", "#FF0000", "#FFD700"];
      
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = bandColors[i];
        const bandX = resistorActualX + (visualLength * 0.2) + (i * bandWidth * 1.5);
        ctx.fillRect(bandX, resistorY - resistorHeight / 2, bandWidth, resistorHeight);
      }
    } else if (material === 'Copper') {
      // Draw wire coil pattern for copper
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 1 * scale;
      for (let i = 0; i < 8; i++) {
        const x = resistorActualX + (i * visualLength / 8);
        ctx.beginPath();
        ctx.moveTo(x, resistorY - resistorHeight / 2);
        ctx.lineTo(x, resistorY + resistorHeight / 2);
        ctx.stroke();
      }
    }

    // Material and dimensions label
    ctx.fillStyle = "#374151";
    ctx.font = `${9 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`${material} - ${length}m × ${thickness}mm²`, resistorX + resistorWidth / 2, resistorY + resistorHeight / 2 + 20 * scale);

    // Resistance value
    ctx.fillStyle = "#374151";
    ctx.font = `bold ${12 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`${resistance}Ω`, resistorX + resistorWidth / 2, resistorY - resistorHeight / 2 - 15 * scale);
  }, [height, scale, material, thickness, length, showHeat, temperature, resistance]);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(particle => {
      if (!particle.active) return;
      
      // More visible particles with speed-based coloring
      const normalizedSpeed = Math.min(1, particle.speed / (current * 0.8 * scale));
      const opacity = 0.7 + (normalizedSpeed * 0.3);
      
      // Color particles red when slowed down in resistor
      const isInResistor = particle.x >= 150 * scale && particle.x <= 300 * scale;
      const color = isInResistor ? `rgba(239, 68, 68, ${opacity})` : `rgba(59, 130, 246, ${opacity})`;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 5 * scale, 0, 2 * Math.PI);
      ctx.fill();

      // More visible particle trail
      const trailColor = isInResistor ? `rgba(239, 68, 68, ${opacity * 0.4})` : `rgba(59, 130, 246, ${opacity * 0.4})`;
      ctx.fillStyle = trailColor;
      ctx.beginPath();
      ctx.arc(particle.x - 12 * scale, particle.y, 3 * scale, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [scale, current]);

  const updateAndDrawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    const resistorStart = 150 * scale;
    const resistorEnd = 300 * scale;
    const baseSpeed = Math.max(0.3, current * 0.8); // More responsive to current

    particlesRef.current = particlesRef.current.map(particle => {
      if (!particle.active) return particle;

      let actualSpeed = baseSpeed;
      
      // Slow down particles significantly in resistor region
      if (particle.x >= resistorStart && particle.x <= resistorEnd) {
        // Higher resistance = more dramatic slowdown
        const resistanceFactor = Math.max(0.1, 1 / (1 + resistance * 0.02));
        actualSpeed = baseSpeed * resistanceFactor;
      }
      
      let newX = particle.x + actualSpeed * scale;
      
      // Reset particle position when it goes off screen
      if (newX > 420 * scale) {
        newX = 30 * scale;
      }

      return {
        ...particle,
        x: newX,
        speed: actualSpeed
      };
    });

    drawParticles(ctx);
  }, [scale, current, resistance, drawParticles]);

  const drawHeatVisualization = useCallback((ctx: CanvasRenderingContext2D) => {
    const resistorX = 150 * scale;
    const resistorY = height / 2;
    const resistorWidth = 150 * scale;
    const resistorHeight = 30 * scale;
    
    const heatIntensity = Math.min(1, (temperature - 25) / 150); // More sensitive to temperature
    
    if (heatIntensity > 0.05) {
      // More visible heat glow effect
      const gradient = ctx.createRadialGradient(
        resistorX + resistorWidth / 2, resistorY,
        0,
        resistorX + resistorWidth / 2, resistorY,
        resistorWidth * 1.2
      );
      
      gradient.addColorStop(0, `rgba(255, 80, 80, ${Math.min(0.6, heatIntensity * 0.8)})`);
      gradient.addColorStop(0.7, `rgba(255, 120, 80, ${Math.min(0.3, heatIntensity * 0.4)})`);
      gradient.addColorStop(1, 'rgba(255, 150, 100, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(resistorX - 30 * scale, resistorY - resistorHeight * 1.5, resistorWidth + 60 * scale, resistorHeight * 4);
      
      // Add heat shimmer effect for high temperatures
      if (temperature > 100) {
        ctx.fillStyle = `rgba(255, 200, 100, ${Math.min(0.2, (temperature - 100) / 1000)})`;
        ctx.fillRect(resistorX - 10 * scale, resistorY - resistorHeight * 2, resistorWidth + 20 * scale, resistorHeight * 5);
      }
    }
  }, [scale, height, temperature]);

  const drawMeasurements = useCallback((ctx: CanvasRenderingContext2D) => {
    // Current measurement
    ctx.fillStyle = "#059669";
    ctx.font = `bold ${12 * scale}px Arial`;
    ctx.textAlign = "left";
    ctx.fillText(`Current: ${current.toFixed(3)}A`, 30 * scale, height - 60 * scale);
    
    // Power measurement
    ctx.fillStyle = "#DC2626";
    ctx.fillText(`Power: ${power.toFixed(2)}W`, 30 * scale, height - 45 * scale);
    
    // Current Density
    ctx.fillStyle = "#8B5CF6";
    ctx.fillText(`Density: ${currentDensity.toFixed(2)}A/mm²`, 30 * scale, height - 30 * scale);
    
    // Temperature display
    if (showHeat) {
      ctx.fillStyle = temperature > 100 ? "#DC2626" : "#F59E0B";
      ctx.fillText(`Temp: ${temperature.toFixed(1)}°C`, 200 * scale, height - 45 * scale);
    }
    
    // Resistivity
    ctx.fillStyle = "#6B7280";
    ctx.fillText(`ρ: ${resistivity.toFixed(1)}Ω⋅mm²/m`, 200 * scale, height - 30 * scale);
  }, [scale, height, current, power, currentDensity, resistivity, showHeat, temperature]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw circuit components
      drawCircuit(ctx);
      
      // Draw resistor with visual feedback
      drawResistor(ctx);
      
      // Draw current flow particles
      if (isAnimating) {
        updateAndDrawParticles(ctx);
        animationTime += 1;
      } else {
        drawParticles(ctx);
      }

      // Draw heat visualization
      if (showHeat) {
        drawHeatVisualization(ctx);
      }

      // Draw measurement displays
      drawMeasurements(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedPreset, current, power, temperature, isAnimating, showHeat, width, height, scale, drawCircuit, drawResistor, updateAndDrawParticles, drawParticles, drawHeatVisualization, drawMeasurements]);


  const togglePlayPause = () => {
    setIsAnimating(!isAnimating);
    onInteraction?.({ action: "toggle", isAnimating: !isAnimating });
  };

  const resetAnimation = () => {
    setTemperature(25);
    const newParticles: FlowParticle[] = [];
    const particleCount = Math.max(3, Math.min(20, Math.floor(current * 5)));

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: 50 * scale + (i * (350 * scale / particleCount)),
        y: height / 2,
        speed: current * 2 * scale,
        active: true,
        id: i,
      });
    }
    particlesRef.current = newParticles;
    onInteraction?.({ action: "reset" });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Gauge className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            Resistance Effects
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
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Material Configuration:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RESISTANCE_PRESETS.map((preset) => (
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
              <div className="font-medium text-gray-900 mb-1">{preset.name}</div>
              <div className="text-sm text-gray-600 mb-2">{preset.description}</div>
              <div className="text-xs text-gray-500">
                R: {preset.resistance}Ω | Current: {(preset.voltage / preset.resistance).toFixed(3)}A
              </div>
            </button>
          ))}
        </div>
        {isAnimating && (
          <div className="text-xs text-gray-500 mt-2">
            Stop animation to change material configuration
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
          <div className="text-xs text-gray-500">Applied voltage</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Current</div>
          <div className="text-lg font-bold text-blue-600">{current.toFixed(3)} A</div>
          <div className="text-xs text-gray-500">I = V ÷ R</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Resistance</div>
          <div className="text-lg font-bold text-red-600">{resistance} Ω</div>
          <div className="text-xs text-gray-500">{material} material</div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Power</div>
          <div className="text-lg font-bold text-purple-600">{power.toFixed(2)} W</div>
          <div className="text-xs text-gray-500">P = V × I</div>
        </div>
      </div>

      {/* Material Properties Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="text-sm font-medium text-amber-700">Material Properties</div>
          <div className="text-lg font-bold text-amber-600">{material}</div>
          <div className="text-xs text-gray-600">{length}m × {thickness}mm²</div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-700">Current Density</div>
          <div className="text-lg font-bold text-blue-600">{currentDensity.toFixed(2)} A/mm²</div>
          <div className="text-xs text-gray-600">I ÷ cross-section</div>
        </div>

        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-sm font-medium text-orange-700">Temperature</div>
          <div className="text-lg font-bold text-orange-600">{temperature.toFixed(1)} °C</div>
          <div className="text-xs text-gray-600">Heat from I²R</div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-red-50 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            How Resistance Works:
          </h4>
          <p className="text-sm text-red-800 mb-2">
            Resistance opposes current flow, converting electrical energy to heat. 
            Blue particles slow down in the resistor and turn red, showing energy conversion.
          </p>
          <div className="text-xs text-red-700 bg-red-100 p-2 rounded font-mono">
            R = ρL/A | Material: {selectedPreset.name} configuration
          </div>
        </div>
        
        {/* Dynamic Status Display */}
        <div className={`p-3 rounded-lg border ${
          !isAnimating ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            !isAnimating ? 'text-gray-700' : 'text-green-800'
          }`}>
            Status: {!isAnimating ? 'Circuit Ready' : 'Current Flowing'}
          </h4>
          <div className={`text-sm ${
            !isAnimating ? 'text-gray-600' : 'text-green-700'
          }`}>
            {!isAnimating ? 
              `${selectedPreset.name} ready. Click "Start" to see resistance effects.` :
              `${selectedPreset.name} - Resistance: ${resistance}Ω reduces current to ${current.toFixed(3)}A`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Resistance Factors:</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Material:</strong> Different materials have different resistivities (ρ)</li>
          <li>• <strong>Length:</strong> Longer conductors have higher resistance (R ∝ L)</li>
          <li>• <strong>Cross-section:</strong> Thicker conductors have lower resistance (R ∝ 1/A)</li>
          <li>• <strong>Temperature:</strong> Most materials increase resistance when heated</li>
          <li>• <strong>Heat Generation:</strong> Power dissipation P = I²R creates heat</li>
          <li>• <strong>Current Density:</strong> Higher density can cause overheating</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Material Comparison:</h4>
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div className="font-medium text-gray-700">Material</div>
          <div className="font-medium text-gray-700">Resistance</div>
          <div className="font-medium text-gray-700">Current</div>
          <div className="font-medium text-gray-700">Power</div>
          <div className="font-medium text-gray-700">Density</div>
          <div className="font-medium text-gray-700">Length</div>
          
          {RESISTANCE_PRESETS.map((preset) => {
            const i = preset.voltage / preset.resistance;
            const p = preset.voltage * i;
            const density = i / preset.thickness;
            
            return (
              <React.Fragment key={preset.id}>
                <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.material}
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.resistance}Ω
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {i.toFixed(3)}A
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {p.toFixed(1)}W
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {density.toFixed(1)}A/mm²
                </div>
                <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                  {preset.length}m
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {temperature > 100 && (
        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-1 flex items-center">
            <span className="text-orange-500 mr-2">⚠️</span>
            High Temperature Warning
          </h4>
          <p className="text-sm text-orange-800">
            Temperature is {temperature.toFixed(0)}°C! In reality, this would damage the component. 
            High current density in {material.toLowerCase()} creates dangerous heat buildup.
          </p>
        </div>
      )}
    </div>
  );
}