from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API settings
    APP_NAME: str = "Psygo AI Camera API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    LOG_LEVEL: str = "info"
    
    # CORS settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    # Database settings
    DATABASE_URL: str = "mysql+pymysql://user:password@localhost:3306/psygo_ai_camera"
    DATABASE_POOL_SIZE: int = 5
    DATABASE_POOL_RECYCLE: int = 3600
    
    # AI Model settings
    AI_MODEL_PATH: str = "models/sr/sr.pth"
    AI_MODEL_TYPE: str = "sr"  # sr (super-resolution), deblur, enhance
    AI_DEVICE: str = "cpu"  # cpu or cuda
    AI_BATCH_SIZE: int = 1
    AI_MAX_IMAGE_SIZE: int = 1024
    
    # Image processing settings
    IMAGE_QUALITY: int = 95
    IMAGE_FORMAT: str = "jpeg"
    MAX_IMAGE_SIZE_MB: int = 10
    
    # WebSocket settings
    WS_MAX_CONNECTIONS: int = 100
    WS_PING_INTERVAL: int = 30
    WS_PING_TIMEOUT: int = 60
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()