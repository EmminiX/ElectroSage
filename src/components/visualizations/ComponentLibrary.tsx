"use client";

import { useState } from 'react';
import { Search, Info, Zap, Settings, Eye, Book } from 'lucide-react';

interface ComponentInfo {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  category: string;
  description: string;
  properties: string[];
  applications: string[];
  formula?: string;
  color: string;
  animation?: string;
  typicalValues?: string[];
  safetyNotes?: string[];
  ohmsLawRelation?: string;
  physicalPrinciple?: string;
}

const ELECTRONIC_COMPONENTS: ComponentInfo[] = [
  {
    id: 'resistor',
    name: 'Resistor',
    symbol: '▬▬▬',
    icon: '🔴',
    category: 'Passive',
    description: 'Limits current flow and creates voltage drops in circuits',
    properties: ['Resistance (Ω)', 'Power Rating (W)', 'Tolerance (%)'],
    applications: ['Current limiting', 'Voltage dividing', 'Pull-up/down circuits'],
    formula: 'V = I × R',
    color: '#F59E0B',
    animation: 'pulse',
    typicalValues: ['1Ω - 10MΩ', '1/8W - 100W', '±1% - ±20%'],
    safetyNotes: ['Check power rating', 'Heat dissipation', 'Fire hazard if overloaded'],
    ohmsLawRelation: 'Resistance opposes current flow. Higher R = lower I for same V',
    physicalPrinciple: 'Electrons collide with material atoms, converting kinetic energy to heat'
  },
  {
    id: 'capacitor',
    name: 'Capacitor',
    symbol: '||',
    icon: '⚡',
    category: 'Passive',
    description: 'Stores electrical energy in an electric field between plates',
    properties: ['Capacitance (F)', 'Voltage Rating (V)', 'ESR (Ω)'],
    applications: ['Energy storage', 'Filtering', 'Timing circuits'],
    formula: 'Q = C × V',
    color: '#3B82F6',
    animation: 'charge',
    typicalValues: ['1pF - 10000μF', '6.3V - 1000V', '<1Ω - 100Ω'],
    safetyNotes: ['Can hold charge when powered off', 'Voltage rating critical', 'Polarity matters for electrolytic'],
    ohmsLawRelation: 'Blocks DC current, allows AC. Lower frequency = higher impedance',
    physicalPrinciple: 'Electric field stores energy between charged plates separated by dielectric'
  },
  {
    id: 'inductor',
    name: 'Inductor',
    symbol: '))))',
    icon: '🌀',
    category: 'Passive',
    description: 'Stores energy in a magnetic field when current flows through it',
    properties: ['Inductance (H)', 'Current Rating (A)', 'DCR (Ω)'],
    applications: ['Energy storage', 'Filtering', 'Transformers'],
    formula: 'V = L × (dI/dt)',
    color: '#10B981',
    animation: 'coil'
  },
  {
    id: 'diode',
    name: 'Diode',
    symbol: '▷|',
    icon: '💎',
    category: 'Semiconductor',
    description: 'Allows current to flow in only one direction',
    properties: ['Forward Voltage (V)', 'Current Rating (A)', 'Reverse Voltage (V)'],
    applications: ['Rectification', 'Protection', 'Voltage regulation'],
    formula: 'I = Is × (e^(V/Vt) - 1)',
    color: '#EF4444',
    animation: 'flow'
  },
  {
    id: 'transistor',
    name: 'Transistor (NPN)',
    symbol: '◤',
    icon: '🔺',
    category: 'Semiconductor',
    description: 'Controls current flow and amplifies signals',
    properties: ['β (hFE)', 'Ic max (A)', 'Vce max (V)'],
    applications: ['Amplification', 'Switching', 'Logic gates'],
    formula: 'Ic = β × Ib',
    color: '#8B5CF6',
    animation: 'switch'
  },
  {
    id: 'led',
    name: 'LED',
    symbol: '▷|*',
    icon: '💡',
    category: 'Optoelectronic',
    description: 'Emits light when current flows through it',
    properties: ['Forward Voltage (V)', 'Forward Current (mA)', 'Luminous Intensity (cd)'],
    applications: ['Indicators', 'Displays', 'Lighting'],
    formula: 'P = V × I',
    color: '#F59E0B',
    animation: 'glow'
  },
  {
    id: 'battery',
    name: 'Battery',
    symbol: '|+|-',
    icon: '🔋',
    category: 'Power Source',
    description: 'Provides electrical energy through chemical reactions',
    properties: ['Voltage (V)', 'Capacity (Ah)', 'Internal Resistance (Ω)'],
    applications: ['Portable power', 'Backup power', 'Energy storage'],
    formula: 'E = V × Q',
    color: '#DC2626',
    animation: 'energy'
  },
  {
    id: 'switch',
    name: 'Switch',
    symbol: '⚬—⚬',
    icon: '🔘',
    category: 'Mechanical',
    description: 'Controls the flow of current by opening or closing a circuit',
    properties: ['Contact Rating (A)', 'Voltage Rating (V)', 'Actuation Force (N)'],
    applications: ['Circuit control', 'User interface', 'Safety shutoff'],
    formula: 'R = 0 (closed) or ∞ (open)',
    color: '#6B7280',
    animation: 'toggle'
  }
];

const CATEGORIES = ['All', 'Passive', 'Semiconductor', 'Optoelectronic', 'Power Source', 'Mechanical'];

export default function ComponentLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const filteredComponents = ELECTRONIC_COMPONENTS.filter(component => {
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getAnimationClass = (animation?: string) => {
    switch (animation) {
      case 'pulse': return 'animate-pulse';
      case 'charge': return 'animate-bounce';
      case 'coil': return 'animate-spin';
      case 'flow': return 'animate-pulse';
      case 'switch': return 'animate-ping';
      case 'glow': return 'animate-pulse';
      case 'energy': return 'animate-bounce';
      case 'toggle': return 'animate-pulse';
      default: return '';
    }
  };


  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
          <h3 className="text-xl font-semibold text-gray-900">
            Electronic Component Library
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {filteredComponents.map(component => (
          <div
            key={component.id}
            onClick={() => setSelectedComponent(component)}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedComponent?.id === component.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className={`text-2xl ${getAnimationClass(component.animation)}`}
                style={{ color: component.color }}
              >
                {component.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{component.name}</h4>
                <div className="text-sm text-gray-500 font-mono">{component.symbol}</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {component.description}
            </p>
            
            <div className="flex justify-between items-center">
              <span 
                className="px-2 py-1 text-xs rounded-full"
                style={{ 
                  backgroundColor: `${component.color}20`,
                  color: component.color 
                }}
              >
                {component.category}
              </span>
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Component Details Panel */}
      {selectedComponent && (
        <div className="border-t pt-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div 
                className={`text-4xl ${getAnimationClass(selectedComponent.animation)}`}
                style={{ color: selectedComponent.color }}
              >
                {selectedComponent.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {selectedComponent.name}
                </h3>
                <p className="text-gray-600 mb-3">{selectedComponent.description}</p>
                
                {selectedComponent.formula && (
                  <div className="bg-white p-3 rounded border border-gray-200 mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Key Formula:</span>
                    </div>
                    <code className="text-sm font-mono text-blue-800">
                      {selectedComponent.formula}
                    </code>
                  </div>
                )}
              </div>
            </div>


            {showDetails && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <h4 className="font-medium text-gray-900">Properties & Typical Values</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedComponent.properties.map((property, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                          <span className="text-gray-600">{property}</span>
                        </div>
                        {selectedComponent.typicalValues?.[index] && (
                          <div className="ml-4 text-xs text-gray-500">
                            Typical: {selectedComponent.typicalValues[index]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Book className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-gray-900">Applications</h4>
                  </div>
                  <ul className="space-y-1">
                    {selectedComponent.applications.map((application, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>{application}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Enhanced Educational Content */}
            {showDetails && (
              <>
                {selectedComponent.physicalPrinciple && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Physical Principle:</h4>
                    <p className="text-sm text-blue-800">{selectedComponent.physicalPrinciple}</p>
                  </div>
                )}

                {selectedComponent.ohmsLawRelation && (
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Ohm&apos;s Law Relationship:</h4>
                    <p className="text-sm text-purple-800">{selectedComponent.ohmsLawRelation}</p>
                  </div>
                )}

                {selectedComponent.safetyNotes && selectedComponent.safetyNotes.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-900 mb-2 flex items-center">
                      <span className="text-red-500 mr-2">⚠️</span>
                      Safety Notes:
                    </h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      {selectedComponent.safetyNotes.map((note, index) => (
                        <li key={index}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Educational Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Component Library Guide:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on any component to see detailed information</li>
          <li>• Use the search bar to find specific components</li>
          <li>• Filter by category to browse related components</li>
          <li>• Animated icons show the component&apos;s primary function</li>
          <li>• Formulas help understand electrical relationships</li>
        </ul>
      </div>
    </div>
  );
}