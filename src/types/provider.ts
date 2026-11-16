export type ProviderId = 'replicate' | 'fal' | 'runway' | 'luma' | 'stability' | 'custom';

export type ConnectionStatus =
  | 'not_connected'
  | 'connecting'
  | 'connected'
  | 'auth_failed'
  | 'provider_unavailable'
  | 'configuration_required';

export type AuthMode = 'direct' | 'serverless';

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  description: string;
  website: string;
  docsUrl: string;
  authMode: AuthMode[];
  supportsCors: boolean;
  requiresServerlessGateway: boolean;
  icon?: string;
  color?: string;
}

export interface ProviderCredentials {
  providerId: ProviderId;
  apiKey: string;
  authMode: AuthMode;
  storedAt: 'memory' | 'local' | 'vault';
  connectedAt?: number;
  expiresAt?: number;
  lastTested?: number;
  lastError?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: ProviderId;
  description?: string;
  capabilities: ModelCapabilities;
  pricing?: {
    costPerSecond?: number;
    costPerGeneration?: number;
    currency?: string;
  };
  parameters: ModelParameters;
  status: 'available' | 'deprecated' | 'unavailable';
}

export interface ModelCapabilities {
  imageToVideo: boolean;
  textToVideo: boolean;
  imageToImage: boolean;
  firstLastFrame: boolean;
  imageAnalysis: boolean;
  maxDuration: number;
  maxResolution: string;
  aspectRatios: string[];
  supportsNegativePrompt: boolean;
  supportsSeed: boolean;
  supportsMotionIntensity: boolean;
  supportsFps: boolean;
}

export interface ModelParameters {
  aspectRatio?: string;
  duration?: number;
  resolution?: string;
  fps?: number;
  seed?: number;
  motionIntensity?: number;
  negativePrompt?: string;
  [key: string]: any;
}

export interface GenerationRequest {
  provider: ProviderId;
  model: string;
  type: 'image_to_video' | 'text_to_video' | 'image_to_image';
  prompt: string;
  negativePrompt?: string;
  image?: string;
  imageFile?: File;
  firstFrame?: string;
  lastFrame?: string;
  parameters: ModelParameters;
  projectId?: string;
  metadata?: Record<string, any>;
}

export interface GenerationJob {
  id: string;
  provider: ProviderId;
  model: string;
  type: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  progress: number;
  prompt: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  result?: GenerationResult;
  error?: GenerationError;
  estimatedCost?: number;
  estimatedCompletion?: number;
}

export interface GenerationResult {
  videoUrl?: string;
  imageUrl?: string;
  thumbnail?: string;
  duration?: number;
  resolution?: string;
  format?: string;
  size?: number;
  metadata?: Record<string, any>;
}

export interface GenerationError {
  code: string;
  message: string;
  details?: string;
  retryable: boolean;
}

export interface ProviderAdapter {
  id: ProviderId;
  config: ProviderConfig;
  testConnection(credentials: ProviderCredentials): Promise<ConnectionTestResult>;
  listModels(credentials: ProviderCredentials): Promise<ModelInfo[]>;
  generateImageToVideo(
    credentials: ProviderCredentials,
    request: GenerationRequest
  ): Promise<GenerationJob>;
  generateTextToVideo(
    credentials: ProviderCredentials,
    request: GenerationRequest
  ): Promise<GenerationJob>;
  getJobStatus(credentials: ProviderCredentials, jobId: string): Promise<GenerationJob>;
  cancelJob(credentials: ProviderCredentials, jobId: string): Promise<boolean>;
  getJobResult(credentials: ProviderCredentials, jobId: string): Promise<GenerationResult>;
  analyzeImage?(credentials: ProviderCredentials, image: string): Promise<ImageAnalysis>;
}

export interface ConnectionTestResult {
  success: boolean;
  status: ConnectionStatus;
  message: string;
  models?: ModelInfo[];
  error?: GenerationError;
  latency?: number;
}

export interface ImageAnalysis {
  objects: string[];
  scene: string;
  composition: string;
  lighting: string;
  colors: string[];
  mood: string;
  suggestedMotion: string[];
  confidence: number;
}