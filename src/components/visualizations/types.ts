export interface VisualizationProps {
  className?: string;
  onInteraction?: (data: any) => void;
  interactive?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export type VisualizationType = 
  | 'atomic-structure'
  | 'circuit-diagram'
  | 'ohms-law'
  | 'current-flow'
  | 'component-library'
  | 'voltage-demo'
  | 'resistance-demo'
  | 'circuit-series'
  | 'circuit-parallel'
  | 'ac-waveform'
  | 'waveform'
  | 'capacitor-demo'
  | 'inductor-demo'
  | 'transformer-demo'
  | 'electric-field'
  | '3-phase-system'
  | 'safety-demo';

export interface AtomicStructureData {
  protons: number;
  neutrons: number;
  electrons: number;
  element: string;
  shells: number[][];
}

export interface CircuitComponent {
  id: string;
  type: 'resistor' | 'battery' | 'switch' | 'led' | 'wire';
  position: { x: number; y: number };
  rotation: number;
  value?: number;
  unit?: string;
  connected: string[];
}

export interface CircuitData {
  components: CircuitComponent[];
  connections: Array<{
    from: string;
    to: string;
    path: Array<{ x: number; y: number }>;
  }>;
}

export interface OhmsLawData {
  voltage?: number;
  current?: number;
  resistance?: number;
  power?: number;
}

export interface CurrentFlowData {
  direction: 'clockwise' | 'counterclockwise';
  speed: number;
  intensity: number;
  circuit: CircuitData;
}
