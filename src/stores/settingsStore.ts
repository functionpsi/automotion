import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserSettings, DEFAULT_SETTINGS } from '@/types/settings'

interface SettingsStore {
  settings: UserSettings
  updateSettings: (updates: Partial<UserSettings>) => void
  resetSettings: () => void
  setTheme: (theme: UserSettings['theme']) => void
  setCredentialStorage: (mode: UserSettings['credentialStorage']) => void
  exportSettings: () => string
  importSettings: (data: string) => boolean
}

const initialSettings: UserSettings = {
  theme: 'dark',
  language: 'en',
  defaultParameters: {
    duration: 5,
    aspectRatio: '16:9',
    resolution: '1080p',
  },
  credentialStorage: 'memory',
  notifications: {
    generationComplete: true,
    generationFailed: true,
    jobUpdates: true,
    providerIssues: true,
    soundEnabled: false,
  },
  privacy: {
    analyticsEnabled: false,
    crashReporting: false,
    shareUsageData: false,
    clearDataOnExit: false,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
  },
  generation: {
    autoSave: true,
    maxConcurrentJobs: 2,
    defaultDuration: 5,
    defaultAspectRatio: '16:9',
    defaultResolution: '1080p',
    quality: 'standard',
    timeout: 300,
    retryFailed: true,
    maxRetries: 2,
  },
  display: {
    density: 'comfortable',
    showAdvancedOptions: false,
    showCostEstimates: true,
    showAgentActivity: true,
    sidebarCollapsed: false,
  },
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: initialSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      resetSettings: () => set({ settings: initialSettings }),
      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
      setCredentialStorage: (mode) =>
        set((state) => ({
          settings: { ...state.settings, credentialStorage: mode },
        })),
      exportSettings: () => JSON.stringify(get().settings, null, 2),
      importSettings: (data) => {
        try {
          const parsed = JSON.parse(data)
          set({ settings: { ...initialSettings, ...parsed } })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'automotion-settings',
    }
  )
)