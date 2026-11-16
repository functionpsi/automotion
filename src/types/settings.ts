export type Theme = 'dark' | 'light' | 'system';

export interface UserSettings {
  theme: Theme;
  language: string;
  defaultProvider?: string;
  defaultModel?: string;
  defaultParameters: Record<string, any>;
  credentialStorage: 'memory' | 'local' | 'vault';
  vaultPassphrase?: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  generation: GenerationSettings;
  display: DisplaySettings;
}

export interface NotificationSettings {
  generationComplete: boolean;
  generationFailed: boolean;
  jobUpdates: boolean;
  providerIssues: boolean;
  soundEnabled: boolean;
}

export interface PrivacySettings {
  analyticsEnabled: boolean;
  crashReporting: boolean;
  shareUsageData: boolean;
  clearDataOnExit: boolean;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface GenerationSettings {
  autoSave: boolean;
  maxConcurrentJobs: number;
  defaultDuration: number;
  defaultAspectRatio: string;
  defaultResolution: string;
  quality: 'draft' | 'standard' | 'high';
  timeout: number;
  retryFailed: boolean;
  maxRetries: number;
}

export interface DisplaySettings {
  density: 'compact' | 'comfortable' | 'spacious';
  showAdvancedOptions: boolean;
  showCostEstimates: boolean;
  showAgentActivity: boolean;
  sidebarCollapsed: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
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
};