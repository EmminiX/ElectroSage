"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VisualizationProps, CircuitComponent, CircuitData } from "./types";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Zap, Square, Circle, Minus, RotateCw, Trash2, Play, Pause, RotateCcw, Edit } from "lucide-react";

interface Wire {
  id: string;
  from: { componentId: string; terminal: 'positive' | 'negative' };
  to: { componentId: string; terminal: 'positive' | 'negative' };
  path: { x: number; y: number }[];
}

interface CircuitDiagramBuilderProps extends VisualizationProps {
  showAnalysis?: boolean;
  allowSimulation?: boolean;
}

const COMPONENT_TYPES = {
  battery: { icon: "⚡", color: "#EF4444", symbol: "V" },
  resistor: { icon: "▬▬▬", color: "#F59E0B", symbol: "R" },
  led: { icon: "💡", color: "#10B981", symbol: "LED" },
  switch: { icon: "⚬—⚬", color: "#6B7280", symbol: "SW" },
  wire: { icon: "—", color: "#374151", symbol: "" },
};

export default function CircuitDiagramBuilder({
  showAnalysis = true,
  allowSimulation = true,
  interactive = true,
  size = "medium",
  className = "",
  onInteraction,
}: CircuitDiagramBuilderProps) {
  const [selectedTool, setSelectedTool] =
    useState<keyof typeof COMPONENT_TYPES>("battery");
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{componentId: string; terminal: 'positive' | 'negative'} | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize] = useState({ width: 600, height: 400 });
  const animationRef = useRef<number | null>(null);

  const addComponent = (x: number, y: number) => {
    if (!interactive || selectedTool === 'wire') return;

    const newComponent: CircuitComponent = {
      id: `${selectedTool}_${Date.now()}`,
      type: selectedTool,
      position: { x, y },
      rotation: 0,
      connected: [],
      ...(selectedTool === "battery" && { value: 9, unit: "V" }),
      ...(selectedTool === "resistor" && { value: 100, unit: "Ω" }),
    };

    setComponents((prev) => [...prev, newComponent]);
    onInteraction?.({ components: [...components, newComponent] });
  };

  const getComponentTerminals = (component: CircuitComponent) => {
    const { x, y } = component.position;
    const size = 30;
    
    // Return terminal positions based on component type and rotation
    const terminals = {
      positive: { x: x + size, y },
      negative: { x: x - size, y }
    };
    
    // Adjust for rotation
    if (component.rotation === 90 || component.rotation === 270) {
      terminals.positive = { x, y: y + size };
      terminals.negative = { x, y: y - size };
    }
    
    return terminals;
  };

  const getComponentAtPosition = (x: number, y: number) => {
    return components.find(comp => {
      const distance = Math.sqrt(
        Math.pow(comp.position.x - x, 2) + Math.pow(comp.position.y - y, 2)
      );
      return distance < 40; // Component hit area
    });
  };

  const getTerminalAtPosition = (x: number, y: number) => {
    for (const comp of components) {
      const terminals = getComponentTerminals(comp);
      
      // Check positive terminal
      const posDist = Math.sqrt(
        Math.pow(terminals.positive.x - x, 2) + Math.pow(terminals.positive.y - y, 2)
      );
      if (posDist < 15) {
        return { componentId: comp.id, terminal: 'positive' as const };
      }
      
      // Check negative terminal
      const negDist = Math.sqrt(
        Math.pow(terminals.negative.x - x, 2) + Math.pow(terminals.negative.y - y, 2)
      );
      if (negDist < 15) {
        return { componentId: comp.id, terminal: 'negative' as const };
      }
    }
    return null;
  };

  const createWire = (from: {componentId: string; terminal: 'positive' | 'negative'}, to: {componentId: string; terminal: 'positive' | 'negative'}) => {
    const fromComp = components.find(c => c.id === from.componentId);
    const toComp = components.find(c => c.id === to.componentId);
    
    if (!fromComp || !toComp || from.componentId === to.componentId) return;
    
    const fromTerminals = getComponentTerminals(fromComp);
    const toTerminals = getComponentTerminals(toComp);
    
    const startPos = fromTerminals[from.terminal];
    const endPos = toTerminals[to.terminal];
    
    const newWire: Wire = {
      id: `wire_${Date.now()}`,
      from,
      to,
      path: [startPos, endPos] // Simple straight line for now
    };
    
    setWires(prev => [...prev, newWire]);
    
    // Update component connections
    setComponents(prev => prev.map(comp => {
      if (comp.id === from.componentId) {
        return { ...comp, connected: [...comp.connected, to.componentId] };
      }
      if (comp.id === to.componentId) {
        return { ...comp, connected: [...comp.connected, from.componentId] };
      }
      return comp;
    }));
  };

  const removeComponent = (id: string) => {
    // Remove component
    setComponents((prev) => prev.filter((comp) => comp.id !== id));
    
    // Remove connected wires
    setWires((prev) => prev.filter((wire) => 
      wire.from.componentId !== id && wire.to.componentId !== id
    ));
    
    // Update other components' connections
    setComponents((prev) => prev.map((comp) => ({
      ...comp,
      connected: comp.connected.filter((connId) => connId !== id)
    })));
  };
  
  const removeWire = (wireId: string) => {
    const wire = wires.find(w => w.id === wireId);
    if (!wire) return;
    
    setWires(prev => prev.filter(w => w.id !== wireId));
    
    // Update component connections
    setComponents(prev => prev.map(comp => {
      if (comp.id === wire.from.componentId) {
        return { ...comp, connected: comp.connected.filter(id => id !== wire.to.componentId) };
      }
      if (comp.id === wire.to.componentId) {
        return { ...comp, connected: comp.connected.filter(id => id !== wire.from.componentId) };
      }
      return comp;
    }));
  };
  
  const updateComponentValue = (id: string, newValue: number) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, value: newValue } : comp
    ));
  };

  const loadExampleCircuit = (type: 'simple' | 'led' | 'series') => {
    // Clear existing circuit
    setComponents([]);
    setWires([]);
    setIsConnecting(false);
    setConnectionStart(null);
    setEditingComponent(null);

    let exampleComponents: CircuitComponent[] = [];
    let exampleWires: Wire[] = [];

    if (type === 'simple') {
      // Simple battery + resistor circuit
      exampleComponents = [
        {
          id: 'battery_example',
          type: 'battery',
          position: { x: 150, y: 200 },
          rotation: 0,
          connected: ['resistor_example'],
          value: 9,
          unit: 'V'
        },
        {
          id: 'resistor_example',
          type: 'resistor',
          position: { x: 350, y: 150 },
          rotation: 90,
          connected: ['battery_example'],
          value: 100,
          unit: 'Ω'
        }
      ];

      exampleWires = [
        {
          id: 'wire_1',
          from: { componentId: 'battery_example', terminal: 'positive' },
          to: { componentId: 'resistor_example', terminal: 'positive' },
          path: [{ x: 180, y: 200 }, { x: 350, y: 120 }]
        },
        {
          id: 'wire_2',
          from: { componentId: 'resistor_example', terminal: 'negative' },
          to: { componentId: 'battery_example', terminal: 'negative' },
          path: [{ x: 350, y: 180 }, { x: 120, y: 200 }]
        }
      ];
    }

    setTimeout(() => {
      setComponents(exampleComponents);
      setWires(exampleWires);
    }, 100);
  };

  const rotateComponent = (id: string) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id
          ? { ...comp, rotation: (comp.rotation + 90) % 360 }
          : comp,
      ),
    );
  };

  const drawComponent = useCallback((
    ctx: CanvasRenderingContext2D,
    component: CircuitComponent,
  ) => {
    const { x, y } = component.position;
    const size = 30;
    const isHovered = hoveredComponent === component.id;
    const isEditing = editingComponent === component.id;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((component.rotation * Math.PI) / 180);

    // Highlight component if hovered
    if (isHovered || isEditing) {
      ctx.strokeStyle = isEditing ? "#3B82F6" : "#10B981";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(-size * 1.2, -size * 1.2, size * 2.4, size * 2.4);
      ctx.setLineDash([]);
    }

    switch (component.type) {
      case "battery":
        // Draw battery symbol
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-size / 2, -size / 4);
        ctx.lineTo(-size / 2, size / 4);
        ctx.moveTo(size / 2, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.stroke();

        // Draw terminals
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(-size, 0);
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();
        
        // Draw terminal indicators
        ctx.fillStyle = "#EF4444";
        ctx.beginPath();
        ctx.arc(-size, 0, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#374151";
        ctx.beginPath();
        ctx.arc(size, 0, 4, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case "resistor":
        // Draw resistor zigzag
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(-size / 2, 0);
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(
            -size / 2 + (i * size) / 4 + size / 8,
            i % 2 === 0 ? -size / 4 : size / 4,
          );
          ctx.lineTo(-size / 2 + ((i + 1) * size) / 4, 0);
        }
        ctx.lineTo(size, 0);
        ctx.stroke();
        
        // Draw terminal indicators
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath();
        ctx.arc(-size, 0, 4, 0, 2 * Math.PI);
        ctx.arc(size, 0, 4, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case "led":
        // Draw LED symbol
        ctx.fillStyle = "#10B981";
        ctx.beginPath();
        ctx.moveTo(-size / 4, -size / 4);
        ctx.lineTo(size / 4, 0);
        ctx.lineTo(-size / 4, size / 4);
        ctx.closePath();
        ctx.fill();

        // Draw leads
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(-size, 0);
        ctx.moveTo(size / 4, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();
        
        // Draw terminal indicators
        ctx.fillStyle = "#10B981";
        ctx.beginPath();
        ctx.arc(-size, 0, 4, 0, 2 * Math.PI);
        ctx.arc(size, 0, 4, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case "switch":
        // Draw switch
        ctx.strokeStyle = "#6B7280";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(-size / 4, 0);
        ctx.lineTo(size / 4, -size / 4);
        ctx.moveTo(size / 4, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();

        // Draw contacts
        ctx.fillStyle = "#6B7280";
        ctx.beginPath();
        ctx.arc(-size / 4, 0, 3, 0, 2 * Math.PI);
        ctx.arc(size / 4, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw terminal indicators
        ctx.fillStyle = "#6B7280";
        ctx.beginPath();
        ctx.arc(-size, 0, 4, 0, 2 * Math.PI);
        ctx.arc(size, 0, 4, 0, 2 * Math.PI);
        ctx.fill();
        break;
    }

    ctx.restore();

    // Draw component label
    if (component.value) {
      ctx.fillStyle = isEditing ? "#3B82F6" : "#374151";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${component.value}${component.unit}`, x, y + size + 15);
    }
  }, [hoveredComponent, editingComponent]);
  
  const drawWire = useCallback((ctx: CanvasRenderingContext2D, wire: Wire) => {
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(wire.path[0].x, wire.path[0].y);
    for (let i = 1; i < wire.path.length; i++) {
      ctx.lineTo(wire.path[i].x, wire.path[i].y);
    }
    ctx.stroke();
    
    // Draw connection points
    ctx.fillStyle = "#374151";
    ctx.beginPath();
    ctx.arc(wire.path[0].x, wire.path[0].y, 3, 0, 2 * Math.PI);
    ctx.arc(wire.path[wire.path.length - 1].x, wire.path[wire.path.length - 1].y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "#F3F4F6";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, []);

  const findCircuitPaths = useCallback(() => {
    const batteries = components.filter(c => c.type === 'battery');
    if (batteries.length === 0) return [];

    const circuitPaths: {wire: Wire, direction: 1 | -1, isActive: boolean}[] = [];
    
    batteries.forEach(battery => {
      // Find complete circuit loops starting from battery positive terminal
      const findLoop = (currentCompId: string, currentTerminal: 'positive' | 'negative', visitedWires: Set<string>, path: Wire[]): boolean => {
        // Find wires connected to current component's terminal
        const connectedWires = wires.filter(wire => 
          !visitedWires.has(wire.id) && (
            (wire.from.componentId === currentCompId && wire.from.terminal === currentTerminal) ||
            (wire.to.componentId === currentCompId && wire.to.terminal === currentTerminal)
          )
        );
        
        for (const wire of connectedWires) {
          const newVisited = new Set(visitedWires);
          newVisited.add(wire.id);
          const newPath = [...path, wire];
          
          // Determine next component and terminal
          const isFromCurrent = wire.from.componentId === currentCompId;
          const nextCompId = isFromCurrent ? wire.to.componentId : wire.from.componentId;
          const nextTerminal = isFromCurrent ? wire.to.terminal : wire.from.terminal;
          
          // Check if we've completed a loop back to battery negative terminal
          if (nextCompId === battery.id && nextTerminal === 'negative' && newPath.length > 1) {
            // Found complete circuit! Mark all wires in this path as active
            newPath.forEach(pathWire => {
              circuitPaths.push({
                wire: pathWire,
                direction: pathWire.from.componentId === currentCompId ? 1 : -1,
                isActive: true
              });
            });
            return true;
          }
          
          // Continue searching if we haven't hit a dead end
          if (nextCompId !== battery.id && newPath.length < 10) { // Prevent infinite loops
            const foundLoop = findLoop(nextCompId, nextTerminal === 'positive' ? 'negative' : 'positive', newVisited, newPath);
            if (foundLoop) return true;
          }
        }
        
        return false;
      };
      
      // Start tracing from battery positive terminal
      findLoop(battery.id, 'positive', new Set(), []);
    });
    
    return circuitPaths;
  }, [components, wires]);
  
  const drawCurrentFlow = useCallback((ctx: CanvasRenderingContext2D) => {
    const circuitPaths = findCircuitPaths();
    
    circuitPaths.forEach(({wire, direction, isActive}) => {
      if (!isActive) return;
      
      // Draw animated current flow along active wires
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 10]);
      ctx.lineDashOffset = (Date.now() / 100) % 20;
      
      ctx.beginPath();
      ctx.moveTo(wire.path[0].x, wire.path[0].y);
      for (let i = 1; i < wire.path.length; i++) {
        ctx.lineTo(wire.path[i].x, wire.path[i].y);
      }
      ctx.stroke();
      
      // Draw flow direction arrows based on actual current direction
      const midPoint = {
        x: (wire.path[0].x + wire.path[wire.path.length - 1].x) / 2,
        y: (wire.path[0].y + wire.path[wire.path.length - 1].y) / 2
      };
      
      let angle = Math.atan2(
        wire.path[wire.path.length - 1].y - wire.path[0].y,
        wire.path[wire.path.length - 1].x - wire.path[0].x
      );
      
      // Reverse arrow if current flows in opposite direction
      if (direction === -1) {
        angle += Math.PI;
      }
      
      ctx.save();
      ctx.translate(midPoint.x, midPoint.y);
      ctx.rotate(angle);
      ctx.fillStyle = "#3B82F6";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -4);
      ctx.lineTo(-8, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    ctx.setLineDash([]);
  }, [findCircuitPaths]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw grid
    drawGrid(ctx, canvasSize.width, canvasSize.height);

    // Draw wires first (behind components)
    wires.forEach((wire) => {
      drawWire(ctx, wire);
    });

    // Draw components
    components.forEach((component) => {
      drawComponent(ctx, component);
    });

    // Draw current flow animation if simulating
    if (isSimulating) {
      drawCurrentFlow(ctx);
    }
  }, [canvasSize, components, wires, drawComponent, drawWire, drawCurrentFlow, drawGrid, isSimulating]);

  useEffect(() => {
    drawCanvas();
  }, [components, wires, isSimulating, drawCanvas]);
  
  useEffect(() => {
    let animationId: number;
    if (isSimulating) {
      const animate = () => {
        drawCanvas();
        animationId = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isSimulating, drawCanvas]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a terminal for wire connection
    const terminal = getTerminalAtPosition(x, y);
    
    if (selectedTool === 'wire' && terminal) {
      if (!isConnecting) {
        // Start wire connection
        setIsConnecting(true);
        setConnectionStart(terminal);
      } else if (connectionStart) {
        // Complete wire connection
        createWire(connectionStart, terminal);
        setIsConnecting(false);
        setConnectionStart(null);
      }
      return;
    }
    
    // Check if clicking on a component for editing
    const component = getComponentAtPosition(x, y);
    if (component && selectedTool !== 'wire') {
      setEditingComponent(editingComponent === component.id ? null : component.id);
      return;
    }
    
    // Cancel wire connection if clicking elsewhere
    if (isConnecting) {
      setIsConnecting(false);
      setConnectionStart(null);
      return;
    }

    // Snap to grid for component placement
    const snappedX = Math.round(x / 20) * 20;
    const snappedY = Math.round(y / 20) * 20;

    addComponent(snappedX, snappedY);
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update hovered component
    const component = getComponentAtPosition(x, y);
    setHoveredComponent(component?.id || null);
    
    // Update cursor based on tool and hover state
    const terminal = getTerminalAtPosition(x, y);
    if (selectedTool === 'wire' && terminal) {
      canvas.style.cursor = 'crosshair';
    } else if (component) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = selectedTool === 'wire' ? 'crosshair' : 'default';
    }
  };

  const analyzeCircuit = () => {
    const batteries = components.filter((c) => c.type === "battery");
    const resistors = components.filter((c) => c.type === "resistor");
    const leds = components.filter((c) => c.type === "led");
    const switches = components.filter((c) => c.type === "switch");
    
    // Find active circuit paths
    const activePaths = findCircuitPaths();
    const hasActivePaths = activePaths.some(path => path.isActive);
    
    let totalVoltage = 0;
    let totalResistance = 0;
    let current = 0;
    let circuitComplete = false;
    
    if (hasActivePaths && batteries.length > 0) {
      // Calculate total voltage from batteries in the active circuit
      const activeBatteries = batteries.filter(battery => 
        activePaths.some(path => 
          path.wire.from.componentId === battery.id || path.wire.to.componentId === battery.id
        )
      );
      totalVoltage = activeBatteries.reduce((sum, b) => sum + (b.value || 0), 0);
      
      // Calculate total resistance from components in the active circuit  
      const activeResistors = resistors.filter(resistor =>
        activePaths.some(path => 
          path.wire.from.componentId === resistor.id || path.wire.to.componentId === resistor.id
        )
      );
      const activeLEDs = leds.filter(led =>
        activePaths.some(path => 
          path.wire.from.componentId === led.id || path.wire.to.componentId === led.id
        )
      );
      
      // Add resistance from resistors
      totalResistance = activeResistors.reduce((sum, r) => sum + (r.value || 0), 0);
      
      // Add LED forward resistance (simplified - normally 2V forward drop)
      totalResistance += activeLEDs.length * 100; // Assume ~100Ω equivalent resistance for LEDs
      
      // Calculate current using Ohm's law
      current = totalResistance > 0 ? totalVoltage / totalResistance : 0;
      circuitComplete = true;
    }
    
    const connectedComponents = components.filter(c => c.connected.length > 0).length;
    
    return { 
      totalVoltage, 
      totalResistance, 
      current, 
      connectedComponents, 
      circuitComplete: circuitComplete && hasActivePaths,
      wireCount: wires.length,
      hasActivePaths,
      componentCounts: {
        batteries: batteries.length,
        resistors: resistors.length,
        leds: leds.length,
        switches: switches.length
      }
    };
  };

  const analysis = showAnalysis ? analyzeCircuit() : null;
  
  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      data-oid="l9d7n9q"
    >
      <div
        className="flex items-center justify-between mb-4"
        data-oid="jigmo4b"
      >
        <h3 className="text-xl font-semibold text-gray-900" data-oid="o_z099n">
          Circuit Builder
        </h3>
        <div className="flex items-center space-x-2" data-oid="o63yj:z">
          {allowSimulation && (
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-3 py-1 rounded-md transition-colors ${
                isSimulating
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              data-oid="zxletqu"
            >
              {isSimulating ? (
                <Pause className="w-4 h-4" data-oid="wzp33sb" />
              ) : (
                <Play className="w-4 h-4" data-oid="pyxd9jv" />
              )}
              {isSimulating ? "Stop" : "Simulate"}
            </button>
          )}
          <button
            onClick={() => loadExampleCircuit('simple')}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            Example Circuit
          </button>
          <button
            onClick={() => {
              setComponents([]);
              setWires([]);
              setIsConnecting(false);
              setConnectionStart(null);
              setEditingComponent(null);
            }}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            data-oid="bentcxc"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Component Toolbar */}
      {interactive && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg" data-oid="dj:d68m">
          <h4
            className="text-sm font-medium text-gray-700 mb-2"
            data-oid="mgsg3dc"
          >
            Tools & Components:
          </h4>
          <div className="flex flex-wrap gap-2" data-oid="zufq0en">
            {Object.entries(COMPONENT_TYPES).map(([type, config]) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedTool(type as keyof typeof COMPONENT_TYPES);
                  if (isConnecting) {
                    setIsConnecting(false);
                    setConnectionStart(null);
                  }
                  setEditingComponent(null);
                }}
                className={`px-3 py-2 rounded-md text-sm transition-colors border ${
                  selectedTool === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
                data-oid="1kf_6r_"
              >
                <span className="mr-2" data-oid="30bp3oe">
                  {config.icon}
                </span>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Wire Connection Status */}
          {isConnecting && connectionStart && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              🔗 Click on another component terminal to complete the wire connection
            </div>
          )}
          
          {/* Current Tool Info */}
          <div className="mt-2 text-xs text-gray-600">
            {selectedTool === 'wire' ? (
              "Click component terminals to create connections"
            ) : (
              `Click grid to place ${selectedTool}, or click existing components to edit values`
            )}
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        className="border border-gray-300 rounded-lg overflow-hidden mb-4"
        data-oid="j452:ro"
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          className="bg-white"
          data-oid=".m2_k:o"
        />
      </div>

      {/* Component and Wire Lists */}
      {(components.length > 0 || wires.length > 0) && (
        <div className="mb-4 grid md:grid-cols-2 gap-4" data-oid="cy4wo-h">
          {/* Components */}
          {components.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2" data-oid="-86vy:b">
                Components ({components.length}):
              </h4>
              <div className="space-y-2" data-oid="abm9_81">
                {components.map((component) => (
                  <div
                    key={component.id}
                    className={`flex items-center justify-between p-2 rounded border ${
                      editingComponent === component.id 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    data-oid="tjj5jtt"
                  >
                    <div className="flex-1">
                      <span className="text-sm" data-oid="u3dmf3.">
                        {COMPONENT_TYPES[component.type].icon} {component.type}
                      </span>
                      {component.value && editingComponent === component.id ? (
                        <div className="mt-1">
                          <input
                            type="number"
                            value={component.value}
                            onChange={(e) => updateComponentValue(component.id, Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border rounded"
                            min="1"
                          />
                          <span className="text-xs text-gray-500 ml-1">{component.unit}</span>
                        </div>
                      ) : component.value ? (
                        <div className="text-xs text-gray-600">{component.value}{component.unit}</div>
                      ) : null}
                    </div>
                    <div className="flex items-center space-x-1" data-oid="e4..y9m">
                      {component.value && (
                        <button
                          onClick={() => setEditingComponent(editingComponent === component.id ? null : component.id)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => rotateComponent(component.id)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        data-oid="h.6o5cz"
                      >
                        <RotateCw className="w-4 h-4" data-oid="hflx8r4" />
                      </button>
                      <button
                        onClick={() => removeComponent(component.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        data-oid="nl-xpt8"
                      >
                        <Trash2 className="w-4 h-4" data-oid="mo92y-q" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Wires */}
          {wires.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Connections ({wires.length}):
              </h4>
              <div className="space-y-2">
                {wires.map((wire) => {
                  const fromComp = components.find(c => c.id === wire.from.componentId);
                  const toComp = components.find(c => c.id === wire.to.componentId);
                  return (
                    <div key={wire.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="text-sm">
                        🔗 {fromComp?.type}({wire.from.terminal}) → {toComp?.type}({wire.to.terminal})
                      </span>
                      <button
                        onClick={() => removeWire(wire.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Circuit Analysis */}
      {showAnalysis && analysis && components.length > 0 && (
        <div className={`p-4 rounded-lg border ${
          analysis.circuitComplete 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`} data-oid="17xkdtd">
          <h4 className={`font-medium mb-2 ${
            analysis.circuitComplete ? 'text-green-900' : 'text-yellow-900'
          }`} data-oid="ym4t382">
            Circuit Analysis:
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3" data-oid="9wqdmjm">
            <div data-oid="3os1m45">
              <span className={analysis.circuitComplete ? 'text-green-700' : 'text-yellow-700'} data-oid="tzbqw7k">
                Total Voltage:
              </span>
              <div className={`font-semibold ${analysis.circuitComplete ? 'text-green-900' : 'text-yellow-900'}`} data-oid="4.0c2v:">
                {analysis.totalVoltage.toFixed(1)} V
              </div>
            </div>
            <div data-oid="t_pfphs">
              <span className={analysis.circuitComplete ? 'text-green-700' : 'text-yellow-700'} data-oid="xuqaos2">
                Total Resistance:
              </span>
              <div className={`font-semibold ${analysis.circuitComplete ? 'text-green-900' : 'text-yellow-900'}`} data-oid="21-blf5">
                {analysis.totalResistance.toFixed(1)} Ω
              </div>
            </div>
            <div data-oid="bggrhzx">
              <span className={analysis.circuitComplete ? 'text-green-700' : 'text-yellow-700'} data-oid="6y7i:.0">
                Current:
              </span>
              <div className={`font-semibold ${analysis.circuitComplete ? 'text-green-900' : 'text-yellow-900'}`} data-oid="h-h.jlc">
                {analysis.current.toFixed(3)} A
              </div>
            </div>
            <div>
              <span className={analysis.circuitComplete ? 'text-green-700' : 'text-yellow-700'}>
                Connections:
              </span>
              <div className={`font-semibold ${analysis.circuitComplete ? 'text-green-900' : 'text-yellow-900'}`}>
                {analysis.wireCount} wires
              </div>
            </div>
          </div>
          
          <div className={`text-sm ${
            analysis.circuitComplete 
              ? 'text-green-800' 
              : 'text-yellow-800'
          }`}>
            <strong>Status:</strong> {analysis.circuitComplete 
              ? '✓ Circuit is complete and functional - current is flowing!'
              : analysis.hasActivePaths 
                ? '⚠ Circuit has closed loops but may need more components'
                : analysis.wireCount > 0
                  ? '⚠ Circuit needs to form a complete loop from battery + to battery -'
                  : '⚠ Add components and wire them together to build a circuit'
            }
          </div>
          
          {analysis.componentCounts.batteries === 0 && (
            <div className="text-sm text-red-600 mt-1">
              💡 <strong>Tip:</strong> Every circuit needs at least one battery to provide power
            </div>
          )}
          
          {analysis.componentCounts.batteries > 0 && analysis.wireCount === 0 && (
            <div className="text-sm text-blue-600 mt-1">
              💡 <strong>Next:</strong> Use the Wire tool to connect component terminals (colored circles)
            </div>
          )}
          
          {analysis.componentCounts.batteries > 0 && analysis.wireCount > 0 && !analysis.hasActivePaths && (
            <div className="text-sm text-orange-600 mt-1">
              💡 <strong>Almost there:</strong> Connect battery + to battery - through other components to complete the loop
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg" data-oid="83.4t10">
        <h4 className="font-medium text-yellow-900 mb-2" data-oid="l8xr7tq">
          Circuit Building Guide:
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1" data-oid="ln9d10a">
          <li data-oid="lf_zmw_">
            🔋 <strong>Start with a battery:</strong> Select Battery and click the grid to place it
          </li>
          <li data-oid="rjvv06.">
            🔌 <strong>Add components:</strong> Place resistors, LEDs, or switches for your circuit
          </li>
          <li data-oid="2sl88pr">
            ⚡ <strong>Wire them up:</strong> Select Wire tool and click colored terminal circles to connect components
          </li>
          <li data-oid="e.yf_wc">
            🔄 <strong>Complete the loop:</strong> Connect battery + (red) to battery - (gray) through other components
          </li>
          <li>
            ▶️ <strong>Test it:</strong> Click Simulate to see current flow and verify your circuit works
          </li>
          <li>
            🎯 <strong>Quick start:</strong> Click &quot;Example Circuit&quot; to see a working circuit, then modify it!
          </li>
        </ul>
        
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong className="text-blue-900">Educational Note:</strong>
          <span className="text-blue-800"> Current flows from battery + through components back to battery -. All electrical devices need this complete path to work!</span>
        </div>
      </div>
    </div>
  );
}
