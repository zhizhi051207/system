// Camera and image processing types

export interface CameraState {
  isActive: boolean
  zoomLevel: number
  isProcessing: boolean
  error: string | null
  deviceId: string | null
  stream: MediaStream | null
}

export interface ZoomSettings {
  min: number
  max: number
  step: number
  defaultValue: number
}

export const DEFAULT_ZOOM_SETTINGS: ZoomSettings = {
  min: 0.5,
  max: 3.0,
  step: 0.1,
  defaultValue: 1.0,
}

export interface ImageFrame {
  id: string
  data: string // base64 encoded image
  timestamp: number
  zoomLevel: number
  width: number
  height: number
  format: 'jpeg' | 'png' | 'webp'
}

export interface ProcessingResult {
  id: string
  originalImage: string
  enhancedImage: string
  zoomLevel: number
  enhancementLevel: 'low' | 'medium' | 'high'
  processingTime: number
  qualityScore: number
  timestamp: number
}

export interface CameraDevice {
  deviceId: string
  label: string
  kind: 'videoinput' | 'audioinput'
  groupId: string
}

export interface CameraConstraints {
  width?: number
  height?: number
  frameRate?: number
  aspectRatio?: number
  facingMode?: 'user' | 'environment'
}

export interface ProcessingStats {
  totalFrames: number
  processedFrames: number
  averageProcessingTime: number
  averageQualityScore: number
  errors: number
}

export interface CameraConfig {
  deviceId?: string
  constraints: CameraConstraints
  zoomSettings: ZoomSettings
  autoEnhance: boolean
  saveHistory: boolean
  realtimeProcessing: boolean
}

// AI Model types
export interface AIModelInfo {
  name: string
  type: 'sr' | 'deblur' | 'enhance'
  version: string
  description: string
  inputSize: string
  outputSize: string
  avgProcessingTime: number
  avgQualityScore: number
  isActive: boolean
  priority: number
}

export interface ProcessingOptions {
  zoomLevel: number
  enhancementLevel: 'low' | 'medium' | 'high'
  modelType?: 'sr' | 'deblur' | 'enhance'
  realtime: boolean
  batchSize?: number
}