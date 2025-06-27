// Core content types
export interface ContentSection {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  subsections: ContentSubsection[];
  practiceQuestions: PracticeQuestion[];
  visualizations: VisualizationType[];
}

export interface ContentSubsection {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  visualizations: VisualizationType[];
}

export interface PracticeQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'calculation';
  options?: string[];
  answer: string;
  explanation: string;
}

// Visualization types
export type VisualizationType = 
  | 'atom-structure'
  | 'circuit-series' 
  | 'circuit-parallel'
  | 'ohms-law'
  | 'current-flow'
  | 'voltage-demo'
  | 'resistance-demo'
  | 'capacitor-demo'
  | 'inductor-demo'
  | 'transformer-demo'
  | 'ac-waveform'
  | '3-phase-system'
  | 'safety-demo';

// Chat interface types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string;
  relatedSection?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  currentSection?: string;
  startTime: Date;
  lastActivity: Date;
}

// Progress tracking types
export interface UserProgress {
  userId: string;
  completedSections: string[];
  currentSection: string;
  timeSpent: Record<string, number>; // section ID -> time in minutes
  questionsAnswered: Record<string, boolean>; // question ID -> correct
  achievements: Achievement[];
  lastActivity: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// UI and accessibility types
export interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  fontFamily: 'lexend' | 'opendyslexic' | 'dyslexie' | 'atkinson';
  highContrast: boolean;
  reducedMotion: boolean;
  focusMode: boolean;
}

export interface ThemeSettings {
  colorScheme: 'light' | 'dark' | 'auto';
  accentColor: string;
}

// Circuit simulation types
export interface CircuitComponent {
  id: string;
  type: 'resistor' | 'capacitor' | 'inductor' | 'battery' | 'led' | 'switch';
  value: number;
  unit: string;
  position: { x: number; y: number };
  connections: string[];
}

export interface Circuit {
  id: string;
  name: string;
  components: CircuitComponent[];
  wires: Wire[];
  isActive: boolean;
}

export interface Wire {
  id: string;
  from: string;
  to: string;
  current?: number;
}

// API response types
export interface ContentResponse {
  sections: ContentSection[];
  totalSections: number;
}

export interface ChatResponse {
  message: string;
  context?: string;
  suggestedActions?: string[];
  relatedVisualizations?: VisualizationType[];
}
