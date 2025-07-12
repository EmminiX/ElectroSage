"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, Battery } from 'lucide-react';

interface CapacitorPreset {
  id: string;
  name: string;
  description: string;
  capacitance: number; // microfarads
  batteryVoltage: number; // volts
  chargingTime: number; // milliseconds
  color: string;
}

const CAPACITOR_PRESETS: CapacitorPreset[] = [
  {
    id: 'small-low',
    name: 'Small Cap, Low Voltage',
    description: '50μF, 3V - Quick charge, low energy',
    capacitance: 50,
    batteryVoltage: 3,
    chargingTime: 2000, // 2 seconds
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'large-low', 
    name: 'Large Cap, Low Voltage',
    description: '500μF, 3V - Slower charge, medium energy',
    capacitance: 500,
    batteryVoltage: 3,
    chargingTime: 5000, // 5 seconds
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'small-high',
    name: 'Small Cap, High Voltage', 
    description: '50μF, 12V - Quick charge, medium energy',
    capacitance: 50,
    batteryVoltage: 12,
    chargingTime: 3000, // 3 seconds
    color: 'bg-orange-100 border-orange-300'
  },
  {
    id: 'large-high',
    name: 'Large Cap, High Voltage',
    description: '500μF, 12V - Slowest charge, highest energy',
    capacitance: 500,
    batteryVoltage: 12,
    chargingTime: 8000, // 8 seconds
    color: 'bg-red-100 border-red-300'
  }
];

export default function CapacitorVisualization() {
  const [isCharging, setIsCharging] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0); // 0 to 1 (0% to 100%)
  const [selectedPreset, setSelectedPreset] = useState<CapacitorPreset>(CAPACITOR_PRESETS[0]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const animateCharging = useCallback((currentTime: number) => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = currentTime;
    }
    
    const elapsedTime = currentTime - startTimeRef.current;
    const chargingDuration = selectedPreset.chargingTime;
    
    // Calculate linear time progress
    const timeProgress = Math.min(elapsedTime / chargingDuration, 1);
    
    // Apply exponential charging curve for realism: V(t) = V_max * (1 - e^(-t/τ))
    // Simplified to: progress = 1 - e^(-3*timeProgress) for 95% charge at end
    const exponentialProgress = 1 - Math.exp(-3 * timeProgress);
    
    setChargeProgress(exponentialProgress);
    
    // Stop when time is complete (will be ~95% charge due to exponential curve)
    if (timeProgress >= 1) {
      setIsCharging(false);
      setChargeProgress(0.95); // Realistic capacitor charging stops at ~95%
    } else if (isCharging) {
      animationRef.current = requestAnimationFrame(animateCharging);
    }
  }, [isCharging, selectedPreset.chargingTime]);
  
  useEffect(() => {
    if (isCharging) {
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animateCharging);
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
  }, [isCharging, animateCharging]);

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setChargeProgress(0);
    setIsCharging(false);
    startTimeRef.current = 0;
  };

  // Calculate derived values from progress and selected preset
  const maxCharge = selectedPreset.capacitance * selectedPreset.batteryVoltage; // Q = C × V (microCoulombs)
  const currentCharge = chargeProgress * maxCharge;
  const currentVoltage = chargeProgress * selectedPreset.batteryVoltage;
  const chargePercentage = chargeProgress * 100;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Capacitor Charging/Discharging
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCharging(!isCharging)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isCharging 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isCharging ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={reset}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Circuit Visualization */}
      <div className="flex items-center justify-center mb-6">
        <svg width="300" height="120" viewBox="0 0 300 120" className="border rounded bg-white">
          {/* Battery */}
          <g>
            <rect x="20" y="50" width="4" height="20" fill="#333" />
            <rect x="28" y="45" width="4" height="30" fill="#333" />
            <text x="15" y="40" className="text-xs font-medium" fill="#666">+</text>
            <text x="30" y="40" className="text-xs font-medium" fill="#666">-</text>
            <Battery className="w-4 h-4" x="10" y="25" />
            <text x="5" y="100" className="text-xs font-medium" fill="#666">
              {selectedPreset.batteryVoltage}V
            </text>
          </g>

          {/* Wires */}
          <line x1="32" y1="60" x2="100" y2="60" stroke="#333" strokeWidth="2" />
          <line x1="200" y1="60" x2="268" y2="60" stroke="#333" strokeWidth="2" />
          <line x1="20" y1="60" x2="20" y2="90" stroke="#333" strokeWidth="2" />
          <line x1="20" y1="90" x2="268" y2="90" stroke="#333" strokeWidth="2" />
          <line x1="268" y1="90" x2="268" y2="60" stroke="#333" strokeWidth="2" />

          {/* Capacitor plates */}
          <rect x="120" y="30" width="6" height="60" fill="#333" />
          <rect x="174" y="30" width="6" height="60" fill="#333" />
          
          {/* Capacitor symbol */}
          <text x="135" y="25" className="text-xs font-medium" fill="#666">C</text>
          
          {/* Charge visualization on plates */}
          <g>
            {Array.from({length: Math.max(0, Math.floor(chargePercentage/12))}).map((_, i) => (
              <g key={i}>
                <circle cx="110" cy={35 + i * 7} r="2" fill="red" />
                <text x="105" y={38 + i * 7} className="text-xs" fill="red">+</text>
                <circle cx="190" cy={35 + i * 7} r="2" fill="blue" />
                <text x="185" y={38 + i * 7} className="text-xs" fill="blue">-</text>
              </g>
            ))}
            
            {/* Show at least one charge pair when charging starts */}
            {chargePercentage > 1 && chargePercentage < 12 && (
              <g>
                <circle cx="110" cy="35" r="2" fill="red" opacity="0.6" />
                <text x="105" y="38" className="text-xs" fill="red" opacity="0.6">+</text>
                <circle cx="190" cy="35" r="2" fill="blue" opacity="0.6" />
                <text x="185" y="38" className="text-xs" fill="blue" opacity="0.6">-</text>
              </g>
            )}
          </g>
          
          {/* Electric field lines */}
          {chargePercentage > 5 && (
            <g>
              {Array.from({length: 3}).map((_, i) => (
                <line 
                  key={i}
                  x1="126" 
                  y1={40 + i * 15} 
                  x2="174" 
                  y2={40 + i * 15} 
                  stroke="#ff6b35" 
                  strokeWidth="1" 
                  strokeDasharray="2,2"
                  opacity="0.7"
                />
              ))}
              <text x="145" y="15" className="text-xs font-medium" fill="#ff6b35">
                Electric Field
              </text>
            </g>
          )}

          {/* Current flow animation - improved */}
          {isCharging && (
            <g>
              {/* Main current particles */}
              <circle cx="40" cy="60" r="3" fill="#00ff00" opacity="0.8">
                <animate attributeName="cx" values="40;110;40" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="60" r="2" fill="#ffff00" opacity="0.9">
                <animate attributeName="cx" values="40;110;40" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="60" r="2" fill="#00ff00" opacity="0.7">
                <animate attributeName="cx" values="40;110;40" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
              </circle>
              
              {/* Return path current (bottom wire) */}
              <circle cx="260" cy="90" r="3" fill="#ff4444" opacity="0.8">
                <animate attributeName="cx" values="260;30;260" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="260" cy="90" r="2" fill="#ff6666" opacity="0.9">
                <animate attributeName="cx" values="260;30;260" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
              </circle>
              
              <text x="50" y="80" className="text-xs font-medium" fill="#00ff00">
                Current →
              </text>
              <text x="220" y="105" className="text-xs font-medium" fill="#ff4444">
                ← Return
              </text>
            </g>
          )}
          
          {/* Voltage indicator */}
          <text x="145" y="110" textAnchor="middle" className="text-sm font-medium">
            {currentVoltage.toFixed(1)}V
          </text>
        </svg>
      </div>

      {/* Preset Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Configuration:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CAPACITOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (!isCharging) {
                  setSelectedPreset(preset);
                  setChargeProgress(0);
                }
              }}
              disabled={isCharging}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedPreset.id === preset.id
                  ? `${preset.color} border-current shadow-md`
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${isCharging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium text-gray-900 mb-1">{preset.name}</div>
              <div className="text-sm text-gray-600 mb-2">{preset.description}</div>
              <div className="text-xs text-gray-500">
                Charging time: {(preset.chargingTime / 1000).toFixed(1)}s | 
                Energy: {(preset.capacitance * preset.batteryVoltage * preset.batteryVoltage / 2).toFixed(0)}μJ
              </div>
            </button>
          ))}
        </div>
        {isCharging && (
          <div className="text-xs text-gray-500 mt-2">
            Stop charging to change configuration
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{selectedPreset.capacitance}μF</div>
          <div className="text-sm text-gray-600">Capacitance</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{selectedPreset.batteryVoltage}V</div>
          <div className="text-sm text-gray-600">Battery Voltage</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{(selectedPreset.chargingTime/1000).toFixed(1)}s</div>
          <div className="text-sm text-gray-600">Charge Time</div>
        </div>
      </div>

      {/* Charge Progress */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Charge Progress: {chargePercentage.toFixed(1)}%
        </label>
        <div className="w-full bg-gray-200 rounded-full h-4 relative">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-100"
            style={{ width: `${Math.min(chargePercentage, 100)}%` }}
          />
          {isCharging && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white mix-blend-difference">
                Charging...
              </span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1 flex justify-between">
          <span>Voltage: {currentVoltage.toFixed(2)}V / {selectedPreset.batteryVoltage}V</span>
          <span>Charge: {currentCharge.toFixed(1)} / {maxCharge.toFixed(1)} μC</span>
        </div>
      </div>

      {/* Educational Info */}
      {/* Educational Info with Dynamic Content */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            How Capacitors Work:
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            As current flows, positive charges accumulate on one plate and negative charges on the other. 
            The voltage builds up until it equals the battery voltage.
          </p>
          <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded font-mono">
            Q = C × V | Current Charge: {currentCharge.toFixed(1)} μC | Max Charge: {maxCharge.toFixed(1)} μC
          </div>
        </div>
        
        {/* Dynamic Status Display */}
        <div className={`p-3 rounded-lg border ${
          chargePercentage < 5 ? 'bg-gray-50 border-gray-200' :
          chargePercentage < 85 ? 'bg-yellow-50 border-yellow-200' :
          'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            chargePercentage < 5 ? 'text-gray-700' :
            chargePercentage < 85 ? 'text-yellow-800' :
            'text-green-800'
          }`}>
            Status: {chargePercentage < 5 ? 'Discharged' : chargePercentage < 85 ? 'Charging...' : 'Nearly Full'}
          </h4>
          <div className={`text-sm ${
            chargePercentage < 5 ? 'text-gray-600' :
            chargePercentage < 85 ? 'text-yellow-700' :
            'text-green-700'
          }`}>
            {chargePercentage < 5 ? 
              `Ready to charge ${selectedPreset.name}. Click "Play" to begin ${(selectedPreset.chargingTime/1000).toFixed(1)}-second animation.` :
              chargePercentage < 85 ?
              `Charging ${selectedPreset.name}... ${chargePercentage.toFixed(1)}% complete (exponential curve)` :
              `${selectedPreset.name} charging complete! Notice how different configurations have different charge times.`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Why Different Charging Times?</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Small Capacitors (50μF):</strong> Fill quickly like a small bucket</li>
          <li>• <strong>Large Capacitors (500μF):</strong> Take longer like a large bucket</li>
          <li>• <strong>Low Voltage (3V):</strong> Less &quot;pressure&quot; to push charge in</li>
          <li>• <strong>High Voltage (12V):</strong> More &quot;pressure&quot; but also more charge needed</li>
          <li>• <strong>Energy Storage:</strong> E = ½CV² - higher voltage stores much more energy</li>
          <li>• <strong>Real Physics:</strong> Charging follows exponential curve, not linear</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Configuration Comparison:</h4>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="font-medium text-gray-700">Configuration</div>
          <div className="font-medium text-gray-700">Time</div>
          <div className="font-medium text-gray-700">Charge</div>
          <div className="font-medium text-gray-700">Energy</div>
          
          {CAPACITOR_PRESETS.map((preset) => (
            <React.Fragment key={preset.id}>
              <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {preset.capacitance}μF, {preset.batteryVoltage}V
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {(preset.chargingTime/1000).toFixed(1)}s
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {(preset.capacitance * preset.batteryVoltage).toFixed(0)}μC
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {(preset.capacitance * preset.batteryVoltage * preset.batteryVoltage / 2).toFixed(0)}μJ
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}