// API request/response types

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: number
}

export interface ImageEnhanceRequest {
  image: string // base64 encoded image
  zoom_level: number
  enhancement_level: 'low' | 'medium' | 'high'
  user_id?: string
}

export interface ImageEnhanceResponse {
  id: string
  original_size: number
  zoom_level: number
  enhancement_level: string
  processing_time_ms: number
  quality_score: number
  enhanced_image: string // base64 encoded enhanced image
  timestamp: number
  user_id?: string
}

export interface UserCreateRequest {
  username: string
  email?: string
}

export interface UserResponse {
  id: string
  username: string
  email?: string
  created_at: number
  settings: UserSettings
  is_active: boolean
}

export interface UserSettings {
  default_zoom: number
  enhancement_level: 'low' | 'medium' | 'high'
  auto_save: boolean
}

export interface UserSettingsUpdate {
  default_zoom?: number
  enhancement_level?: 'low' | 'medium' | 'high'
  auto_save?: boolean
}

export interface HealthCheckResponse {
  status: string
  service: string
  timestamp: number
  version: string
}

export interface ImageHistoryItem {
  id: string
  user_id?: string
  original_filename?: string
  original_size: number
  zoom_level: number
  enhancement_level: string
  processing_time_ms: number
  quality_score: number
  timestamp: number
}

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/api/v1/health',
  HEALTH_DETAILED: '/api/v1/health/detailed',
  IMAGE_ENHANCE: '/api/v1/images/enhance',
  IMAGE_HISTORY: '/api/v1/images/history',
  IMAGE_STATUS: '/api/v1/images/status',
  USERS_CREATE: '/api/v1/users',
  USERS_GET: '/api/v1/users/{username}',
  USERS_SETTINGS: '/api/v1/users/{username}/settings',
  USERS_LIST: '/api/v1/users',
  WEBSOCKET: '/ws/{client_id}',
} as const