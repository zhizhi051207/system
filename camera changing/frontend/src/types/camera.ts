export interface CameraState {
  isActive: boolean
  zoomLevel: number
  isProcessing: boolean
  error: string | null
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
  data: string  // base64 encoded image
  timestamp: number
  zoomLevel: number
}

export interface ProcessingResult {
  originalImage: string
  enhancedImage: string
  zoomLevel: number
  processingTime: number
  qualityScore: number
}