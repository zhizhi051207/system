// WebSocket communication protocol

export type WebSocketMessageType = 
  | 'connect'
  | 'disconnect'
  | 'image_frame'
  | 'processing_result'
  | 'enhanced_image'
  | 'error'
  | 'ping'
  | 'pong'
  | 'status_update'
  | 'model_update'

export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType
  client_id: string
  timestamp: number
  data?: T
  error?: string
}

export interface ImageFrameMessage {
  type: 'image_frame'
  data: string // base64 encoded image frame
  zoom_level: number
  frame_id: string
  width: number
  height: number
  format: 'jpeg' | 'png' | 'webp'
}

export interface ProcessingResultMessage {
  type: 'processing_result'
  status: 'queued' | 'processing' | 'completed' | 'failed'
  frame_id: string
  progress?: number
  estimated_time?: number
}

export interface EnhancedImageMessage {
  type: 'enhanced_image'
  frame_id: string
  enhanced_image: string // base64 encoded enhanced image
  processing_time_ms: number
  quality_score: number
  zoom_level: number
  enhancement_level: 'low' | 'medium' | 'high'
}

export interface ErrorMessage {
  type: 'error'
  code: string
  message: string
  details?: any
}

export interface StatusUpdateMessage {
  type: 'status_update'
  status: 'connected' | 'disconnected' | 'processing' | 'idle'
  active_clients: number
  processing_queue: number
  model_status: 'loaded' | 'loading' | 'error'
}

export interface ModelUpdateMessage {
  type: 'model_update'
  model_name: string
  model_type: 'sr' | 'deblur' | 'enhance'
  status: 'loaded' | 'unloaded' | 'updated'
  version?: string
  performance_metrics?: {
    avg_processing_time: number
    avg_quality_score: number
  }
}

export interface PingPongMessage {
  type: 'ping' | 'pong'
  timestamp: number
  server_time?: number
}

// WebSocket connection configuration
export interface WebSocketConfig {
  url: string
  reconnect_interval: number
  max_reconnect_attempts: number
  ping_interval: number
  timeout: number
}

export const DEFAULT_WS_CONFIG: WebSocketConfig = {
  url: 'ws://localhost:8000/ws/{client_id}',
  reconnect_interval: 3000,
  max_reconnect_attempts: 5,
  ping_interval: 30000,
  timeout: 10000,
}

// Helper functions for WebSocket messages
export function createImageFrameMessage(
  clientId: string,
  data: Omit<ImageFrameMessage, 'type'>
): WebSocketMessage<ImageFrameMessage> {
  return {
    type: 'image_frame',
    client_id: clientId,
    timestamp: Date.now(),
    data: {
      type: 'image_frame',
      ...data
    }
  }
}

export function createPingMessage(clientId: string): WebSocketMessage<PingPongMessage> {
  return {
    type: 'ping',
    client_id: clientId,
    timestamp: Date.now(),
    data: {
      type: 'ping',
      timestamp: Date.now()
    }
  }
}