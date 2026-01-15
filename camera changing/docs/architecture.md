# Technical Architecture

## System Overview

The Psygo AI Camera is a full-stack application that provides AI-enhanced digital zoom functionality. The system processes camera input in real-time, applies super-resolution algorithms during zoom operations, and maintains image quality.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │ Camera View │  │ Zoom Control│  │ Enhanced Preview │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
│          │               │                      │           │
│          └───────────────┼──────────────────────┘           │
│                          │                                  │
│                 WebSocket / HTTP API                         │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                     Backend (FastAPI)                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │                 API Gateway                        │    │
│  ├────────────────────────────────────────────────────┤    │
│  │  Camera Stream     Image Process     User Mgmt     │    │
│  │    Handler           Handler          Handler      │    │
│  └────────────────────────────────────────────────────┘    │
│          │               │                      │           │
│          ▼               ▼                      ▼           │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │ WebSocket   │  │ AI Model    │  │ Database         │    │
│  │ Manager     │  │ Inference   │  │ Connector        │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
│                                  │           │              │
│                                  └───────────┼──────────────┘
│                                              ▼               │
│                                       ┌─────────────┐        │
│                                       │   MySQL     │        │
│                                       │  Database   │        │
│                                       └─────────────┘        │
└──────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Architecture

#### 1.1 Camera Module
- **Technology**: react-webcam + WebRTC
- **Features**:
  - Access device camera stream
  - Capture video frames
  - Real-time preview display
  - Zoom level adjustment (0.5x - 3.0x)

#### 1.2 UI Components
- **Framework**: React + TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Key Components**:
  - CameraView: Main camera interface
  - ZoomSlider: Zoom control component
  - SettingsPanel: User preferences
  - HistoryView: Processing history

#### 1.3 State Management
- **Library**: Zustand
- **Stores**:
  - CameraStore: Camera state, zoom level, stream
  - ProcessingStore: AI processing status, results
  - UserStore: User settings, preferences

#### 1.4 Communication
- **WebSocket**: Real-time image processing updates
- **HTTP API**: Configuration, history, user management

### 2. Backend Architecture

#### 2.1 API Layer
- **Framework**: FastAPI
- **Endpoints**:
  - `/api/camera/stream`: WebSocket for real-time processing
  - `/api/images/process`: HTTP endpoint for image enhancement
  - `/api/users/*`: User management
  - `/api/history/*`: Processing history

#### 2.2 Image Processing Pipeline
```
1. Receive image frame (WebSocket or HTTP)
2. Preprocess (resize, normalize, format conversion)
3. Apply zoom transformation
4. Run super-resolution model
5. Post-process (denoise, sharpen)
6. Return enhanced image
```

#### 2.3 AI Model Service
- **Initial Model**: ESRCNN (Efficient Sub-pixel CNN)
- **Alternative**: Real-ESRGAN for higher quality
- **Optimization**:
  - Model quantization for faster inference
  - Batch processing for efficiency
  - GPU acceleration support

#### 2.4 Database Schema
```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Processing history
CREATE TABLE image_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    original_image BLOB,
    enhanced_image BLOB,
    zoom_level DECIMAL(3,1),
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Model configurations
CREATE TABLE model_configs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    model_name VARCHAR(100),
    model_path VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. AI/ML Architecture

#### 3.1 Super-Resolution Models
- **ESRCNN**: Lightweight, fast inference (15-30ms per frame)
- **Real-ESRGAN**: Higher quality, slower (50-100ms per frame)
- **Custom Models**: Potential for domain-specific training

#### 3.2 Image Enhancement Techniques
- **Deblurring**: Remove motion blur from zoomed images
- **Denoising**: Reduce noise introduced during zoom
- **Sharpening**: Enhance edge clarity
- **Color Correction**: Maintain color accuracy

#### 3.3 Real-time Optimization
- **Frame Skipping**: Process every N frames for performance
- **Resolution Scaling**: Adjust processing resolution based on zoom level
- **Model Switching**: Use lighter models for lower zoom levels

### 4. Data Flow

#### 4.1 Real-time Processing Flow
1. Frontend captures video frame from camera
2. Frame sent to backend via WebSocket
3. Backend processes frame with AI model
4. Enhanced frame returned via WebSocket
5. Frontend displays enhanced frame

#### 4.2 Batch Processing Flow
1. User captures photo
2. Image uploaded via HTTP API
3. Backend processes with higher-quality model
4. Result stored in database
5. Enhanced image returned to user

### 5. Performance Considerations

#### 5.1 Latency Targets
- **Real-time processing**: < 100ms end-to-end
- **Batch processing**: < 2 seconds
- **WebSocket connection**: Persistent, low-latency

#### 5.2 Scalability
- **Horizontal scaling**: Multiple backend instances
- **Load balancing**: Distribute WebSocket connections
- **Database scaling**: Read replicas for history queries

#### 5.3 Resource Optimization
- **GPU utilization**: Batch processing for efficiency
- **Memory management**: Frame buffer pooling
- **Network optimization**: Image compression techniques

### 6. Security Considerations

#### 6.1 Data Protection
- **Image data**: Temporary processing, not stored long-term
- **User data**: Encrypted in database
- **API security**: Authentication for user endpoints

#### 6.2 Access Control
- **Camera access**: User permission required
- **API access**: Rate limiting
- **Admin access**: Separate authentication

### 7. Deployment Architecture

#### 7.1 Containerization
```dockerfile
# Frontend container
FROM node:18-alpine AS frontend

# Backend container  
FROM python:3.10-slim AS backend

# Database container
FROM mysql:8.0
```

#### 7.2 Cloud Deployment
- **Frontend**: Tencent Cloud EdgeOne Pages
- **Backend**: Container service with auto-scaling
- **Database**: Cloud MySQL with backup
- **Storage**: Object storage for images

#### 7.3 Monitoring & Logging
- **Application logs**: Structured logging with context
- **Performance metrics**: Response time, error rates
- **AI model metrics**: Inference time, quality scores

## Development Phases

### Phase 1: MVP (Week 1-2)
- Basic camera interface with zoom control
- Simple image processing (no AI)
- WebSocket communication prototype
- Basic database schema

### Phase 2: AI Integration (Week 3-4)
- ESRCNN model integration
- Real-time enhancement pipeline
- Quality comparison tools
- Performance optimization

### Phase 3: Enhancement (Week 5-6)
- Advanced models (Real-ESRGAN)
- User customization features
- Advanced zoom algorithms
- Mobile optimization

### Phase 4: Production (Week 7-8)
- Performance tuning
- Security hardening
- Deployment automation
- Documentation completion

## Technology Decisions

### Why React?
- Component-based architecture fits camera UI needs
- Strong TypeScript support for type safety
- Rich ecosystem for camera and WebRTC integration

### Why FastAPI?
- High performance for real-time processing
- Built-in WebSocket support
- Automatic API documentation
- Python ecosystem for AI/ML

### Why MySQL?
- Relational data structure fits user/history data
- Transaction support for data consistency
- Mature ecosystem with good tooling

### Why Docker?
- Consistent development/production environments
- Easy scaling and deployment
- Isolation of AI model dependencies

## Future Enhancements

1. **Mobile App**: React Native version
2. **Advanced AI**: Custom trained models for specific scenarios
3. **Cloud Processing**: Offload intensive processing to cloud
4. **Collaborative Features**: Multiple users viewing same camera
5. **Analytics Dashboard**: Processing metrics and quality analysis