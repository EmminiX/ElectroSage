"use client";

import React, { useState, useEffect, useRef } from "react";
import { VisualizationProps } from "./types";
import * as d3 from "d3";
import { Play, Pause, RotateCcw, Radio } from "lucide-react";

interface ACWaveformPreset {
  id: string;
  name: string;
  description: string;
  frequency: number; // Hz
  amplitude: number; // V
  phase: number; // degrees
  color: string;
}

const AC_WAVEFORM_PRESETS: ACWaveformPreset[] = [
  {
    id: 'low-freq',
    name: 'Low Frequency',
    description: '1Hz, 5V - Slow oscillation, easy to follow',
    frequency: 1,
    amplitude: 5,
    phase: 0,
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'standard-ac',
    name: 'Standard AC',
    description: '60Hz, 120V - Household power frequency',
    frequency: 60,
    amplitude: 120,
    phase: 0,
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'high-freq',
    name: 'High Frequency',
    description: '1000Hz, 10V - Fast oscillation, high pitch',
    frequency: 1000,
    amplitude: 10,
    phase: 0,
    color: 'bg-orange-100 border-orange-300'
  },
  {
    id: 'phase-shift',
    name: 'Phase Shifted',
    description: '60Hz, 120V, 90° - Demonstrates phase relationships',
    frequency: 60,
    amplitude: 120,
    phase: 90,
    color: 'bg-purple-100 border-purple-300'
  }
];

interface ACWaveformVisualizationProps extends VisualizationProps {
  frequency?: number;
  amplitude?: number;
  phase?: number;
  showMultipleWaves?: boolean;
}

export default function ACWaveformVisualization({
  frequency = 60,
  amplitude = 120,
  phase = 0,
  showMultipleWaves = false,
  interactive = true,
  size = "medium",
  className = "",
  onInteraction,
}: ACWaveformVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ACWaveformPreset>(AC_WAVEFORM_PRESETS[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [localShowMultipleWaves, setLocalShowMultipleWaves] = useState(showMultipleWaves);
  
  // Use selected preset values
  const currentFreq = selectedPreset.frequency;
  const currentAmp = selectedPreset.amplitude;
  const currentPhase = selectedPreset.phase;

  const sizeMap = {
    small: { width: 400, height: 250, scale: 0.8 },
    medium: { width: 600, height: 300, scale: 1 },
    large: { width: 800, height: 400, scale: 1.2 },
  };

  const { width, height, scale } = sizeMap[size];
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Setup chart structure (only when size changes)
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create scales - keep original 2 second timespan for all frequencies
    const timeSpan = 2; // Fixed 2 seconds like original
    
    const timeScale = d3.scaleLinear()
      .domain([0, timeSpan])
      .range([0, innerWidth]);

    // Dynamic voltage scale based on current amplitude for better visibility
    const maxVoltage = Math.max(currentAmp * 1.3, 50); // Scale with 30% padding, minimum 50V
    const voltageScale = d3.scaleLinear()
      .domain([-maxVoltage, maxVoltage])
      .range([innerHeight, 0]);

    // Create container group
    const container = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add grid lines
    const xTicks = timeScale.ticks(10);
    const yTicks = voltageScale.ticks(8);

    // Vertical grid lines
    container.selectAll(".grid-line-x")
      .data(xTicks)
      .enter()
      .append("line")
      .attr("class", "grid-line-x")
      .attr("x1", d => timeScale(d))
      .attr("x2", d => timeScale(d))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 0.5);

    // Horizontal grid lines
    container.selectAll(".grid-line-y")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("class", "grid-line-y")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => voltageScale(d))
      .attr("y2", d => voltageScale(d))
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 0.5);

    // Add zero line
    container.append("line")
      .attr("class", "zero-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", voltageScale(0))
      .attr("y2", voltageScale(0))
      .attr("stroke", "#6B7280")
      .attr("stroke-width", 2);

    // Create axes
    const xAxis = d3.axisBottom(timeScale)
      .tickFormat((d: d3.NumberValue) => {
        const time = +d;
        if (time >= 1) {
          return `${time.toFixed(1)}s`;
        } else {
          return `${(time * 1000).toFixed(0)}ms`;
        }
      });
    
    const yAxis = d3.axisLeft(voltageScale)
      .tickFormat((d: d3.NumberValue) => `${+d}V`);

    container.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    container.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    // Add axis labels
    container.append("text")
      .attr("class", "x-label")
      .attr("transform", `translate(${innerWidth/2}, ${innerHeight + 45})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#374151")
      .text("Time");

    container.append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - (innerHeight / 2))
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#374151")
      .text("Voltage (V)");

    // Add waveform container
    container.append("g").attr("class", "waveforms");
    
    // Add measurement container
    container.append("g").attr("class", "measurements");
    
    // Add reference wave container for phase comparison
    container.append("g").attr("class", "reference-wave");

  }, [width, height, innerWidth, innerHeight, margin.left, margin.top]);

  // Animation loop
  useEffect(() => {
    if (!svgRef.current || !isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    const container = svg.select("g");
    
    // Create scales (recalculated each frame for consistency)
    const timeSpan = 2; // Fixed 2 seconds like original
    
    const timeScale = d3.scaleLinear()
      .domain([0, timeSpan])
      .range([0, innerWidth]);

    // Dynamic voltage scale based on current amplitude for better visibility  
    const maxVoltage = Math.max(currentAmp * 1.3, 50); // Scale with 30% padding, minimum 50V
    const voltageScale = d3.scaleLinear()
      .domain([-maxVoltage, maxVoltage])
      .range([innerHeight, 0]);

    // Line generator
    const line = d3.line<{time: number, voltage: number}>()
      .x(d => timeScale(d.time))
      .y(d => voltageScale(d.voltage))
      .curve(d3.curveLinear); // Use linear for more predictable behavior

    const animate = () => {
      if (!isAnimating) return;

      // Simple time increment - no complex frequency scaling
      timeRef.current += 0.02; // Fixed increment rate

      // Generate waveform data points
      const numPoints = 100;
      
      // Calculate the main waveform
      const mainWaveData = [];
      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * timeSpan;
        
        // Simple sine wave calculation - back to original approach
        // frequency controls cycles per time span
        // phase shifts the wave horizontally
        // timeRef.current provides animation
        const cycles = currentFreq / 60; // Normalize to 60Hz reference
        const phaseInRadians = (currentPhase * Math.PI) / 180; // Convert degrees to radians
        const animationPhase = timeRef.current * 2; // Animation speed
        
        // Phase shift is applied as a time offset to make it more visible
        // This creates a clear horizontal shift of the entire waveform
        const voltage = currentAmp * Math.sin(
          2 * Math.PI * cycles * (t - (currentPhase / 360) * (60 / currentFreq)) + animationPhase
        );
        
        mainWaveData.push({ time: t, voltage });
      }

      // Update main waveform
      const waveformGroup = container.select(".waveforms");
      
      let mainPath: any = waveformGroup.select(".main-waveform");
      if (mainPath.empty()) {
        mainPath = waveformGroup.append("path")
          .attr("class", "main-waveform")
          .attr("fill", "none")
          .attr("stroke", "#3B82F6")
          .attr("stroke-width", 3);
      }
      
      mainPath.datum(mainWaveData).attr("d", line);

      // Draw reference wave when phase is not zero to show the difference
      const referenceGroup = container.select(".reference-wave");
      if (currentPhase !== 0) {
        // Generate reference wave (zero phase) for comparison
        const referenceWaveData = [];
        for (let i = 0; i <= numPoints; i++) {
          const t = (i / numPoints) * timeSpan;
          const cycles = currentFreq / 60;
          const animationPhase = timeRef.current * 2;
          
          // Reference wave with zero phase
          const voltage = currentAmp * Math.sin(
            2 * Math.PI * cycles * t + animationPhase
          );
          
          referenceWaveData.push({ time: t, voltage });
        }

        let referencePath: any = referenceGroup.select(".reference-waveform");
        if (referencePath.empty()) {
          referencePath = referenceGroup.append("path")
            .attr("class", "reference-waveform")
            .attr("fill", "none")
            .attr("stroke", "#6B7280")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "8,4")
            .attr("opacity", 0.9);
        }
        
        referencePath.datum(referenceWaveData).attr("d", line);
      } else {
        // Remove reference wave when phase is zero
        referenceGroup.select(".reference-waveform").remove();
      }

      // Handle multiple waveforms
      if (localShowMultipleWaves) {
        // Second waveform with additional +60° phase shift
        const secondWaveData = [];
        for (let i = 0; i <= numPoints; i++) {
          const t = (i / numPoints) * timeSpan;
          const cycles = currentFreq / 60;
          const animationPhase = timeRef.current * 2;
          const additionalPhase = currentPhase + 60; // Add 60° to current phase
          
          const voltage = currentAmp * Math.sin(
            2 * Math.PI * cycles * (t - (additionalPhase / 360) * (60 / currentFreq)) + animationPhase
          );
          
          secondWaveData.push({ time: t, voltage });
        }

        let secondPath: any = waveformGroup.select(".second-waveform");
        if (secondPath.empty()) {
          secondPath = waveformGroup.append("path")
            .attr("class", "second-waveform")
            .attr("fill", "none")
            .attr("stroke", "#EF4444")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");
        }
        
        secondPath.datum(secondWaveData).attr("d", line);

        // Third waveform with different frequency
        const thirdWaveData = [];
        for (let i = 0; i <= numPoints; i++) {
          const t = (i / numPoints) * timeSpan;
          const cycles = (currentFreq * 1.5) / 60; // 1.5x frequency
          const animationPhase = timeRef.current * 2;
          
          const voltage = (currentAmp * 0.7) * Math.sin(
            2 * Math.PI * cycles * (t - (currentPhase / 360) * (60 / (currentFreq * 1.5))) + animationPhase
          );
          
          thirdWaveData.push({ time: t, voltage });
        }

        let thirdPath: any = waveformGroup.select(".third-waveform");
        if (thirdPath.empty()) {
          thirdPath = waveformGroup.append("path")
            .attr("class", "third-waveform")
            .attr("fill", "none")
            .attr("stroke", "#10B981")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "3,3");
        }
        
        thirdPath.datum(thirdWaveData).attr("d", line);
      } else {
        // Remove additional waveforms when disabled
        waveformGroup.select(".second-waveform").remove();
        waveformGroup.select(".third-waveform").remove();
      }

      // Update measurements
      updateMeasurements(container, voltageScale, timeScale);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isAnimating, currentFreq, currentAmp, currentPhase, localShowMultipleWaves, innerWidth, innerHeight]);

  // Function to update measurements
  const updateMeasurements = (container: any, voltageScale: any, timeScale: any) => {
    const measurementGroup = container.select(".measurements");
    measurementGroup.selectAll("*").remove();

    const amplitude = currentAmp;
    const frequency = currentFreq;
    const rmsVoltage = amplitude / Math.sqrt(2);
    const peakY = voltageScale(amplitude);
    const rmsY = voltageScale(rmsVoltage);
    const periodTime = 1 / frequency;
    
    const minLabelSpacing = 20;
    const peakRmsDistance = Math.abs(peakY - rmsY);
    const showDetailedLabels = peakRmsDistance > minLabelSpacing && innerHeight > 200;
    
    // Peak voltage indicator
    if (showDetailedLabels) {
      measurementGroup.append("line")
        .attr("x1", timeScale(0.25))
        .attr("x2", timeScale(0.25))
        .attr("y1", voltageScale(0))
        .attr("y2", peakY)
        .attr("stroke", "#F59E0B")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "3,3");

      const peakLabelY = peakY < 30 ? peakY + 15 : peakY - 5;
      measurementGroup.append("text")
        .attr("x", timeScale(0.25) + 5)
        .attr("y", peakLabelY)
        .style("font-size", `${Math.max(8, Math.min(10, innerWidth / 60))}px`)
        .style("fill", "#F59E0B")
        .style("font-weight", "500")
        .text(`Peak: ${amplitude}V`);
    }

    // RMS voltage indicator
    measurementGroup.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", rmsY)
      .attr("y2", rmsY)
      .attr("stroke", "#EC4899")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2,2");

    const rmsLabelX = innerWidth > 400 ? innerWidth - 5 : innerWidth - 60;
    const rmsLabelY = rmsY < 20 ? rmsY + 15 : rmsY - 5;
    measurementGroup.append("text")
      .attr("x", rmsLabelX)
      .attr("y", rmsLabelY)
      .style("text-anchor", innerWidth > 400 ? "end" : "start")
      .style("font-size", `${Math.max(8, Math.min(10, innerWidth / 60))}px`)
      .style("fill", "#EC4899")
      .style("font-weight", "500")
      .text(`RMS: ${rmsVoltage.toFixed(1)}V`);

    // Period indicator - adjust based on timespan
    const timeSpan = timeScale.domain()[1];
    if (periodTime < timeSpan && innerWidth > 200) {
      measurementGroup.append("line")
        .attr("x1", timeScale(0))
        .attr("x2", timeScale(Math.min(periodTime, timeSpan)))
        .attr("y1", innerHeight - 10)
        .attr("y2", innerHeight - 10)
        .attr("stroke", "#8B5CF6")
        .attr("stroke-width", 2);

      const periodLabelX = Math.min(timeScale(periodTime/2), innerWidth - 50);
      measurementGroup.append("text")
        .attr("x", periodLabelX)
        .attr("y", innerHeight - 15)
        .style("text-anchor", "middle")
        .style("font-size", `${Math.max(8, Math.min(10, innerWidth / 60))}px`)
        .style("fill", "#8B5CF6")
        .style("font-weight", "500")
        .text(`T: ${periodTime >= 1 ? `${periodTime.toFixed(1)}s` : `${(periodTime * 1000).toFixed(0)}ms`}`);
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    onInteraction?.({ action: "toggle", isAnimating: !isAnimating });
  };

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
    timeRef.current = 0;
  };

  // Calculate derived values
  const rmsVoltage = currentAmp / Math.sqrt(2);
  const period = 1 / currentFreq;
  const angularFreq = 2 * Math.PI * currentFreq;
  const instantVoltage = currentAmp * Math.sin(angularFreq * timeRef.current / 1000 + (currentPhase * Math.PI / 180));

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Radio className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            AC Waveform Visualization
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleAnimation}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isAnimating 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAnimating ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Preset Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Waveform Configuration:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AC_WAVEFORM_PRESETS.map((preset) => (
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
                Period: {(1000 / preset.frequency).toFixed(1)}ms | 
                RMS: {(preset.amplitude / Math.sqrt(2)).toFixed(1)}V | 
                Phase: {preset.phase}°
              </div>
            </button>
          ))}
        </div>
        {isAnimating && (
          <div className="text-xs text-gray-500 mt-2">
            Stop animation to change waveform configuration
          </div>
        )}
      </div>

      <div className="flex justify-center mb-4">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded bg-gray-50"
        />
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{currentFreq}Hz</div>
          <div className="text-sm text-gray-600">Frequency</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{currentAmp}V</div>
          <div className="text-sm text-gray-600">Peak Voltage</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-pink-600">{rmsVoltage.toFixed(1)}V</div>
          <div className="text-sm text-gray-600">RMS Voltage</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{(period * 1000).toFixed(1)}ms</div>
          <div className="text-sm text-gray-600">Period</div>
        </div>
      </div>

      {/* Real-time readings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Frequency</div>
          <div className="text-lg font-bold text-blue-600">{currentFreq} Hz</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Peak Voltage</div>
          <div className="text-lg font-bold text-green-600">{currentAmp} V</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">RMS Voltage</div>
          <div className="text-lg font-bold text-pink-600">{rmsVoltage.toFixed(1)} V</div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Period</div>
          <div className="text-lg font-bold text-purple-600">{(period * 1000).toFixed(1)} ms</div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Radio className="w-4 h-4" />
            How AC Waveforms Work:
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            AC voltage alternates between positive and negative values in a sinusoidal pattern. 
            The frequency determines how fast it oscillates, while amplitude sets the peak voltage.
          </p>
          <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded font-mono">
            V(t) = A × sin(2πft + φ) | Current: {currentFreq}Hz, {currentAmp}V peak, {currentPhase}° phase
          </div>
        </div>
        
        {/* Dynamic Status Display */}
        <div className={`p-3 rounded-lg border ${
          !isAnimating ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            !isAnimating ? 'text-gray-700' : 'text-green-800'
          }`}>
            Status: {!isAnimating ? 'Stopped' : 'Oscillating'}
          </h4>
          <div className={`text-sm ${
            !isAnimating ? 'text-gray-600' : 'text-green-700'
          }`}>
            {!isAnimating ? 
              `Ready to demonstrate ${selectedPreset.name}. Click "Start" to begin AC waveform animation.` :
              `${selectedPreset.name} - ${currentFreq}Hz sine wave oscillating at ${currentAmp}V peak with ${currentPhase}° phase shift`
            }
          </div>
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Why Different Waveforms?</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Low Frequency (1Hz):</strong> Slow oscillation, easy to follow visually</li>
          <li>• <strong>Standard AC (60Hz):</strong> Power grid frequency, household electricity</li>
          <li>• <strong>High Frequency (1000Hz):</strong> Fast oscillation, radio/audio signals</li>
          <li>• <strong>Phase Shift (90°):</strong> Shows timing relationship between waveforms</li>
          <li>• <strong>RMS vs Peak:</strong> RMS is the &quot;effective&quot; voltage (Peak ÷ √2)</li>
          <li>• <strong>Period:</strong> Time for one complete cycle (1/frequency)</li>
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Waveform Comparison:</h4>
        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className="font-medium text-gray-700">Configuration</div>
          <div className="font-medium text-gray-700">Frequency</div>
          <div className="font-medium text-gray-700">Peak</div>
          <div className="font-medium text-gray-700">RMS</div>
          <div className="font-medium text-gray-700">Period</div>
          
          {AC_WAVEFORM_PRESETS.map((preset) => (
            <React.Fragment key={preset.id}>
              <div className={`p-1 rounded text-gray-800 ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {preset.name}
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {preset.frequency}Hz
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {preset.amplitude}V
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {(preset.amplitude / Math.sqrt(2)).toFixed(1)}V
              </div>
              <div className={`p-1 rounded ${preset.id === selectedPreset.id ? 'bg-blue-100 font-medium' : ''}`}>
                {(1000 / preset.frequency).toFixed(1)}ms
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}