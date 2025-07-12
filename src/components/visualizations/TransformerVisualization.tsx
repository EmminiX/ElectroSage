"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpDown, Zap } from 'lucide-react';

interface TransformerPreset {
  id: string;
  name: string;
  description: string;
  primaryTurns: number;
  secondaryTurns: number;
  inputVoltage: number; // RMS voltage
  frequency: number; // Hz
  loadResistance: number; // Ohms
  color: string;
}

const TRANSFORMER_PRESETS: TransformerPreset[] = [
  {
    id: 'stepup-small',
    name: 'Step-up Transformer (1:2)',
    description: '120V → 240V - Double voltage, half current',
    primaryTurns: 100,
    secondaryTurns: 200,
    inputVoltage: 120,
    frequency: 60,
    loadResistance: 100,
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'stepup-large',
    name: 'Step-up Transformer (1:4)',
    description: '120V → 480V - Four times voltage, quarter current',
    primaryTurns: 100,
    secondaryTurns: 400,
    inputVoltage: 120,
    frequency: 60,
    loadResistance: 200,
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'stepdown-small',
    name: 'Step-down Transformer (2:1)',
    description: '240V → 120V - Half voltage, double current',
    primaryTurns: 200,
    secondaryTurns: 100,
    inputVoltage: 240,
    frequency: 60,
    loadResistance: 50,
    color: 'bg-orange-100 border-orange-300'
  },
  {
    id: 'stepdown-large',
    name: 'Step-down Transformer (10:1)',
    description: '1200V → 120V - One-tenth voltage, ten times current',
    primaryTurns: 1000,
    secondaryTurns: 100,
    inputVoltage: 1200,
    frequency: 60,
    loadResistance: 20,
    color: 'bg-red-100 border-red-300'
  }
];

export default function TransformerVisualization() {
  const [isActive, setIsActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<TransformerPreset>(TRANSFORMER_PRESETS[0]);

  const reset = () => {
    setIsActive(false);
  };

  const turnsRatio = selectedPreset.secondaryTurns / selectedPreset.primaryTurns;
  const transformerType = turnsRatio > 1 ? 'Step-up' : turnsRatio < 1 ? 'Step-down' : 'Isolation';
  const efficiency = 0.95; // Assume 95% efficiency
  const outputVoltageRMS = selectedPreset.inputVoltage * turnsRatio;
  
  // Calculate stable values for educational display
  const secondaryCurrentRMS = outputVoltageRMS / selectedPreset.loadResistance;
  const primaryCurrentRMS = secondaryCurrentRMS * turnsRatio;
  const inputPower = selectedPreset.inputVoltage * primaryCurrentRMS;
  const outputPower = outputVoltageRMS * secondaryCurrentRMS;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Transformer Operation - {transformerType} ({turnsRatio.toFixed(2)}:1)
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isActive 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isActive ? 'Stop' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Transformer Visualization */}
      <div className="flex items-center justify-center mb-6">
        <svg width="450" height="200" viewBox="0 0 450 200" className="border rounded bg-white">
          {/* Primary circuit */}
          <g>
            {/* AC Source */}
            <circle cx="40" cy="100" r="20" fill="none" stroke="#333" strokeWidth="2" />
            <text x="40" y="90" textAnchor="middle" className="text-xs font-medium">AC</text>
            <text x="40" y="105" textAnchor="middle" className="text-xs font-medium">
              {selectedPreset.inputVoltage}V
            </text>
            <text x="40" y="115" textAnchor="middle" className="text-xs font-medium">
              {selectedPreset.frequency}Hz
            </text>
            <path d="M 30 100 Q 35 95 40 100 Q 45 105 50 100" fill="none" stroke="#333" strokeWidth="1" />
            
            {/* Primary winding connections */}
            <line x1="60" y1="100" x2="120" y2="100" stroke="#ff6600" strokeWidth="3" />
            <line x1="40" y1="80" x2="40" y2="50" stroke="#ff6600" strokeWidth="3" />
            <line x1="40" y1="50" x2="410" y2="50" stroke="#ff6600" strokeWidth="3" />
            <line x1="410" y1="50" x2="410" y2="100" stroke="#ff6600" strokeWidth="3" />
            <line x1="390" y1="100" x2="410" y2="100" stroke="#ff6600" strokeWidth="3" />
          </g>

          {/* Iron core - improved visual */}
          <rect x="210" y="70" width="30" height="60" fill="#8B4513" stroke="#654321" strokeWidth="2" rx="3" />
          <rect x="215" y="75" width="5" height="50" fill="#A0522D" />
          <rect x="225" y="75" width="5" height="50" fill="#A0522D" />
          <rect x="235" y="75" width="5" height="50" fill="#A0522D" />
          <text x="225" y="45" textAnchor="middle" className="text-xs font-medium">Iron Core</text>

          {/* Primary coil - improved visual */}
          <g>
            {Array.from({length: Math.min(8, Math.floor(selectedPreset.primaryTurns/100))}).map((_, i) => (
              <g key={i}>
                <circle
                  cx={150 + i * 8}
                  cy="100"
                  r="8"
                  fill="none"
                  stroke="#ff6600"
                  strokeWidth="4"
                  opacity={0.9}
                />
                <circle
                  cx={150 + i * 8}
                  cy="100"
                  r="4"
                  fill="none"
                  stroke="#ff6600"
                  strokeWidth="2"
                  opacity={0.6}
                />
              </g>
            ))}
            <text x="170" y="165" textAnchor="middle" className="text-xs font-medium">
              Primary: {selectedPreset.primaryTurns} turns
            </text>
            <line x1="120" y1="100" x2="142" y2="100" stroke="#ff6600" strokeWidth="3" />
            <line x1="198" y1="100" x2="210" y2="100" stroke="#ff6600" strokeWidth="3" />
          </g>

          {/* Secondary coil - improved visual */}
          <g>
            {Array.from({length: Math.min(8, Math.floor(selectedPreset.secondaryTurns/100))}).map((_, i) => (
              <g key={i}>
                <circle
                  cx={260 + i * 8}
                  cy="100"
                  r="8"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="4"
                  opacity={0.9}
                />
                <circle
                  cx={260 + i * 8}
                  cy="100"
                  r="4"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="2"
                  opacity={0.6}
                />
              </g>
            ))}
            <text x="280" y="165" textAnchor="middle" className="text-xs font-medium">
              Secondary: {selectedPreset.secondaryTurns} turns
            </text>
            <line x1="240" y1="100" x2="252" y2="100" stroke="#0066ff" strokeWidth="3" />
            <line x1="308" y1="100" x2="330" y2="100" stroke="#0066ff" strokeWidth="3" />
          </g>

          {/* Load resistor */}
          <g>
            <rect x="340" y="95" width="30" height="10" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M340,100 L345,95 L350,105 L355,95 L360,105 L365,95 L370,100" 
                  fill="none" stroke="#333" strokeWidth="2" />
            <text x="355" y="115" textAnchor="middle" className="text-xs">
              Load: {selectedPreset.loadResistance}Ω
            </text>
            
            {/* Secondary circuit completion */}
            <line x1="330" y1="100" x2="340" y2="100" stroke="#0066ff" strokeWidth="3" />
            <line x1="370" y1="100" x2="410" y2="100" stroke="#0066ff" strokeWidth="3" />
          </g>

          {/* Enhanced magnetic flux lines */}
          {isActive && (
            <g opacity="0.9">
              {Array.from({length: 8}).map((_, i) => (
                <g key={i}>
                  <path
                    d={`M 215 ${70 + i * 7} Q 225 ${65 + i * 7} 235 ${70 + i * 7}`}
                    fill="none"
                    stroke="#ff00ff"
                    strokeWidth="3"
                    strokeDasharray="4,4"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;8;0"
                      dur="800ms"
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle
                    cx="235"
                    cy={70 + i * 7}
                    r="2"
                    fill="#ff00ff"
                    opacity="0.9"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.9;0.3;0.9"
                      dur="800ms"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              ))}
              <text x="225" y="35" textAnchor="middle" className="text-xs font-medium" fill="#ff00ff">
                Magnetic Flux
              </text>
            </g>
          )}

          {/* Voltage and current indicators */}
          {isActive && (
            <g>
              <text x="130" y="25" className="text-sm font-medium" fill="#ff6600">
                V₁ = {selectedPreset.inputVoltage}V RMS
              </text>
              <text x="300" y="25" className="text-sm font-medium" fill="#0066ff">
                V₂ = {outputVoltageRMS.toFixed(1)}V RMS
              </text>
              <text x="130" y="185" className="text-xs font-medium" fill="#ff6600">
                I₁ = {primaryCurrentRMS.toFixed(2)}A RMS
              </text>
              <text x="300" y="185" className="text-xs font-medium" fill="#0066ff">
                I₂ = {secondaryCurrentRMS.toFixed(2)}A RMS
              </text>
            </g>
          )}

          {/* Enhanced current flow animation */}
          {isActive && (
            <g>
              {/* Primary current particles - larger and more visible */}
              <circle cx="80" cy="100" r="4" fill="#ffff00" opacity="0.9">
                <animate 
                  attributeName="cx" 
                  values="80;142;198;80" 
                  dur="2000ms" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="80" cy="100" r="3" fill="#ff9900" opacity="0.8">
                <animate 
                  attributeName="cx" 
                  values="80;142;198;80" 
                  dur="2000ms" 
                  begin="500ms" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="80" cy="100" r="2" fill="#ffaa00" opacity="0.7">
                <animate 
                  attributeName="cx" 
                  values="80;142;198;80" 
                  dur="2000ms" 
                  begin="1000ms" 
                  repeatCount="indefinite" 
                />
              </circle>
              
              {/* Secondary current particles - larger and more visible */}
              <circle cx="252" cy="100" r="4" fill="#00ffff" opacity="0.9">
                <animate 
                  attributeName="cx" 
                  values="252;308;370;252" 
                  dur="2000ms" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="252" cy="100" r="3" fill="#0099ff" opacity="0.8">
                <animate 
                  attributeName="cx" 
                  values="252;308;370;252" 
                  dur="2000ms" 
                  begin="500ms" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="252" cy="100" r="2" fill="#00aaff" opacity="0.7">
                <animate 
                  attributeName="cx" 
                  values="252;308;370;252" 
                  dur="2000ms" 
                  begin="1000ms" 
                  repeatCount="indefinite" 
                />
              </circle>
              
              {/* Return path particles */}
              <circle cx="370" cy="140" r="3" fill="#ff6600" opacity="0.8">
                <animate 
                  attributeName="cx" 
                  values="370;60;370" 
                  dur="2000ms" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="370" cy="140" r="2" fill="#ff9900" opacity="0.7">
                <animate 
                  attributeName="cx" 
                  values="370;60;370" 
                  dur="2000ms" 
                  begin="1000ms" 
                  repeatCount="indefinite" 
                />
              </circle>
              
              {/* Current direction arrows */}
              <g opacity="0.8">
                <polygon points="100,95 110,100 100,105" fill="#ffff00">
                  <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur="2000ms"
                    repeatCount="indefinite"
                  />
                </polygon>
                <polygon points="320,95 330,100 320,105" fill="#00ffff">
                  <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur="2000ms"
                    repeatCount="indefinite"
                  />
                </polygon>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Preset Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Transformer Configuration:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TRANSFORMER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (!isActive) {
                  setSelectedPreset(preset);
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
                Turns Ratio: {(preset.secondaryTurns / preset.primaryTurns).toFixed(2)}:1 | 
                Output: {(preset.inputVoltage * preset.secondaryTurns / preset.primaryTurns).toFixed(0)}V
              </div>
            </button>
          ))}
        </div>
        {isActive && (
          <div className="text-xs text-gray-500 mt-2">
            Stop the AC to change transformer configuration
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-indigo-600">{turnsRatio.toFixed(2)}:1</div>
          <div className="text-sm text-gray-600">Turns Ratio</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{outputVoltageRMS.toFixed(0)}V</div>
          <div className="text-sm text-gray-600">Output RMS</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{transformerType}</div>
          <div className="text-sm text-gray-600">Type</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{(efficiency * 100).toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Efficiency</div>
        </div>
      </div>

      {/* Real-time readings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Primary Voltage</div>
          <div className="text-lg font-bold text-orange-600">{selectedPreset.inputVoltage}V RMS</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Secondary Voltage</div>
          <div className="text-lg font-bold text-blue-600">{outputVoltageRMS.toFixed(1)}V RMS</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Primary Current</div>
          <div className="text-lg font-bold text-orange-600">{primaryCurrentRMS.toFixed(2)}A RMS</div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Secondary Current</div>
          <div className="text-lg font-bold text-blue-600">{secondaryCurrentRMS.toFixed(2)}A RMS</div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-indigo-900 mb-2 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            How Transformers Work:
          </h4>
          <p className="text-sm text-indigo-800 mb-2">
            Changing magnetic flux in the iron core induces voltage in both windings through electromagnetic induction. 
            The voltage ratio equals the turns ratio, while current is inversely proportional.
          </p>
          <div className="text-xs text-indigo-700 bg-indigo-100 p-2 rounded font-mono">
            V₂/V₁ = N₂/N₁ | I₁/I₂ = N₂/N₁ | P₁ ≈ P₂ (ideal transformer)
          </div>
        </div>
        
        {/* Dynamic Status Display */}
        <div className={`p-3 rounded-lg border ${
          !isActive ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            !isActive ? 'text-gray-700' : 'text-green-800'
          }`}>
            Status: {!isActive ? 'Inactive' : 'Active Operation'}
          </h4>
          <div className={`text-sm ${
            !isActive ? 'text-gray-600' : 'text-green-700'
          }`}>
            {!isActive ? 
              `Ready to demonstrate ${selectedPreset.name}. Click "Activate" to see transformer operation.` :
              `${selectedPreset.name} - Transforming ${selectedPreset.inputVoltage}V RMS to ${outputVoltageRMS.toFixed(1)}V RMS`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Transformer Principles:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Step-up Transformers:</strong> Increase voltage, decrease current (N₂ &gt; N₁)</li>
          <li>• <strong>Step-down Transformers:</strong> Decrease voltage, increase current (N₂ &lt; N₁)</li>
          <li>• <strong>Turns Ratio:</strong> Determines voltage transformation ratio</li>
          <li>• <strong>Power Conservation:</strong> Input power ≈ Output power (minus losses)</li>
          <li>• <strong>Magnetic Coupling:</strong> Iron core provides efficient flux linkage</li>
          <li>• <strong>AC Operation:</strong> Only works with changing magnetic flux</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Configuration Comparison:</h4>
        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className="font-medium text-gray-700">Configuration</div>
          <div className="font-medium text-gray-700">Turns Ratio</div>
          <div className="font-medium text-gray-700">Input</div>
          <div className="font-medium text-gray-700">Output</div>
          <div className="font-medium text-gray-700">Application</div>
          
          {TRANSFORMER_PRESETS.map((preset) => (
            <React.Fragment key={preset.id}>
              <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-indigo-100 font-medium' : ''}`}>
                {preset.name.split(' ')[0]}
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-indigo-100 font-medium' : ''}`}>
                {(preset.secondaryTurns / preset.primaryTurns).toFixed(2)}:1
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-indigo-100 font-medium' : ''}`}>
                {preset.inputVoltage}V
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-indigo-100 font-medium' : ''}`}>
                {(preset.inputVoltage * preset.secondaryTurns / preset.primaryTurns).toFixed(0)}V
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-indigo-100 font-medium' : ''}`}>
                {preset.secondaryTurns > preset.primaryTurns ? 'Power Dist.' : 'Power Supply'}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}