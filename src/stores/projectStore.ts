import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, ProjectAsset, SavedPrompt, SavedConfiguration } from '@/types/project'

interface ProjectStore {
  projects: Project[]
  currentProject: Project | null
  createProject: (name: string, description?: string) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProject: (id: string) => Project | null
  setCurrentProject: (project: Project | null) => void
  addAsset: (projectId: string, asset: Omit<ProjectAsset, 'id'>) => ProjectAsset
  removeAsset: (projectId: string, assetId: string) => void
  addPrompt: (projectId: string, prompt: Omit<SavedPrompt, 'id'>) => SavedPrompt
  removePrompt: (projectId: string, promptId: string) => void
  addConfiguration: (projectId: string, config: Omit<SavedConfiguration, 'id'>) => SavedConfiguration
  removeConfiguration: (projectId: string, configId: string) => void
  duplicateProject: (id: string, newName: string) => Project | null
  exportProject: (id: string) => string | null
  clearAll: () => void
}

const generateId = () => Math.random().toString(36).slice(2, 11)

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      createProject: (name, description) => {
        const project: Project = {
          id: generateId(),
          name,
          description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          assets: [],
          prompts: [],
          configurations: [],
          generations: [],
        }
        set((state) => ({ projects: [...state.projects, project] }))
        return project
      },
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
          ),
          currentProject: state.currentProject?.id === id
            ? { ...state.currentProject, ...updates, updatedAt: Date.now() }
            : state.currentProject,
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        })),
      getProject: (id) => get().projects.find((p) => p.id === id) || null,
      setCurrentProject: (project) => set({ currentProject: project }),
      addAsset: (projectId, assetData) => {
        const asset: ProjectAsset = { ...assetData, id: generateId() }
        get().updateProject(projectId, {
          assets: [...(get().getProject(projectId)?.assets || []), asset],
        })
        return asset
      },
      removeAsset: (projectId, assetId) => {
        const project = get().getProject(projectId)
        if (project) {
          get().updateProject(projectId, {
            assets: project.assets.filter((a) => a.id !== assetId),
          })
        }
      },
      addPrompt: (projectId, promptData) => {
        const prompt: SavedPrompt = { ...promptData, id: generateId() }
        get().updateProject(projectId, {
          prompts: [...(get().getProject(projectId)?.prompts || []), prompt],
        })
        return prompt
      },
      removePrompt: (projectId, promptId) => {
        const project = get().getProject(projectId)
        if (project) {
          get().updateProject(projectId, {
            prompts: project.prompts.filter((p) => p.id !== promptId),
          })
        }
      },
      addConfiguration: (projectId, configData) => {
        const config: SavedConfiguration = { ...configData, id: generateId() }
        get().updateProject(projectId, {
          configurations: [...(get().getProject(projectId)?.configurations || []), config],
        })
        return config
      },
      removeConfiguration: (projectId, configId) => {
        const project = get().getProject(projectId)
        if (project) {
          get().updateProject(projectId, {
            configurations: project.configurations.filter((c) => c.id !== configId),
          })
        }
      },
      duplicateProject: (id, newName) => {
        const original = get().getProject(id)
        if (!original) return null
        const duplicate: Project = {
          ...original,
          id: generateId(),
          name: newName,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({ projects: [...state.projects, duplicate] }))
        return duplicate
      },
      exportProject: (id) => {
        const project = get().getProject(id)
        if (!project) return null
        return JSON.stringify(project, null, 2)
      },
      clearAll: () => set({ projects: [], currentProject: null }),
    }),
    {
      name: 'automotion-projects',
    }
  )
)