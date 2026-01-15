from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid

from app.core.config import settings

# Create engine and session
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Settings as JSON
    settings = Column(Text, default='{"default_zoom": 1.0, "enhancement_level": "medium", "auto_save": true}')
    is_active = Column(Boolean, default=True)

class ImageHistory(Base):
    __tablename__ = "image_history"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True, index=True)
    
    # Image metadata
    original_filename = Column(String(255))
    original_size = Column(Integer)  # in bytes
    original_format = Column(String(10))
    
    # Processing parameters
    zoom_level = Column(Float, nullable=False)
    enhancement_level = Column(String(20), default="medium")
    
    # Results
    processing_time_ms = Column(Integer)
    quality_score = Column(Float)
    enhanced_size = Column(Integer)  # in bytes
    
    # Image storage (in production, store in object storage)
    original_image_blob = Column(Text)  # Base64 encoded original
    enhanced_image_blob = Column(Text)  # Base64 encoded enhanced
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class ModelConfig(Base):
    __tablename__ = "model_configs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    model_name = Column(String(100), nullable=False)
    model_type = Column(String(50), nullable=False)  # sr, deblur, enhance
    model_path = Column(String(255), nullable=False)
    
    # Model metadata
    version = Column(String(20))
    description = Column(Text)
    input_size = Column(String(50))  # e.g., "256x256"
    output_size = Column(String(50))  # e.g., "1024x1024"
    
    # Performance metrics
    avg_processing_time_ms = Column(Integer)
    avg_quality_score = Column(Float)
    
    # Configuration
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)  # Lower number = higher priority
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True, index=True)
    image_id = Column(String(36), nullable=True, index=True)
    
    # Job parameters
    zoom_level = Column(Float)
    enhancement_level = Column(String(20))
    
    # Status tracking
    status = Column(String(20), default="pending")  # pending, processing, completed, failed
    progress = Column(Integer, default=0)  # 0-100
    
    # Results
    result_data = Column(Text)  # JSON encoded results
    error_message = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    failed_at = Column(DateTime, nullable=True)

# Helper function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create all tables (call this on startup)
def create_tables():
    Base.metadata.create_all(bind=engine)