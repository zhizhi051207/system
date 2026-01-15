from typing import Dict
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
    
    async def send_message(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            try:
                await websocket.send_json(message)
            except Exception as e:
                print(f"Error sending message to {client_id}: {e}")
                self.disconnect(client_id)
    
    async def broadcast(self, message: dict):
        for client_id in list(self.active_connections.keys()):
            await self.send_message(client_id, message)
    
    def get_active_client_count(self) -> int:
        return len(self.active_connections)
    
    def is_client_connected(self, client_id: str) -> bool:
        return client_id in self.active_connections

websocket_manager = WebSocketManager()