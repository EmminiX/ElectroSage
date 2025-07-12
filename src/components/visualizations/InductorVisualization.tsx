"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Radio, Zap } from 'lucide-react';

interface InductorPreset {
  id: string;
  name: string;
  description: string;
  inductance: number; // millihenries
  frequency: number; // Hz
  peakCurrent: number; // Amperes
  color: string;
}

const INDUCTOR_PRESETS: InductorPreset[] = [
  {
    id: 'small-low',
    name: 'Small Inductor, Low Frequency',
    description: '10mH, 0.5Hz - Slow field changes, low reactance',
    inductance: 10,
    frequency: 0.5,
    peakCurrent: 2,
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'small-high',
    name: 'Small Inductor, High Frequency',
    description: '10mH, 2Hz - Fast field changes, higher reactance',
    inductance: 10,
    frequency: 2,
    peakCurrent: 1.5,
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'large-low',
    name: 'Large Inductor, Low Frequency',
    description: '100mH, 0.5Hz - Strong field, low reactance',
    inductance: 100,
    frequency: 0.5,
    peakCurrent: 2,
    color: 'bg-orange-100 border-orange-300'
  },
  {
    id: 'large-high',
    name: 'Large Inductor, High Frequency',
    description: '100mH, 2Hz - Strong field, highest reactance',
    inductance: 100,
    frequency: 2,
    peakCurrent: 1,
    color: 'bg-red-100 border-red-300'
  }
];

export default function InductorVisualization() {
  const [isActive, setIsActive] = useState(false);
  const [current, setCurrent] = useState(0);
  const [magneticField, setMagneticField] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<InductorPreset>(INDUCTOR_PRESETS[0]);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const animateAC = useCallback((currentTime: number) => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = currentTime;
    }
    
    const elapsedTime = (currentTime - startTimeRef.current) / 1000; // Convert to seconds
    const newCurrent = Math.sin(2 * Math.PI * selectedPreset.frequency * elapsedTime) * selectedPreset.peakCurrent;
    setCurrent(newCurrent);
    
    // Magnetic field is proportional to current for an inductor (B = μ₀nI)
    // Using simplified scaling: B ∝ L × I (mT units)
    setMagneticField(newCurrent * selectedPreset.inductance / 50);
    
    if (isActive) {
      animationRef.current = requestAnimationFrame(animateAC);
    }
  }, [isActive, selectedPreset.frequency, selectedPreset.peakCurrent, selectedPreset.inductance]);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animateAC);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, animateAC]);

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setCurrent(0);
    setMagneticField(0);
    setIsActive(false);
    startTimeRef.current = 0;
  };

  // Calculate field line intensity based on current
  const fieldIntensity = Math.abs(current) / selectedPreset.peakCurrent; // Normalize to 0-1
  const reactance = 2 * Math.PI * selectedPreset.frequency * selectedPreset.inductance / 1000; // Convert mH to H
  
  // Calculate animation duration based on frequency (period = 1/f)
  const animationDuration = 1 / selectedPreset.frequency; // seconds
  const animationDurationMs = animationDuration * 1000; // milliseconds

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Radio className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Inductor & Magnetic Field Effects
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isActive 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isActive ? 'Stop AC' : 'Start AC'}
          </button>
          <button
            onClick={reset}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setShowFieldLines(!showFieldLines)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              showFieldLines
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Field Lines
          </button>
        </div>
      </div>

      {/* Circuit Visualization */}
      <div className="flex items-center justify-center mb-6">
        <svg width="400" height="200" viewBox="0 0 400 200" className="border rounded bg-white">
          {/* AC Source */}
          <g>
            <circle cx="40" cy="100" r="20" fill="none" stroke="#333" strokeWidth="2" />
            <text x="40" y="85" textAnchor="middle" className="text-xs font-medium">AC</text>
            <text x="40" y="105" textAnchor="middle" className="text-xs font-medium">
              {selectedPreset.frequency}Hz
            </text>
            <path d="M 30 100 Q 35 95 40 100 Q 45 105 50 100" fill="none" stroke="#333" strokeWidth="1" />
          </g>

          {/* Connecting wires */}
          <line x1="60" y1="100" x2="120" y2="100" stroke="#333" strokeWidth="2" />
          <line x1="280" y1="100" x2="340" y2="100" stroke="#333" strokeWidth="2" />
          <line x1="340" y1="100" x2="340" y2="140" stroke="#333" strokeWidth="2" />
          <line x1="340" y1="140" x2="40" y2="140" stroke="#333" strokeWidth="2" />
          <line x1="40" y1="140" x2="40" y2="120" stroke="#333" strokeWidth="2" />

          {/* Inductor coil */}
          <g>
            {/* Coil windings */}
            {Array.from({length: 8}).map((_, i) => (
              <g key={i}>
                <path
                  d={`M ${120 + i * 20} 100 Q ${130 + i * 20} 85 ${140 + i * 20} 100`}
                  fill="none"
                  stroke="#333"
                  strokeWidth="3"
                />
                <path
                  d={`M ${120 + i * 20} 100 Q ${130 + i * 20} 115 ${140 + i * 20} 100`}
                  fill="none"
                  stroke="#333"
                  strokeWidth="3"
                />
              </g>
            ))}
            
            {/* Inductor symbol */}
            <text x="200" y="75" textAnchor="middle" className="text-sm font-medium">
              L = {selectedPreset.inductance} mH
            </text>
          </g>

          {/* Current flow indicators with animation */}
          {isActive && (
            <g>
              {/* Current direction arrows */}
              <g opacity={current > 0 ? 1 : 0.3}>
                <polygon points="90,95 100,100 90,105" fill="#00ff00" />
                <polygon points="310,95 320,100 310,105" fill="#00ff00" />
              </g>
              <g opacity={current < 0 ? 1 : 0.3}>
                <polygon points="100,95 90,100 100,105" fill="#ff6600" />
                <polygon points="320,95 310,100 320,105" fill="#ff6600" />
              </g>
              
              {/* Current flow particles - synchronized with frequency */}
              <circle cx="70" cy="100" r="2" fill={current > 0 ? "#00ff00" : "#ff6600"} opacity="0.8">
                <animate 
                  attributeName="cx" 
                  values={current > 0 ? "70;120;70" : "120;70;120"} 
                  dur={`${animationDurationMs}ms`} 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="70" cy="100" r="1" fill={current > 0 ? "#ffff00" : "#ff9900"} opacity="0.9">
                <animate 
                  attributeName="cx" 
                  values={current > 0 ? "70;120;70" : "120;70;120"} 
                  dur={`${animationDurationMs}ms`} 
                  begin={`${animationDurationMs/4}ms`} 
                  repeatCount="indefinite" 
                />
              </circle>
              
              {/* Return path particles */}
              <circle cx="320" cy="140" r="2" fill={current > 0 ? "#ff6600" : "#00ff00"} opacity="0.8">
                <animate 
                  attributeName="cx" 
                  values={current > 0 ? "320;60;320" : "60;320;60"} 
                  dur={`${animationDurationMs}ms`} 
                  repeatCount="indefinite" 
                />
              </circle>
              
              <text x="90" y="125" className="text-xs font-medium" fill={current > 0 ? "#00ff00" : "#ff6600"}>
                I = {current.toFixed(2)}A
              </text>
            </g>
          )}

          {/* Magnetic field lines */}
          {showFieldLines && fieldIntensity > 0.01 && (
            <g opacity={fieldIntensity}>
              {/* Field lines around the inductor */}
              {Array.from({length: 5}).map((_, i) => (
                <g key={i}>
                  <ellipse
                    cx="200"
                    cy="100"
                    rx={60 + i * 15}
                    ry={30 + i * 8}
                    fill="none"
                    stroke={current > 0 ? "#0066ff" : "#ff0066"}
                    strokeWidth={Math.max(1, fieldIntensity * 2)}
                    strokeDasharray="3,3"
                    opacity={Math.max(0.2, 1 - i * 0.15) * fieldIntensity}
                  >
                    {/* Animate field strength */}
                    <animate
                      attributeName="stroke-width"
                      values={`${Math.max(1, fieldIntensity * 2)};${Math.max(1, fieldIntensity * 3)};${Math.max(1, fieldIntensity * 2)}`}
                      dur={`${animationDurationMs}ms`}
                      repeatCount="indefinite"
                    />
                  </ellipse>
                  
                  {/* Field direction indicators */}
                  {i % 2 === 0 && (
                    <g>
                      <polygon 
                        points={`${200 + (60 + i * 15)},100 ${200 + (60 + i * 15) - 5},95 ${200 + (60 + i * 15) - 5},105`}
                        fill={current > 0 ? "#0066ff" : "#ff0066"}
                        opacity={fieldIntensity}
                      />
                    </g>
                  )}
                </g>
              ))}
              
              <text x="200" y="50" textAnchor="middle" className="text-xs font-medium" fill={current > 0 ? "#0066ff" : "#ff0066"}>
                Magnetic Field {current > 0 ? '→' : '←'}
              </text>
            </g>
          )}

          {/* Core material */}
          <rect x="180" y="95" width="40" height="10" fill="#8B4513" opacity="0.6" />
          <text x="200" y="170" textAnchor="middle" className="text-xs" fill="#8B4513">
            Iron Core
          </text>
        </svg>
      </div>

      {/* Preset Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Configuration:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INDUCTOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (!isActive) {
                  setSelectedPreset(preset);
                  setCurrent(0);
                  setMagneticField(0);
                }
              }}
              disabled={isActive}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedPreset.id === preset.id
                  ? `${preset.color} border-current shadow-md`
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium text-gray-900 mb-1">{preset.name}</div>
              <div className="text-sm text-gray-600 mb-2">{preset.description}</div>
              <div className="text-xs text-gray-500">
                Reactance: {(2 * Math.PI * preset.frequency * preset.inductance / 1000).toFixed(3)}Ω | 
                Peak Current: {preset.peakCurrent}A
              </div>
            </button>
          ))}
        </div>
        {isActive && (
          <div className="text-xs text-gray-500 mt-2">
            Stop the AC to change configuration
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{selectedPreset.inductance}mH</div>
          <div className="text-sm text-gray-600">Inductance</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{selectedPreset.frequency}Hz</div>
          <div className="text-sm text-gray-600">Frequency</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{reactance.toFixed(3)}Ω</div>
          <div className="text-sm text-gray-600">Reactance</div>
        </div>
      </div>

      {/* Current Waveform Visualization */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Waveform (AC):</h4>
        <div className="flex items-center justify-center">
          <svg width="300" height="80" viewBox="0 0 300 80" className="border rounded bg-gray-50">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="300" height="80" fill="url(#grid)" />
            
            {/* Zero line */}
            <line x1="0" y1="40" x2="300" y2="40" stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
            
            {/* AC Waveform */}
            <path
              d={`M 0 40 ${Array.from({length: 150}).map((_, i) => {
                const x = (i / 150) * 300;
                const cycles = selectedPreset.frequency * 2; // Show 2 seconds worth
                const y = 40 - (Math.sin(2 * Math.PI * cycles * (i / 150)) * selectedPreset.peakCurrent * 15);
                return `L ${x} ${y}`;
              }).join(' ')}`}
              fill="none"
              stroke="#059669"
              strokeWidth="2"
            />
            
            {/* Current indicator */}
            {isActive && (
              <circle 
                cx="150" 
                cy={40 - (current * 15)} 
                r="3" 
                fill="#dc2626"
                opacity="0.8"
              />
            )}
            
            {/* Labels */}
            <text x="5" y="12" className="text-xs" fill="#6b7280">+{selectedPreset.peakCurrent}A</text>
            <text x="5" y="44" className="text-xs" fill="#6b7280">0A</text>
            <text x="5" y="76" className="text-xs" fill="#6b7280">-{selectedPreset.peakCurrent}A</text>
            <text x="250" y="76" className="text-xs" fill="#6b7280">Time</text>
          </svg>
        </div>
      </div>

      {/* Real-time readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Current</div>
          <div className="text-lg font-bold text-green-600">{current.toFixed(2)} A</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Magnetic Field</div>
          <div className="text-lg font-bold text-blue-600">{magneticField.toFixed(2)} mT</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Reactance</div>
          <div className="text-lg font-bold text-purple-600">{reactance.toFixed(3)} Ω</div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
            <Radio className="w-4 h-4" />
            How Inductors Work:
          </h4>
          <p className="text-sm text-purple-800 mb-2">
            When current flows through a coil, it creates a magnetic field. Changes in current 
            induce a voltage that opposes the change (Lenz&apos;s Law). The faster the change, the greater the opposition.
          </p>
          <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded font-mono">
            XL = 2πfL | Current: {current.toFixed(2)}A | Magnetic Field: {magneticField.toFixed(2)}mT
          </div>
        </div>
        
        {/* Dynamic Status Display */}
        <div className={`p-3 rounded-lg border ${
          !isActive ? 'bg-gray-50 border-gray-200' :
          Math.abs(current) < 0.1 ? 'bg-yellow-50 border-yellow-200' :
          'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            !isActive ? 'text-gray-700' :
            Math.abs(current) < 0.1 ? 'text-yellow-800' :
            'text-green-800'
          }`}>
            Status: {!isActive ? 'Stopped' : Math.abs(current) < 0.1 ? 'Low Current' : 'Active Field'}
          </h4>
          <div className={`text-sm ${
            !isActive ? 'text-gray-600' :
            Math.abs(current) < 0.1 ? 'text-yellow-700' :
            'text-green-700'
          }`}>
            {!isActive ? 
              `Ready to demonstrate ${selectedPreset.name}. Click "Start AC" to begin alternating current flow.` :
              Math.abs(current) < 0.1 ?
              `${selectedPreset.name} - Current reversing direction, magnetic field collapsing/building` :
              `${selectedPreset.name} - Strong magnetic field created by ${current.toFixed(2)}A current`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Why Different Reactances?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Small Inductors (1mH):</strong> Low reactance, current changes easily</li>
          <li>• <strong>Large Inductors (50mH):</strong> High reactance, resist current changes</li>
          <li>• <strong>Low Frequency (0.5Hz):</strong> Slow changes, lower reactance</li>
          <li>• <strong>High Frequency (2Hz):</strong> Fast changes, higher reactance</li>
          <li>• <strong>Magnetic Field:</strong> Proportional to current and inductance</li>
          <li>• <strong>Lenz&apos;s Law:</strong> Induced voltage opposes current changes</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Configuration Comparison:</h4>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="font-medium text-gray-700">Configuration</div>
          <div className="font-medium text-gray-700">Reactance</div>
          <div className="font-medium text-gray-700">Peak Current</div>
          <div className="font-medium text-gray-700">Max Field</div>
          
          {INDUCTOR_PRESETS.map((preset) => (
            <React.Fragment key={preset.id}>
              <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-purple-100 font-medium' : ''}`}>
                {preset.inductance}mH, {preset.frequency}Hz
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-purple-100 font-medium' : ''}`}>
                {(2 * Math.PI * preset.frequency * preset.inductance / 1000).toFixed(3)}Ω
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-purple-100 font-medium' : ''}`}>
                {preset.peakCurrent}A
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-purple-100 font-medium' : ''}`}>
                {(preset.peakCurrent * preset.inductance / 50).toFixed(1)}mT
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}