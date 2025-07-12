"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VisualizationProps } from "./types";
import { Zap, Plus, Minus, Gauge, Play, Pause, RotateCcw } from "lucide-react";

interface VoltagePreset {
  id: string;
  name: string;
  description: string;
  voltage: number; // V
  sourceType: string;
  application: string;
  safetyLevel: 'low' | 'medium' | 'high' | 'extreme';
  color: string;
}

const VOLTAGE_PRESETS: VoltagePreset[] = [
  {
    id: 'battery-aa',
    name: 'AA Battery',
    description: '1.5V - Safe household battery',
    voltage: 1.5,
    sourceType: 'Chemical (Battery)',
    application: 'Toys, remotes, flashlights',
    safetyLevel: 'low',
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'car-battery',
    name: 'Car Battery',
    description: '12V - Automotive electrical system',
    voltage: 12,
    sourceType: 'Lead-Acid Battery',
    application: 'Vehicle starting, lighting',
    safetyLevel: 'medium',
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'wall-outlet',
    name: 'Wall Outlet',
    description: '120V - Standard household power',
    voltage: 120,
    sourceType: 'AC Mains Power',
    application: 'Home appliances, electronics',
    safetyLevel: 'high',
    color: 'bg-orange-100 border-orange-300'
  },
  {
    id: 'high-voltage',
    name: 'High Voltage Line',
    description: '1000V - Industrial/transmission',
    voltage: 1000,
    sourceType: 'Power Transmission',
    application: 'Industrial equipment, power grid',
    safetyLevel: 'extreme',
    color: 'bg-red-100 border-red-300'
  }
];

interface VoltageVisualizationProps extends VisualizationProps {
  initialVoltage?: number;
  showFieldLines?: boolean;
  animated?: boolean;
}

interface ChargeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: number; // +1 or -1
  id: number;
}

export default function VoltageVisualization({
  initialVoltage = 12,
  showFieldLines = true,
  animated = true,
  interactive = true,
  size = "medium",
  className = "",
  onInteraction,
}: VoltageVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<ChargeParticle[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<VoltagePreset>(VOLTAGE_PRESETS[1]); // Default to car battery
  const [isAnimating, setIsAnimating] = useState(false);
  const [localShowFieldLines, setLocalShowFieldLines] = useState(showFieldLines);

  const sizeMap = {
    small: { width: 300, height: 200, scale: 0.8 },
    medium: { width: 400, height: 280, scale: 1 },
    large: { width: 500, height: 350, scale: 1.2 },
  };

  const { width, height, scale } = sizeMap[size];
  
  // Use selected preset values
  const voltage = selectedPreset.voltage;
  const sourceType = selectedPreset.sourceType;
  const application = selectedPreset.application;
  const safetyLevel = selectedPreset.safetyLevel;
  
  // Calculate derived values
  const fieldStrength = voltage / 10; // Simplified field strength (V/cm)
  const electricField = voltage / ((width - 140 * scale) / scale / 10); // V/cm across the gap
  const potentialDifference = voltage;

  const drawFieldArrows = useCallback((
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number
  ) => {
    // Draw arrows at multiple points along the curve
    for (let t = 0.3; t < 1; t += 0.3) {
      const x = Math.pow(1-t, 3) * x1 + 3 * Math.pow(1-t, 2) * t * cp1x + 3 * (1-t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * x2;
      const y = Math.pow(1-t, 3) * y1 + 3 * Math.pow(1-t, 2) * t * cp1y + 3 * (1-t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * y2;
      
      // Calculate direction
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
      
      // Draw arrow
      const arrowSize = 6 * scale;
      ctx.fillStyle = "rgba(251, 191, 36, 0.8)";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - arrowSize * Math.cos(angle - Math.PI/6), y - arrowSize * Math.sin(angle - Math.PI/6));
      ctx.lineTo(x - arrowSize * Math.cos(angle + Math.PI/6), y - arrowSize * Math.sin(angle + Math.PI/6));
      ctx.closePath();
      ctx.fill();
    }
  }, [scale]);

  const drawVoltageSource = useCallback((ctx: CanvasRenderingContext2D) => {
    const terminalWidth = 20 * scale;
    const terminalHeight = 80 * scale;

    // Positive terminal (left)
    const posX = 50 * scale;
    const posY = height / 2 - terminalHeight / 2;
    
    ctx.fillStyle = "#EF4444";
    ctx.fillRect(posX, posY, terminalWidth, terminalHeight);
    
    // Positive sign
    ctx.fillStyle = "white";
    ctx.font = `bold ${16 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("+", posX + terminalWidth / 2, posY + terminalHeight / 2 + 6 * scale);

    // Negative terminal (right)
    const negX = width - 70 * scale;
    const negY = height / 2 - terminalHeight / 2;
    
    ctx.fillStyle = "#3B82F6";
    ctx.fillRect(negX, negY, terminalWidth, terminalHeight);
    
    // Negative sign
    ctx.fillStyle = "white";
    ctx.fillText("−", negX + terminalWidth / 2, negY + terminalHeight / 2 + 6 * scale);

    // Voltage labels
    ctx.fillStyle = "#374151";
    ctx.font = `${12 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`+${voltage/2}V`, posX + terminalWidth / 2, posY - 10 * scale);
    ctx.fillText(`-${voltage/2}V`, negX + terminalWidth / 2, negY - 10 * scale);
  }, [width, height, scale, voltage]);

  const drawFieldLines = useCallback((ctx: CanvasRenderingContext2D) => {
    const posTerminal = { x: 70 * scale, y: height / 2 };
    const negTerminal = { x: width - 60 * scale, y: height / 2 };
    
    // Make field lines more visible when voltage is higher
    const alpha = Math.min(0.3 + (voltage / 24) * 0.5, 0.8);
    ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
    ctx.lineWidth = Math.max(1, (2 + voltage * 0.1) * scale);

    // Draw field lines from positive to negative
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      const startY = posTerminal.y + (i * 20 * scale);
      const endY = negTerminal.y + (i * 20 * scale);
      
      // Curved field lines
      const cp1x = posTerminal.x + 80 * scale;
      const cp1y = startY;
      const cp2x = negTerminal.x - 80 * scale;
      const cp2y = endY;
      
      ctx.moveTo(posTerminal.x, startY);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, negTerminal.x, endY);
      ctx.stroke();

      // Draw arrow heads along the field lines
      drawFieldArrows(ctx, posTerminal.x, startY, negTerminal.x, endY, cp1x, cp1y, cp2x, cp2y);
    }
  }, [width, height, scale, drawFieldArrows]);

  const drawEquipotentialLines = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
    ctx.lineWidth = 1 * scale;
    ctx.setLineDash([5 * scale, 5 * scale]);

    // Draw vertical equipotential lines
    const numLines = 5;
    const startX = 100 * scale;
    const endX = width - 100 * scale;
    const stepX = (endX - startX) / numLines;

    for (let i = 1; i < numLines; i++) {
      const x = startX + i * stepX;
      const voltage_at_x = voltage * (1 - i / numLines);
      
      ctx.beginPath();
      ctx.moveTo(x, 50 * scale);
      ctx.lineTo(x, height - 50 * scale);
      ctx.stroke();

      // Label the equipotential line
      ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
      ctx.font = `${10 * scale}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(`${voltage_at_x.toFixed(1)}V`, x, 40 * scale);
    }

    ctx.setLineDash([]);
  }, [width, height, scale, voltage]);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, particlesToDraw = particlesRef.current) => {
    particlesToDraw.forEach((particle) => {
      const radius = 4 * scale;
      
      // Draw particle
      ctx.fillStyle = particle.charge > 0 ? "#EF4444" : "#3B82F6";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw charge sign
      ctx.fillStyle = "white";
      ctx.font = `bold ${8 * scale}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(
        particle.charge > 0 ? "+" : "−",
        particle.x,
        particle.y + 3 * scale
      );
    });
  }, [scale]);

  const updateAndDrawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particlesRef.current = particlesRef.current.map((particle) => {
      // Define terminals
      const posTerminal = { x: 70 * scale, y: height / 2 };
      const negTerminal = { x: width - 60 * scale, y: height / 2 };
      
      // Create realistic electric field relationship
      // Use square root scaling for more gradual speed changes
      const baseSpeed = 0.3 * scale; // Minimum movement speed
      const voltageEffect = Math.sqrt(voltage) * 0.4 * scale; // Gradual scaling
      const maxSpeed = 2.0 * scale; // Prevent excessive speed
      const fieldStrength = Math.min(baseSpeed + voltageEffect, maxSpeed);
      
      // Calculate forces - simplified uniform field approach
      let fx = 0;
      let fy = 0;
      
      if (voltage > 0) {
        // Create uniform electric field pointing from + to -
        const fieldDirection = 1; // Left to right (+ to -)
        
        if (particle.charge > 0) {
          // Positive charges move with the field (+ to -)
          fx = fieldDirection * fieldStrength;
        } else {
          // Negative charges move against the field (- to +)
          fx = -fieldDirection * fieldStrength;
        }
        
        // Add slight vertical randomness to make movement more visible
        fy = (Math.random() - 0.5) * 0.2 * scale;
      }

      // Update velocity with smooth damping for realistic movement
      const damping = 0.92; // Slightly more damping for smoother motion
      let newVx = (particle.vx * 0.7) + (fx * 0.3); // Blend old and new velocity
      let newVy = (particle.vy + fy) * damping;

      // Update position
      let newX = particle.x + newVx;
      let newY = particle.y + newVy;

      // Boundary conditions - reset particles that go off screen
      if (newX < 80 * scale) {
        // Particle hit left boundary - reset to right side
        newX = width - 90 * scale;
        newVx = 0;
      } else if (newX > width - 80 * scale) {
        // Particle hit right boundary - reset to left side
        newX = 90 * scale;
        newVx = 0;
      }
      
      // Vertical boundaries with gentle bounce
      if (newY < 30 * scale || newY > height - 30 * scale) {
        newVy *= -0.5;
        newY = Math.max(30 * scale, Math.min(height - 30 * scale, newY));
      }

      return {
        ...particle,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
      };
    });

    drawParticles(ctx, particlesRef.current);
  }, [width, height, scale, voltage, drawParticles]);

  const drawVoltageMeter = useCallback((ctx: CanvasRenderingContext2D) => {
    const meterX = width / 2 - 40 * scale;
    const meterY = 20 * scale;
    const meterWidth = 80 * scale;
    const meterHeight = 30 * scale;

    // Meter background
    ctx.fillStyle = "#F3F4F6";
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);

    // Voltage display
    ctx.fillStyle = "#059669";
    ctx.font = `bold ${14 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`${voltage}V`, meterX + meterWidth / 2, meterY + meterHeight / 2 + 5 * scale);

    // Meter label
    ctx.fillStyle = "#374151";
    ctx.font = `${10 * scale}px Arial`;
    ctx.fillText("VOLTAGE", meterX + meterWidth / 2, meterY + meterHeight + 15 * scale);
  }, [width, scale, voltage]);

  // Initialize particles based on voltage level
  useEffect(() => {
    const newParticles: ChargeParticle[] = [];
    // More particles for higher voltage to show increased activity
    const particleCount = Math.min(40, Math.max(12, Math.floor(voltage / 50 * 24) + 12));

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * (width - 160 * scale) + 80 * scale,
        y: Math.random() * (height - 80 * scale) + 40 * scale,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        charge: Math.random() > 0.5 ? 1 : -1,
        id: i,
      });
    }

    particlesRef.current = newParticles;
  }, [selectedPreset, voltage, width, height, scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cancel previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    let animationTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw voltage source terminals
      drawVoltageSource(ctx);

      // Draw electric field lines
      if (localShowFieldLines) {
        drawFieldLines(ctx);
      }

      // Draw equipotential lines
      drawEquipotentialLines(ctx);

      // Draw and update particles
      if (isAnimating) {
        updateAndDrawParticles(ctx);
        animationTime += 1;
      } else {
        drawParticles(ctx);
      }

      // Draw voltage meter
      drawVoltageMeter(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedPreset, voltage, isAnimating, localShowFieldLines, width, height, scale, drawVoltageSource, drawFieldLines, drawEquipotentialLines, updateAndDrawParticles, drawParticles, drawVoltageMeter]);

  const togglePlayPause = () => {
    setIsAnimating(!isAnimating);
    onInteraction?.({ action: "toggle", isAnimating: !isAnimating });
  };

  const resetAnimation = () => {
    const particleCount = Math.min(40, Math.max(12, Math.floor(voltage / 50 * 24) + 12));
    const newParticles: ChargeParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * (width - 160 * scale) + 80 * scale,
        y: Math.random() * (height - 80 * scale) + 40 * scale,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        charge: Math.random() > 0.5 ? 1 : -1,
        id: i,
      });
    }
    particlesRef.current = newParticles;
    onInteraction?.({ action: "reset" });
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-blue-600';
      case 'high': return 'text-orange-600';
      case 'extreme': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSafetyMessage = (level: string) => {
    switch (level) {
      case 'low': return 'Safe to handle with normal precautions';
      case 'medium': return 'Use caution - can cause shock';
      case 'high': return 'Dangerous - can cause serious injury';
      case 'extreme': return 'LETHAL - extreme danger, professional only';
      default: return 'Unknown safety level';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            Voltage Demonstration
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
          <button
            onClick={() => setLocalShowFieldLines(!localShowFieldLines)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              localShowFieldLines 
                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Field Lines
          </button>
        </div>
      </div>

      {/* Preset Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Voltage Source:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VOLTAGE_PRESETS.map((preset) => (
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
                Type: {preset.sourceType} | Safety: <span className={getSafetyColor(preset.safetyLevel)}>{preset.safetyLevel.toUpperCase()}</span>
              </div>
            </button>
          ))}
        </div>
        {isAnimating && (
          <div className="text-xs text-gray-500 mt-2">
            Stop animation to change voltage source
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
          <div className="text-lg font-bold text-yellow-600">{voltage} V</div>
          <div className="text-xs text-gray-500">Potential difference</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Field Strength</div>
          <div className="text-lg font-bold text-blue-600">{fieldStrength.toFixed(1)} V/cm</div>
          <div className="text-xs text-gray-500">Electric field</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Source Type</div>
          <div className="text-lg font-bold text-green-600">{sourceType.split(' ')[0]}</div>
          <div className="text-xs text-gray-500">{sourceType}</div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Safety Level</div>
          <div className={`text-lg font-bold ${getSafetyColor(safetyLevel)}`}>{safetyLevel.toUpperCase()}</div>
          <div className="text-xs text-gray-500">Risk assessment</div>
        </div>
      </div>

      {/* Application and Safety Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-700">Common Applications</div>
          <div className="text-lg font-bold text-green-600">{application}</div>
          <div className="text-xs text-gray-600">Typical use cases</div>
        </div>
        
        <div className={`p-3 rounded-lg border ${
          safetyLevel === 'low' ? 'bg-green-50 border-green-200' :
          safetyLevel === 'medium' ? 'bg-blue-50 border-blue-200' :
          safetyLevel === 'high' ? 'bg-orange-50 border-orange-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className={`text-sm font-medium ${
            safetyLevel === 'low' ? 'text-green-700' :
            safetyLevel === 'medium' ? 'text-blue-700' :
            safetyLevel === 'high' ? 'text-orange-700' :
            'text-red-700'
          }`}>Safety Information</div>
          <div className={`text-sm font-bold ${getSafetyColor(safetyLevel)}`}>
            {getSafetyMessage(safetyLevel)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {voltage < 50 ? 'Generally safe voltage level' :
             voltage < 120 ? 'Can cause painful shock' :
             voltage < 500 ? 'Can cause serious injury' :
             'Potentially lethal - extreme caution required'}
          </div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            How Voltage Works:
          </h4>
          <p className="text-sm text-yellow-800 mb-2">
            Voltage is the electric potential difference between two points. It creates an electric field 
            that pushes charges from high potential (+) to low potential (-).
          </p>
          <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded font-mono">
            V = W/Q | Source: {selectedPreset.name} configuration
          </div>
        </div>
        
        {/* Dynamic Status Display */}
        <div className={`p-3 rounded-lg border ${
          !isAnimating ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            !isAnimating ? 'text-gray-700' : 'text-green-800'
          }`}>
            Status: {!isAnimating ? 'Circuit Ready' : 'Electric Field Active'}
          </h4>
          <div className={`text-sm ${
            !isAnimating ? 'text-gray-600' : 'text-green-700'
          }`}>
            {!isAnimating ? 
              `${selectedPreset.name} ready. Click "Start" to see electric field effects.` :
              `${selectedPreset.name} - ${voltage}V creating ${fieldStrength.toFixed(1)}V/cm field strength`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Voltage Concepts:</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Potential Difference:</strong> Voltage is the energy per unit charge (V = J/C)</li>
          <li>• <strong>Electric Field:</strong> Higher voltage creates stronger field (E = V/d)</li>
          <li>• <strong>Charge Movement:</strong> Positive charges move toward negative terminal</li>
          <li>• <strong>Energy Source:</strong> Different methods create voltage (chemical, mechanical, etc.)</li>
          <li>• <strong>Safety:</strong> Higher voltage increases danger of electrical shock</li>
          <li>• <strong>Field Lines:</strong> Show direction from positive to negative terminals</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Voltage Source Comparison:</h4>
        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className="font-medium text-gray-700">Source</div>
          <div className="font-medium text-gray-700">Voltage</div>
          <div className="font-medium text-gray-700">Type</div>
          <div className="font-medium text-gray-700">Safety</div>
          <div className="font-medium text-gray-700">Application</div>
          
          {VOLTAGE_PRESETS.map((preset) => (
            <React.Fragment key={preset.id}>
              <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {preset.name}
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {preset.voltage}V
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {preset.sourceType.split(' ')[0]}
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                <span className={getSafetyColor(preset.safetyLevel)}>{preset.safetyLevel.toUpperCase()}</span>
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {preset.application.split(',')[0]}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {safetyLevel === 'high' || safetyLevel === 'extreme' ? (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-900 mb-1 flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            High Voltage Warning
          </h4>
          <p className="text-sm text-red-800">
            {voltage}V is {safetyLevel === 'extreme' ? 'EXTREMELY DANGEROUS and potentially LETHAL' : 'dangerous and can cause serious injury'}! 
            {safetyLevel === 'extreme' ? ' Only trained professionals should work with this voltage level.' : ' Always use proper safety equipment and procedures.'}
          </p>
        </div>
      ) : null}
    </div>
  );
}