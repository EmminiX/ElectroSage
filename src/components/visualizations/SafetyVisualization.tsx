"use client";

import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Shield, Zap, Eye } from 'lucide-react';

const SAFETY_SCENARIOS = [
  {
    id: 'wet-hands',
    title: 'Wet Hands',
    fullTitle: 'Working with Wet Hands',
    description: 'Handling electrical equipment with wet hands',
    safe: false,
    explanation: 'Water dramatically reduces skin resistance from ~10,000Ω to ~1,000Ω, increasing shock risk by 10x',
    consequence: 'Severe electric shock, burns, cardiac arrest, or death',
    prevention: 'Always dry hands thoroughly before touching any electrical equipment',
    severity: 'critical',
    mathExplanation: 'Using Ohm\'s Law (I = V/R): 120V ÷ 1,000Ω = 0.12A (potentially lethal vs 120V ÷ 10,000Ω = 0.012A)',
    realWorldExample: 'A worker received fatal shock touching a 120V panel with wet hands - current was 10x normal'
  },
  {
    id: 'proper-ppe',
    title: 'Using PPE',
    fullTitle: 'Using Personal Protective Equipment',
    description: 'Wearing insulated gloves, safety glasses, and proper footwear',
    safe: true,
    explanation: 'PPE provides multiple layers of protection against electrical hazards and arc flash',
    consequence: 'Greatly reduced risk of injury and compliance with safety standards',
    prevention: 'Always wear appropriate PPE rated for the voltage level you\'re working with',
    severity: 'safe',
    mathExplanation: 'Insulated gloves rated for 1000V can withstand 5000V test - safety factor of 5x',
    realWorldExample: 'Arc flash suits protect against 40 cal/cm² - enough to survive most electrical arc incidents'
  },
  {
    id: 'overloaded-outlet',
    title: 'Overloaded Outlet',
    fullTitle: 'Overloaded Power Outlet',
    description: 'Plugging multiple high-power devices into one outlet via extension cords',
    safe: false,
    explanation: 'Exceeding outlet capacity (typically 15-20A) causes excessive heat generation',
    consequence: 'Fire hazard, equipment damage, potential electrocution',
    prevention: 'Use dedicated circuits for high-power devices, check amp ratings',
    severity: 'high',
    mathExplanation: 'P = I²R: Drawing 25A through 15A-rated wire generates 2.8x more heat than safe operation',
    realWorldExample: 'House fires: 13% caused by electrical issues, many from overloaded circuits'
  },
  {
    id: 'lockout-tagout',
    title: 'LOTO',
    fullTitle: 'Lockout/Tagout Procedures',
    description: 'Properly locking and tagging electrical panels before maintenance',
    safe: true,
    explanation: 'LOTO prevents accidental energization during maintenance work',
    consequence: 'Prevents workplace accidents and ensures worker safety',
    prevention: 'Always follow LOTO procedures and verify zero energy state',
    severity: 'safe',
    mathExplanation: 'LOTO compliance reduces electrical fatalities by 50% in industrial settings',
    realWorldExample: 'OSHA requires LOTO - violations result in average fines of $4,000-$15,000'
  },
  {
    id: 'damaged-cords',
    title: 'Damaged Cords',
    fullTitle: 'Using Damaged Extension Cords',
    description: 'Continuing to use frayed or damaged electrical cords',
    safe: false,
    explanation: 'Exposed conductors can cause shock, short circuits, and ground faults',
    consequence: 'Electric shock, burns, fire, equipment damage',
    prevention: 'Inspect cords regularly, replace damaged ones immediately',
    severity: 'high',
    mathExplanation: 'Damaged insulation can reduce breakdown voltage from 600V to <50V',
    realWorldExample: 'Extension cord fires cause 3,300 injuries annually - most preventable through inspection'
  },
  {
    id: 'arc-flash-protection',
    title: 'Arc Flash',
    fullTitle: 'Arc Flash Protection',
    description: 'Using proper arc-rated clothing when working on energized equipment',
    safe: true,
    explanation: 'Arc-rated PPE protects against temperatures up to 35,000°F from arc flash',
    consequence: 'Protection from severe burns and potential fatality',
    prevention: 'Calculate arc flash hazard levels and use appropriate PPE categories',
    severity: 'safe',
    mathExplanation: 'Arc flash energy: E = 4.184 × Cf × Ia × t / D² (calories per cm²)',
    realWorldExample: 'Arc flash accidents cause 5-10 deaths daily in US - proper PPE saves lives'
  }
];

export default function SafetyVisualization() {
  const [selectedScenario, setSelectedScenario] = useState(SAFETY_SCENARIOS[0]);
  const [showDetails, setShowDetails] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'safe': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getSeverityIcon = (safe: boolean, severity: string) => {
    if (safe) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (severity === 'critical') return <XCircle className="w-6 h-6 text-red-600" />;
    return <AlertTriangle className="w-6 h-6 text-orange-600" />;
  };

  return (
    <div className="w-full h-96 bg-gray-50 rounded-lg p-6 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        Electrical Safety Scenarios
      </h3>
      
      {/* Scenario Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {SAFETY_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => {
              setSelectedScenario(scenario);
              setShowDetails(false);
            }}
            className={`p-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 min-h-[80px] ${
              selectedScenario.id === scenario.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex-shrink-0">
              {getSeverityIcon(scenario.safe, scenario.severity)}
            </div>
            <span className="text-center leading-tight text-xs">{scenario.title}</span>
          </button>
        ))}
      </div>

      {/* Scenario Display */}
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          {getSeverityIcon(selectedScenario.safe, selectedScenario.severity)}
          <div className="flex-1">
            <h4 className="text-lg font-medium mb-1">{selectedScenario.fullTitle}</h4>
            <p className="text-gray-700 text-sm">{selectedScenario.description}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>
        
        {/* Main Assessment */}
        <div className={`p-3 rounded-lg border ${getSeverityColor(selectedScenario.severity)}`}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${selectedScenario.safe ? 'text-green-600' : 'text-red-600'}`} />
            <span className="font-medium">
              {selectedScenario.safe ? 'Safe Practice' : 'Dangerous Practice'}
            </span>
          </div>
          <p className="text-sm mb-2">{selectedScenario.explanation}</p>
          <div className="text-sm">
            <strong>Consequence:</strong> {selectedScenario.consequence}
          </div>
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Prevention Measures
              </h5>
              <p className="text-sm text-blue-800">{selectedScenario.prevention}</p>
            </div>

            {/* Mathematical Explanation */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <h5 className="font-medium text-purple-900 mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Mathematical Analysis
              </h5>
              <p className="text-sm text-purple-800 font-mono">{selectedScenario.mathExplanation}</p>
            </div>

            {/* Real World Example */}
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <h5 className="font-medium text-orange-900 mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Real-World Case Study
              </h5>
              <p className="text-sm text-orange-800">{selectedScenario.realWorldExample}</p>
            </div>

            {!selectedScenario.safe && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h5 className="font-medium text-red-900 mb-1">Risk Level: {selectedScenario.severity.toUpperCase()}</h5>
                <p className="text-sm text-red-800">
                  {selectedScenario.severity === 'critical' 
                    ? 'Immediate life-threatening danger. Stop work immediately.'
                    : 'High risk of injury or property damage. Take corrective action.'
                  }
                </p>
              </div>
            )}

            {/* Enhanced Safety Guidelines */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Electrical Safety Hierarchy</h5>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                  <span><strong>Eliminate:</strong> Remove the hazard completely (de-energize)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                  <span><strong>Substitute:</strong> Use lower voltage alternatives</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-yellow-500 text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
                  <span><strong>Engineering:</strong> Install safety systems (GFCI, lockout)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">4</span>
                  <span><strong>Administrative:</strong> Training, procedures, warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full text-xs flex items-center justify-center font-bold">5</span>
                  <span><strong>PPE:</strong> Personal protective equipment (last resort)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Safety Statistics */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-yellow-900">Critical Safety Statistics</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-800">
          <div>
            <div className="font-semibold mb-1">Workplace Electrical Accidents:</div>
            <ul className="space-y-1 text-xs">
              <li>• ~400 deaths annually in US workplaces</li>
              <li>• ~4,000 non-fatal injuries requiring hospitalization</li>
              <li>• 5-10 arc flash incidents daily nationwide</li>
              <li>• $1 billion+ in workers compensation claims</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1">Current Thresholds (60Hz AC):</div>
            <ul className="space-y-1 text-xs">
              <li>• 1mA: Barely perceptible</li>
              <li>• 5mA: Maximum safe current</li>
              <li>• 10-20mA: Muscular control lost</li>
              <li>• 50mA+: Possible ventricular fibrillation</li>
              <li>• 100-200mA: Certain death if sustained</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-300">
          <p className="text-xs text-yellow-900 font-medium">
            Remember: It&apos;s not the voltage that kills - it&apos;s the current! Even 120V household current can be lethal.
          </p>
        </div>
      </div>
    </div>
  );
}