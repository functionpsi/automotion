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

const REPLICATE_API_URL = 'https://api.replicate.com/v1'

const REPLICATE_MODELS: Record<string, ModelInfo> = {
  'stability-ai/stable-video-diffusion': {
    id: 'stability-ai/stable-video-diffusion',
    name: 'Stable Video Diffusion',
    provider: 'replicate',
    description: 'High-quality image-to-video generation',
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
    pricing: { costPerSecond: 0.05, currency: 'USD' },
  },
  'luma/ray-2': {
    id: 'luma/ray-2',
    name: 'Luma Ray 2',
    provider: 'replicate',
    description: 'Text-to-video generation from Luma',
    capabilities: {
      imageToVideo: false,
      textToVideo: true,
      imageToImage: false,
      firstLastFrame: false,
      imageAnalysis: false,
      maxDuration: 10,
      maxResolution: '720p',
      aspectRatios: ['16:9', '9:16', '1:1'],
      supportsNegativePrompt: true,
      supportsSeed: true,
      supportsMotionIntensity: false,
      supportsFps: false,
    },
    parameters: {
      aspectRatio: { type: 'string', default: '16:9', enum: ['16:9', '9:16', '1:1'] },
      duration: { type: 'number', default: 5, min: 1, max: 10 },
      seed: { type: 'number', default: null },
      negativePrompt: { type: 'string', default: '' },
    },
    status: 'available',
    pricing: { costPerSecond: 0.1, currency: 'USD' },
  },
}

export class ReplicateAdapter extends BaseProviderAdapter {
  id = 'replicate'
  config: ProviderConfig = {
    id: 'replicate',
    name: 'Replicate',
    description: 'Run AI models via API',
    website: 'https://replicate.com',
    docsUrl: 'https://replicate.com/docs',
    authMode: ['direct', 'serverless'],
    supportsCors: true,
    requiresServerlessGateway: false,
    icon: 'replicate',
    color: '#E86C00',
  }

  protected async makeRequest<T>(
    credentials: ProviderCredentials,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${REPLICATE_API_URL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Token ${credentials.apiKey}`,
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
      await this.makeRequest<{ models: any[] }>(credentials, '/models')
      return {
        success: true,
        status: 'connected',
        message: 'Connected to Replicate',
        models: Object.values(REPLICATE_MODELS),
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
    return Object.values(REPLICATE_MODELS)
  }
private buildReplicateInput(request: GenerationRequest): Record<string, any> {
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
      input.image = request.image
    }

    return input
  }

  async generateImageToVideo(
    credentials: ProviderCredentials,
    request: GenerationRequest
  ): Promise<GenerationJob> {
    const input = this.buildReplicateInput(request)
    const model = request.model

    const prediction = await this.makeRequest<any>(credentials, '/predictions', {
      method: 'POST',
      body: JSON.stringify({
        version: model,
        input,
      }),
    })

    return {
      id: prediction.id,
      provider: 'replicate',
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
    const prediction = await this.makeRequest<any>(
      credentials,
      `/predictions/${jobId}`
    )

    const statusMap: Record<string, GenerationJob['status']> = {
      starting: 'queued',
      processing: 'processing',
      succeeded: 'completed',
      failed: 'failed',
      canceled: 'cancelled',
    }

    return {
      id: prediction.id,
      provider: 'replicate',
      model: prediction.version,
      type: 'image_to_video',
      status: statusMap[prediction.status] || 'processing',
      progress: prediction.status === 'processing' ? 50 : prediction.status === 'succeeded' ? 100 : 0,
      prompt: prediction.input?.prompt || '',
      createdAt: new Date(prediction.created_at).getTime(),
      updatedAt: Date.now(),
      completedAt: prediction.completed_at ? new Date(prediction.completed_at).getTime() : undefined,
      error: prediction.error
        ? {
            code: 'PREDICTION_FAILED',
            message: prediction.error,
            retryable: true,
          }
        : undefined,
    }
  }

  async cancelJob(
    credentials: ProviderCredentials,
    jobId: string
  ): Promise<boolean> {
    await this.makeRequest<any>(credentials, `/predictions/${jobId}/cancel`, {
      method: 'POST',
    })
    return true
  }

  async getJobResult(
    credentials: ProviderCredentials,
    jobId: string
  ): Promise<GenerationResult> {
    const prediction = await this.makeRequest<any>(
      credentials,
      `/predictions/${jobId}`
    )

    if (prediction.output) {
      const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
      return {
        videoUrl: output,
        thumbnail: output,
        format: 'mp4',
      }
    }

    return {}
  }

export const replicateAdapter = new ReplicateAdapter()
}