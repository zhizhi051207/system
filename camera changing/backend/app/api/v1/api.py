from fastapi import APIRouter
from app.api.v1.endpoints import images, users, health

api_router = APIRouter()

api_router.include_router(images.router, prefix="/images", tags=["images"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(health.router, prefix="/health", tags=["health"])