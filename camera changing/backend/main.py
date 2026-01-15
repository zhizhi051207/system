from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import asyncio
import json

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.websocket_manager import websocket_manager

app = FastAPI(
    title="Psygo AI Camera API",
    description="AI-powered camera zoom enhancement service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_router, prefix="/api/v1")

# WebSocket endpoint for real-time processing
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket_manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message["type"] == "image_frame":
                # Process image frame with AI
                frame_data = message["data"]
                zoom_level = message.get("zoom_level", 1.0)
                
                # Simulate AI processing (replace with actual AI service)
                processing_result = {
                    "type": "processing_result",
                    "client_id": client_id,
                    "status": "processing",
                    "zoom_level": zoom_level,
                    "timestamp": asyncio.get_event_loop().time()
                }
                await websocket.send_json(processing_result)
                
                # Simulate processing delay
                await asyncio.sleep(0.05)
                
                # Send enhanced image result
                enhanced_result = {
                    "type": "enhanced_image",
                    "client_id": client_id,
                    "status": "completed",
                    "zoom_level": zoom_level,
                    "enhanced_image": frame_data,  # In real app, this would be the enhanced image
                    "processing_time_ms": 50,
                    "quality_score": 0.95
                }
                await websocket.send_json(enhanced_result)
                
            elif message["type"] == "ping":
                await websocket.send_json({"type": "pong", "timestamp": asyncio.get_event_loop().time()})
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(client_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        websocket_manager.disconnect(client_id)

@app.get("/")
async def root():
    return {
        "message": "Psygo AI Camera API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-camera-api",
        "timestamp": asyncio.get_event_loop().time()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL
    )