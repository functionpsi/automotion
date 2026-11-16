import { useAgentStore } from '@/stores'
import type { Agent, AgentId } from '@/types/agent'

const agentDefinitions: Omit<Agent, 'status' | 'executionHistory' | 'errors' | 'lastExecution' | 'currentTask'>[] = [
  {
    id: 'creative_director',
    name: 'Creative Director',
    role: 'Understand creative intention and coordinate workflow',
    description: 'Analyzes user requests, identifies desired outcomes, and orchestrates the creative process',
    icon: 'Target',
    color: '#8B5CF6',
    capabilities: [
      'Creative brief analysis',
      'Workflow recommendation',
      'Agent coordination',
      'Quality gatekeeping',
    ],
  },
  {
    id: 'vision_analysis',
    name: 'Vision Analysis',
    role: 'Analyze uploaded images for composition and motion opportunities',
    description: 'Identifies subjects, composition, lighting, and suggests suitable camera movements',
    icon: 'Eye',
    color: '#3B82F6',
    capabilities: [
      'Image composition analysis',
      'Subject detection',
      'Lighting assessment',
      'Motion opportunity identification',
    ],
  },
  {
    id: 'motion_architect',
    name: 'Motion Architect',
    role: 'Design camera movements and subject animations',
    description: 'Translates creative instructions into structured motion plans with keyframes',
    icon: 'Move',
    color: '#F59E0B',
    capabilities: [
      'Camera movement design',
      'Subject animation planning',
      'Environmental animation',
      'Keyframe generation',
    ],
  },
  {
    id: 'prompt_engineer',
    name: 'Prompt Engineer',
    role: 'Generate optimized prompts for specific models',
    description: 'Adapts prompts to provider requirements, generates negative prompts, reduces ambiguity',
    icon: 'PenTool',
    color: '#EC4899',
    capabilities: [
      'Prompt optimization',
      'Negative prompt generation',
      'Model-specific adaptation',
      'Consistency preservation',
    ],
  },
  {
    id: 'model_selection',
    name: 'Model Selection',
    role: 'Recommend the best compatible model',
    description: 'Compares model capabilities, considers resolution, duration, aspect ratio, and cost',
    icon: 'Cpu',
    color: '#10B981',
    capabilities: [
      'Capability matching',
      'Cost estimation',
      'Compatibility checking',
      'Performance prediction',
    ],
  },
  {
    id: 'generation',
    name: 'Generation',
    role: 'Execute generation requests and monitor jobs',
    description: 'Submits requests, tracks async generation, handles retries and timeouts',
    icon: 'Play',
    color: '#EF4444',
    capabilities: [
      'Request validation',
      'Job submission',
      'Progress tracking',
      'Error handling',
    ],
  },
  {
    id: 'quality_control',
    name: 'Quality Control',
    role: 'Inspect outputs against creative brief',
    description: 'Compares results to original intent, identifies issues, recommends improvements',
    icon: 'CheckCircle2',
    color: '#6366F1',
    capabilities: [
      'Output assessment',
      'Brief compliance checking',
      'Issue detection',
      'Refinement suggestions',
    ],
  },
  {
    id: 'workflow_orchestrator',
    name: 'Workflow Orchestrator',
    role: 'Coordinate all agents and manage execution',
    description: 'Manages execution order, tracks workflow states, handles dependencies and cancellation',
    icon: 'GitBranch',
    color: '#8B5CF6',
    capabilities: [
      'Workflow coordination',
      'State management',
      'Dependency resolution',
      'Execution history',
    ],
  },
]

export function initializeAgents() {
  const store = useAgentStore.getState()
  agentDefinitions.forEach((def) => store.registerAgent(def))
}