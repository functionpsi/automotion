import { replicateAdapter } from './replicate'
import { falAdapter } from './fal'
import type { ProviderAdapter } from '@/types/provider'

const adapters: ProviderAdapter[] = [
  replicateAdapter,
  falAdapter,
]

export function registerAllProviders(): ProviderAdapter[] {
  return adapters
}

export function getAdapter(id: string): ProviderAdapter | undefined {
  return adapters.find((a) => a.id === id)
}

export function getAllAdapters(): ProviderAdapter[] {
  return adapters
}