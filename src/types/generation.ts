export * from './provider'

export interface GenerationHistoryEntry {
  id: string;
  projectId?: string;
  provider: string;
  model: string;
  type: 'image_to_video' | 'text_to_video' | 'image_to_image';
  prompt: string;
  negativePrompt?: string;
  sourceImage?: string;
  parameters: Record<string, any>;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: number;
  completedAt?: number;
  result?: {
    videoUrl?: string;
    imageUrl?: string;
    thumbnail?: string;
    duration?: number;
    resolution?: string;
    format?: string;
  };
  error?: {
    code: string;
    message: string;
  };
  estimatedCost?: number;
  actualCost?: number;
}

export interface GenerationStats {
  total: number;
  completed: number;
  failed: number;
  processing: number;
  totalCost?: number;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
  byType: Record<string, number>;
}