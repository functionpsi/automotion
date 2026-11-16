import { registerAllProviders } from '@/services/providers'
import { initializeAgents } from '@/services/agents/registry'
import { useProviderStore } from '@/stores'

export function initializeApp() {
  // Register all provider adapters
  const adapters = registerAllProviders()
  const providerStore = useProviderStore.getState()

  adapters.forEach(adapter => {
    providerStore.registerAdapter(adapter)
  })

  // Initialize AI agents
  initializeAgents()

  console.log('[Automotion] Initialized with', adapters.length, 'providers and 8 agents')
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  // Defer to after React mounts
  setTimeout(initializeApp, 0)
}