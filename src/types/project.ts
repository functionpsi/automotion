export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  assets: ProjectAsset[];
  prompts: SavedPrompt[];
  configurations: SavedConfiguration[];
  generations: string[];
  thumbnail?: string;
  tags?: string[];
}

export interface ProjectAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: number;
  format: string;
  dimensions?: { width: number; height: number };
  uploadedAt: number;
  metadata?: Record<string, any>;
}

export interface SavedPrompt {
  id: string;
  name: string;
  prompt: string;
  negativePrompt?: string;
  type: 'image_to_video' | 'text_to_video';
  createdAt: number;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  provider: string;
  model: string;
  parameters: Record<string, any>;
  createdAt: number;
}