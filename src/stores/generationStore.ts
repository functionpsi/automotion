import { create } from 'zustand'
import type { GenerationJob, GenerationRequest, GenerationResult } from '@/types/provider'

interface GenerationStore {
  jobs: Record<string, GenerationJob>
  activeJobs: string[]
  currentJob: GenerationJob | null
  submitGeneration: (request: GenerationRequest) => Promise<GenerationJob>
  updateJobStatus: (jobId: string, status: GenerationJob['status'], progress?: number) => void
  updateJobResult: (jobId: string, result: GenerationResult) => void
  updateJobError: (jobId: string, error: any) => void
  cancelJob: (jobId: string) => boolean
  getJob: (jobId: string) => GenerationJob | null
  setCurrentJob: (job: GenerationJob | null) => void
  clearCompletedJobs: () => void
  clearAllJobs: () => void
  getActiveJobsCount: () => number
}

const generateJobId = () => `job_${Math.random().toString(36).slice(2, 11)}`

export const useGenerationStore = create<GenerationStore>((set, get) => ({
  jobs: {},
  activeJobs: [],
  currentJob: null,
  submitGeneration: async (request) => {
    const job: GenerationJob = {
      id: generateJobId(),
      provider: request.provider,
      model: request.model,
      type: request.type,
      status: 'queued',
      progress: 0,
      prompt: request.prompt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set((state) => ({
      jobs: { ...state.jobs, [job.id]: job },
      activeJobs: [...state.activeJobs, job.id],
    }))
    return job
  },
  updateJobStatus: (jobId, status, progress) =>
    set((state) => {
      const job = state.jobs[jobId]
      if (!job) return state
      const updated: GenerationJob = {
        ...job,
        status,
        progress: progress ?? job.progress,
        updatedAt: Date.now(),
        completedAt: status === 'completed' || status === 'failed' || status === 'cancelled'
          ? Date.now()
          : job.completedAt,
      }
      const activeJobs = state.activeJobs.filter((id) => id !== jobId)
      if (status === 'completed' || status === 'failed' || status === 'cancelled') {
        return {
          jobs: { ...state.jobs, [jobId]: updated },
          activeJobs,
        }
      }
      return {
        jobs: { ...state.jobs, [jobId]: updated },
        activeJobs: state.activeJobs.includes(jobId) ? state.activeJobs : [...state.activeJobs, jobId],
      }
    }),
  updateJobResult: (jobId, result) =>
    set((state) => {
      const job = state.jobs[jobId]
      if (!job) return state
      return {
        jobs: {
          ...state.jobs,
          [jobId]: { ...job, result, status: 'completed', progress: 100, completedAt: Date.now(), updatedAt: Date.now() },
        },
      }
    }),
  updateJobError: (jobId, error) =>
    set((state) => {
      const job = state.jobs[jobId]
      if (!job) return state
      return {
        jobs: {
          ...state.jobs,
          [jobId]: {
            ...job,
            status: 'failed',
            error: {
              code: error.code || 'UNKNOWN',
              message: error.message || 'Generation failed',
              details: error.details,
              retryable: error.retryable ?? true,
            },
            completedAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
      }
    }),
  cancelJob: (jobId) => {
    const job = get().jobs[jobId]
    if (job && (job.status === 'queued' || job.status === 'processing')) {
      set((state) => ({
        jobs: {
          ...state.jobs,
          [jobId]: { ...job, status: 'cancelled', completedAt: Date.now(), updatedAt: Date.now() },
        },
        activeJobs: state.activeJobs.filter((id) => id !== jobId),
      }))
      return true
    }
    return false
  },
  getJob: (jobId) => get().jobs[jobId] || null,
  setCurrentJob: (job) => set({ currentJob: job }),
  clearCompletedJobs: () =>
    set((state) => {
      const jobs: Record<string, GenerationJob> = {}
      const activeJobs: string[] = []
      for (const [id, job] of Object.entries(state.jobs)) {
        if (job.status === 'queued' || job.status === 'processing') {
          jobs[id] = job
          activeJobs.push(id)
        }
      }
      return { jobs, activeJobs }
    }),
  clearAllJobs: () => set({ jobs: {}, activeJobs: [], currentJob: null }),
  getActiveJobsCount: () => get().activeJobs.length,
}))