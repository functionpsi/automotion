export type AgentId =
  | 'creative_director'
  | 'vision_analysis'
  | 'motion_architect'
  | 'prompt_engineer'
  | 'model_selection'
  | 'generation'
  | 'quality_control'
  | 'workflow_orchestrator';

export type AgentStatus = 'idle' | 'thinking' | 'executing' | 'completed' | 'error' | 'waiting';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  icon: string;
  color: string;
  capabilities: string[];
  status: AgentStatus;
  currentTask?: string;
  lastExecution?: AgentExecution;
  executionHistory: AgentExecution[];
  errors: AgentError[];
}

export interface AgentExecution {
  id: string;
  agentId: AgentId;
  status: 'started' | 'in_progress' | 'completed' | 'failed';
  startedAt: number;
  completedAt?: number;
  input?: Record<string, any>;
  output?: Record<string, any>;
  reasoning?: string;
  error?: string;
  duration?: number;
}

export interface AgentError {
  id: string;
  agentId: AgentId;
  timestamp: number;
  error: string;
  context?: Record<string, any>;
  resolved: boolean;
}

export interface WorkflowExecution {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  steps: WorkflowStep[];
  startedAt: number;
  completedAt?: number;
  error?: string;
}

export interface WorkflowStep {
  id: string;
  agentId: AgentId;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: number;
  completedAt?: number;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
}

export interface CreativeBrief {
  userId?: string;
  projectId?: string;
  sourceImage?: string;
  sourceImageFile?: File;
  userPrompt: string;
  intent: CreativeIntent;
  constraints: CreativeConstraints;
  targetOutput: TargetOutput;
}

export interface CreativeIntent {
  type: 'image_to_video' | 'text_to_video' | 'image_to_image';
  description: string;
  mood: string;
  style: string;
  keyElements: string[];
}

export interface CreativeConstraints {
  maxDuration?: number;
  aspectRatio?: string;
  resolution?: string;
  styleReference?: string;
  avoidElements?: string[];
}

export interface TargetOutput {
  format: 'video' | 'image';
  aspectRatio: string;
  duration?: number;
  resolution?: string;
}

export interface MotionPlan {
  cameraMovement: CameraMovement;
  subjectMovement: SubjectMovement;
  environmentalAnimation: EnvironmentalAnimation;
  duration: number;
  aspectRatio: string;
  pacing: string;
  keyFrames: KeyFrame[];
}

export interface CameraMovement {
  type: 'static' | 'pan' | 'tilt' | 'zoom' | 'dolly' | 'orbit' | 'tracking';
  direction?: string;
  intensity: number;
  smoothness: number;
}

export interface SubjectMovement {
  subjects: string[];
  description: string;
  intensity: number;
}

export interface EnvironmentalAnimation {
  elements: string[];
  description: string;
  intensity: number;
}

export interface KeyFrame {
  timestamp: number;
  description: string;
}

export interface GeneratedPrompt {
  provider: ProviderId;
  model: string;
  prompt: string;
  negativePrompt?: string;
  parameters: Record<string, any>;
  confidence: number;
  alternatives?: GeneratedPrompt[];
}

export interface QualityAssessment {
  overallScore: number;
  issues: QualityIssue[];
  suggestions: string[];
  meetsBrief: boolean;
}

export interface QualityIssue {
  severity: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  suggestion?: string;
}