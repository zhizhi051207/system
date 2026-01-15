from fastapi import APIRouter, HTTPException
from typing import List, Optional
import time

router = APIRouter()

# In-memory user storage for demo
users_db = {}

@router.post("/")
async def create_user(username: str, email: Optional[str] = None):
    """
    Create a new user
    """
    if username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_id = f"user_{int(time.time())}"
    users_db[username] = {
        "id": user_id,
        "username": username,
        "email": email,
        "created_at": time.time(),
        "settings": {
            "default_zoom": 1.0,
            "enhancement_level": "medium",
            "auto_save": True
        }
    }
    
    return users_db[username]

@router.get("/{username}")
async def get_user(username: str):
    """
    Get user information
    """
    if username not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    return users_db[username]

@router.put("/{username}/settings")
async def update_user_settings(
    username: str,
    default_zoom: Optional[float] = None,
    enhancement_level: Optional[str] = None,
    auto_save: Optional[bool] = None
):
    """
    Update user settings
    """
    if username not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[username]
    settings = user["settings"]
    
    if default_zoom is not None:
        if not 0.5 <= default_zoom <= 3.0:
            raise HTTPException(
                status_code=400,
                detail="Default zoom must be between 0.5 and 3.0"
            )
        settings["default_zoom"] = default_zoom
    
    if enhancement_level is not None:
        if enhancement_level not in ["low", "medium", "high"]:
            raise HTTPException(
                status_code=400,
                detail="Enhancement level must be low, medium, or high"
            )
        settings["enhancement_level"] = enhancement_level
    
    if auto_save is not None:
        settings["auto_save"] = auto_save
    
    user["settings"] = settings
    users_db[username] = user
    
    return user

@router.get("/")
async def list_users(limit: int = 100):
    """
    List all users
    """
    return list(users_db.values())[:limit]