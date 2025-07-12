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
  type: 'multiple-choice' | 'text' | 'calculation' | 'open-ended';
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Visualization types
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
  sectionProgress: Record<string, number>; // section ID -> progress 0-100%
  currentSection: string;
  timeSpent: Record<string, number>; // section ID -> time in minutes
  questionsAnswered: Record<string, boolean>; // question ID -> correct
  quizScores: Record<string, QuizResult>; // section ID -> quiz result
  achievements: Achievement[];
  masteryLevels: Record<string, MasteryLevel>; // section ID -> mastery level
  learningStreak: number;
  lastActivity: Date;
  subsectionProgress?: Record<string, boolean>; // subsection key: sectionId.subsectionId -> completed
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: Date;
  answers: Record<string, any>;
}

export type MasteryLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop' | 'circuit' | 'calculation';
  question: string;
  options?: string[];
  correctAnswer: string | string[] | number | boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  hints?: string[];
  visualAid?: string;
  points?: number;
}

export interface Quiz {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // minutes
  passingScore: number; // percentage
  allowRetake: boolean;
  showExplanations: boolean;
}

export interface QuizSession {
  id: string;
  quizId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  answers: Record<string, any>;
  score?: number;
  timeSpent: number; // seconds
  completed: boolean;
  hintsUsed: string[];
}

export interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  averageTimeSpent: number;
  commonMistakes: Record<string, number>;
  improvementAreas: string[];
  strongAreas: string[];
}

// UI and accessibility types
export interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  fontFamily: 'lexend' | 'opendyslexic' | 'dyslexie' | 'atkinson';
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
