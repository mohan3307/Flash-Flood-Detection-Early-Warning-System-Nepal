"""
Main FastAPI application entrypoint for SENSORA.
"""

import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import settings
from app.database.session import init_db
from app.api.routes import router as api_router
from app.api.websocket import manager, simulation_broadcast_loop
from app.ml.model_service import model_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database & Load Model
    print("Initializing SENSORA Database...")
    init_db()
    
    print("Checking ML Model status...")
    if model_service.model is None:
        model_service.load_model()

    # Launch background simulation broadcaster
    broadcast_task = asyncio.create_task(simulation_broadcast_loop())
    
    yield
    
    # Shutdown: cancel task
    broadcast_task.cancel()
    try:
        await broadcast_task
    except asyncio.CancelledError:
        pass
    print("SENSORA backend shutdown complete.")

app = FastAPI(
    title="SENSORA – Flash Flood Early Warning System API",
    description="Software-only prototype for AI-driven flash flood detection in steep Himalayan catchments.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for local frontend dev & network access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST Routes
app.include_router(api_router, prefix="/api")

# Real-time WebSocket endpoint
@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and accept client commands if sent
            data = await websocket.receive_text()
    except Exception:
        manager.disconnect(websocket)

# Serve built frontend if dist exists
dist_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_index():
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "SENSORA API is running. Frontend build not found."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
