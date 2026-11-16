import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ProviderId,
  ProviderConfig,
  ProviderCredentials,
  ModelInfo,
  ConnectionStatus,
  ConnectionTestResult,
  ProviderAdapter,
} from '@/types/provider'

interface ProviderStore {
  providers: Record<ProviderId, ProviderConfig>
  credentials: Record<ProviderId, ProviderCredentials>
  connectionStatus: Record<ProviderId, ConnectionStatus>
  models: Record<ProviderId, ModelInfo[]>
  adapters: Record<ProviderId, ProviderAdapter>
  defaultProvider: ProviderId | null
  defaultModel: Record<ProviderId, string | null>
  testConnection: (providerId: ProviderId, credentials: ProviderCredentials) => Promise<ConnectionTestResult>
  setCredentials: (providerId: ProviderId, credentials: ProviderCredentials) => void
  removeCredentials: (providerId: ProviderId) => void
  setConnectionStatus: (providerId: ProviderId, status: ConnectionStatus) => void
  setModels: (providerId: ProviderId, models: ModelInfo[]) => void
  registerAdapter: (adapter: ProviderAdapter) => void
  setDefaultProvider: (providerId: ProviderId | null) => void
  setDefaultModel: (providerId: ProviderId, modelId: string | null) => void
  getAdapter: (providerId: ProviderId) => ProviderAdapter | null
  disconnectProvider: (providerId: ProviderId) => void
  getConnectedProviders: () => ProviderId[]
  isProviderConnected: (providerId: ProviderId) => boolean
}

export const useProviderStore = create<ProviderStore>()(
  persist(
    (set, get) => ({
      providers: {} as Record<ProviderId, ProviderConfig>,
      credentials: {} as Record<ProviderId, ProviderCredentials>,
      connectionStatus: {} as Record<ProviderId, ConnectionStatus>,
      models: {} as Record<ProviderId, ModelInfo[]>,
      adapters: {} as Record<ProviderId, ProviderAdapter>,
      defaultProvider: null,
      defaultModel: {} as Record<ProviderId, string | null>,
      testConnection: async (providerId, credentials) => {
        const adapter = get().adapters[providerId]
        if (!adapter) {
          return {
            success: false,
            status: 'configuration_required',
            message: 'Provider adapter not found',
            error: { code: 'NO_ADAPTER', message: 'Provider adapter is not registered', retryable: false },
          }
        }
        set((state) => ({
          connectionStatus: { ...state.connectionStatus, [providerId]: 'connecting' },
        }))
        try {
          const result = await adapter.testConnection(credentials)
          set((state) => ({
            connectionStatus: {
              ...state.connectionStatus,
              [providerId]: result.success ? 'connected' : result.status,
            },
          }))
          return result
        } catch (error) {
          set((state) => ({
            connectionStatus: { ...state.connectionStatus, [providerId]: 'auth_failed' },
          }))
          return {
            success: false,
            status: 'auth_failed',
            message: error instanceof Error ? error.message : 'Connection test failed',
            error: {
              code: 'TEST_FAILED',
              message: error instanceof Error ? error.message : 'Unknown error',
              retryable: true,
            },
          }
        }
      },
      setCredentials: (providerId, credentials) =>
        set((state) => ({
          credentials: { ...state.credentials, [providerId]: credentials },
          connectionStatus: { ...state.connectionStatus, [providerId]: 'connected' },
        })),
      removeCredentials: (providerId) =>
        set((state) => {
          const newCreds = { ...state.credentials }
          delete newCreds[providerId]
          const newStatus = { ...state.connectionStatus }
          delete newStatus[providerId]
          const newModels = { ...state.models }
          delete newModels[providerId]
          return {
            credentials: newCreds,
            connectionStatus: newStatus,
            models: newModels,
          }
        }),
      setConnectionStatus: (providerId, status) =>
        set((state) => ({
          connectionStatus: { ...state.connectionStatus, [providerId]: status },
        })),
      setModels: (providerId, models) =>
        set((state) => ({
          models: { ...state.models, [providerId]: models },
        })),
      registerAdapter: (adapter) =>
        set((state) => ({
          adapters: { ...state.adapters, [adapter.id]: adapter },
          providers: { ...state.providers, [adapter.id]: adapter.config },
        })),
      setDefaultProvider: (providerId) => set({ defaultProvider: providerId }),
      setDefaultModel: (providerId, modelId) =>
        set((state) => ({
          defaultModel: { ...state.defaultModel, [providerId]: modelId },
        })),
      getAdapter: (providerId) => get().adapters[providerId] || null,
      disconnectProvider: (providerId) => get().removeCredentials(providerId),
      getConnectedProviders: () => {
        const creds = get().credentials
        return (Object.keys(creds) as ProviderId[]).filter((id) => creds[id])
      },
      isProviderConnected: (providerId) => {
        const creds = get().credentials
        return !!creds[providerId]
      },
    }),
    {
      name: 'automotion-providers',
      partialize: (state) => ({
        defaultProvider: state.defaultProvider,
        defaultModel: state.defaultModel,
      }),
    }
  )
)