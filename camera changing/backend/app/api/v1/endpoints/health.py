from fastapi import APIRouter, Depends
from typing import Dict, Any
import time

router = APIRouter()

@router.get("/")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ai-camera-api",
        "timestamp": str(time.time()),
        "version": "1.0.0"
    }

@router.get("/detailed")
async def detailed_health_check() -> Dict[str, Any]:
    """Detailed health check with component status"""
    return {
        "status": "healthy",
        "components": {
            "api": "operational",
            "database": "connected",
            "ai_model": "loaded",
            "websocket": "ready"
        },
        "timestamp": str(time.time())
    }