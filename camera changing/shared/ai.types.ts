// AI model and processing types

export interface AIModel {
  id: string
  name: string
  type: 'sr' | 'deblur' | 'enhance' | 'hybrid'
  version: string
  description: string
  input_size: string  // e.g., "256x256"
  output_size: string // e.g., "1024x1024"
  model_path: string
  is_active: boolean
  priority: number
  created_at: number
  updated_at: number
}

export interface ModelMetrics {
  avg_processing_time_ms: number
  avg_quality_score: number
  max_processing_time_ms: number
  min_processing_time_ms: number
  total_processings: number
  success_rate: number
  memory_usage_mb: number
  gpu_usage_percent?: number
}

export interface ProcessingJob {
  id: string
  user_id?: string
  image_id?: string
  zoom_level: number
  enhancement_level: 'low' | 'medium' | 'high'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result_data?: string
  error_message?: string
  created_at: number
  started_at?: number
  completed_at?: number
  failed_at?: number
}

export interface QualityMetrics {
  psnr?: number  // Peak Signal-to-Noise Ratio
  ssim?: number  // Structural Similarity Index
  lpips?: number // Learned Perceptual Image Patch Similarity
  brisque?: number // Blind/Referenceless Image Spatial Quality Evaluator
  niqe?: number  // Natural Image Quality Evaluator
  overall_score: number
}

export interface EnhancementResult {
  original_image: string
  enhanced_image: string
  zoom_level: number
  enhancement_level: 'low' | 'medium' | 'high'
  processing_time_ms: number
  quality_metrics: QualityMetrics
  model_used: string
  model_version: string
}

export interface BatchProcessingRequest {
  images: string[]  // base64 encoded images
  zoom_levels: number[]
  enhancement_level: 'low' | 'medium' | 'high'
  batch_size?: number
  callback_url?: string
}

export interface BatchProcessingResult {
  job_id: string
  total_images: number
  processed_images: number
  failed_images: number
  results: EnhancementResult[]
  average_processing_time: number
  average_quality_score: number
  status: 'processing' | 'completed' | 'failed'
  created_at: number
  completed_at?: number
}

export interface ModelConfiguration {
  model_type: 'sr' | 'deblur' | 'enhance'
  device: 'cpu' | 'cuda' | 'mps'
  batch_size: number
  max_image_size: number
  enable_cache: boolean
  cache_size_mb: number
  enable_quantization: boolean
  quantization_level: 'int8' | 'int16' | 'fp16'
  enable_pruning: boolean
  pruning_ratio: number
}

export interface PerformanceStats {
  frames_processed: number
  total_processing_time_ms: number
  avg_frame_processing_time_ms: number
  peak_memory_usage_mb: number
  avg_gpu_usage_percent?: number
  errors_count: number
  last_update_time: number
}

// AI Service interfaces
export interface IAIService {
  loadModel(modelPath: string, device: string): Promise<boolean>
  enhanceImage(
    imageData: string | ArrayBuffer,
    zoomLevel: number,
    enhancementLevel: 'low' | 'medium' | 'high'
  ): Promise<EnhancementResult>
  batchEnhance(
    imagesData: (string | ArrayBuffer)[],
    zoomLevels: number[],
    enhancementLevel: 'low' | 'medium' | 'high'
  ): Promise<BatchProcessingResult>
  getModelInfo(): AIModel
  getPerformanceStats(): PerformanceStats
  unloadModel(): Promise<void>
}