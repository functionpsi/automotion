import type {
  ProviderAdapter,
  ProviderCredentials,
  ConnectionTestResult,
  ModelInfo,
  GenerationRequest,
  GenerationJob,
  GenerationResult,
  ImageAnalysis,
} from '@/types/provider'

export abstract class BaseProviderAdapter implements ProviderAdapter {
  abstract id: string
  abstract config: any

  protected abstract makeRequest<T>(
    credentials: ProviderCredentials,
    endpoint: string,
    options: RequestInit
  ): Promise<T>

  async testConnection(credentials: ProviderCredentials): Promise<ConnectionTestResult> {
    try {
      const start = Date.now()
      const result = await this.performConnectionTest(credentials)
      const latency = Date.now() - start

      if (result.success) {
        return {
          success: true,
          status: 'connected',
          message: 'Connection successful',
          models: result.models,
          latency,
        }
      }

      return {
        success: false,
        status: result.status || 'auth_failed',
        message: result.message || 'Connection failed',
        error: result.error,
        latency,
      }
    } catch (error) {
      return {
        success: false,
        status: 'provider_unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
        error: {
          code: 'CONNECTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          retryable: true,
        },
      }
    }
  }

  protected abstract performConnectionTest(
    credentials: ProviderCredentials
  ): Promise<{
    success: boolean
    status?: ConnectionTestResult['status']
    message?: string
    models?: ModelInfo[]
    error?: ConnectionTestResult['error']
  }>

  abstract listModels(credentials: ProviderCredentials): Promise<ModelInfo[]>

  abstract generateImageToVideo(
    credentials: ProviderCredentials,
    request: GenerationRequest
  ): Promise<GenerationJob>

  abstract generateTextToVideo(
    credentials: ProviderCredentials,
    request: GenerationRequest
  ): Promise<GenerationJob>

  abstract getJobStatus(
    credentials: ProviderCredentials,
    jobId: string
  ): Promise<GenerationJob>

  abstract cancelJob(
    credentials: ProviderCredentials,
    jobId: string
  ): Promise<boolean>

  abstract getJobResult(
    credentials: ProviderCredentials,
    jobId: string
  ): Promise<GenerationResult>

  async analyzeImage?(
    credentials: ProviderCredentials,
    image: string
  ): Promise<ImageAnalysis>
}

export function createProviderError(
  code: string,
  message: string,
  details?: string,
  retryable = true
) {
  return { code, message, details, retryable }
}