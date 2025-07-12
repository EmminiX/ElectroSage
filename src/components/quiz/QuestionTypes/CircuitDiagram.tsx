"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QuizQuestion } from "@/data/types";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Zap, CheckCircle, Circle, Info } from "lucide-react";

interface CircuitDiagramProps {
  question: QuizQuestion;
  answer?: string;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function CircuitDiagram({ 
  question, 
  answer, 
  onAnswer, 
  disabled = false 
}: CircuitDiagramProps) {
  const { settings, getThemeClasses } = useAccessibility();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // This is a simplified version - in a full implementation, this would 
  // integrate with the circuit visualization system
  const circuitComponents = [
    { id: 'resistor1', name: 'Resistor R1', position: { x: 100, y: 100 } },
    { id: 'resistor2', name: 'Resistor R2', position: { x: 200, y: 100 } },
    { id: 'battery', name: 'Battery', position: { x: 50, y: 150 } },
    { id: 'switch', name: 'Switch', position: { x: 250, y: 150 } },
  ];

  const handleComponentClick = (componentId: string) => {
    if (disabled) return;
    setSelectedComponent(componentId);
    onAnswer(componentId);
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {question.question}
        </h3>
        {question.difficulty && (
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            question.difficulty === 'easy' 
              ? 'bg-green-100 text-green-700'
              : question.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          }`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        )}
      </div>

      {/* Circuit Visualization Area */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Zap className="w-5 h-5 text-electric-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-900">
            Interactive Circuit Diagram
          </h4>
        </div>

        {/* Simple Circuit SVG - This would be replaced with the actual circuit visualization */}
        <div className="relative bg-gray-50 rounded-lg p-8 min-h-[300px] border border-gray-200">
          <svg 
            width="100%" 
            height="300" 
            viewBox="0 0 400 300"
            className="absolute inset-0"
          >
            {/* Circuit Lines */}
            <line x1="50" y1="150" x2="100" y2="150" stroke="#374151" strokeWidth="2" />
            <line x1="150" y1="150" x2="200" y2="150" stroke="#374151" strokeWidth="2" />
            <line x1="250" y1="150" x2="300" y2="150" stroke="#374151" strokeWidth="2" />
            <line x1="300" y1="150" x2="300" y2="100" stroke="#374151" strokeWidth="2" />
            <line x1="300" y1="100" x2="50" y2="100" stroke="#374151" strokeWidth="2" />
            <line x1="50" y1="100" x2="50" y2="150" stroke="#374151" strokeWidth="2" />

            {/* Interactive Components */}
            {circuitComponents.map((component) => (
              <g key={component.id}>
                <circle
                  cx={component.position.x}
                  cy={component.position.y}
                  r="20"
                  fill={answer === component.id ? "#10b981" : "#e5e7eb"}
                  stroke={answer === component.id ? "#059669" : "#9ca3af"}
                  strokeWidth="2"
                  className={`cursor-pointer transition-all duration-200 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:fill-electric-100'
                  }`}
                  onClick={() => handleComponentClick(component.id)}
                />
                <text
                  x={component.position.x}
                  y={component.position.y + 35}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {component.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Instruction Overlay */}
          <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Instructions:</p>
                <p>Click on the circuit component that answers the question.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component List for Accessibility */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-900 mb-3">Available Components:</h5>
        <div className="grid grid-cols-2 gap-2">
          {circuitComponents.map((component) => (
            <button
              key={component.id}
              onClick={() => handleComponentClick(component.id)}
              disabled={disabled}
              className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-500 ${
                answer === component.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="mr-3">
                {answer === component.id ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <span className="font-medium">{component.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Answer Display */}
      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Selected: {circuitComponents.find(c => c.id === answer)?.name}
            </span>
          </div>
        </motion.div>
      )}

      {/* Note about Future Enhancement */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Development Note:</p>
            <p>
              This is a simplified circuit diagram. The full implementation will include 
              interactive circuit building, real-time simulation, and advanced component interactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}