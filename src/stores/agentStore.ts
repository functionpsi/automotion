import { create } from 'zustand'
import type {
  Agent,
  AgentExecution,
  AgentError,
  WorkflowExecution,
  WorkflowStep,
  AgentId,
  AgentStatus,
} from '@/types/agent'

interface AgentStore {
  agents: Record<AgentId, Agent>
  workflows: Record<string, WorkflowExecution>
  activeWorkflow: WorkflowExecution | null
  registerAgent: (agent: Omit<Agent, 'status' | 'executionHistory' | 'errors'>) => void
  updateAgentStatus: (agentId: AgentId, status: AgentStatus, task?: string) => void
  addExecution: (agentId: AgentId, execution: Omit<AgentExecution, 'id'>) => void
  addError: (agentId: AgentId, error: Omit<AgentError, 'id'>) => void
  resolveError: (agentId: AgentId, errorId: string) => void
  createWorkflow: (steps: Omit<WorkflowStep, 'id' | 'status'>[]) => WorkflowExecution
  updateWorkflow: (workflowId: string, updates: Partial<WorkflowExecution>) => void
  updateStepStatus: (workflowId: string, stepId: string, status: WorkflowStep['status'], output?: any) => void
  setActiveWorkflow: (workflow: WorkflowExecution | null) => void
  getAgent: (agentId: AgentId) => Agent | null
  getAgentStatus: (agentId: AgentId) => AgentStatus
  clearHistory: () => void
}

const generateId = () => Math.random().toString(36).slice(2, 11)

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: {} as Record<AgentId, Agent>,
  workflows: {},
  activeWorkflow: null,
  registerAgent: (agentData) => {
    const agent: Agent = {
      ...agentData,
      status: 'idle',
      executionHistory: [],
      errors: [],
    }
    set((state) => ({ agents: { ...state.agents, [agentData.id]: agent } }))
  },
  updateAgentStatus: (agentId, status, task) =>
    set((state) => {
      const agent = state.agents[agentId]
      if (!agent) return state
      return {
        agents: {
          ...state.agents,
          [agentId]: { ...agent, status, currentTask: task, lastExecution: agent.lastExecution },
        },
      }
    }),
  addExecution: (agentId, executionData) => {
    const execution: AgentExecution = { ...executionData, id: generateId() }
    set((state) => {
      const agent = state.agents[agentId]
      if (!agent) return state
      return {
        agents: {
          ...state.agents,
          [agentId]: {
            ...agent,
            status: execution.status === 'completed' ? 'idle' :
                   execution.status === 'failed' ? 'error' : 'executing',
            lastExecution: execution,
            executionHistory: [...agent.executionHistory, execution],
          },
        },
      }
    })
  },
  addError: (agentId, errorData) => {
    const error: AgentError = { ...errorData, id: generateId() }
    set((state) => {
      const agent = state.agents[agentId]
      if (!agent) return state
      return {
        agents: {
          ...state.agents,
          [agentId]: { ...agent, status: 'error', errors: [...agent.errors, error] },
        },
      }
    })
  },
  resolveError: (agentId, errorId) =>
    set((state) => {
      const agent = state.agents[agentId]
      if (!agent) return state
      return {
        agents: {
          ...state.agents,
          [agentId]: {
            ...agent,
            errors: agent.errors.map((e) =>
              e.id === errorId ? { ...e, resolved: true } : e
            ),
          },
        },
      }
    }),
  createWorkflow: (stepsData) => {
    const workflow: WorkflowExecution = {
      id: generateId(),
      status: 'pending',
      steps: stepsData.map((s) => ({ ...s, id: generateId(), status: 'pending' })),
      startedAt: Date.now(),
    }
    set((state) => ({ workflows: { ...state.workflows, [workflow.id]: workflow } }))
    return workflow
  },
  updateWorkflow: (workflowId, updates) =>
    set((state) => {
      const workflow = state.workflows[workflowId]
      if (!workflow) return state
      const updated = { ...workflow, ...updates }
      if (updates.status === 'completed' || updates.status === 'failed') {
        updated.completedAt = Date.now()
      }
      return {
        workflows: { ...state.workflows, [workflowId]: updated },
        activeWorkflow: state.activeWorkflow?.id === workflowId ? updated : state.activeWorkflow,
      }
    }),
  updateStepStatus: (workflowId, stepId, status, output) =>
    set((state) => {
      const workflow = state.workflows[workflowId]
      if (!workflow) return state
      const updatedSteps = workflow.steps.map((s) =>
        s.id === stepId
          ? { ...s, status, output, startedAt: s.startedAt || Date.now(), completedAt: status === 'completed' || status === 'failed' ? Date.now() : undefined }
          : s
      )
      const allCompleted = updatedSteps.every(
        (s) => s.status === 'completed' || s.status === 'skipped'
      )
      const anyFailed = updatedSteps.some((s) => s.status === 'failed')
      return {
        workflows: {
          ...state.workflows,
          [workflowId]: { ...workflow, steps: updatedSteps, status: anyFailed ? 'failed' : allCompleted ? 'completed' : 'running' },
        },
      }
    }),
  setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),
  getAgent: (agentId) => get().agents[agentId] || null,
  getAgentStatus: (agentId) => get().agents[agentId]?.status || 'idle',
  clearHistory: () =>
    set((state) => {
      const clearedAgents: Record<AgentId, Agent> = {}
      for (const [id, agent] of Object.entries(state.agents)) {
        clearedAgents[id as AgentId] = { ...agent, executionHistory: [], errors: [], status: 'idle' }
      }
      return { agents: clearedAgents, workflows: {}, activeWorkflow: null }
    }),
}))