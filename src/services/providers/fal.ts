import type {
  ProviderConfig,
  ProviderCredentials,
  ModelInfo,
  ConnectionTestResult,
  GenerationRequest,
  GenerationJob,
  GenerationResult,
} from '@/types/provider'
import { BaseProviderAdapter, createProviderError } from './base'

const FAL_API_URL = 'https://fal.run/fal-ai'

const FAL_MODELS: Record<string, ModelInfo> = {
  'fal-ai/fast-svd': {
    id: 'fal-ai/fast-svd',
    name: 'Fast SVD',
    provider: 'fal',
    description: 'Fast Stable Video Diffusion',
    capabilities: {
      imageToVideo: true,
      textToVideo: false,
      imageToImage: false,
      firstLastFrame: false,
      imageAnalysis: false,
      maxDuration: 4,
      maxResolution: '1024x576',
      aspectRatios: ['16:9', '1:1', '9:16'],
      supportsNegativePrompt: false,
      supportsSeed: true,
      supportsMotionIntensity: true,
      supportsFps: false,
    },
    parameters: {
      aspectRatio: { type: 'string', default: '16:9', enum: ['16:9', '1:1', '9:16'] },
      duration: { type: 'number', default: 4, min: 1, max: 4 },
      seed: { type: 'number', default: null },
      motionIntensity: { type: 'number', default: 100, min: 0, max: 200 },
    },
    status: 'available',
    pricing: { costPerSecond: 0.02, currency: 'USD' },
  },
  'fal-ai/luma-dream-machine': {
    id: 'fal-ai/luma-dream-machine',
    name: 'Luma Dream Machine',
    provider: 'fal',
    description: 'Text-to-video from Luma',
    capabilities: {
      imageToVideo: false,
      textToVideo: true,
      imageToImage: false,
      firstLastFrame: false,
      imageAnalysis: false,
      maxDuration: 5,
      maxResolution: '720p',
      aspectRatios: ['16:9', '9:16', '1:1'],
      supportsNegativePrompt: true,
      supportsSeed: true,
      supportsMotionIntensity: false,
      supportsFps: false,
    },
    parameters: {
      aspectRatio: { type: 'string', default: '16:9', enum: ['16:9', '9:16', '1:1'] },
      duration: { type: 'number', default: 5, min: 1, max: 5 },
      seed: { type: 'number', default: null },
      negativePrompt: { type: 'string', default: '' },
    },
    status: 'available',
    pricing: { costPerSecond: 0.05, currency: 'USD' },
  },
}

export class FalAdapter extends BaseProviderAdapter {
  id = 'fal'
  config: ProviderConfig = {
    id: 'fal',
    name: 'fal.ai',
    description: 'Fast AI inference platform',
    website: 'https://fal.ai',
    docsUrl: 'https://fal.ai/docs',
    authMode: ['direct', 'serverless'],
    supportsCors: true,
    requiresServerlessGateway: false,
    icon: 'fal',
    color: '#00D4AA',
  }

  protected async makeRequest<T>(
    credentials: ProviderCredentials,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${FAL_API_URL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Key ${credentials.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw createProviderError(
        'API_ERROR',
        error.detail || `HTTP ${response.status}`,
        JSON.stringify(error),
        response.status >= 500 || response.status === 429
      )
    }

    return response.json()
  }

  protected async performConnectionTest(
    credentials: ProviderCredentials
  ): Promise<{
    success: boolean
    status?: ConnectionTestResult['status']
    message?: string
    models?: ModelInfo[]
    error?: ConnectionTestResult['error']
  }> {
    try {
      const models = await this.listModels(credentials)
      return {
        success: true,
        status: 'connected',
        message: 'Connected to fal.ai',
        models,
      }
    } catch (error) {
      return {
        success: false,
        status: 'auth_failed',
        message: error instanceof Error ? error.message : 'Authentication failed',
        error: error as ConnectionTestResult['error'],
      }
    }
  }

  async listModels(credentials: ProviderCredentials): Promise<ModelInfo[]> {
    return Object.values(FAL_MODELS)
  }
private buildFalInput(request: GenerationRequest): Record<string, any> {
    const input: Record<string, any> = {
      prompt: request.prompt,
    }

    if (request.negativePrompt) {
      input.negative_prompt = request.negativePrompt
    }

    if (request.parameters.aspectRatio) {
      input.aspect_ratio = request.parameters.aspectRatio
    }

    if (request.parameters.duration) {
      input.duration = request.parameters.duration
    }

    if (request.parameters.seed) {
      input.seed = request.parameters.seed
    }

    if (request.parameters.motionIntensity) {
      input.motion_bucket_id = request.parameters.motionIntensity
    }

    if (request.image) {
      input.image_url = request.image
    }

    return input
  }

  async generateImageToVideo(
    credentials: ProviderCredentials,
    request: GenerationRequest
  ): Promise<GenerationJob> {
    const input = this.buildFalInput(request)
    const model = request.model.replace('fal-ai/', '')

    const result = await this.makeRequest<any>(credentials, `/${model}`, {
      method: 'POST',
      body: JSON.stringify({ input }),
    })

    return {
      id: result.request_id || `fal_${Date.now()}`,
      provider: 'fal',
      model,
      type: 'image_to_video',
      status: 'queued',
      progress: 0,
      prompt: request.prompt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  }

  async generateTextToVideo(
    credentials: ProviderCredentials,
    request: GenerationRequest
  ): Promise<GenerationJob> {
    return this.generateImageToVideo(credentials, request)
  }

  async getJobStatus(
    credentials: ProviderCredentials,
    jobId: string
  ): Promise<GenerationJob> {
    const result = await this.makeRequest<any>(credentials, `/requests/${jobId}`)

    const statusMap: Record<string, GenerationJob['status']> = {
      IN_QUEUE: 'queued',
      IN_PROGRESS: 'processing',
      COMPLETED: 'completed',
      FAILED: 'failed',
    }

    return {
      id: jobId,
      provider: 'fal',
      model: '',
      type: 'image_to_video',
      status: statusMap[result.status] || 'processing',
      progress: result.status === 'IN_PROGRESS' ? 50 : result.status === 'COMPLETED' ? 100 : 0,
      prompt: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: result.status === 'COMPLETED' || result.status === 'FAILED' ? Date.now() : undefined,
      error: result.status === 'FAILED'
        ? {
            code: 'GENERATION_FAILED',
            message: result.error || 'Generation failed',
            retryable: true,
          }
        : undefined,
    }
  }

  async cancelJob(
    credentials: ProviderCredentials,
    jobId: string
  ): Promise<boolean> {
    // fal.ai doesn't support cancellation directly
    return false
  }

  async getJobResult(
    credentials: ProviderCredentials,
    jobId: string
  ): Promise<GenerationResult> {
    const result = await this.makeRequest<any>(credentials, `/requests/${jobId}`)

    if (result.output?.video?.url) {
      return {
        videoUrl: result.output.video.url,
        thumbnail: result.output.video.url,
        format: 'mp4',
      }
    }

    return {}
  }

export const falAdapter = new FalAdapter()
}