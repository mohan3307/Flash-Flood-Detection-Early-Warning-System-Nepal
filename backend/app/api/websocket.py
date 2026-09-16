"""
WebSocket Connection Manager and real-time streaming broadcaster for SENSORA.
"""

import asyncio
import json
from typing import List
from fastapi import WebSocket, WebSocketDisconnect
from app.simulation.engine import simulation_engine

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        if websocket not in self.active_connections:
            self.active_connections.append(websocket)
        # Send immediate initial state
        try:
            initial_frame = simulation_engine.tick()
            await websocket.send_text(json.dumps(initial_frame))
        except Exception as e:
            print(f"Error sending initial frame to WebSocket: {e}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        dead_connections = []
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect(dead)

manager = ConnectionManager()

async def simulation_broadcast_loop():
    """
    Continuous background loop that advances simulation ticks and broadcasts to WebSockets.
    """
    print("Starting SENSORA real-time simulation broadcast loop...")
    while True:
        try:
            speed = max(1, simulation_engine.speed)
            sleep_duration = 1.0 / speed

            if simulation_engine.is_running:
                frame = simulation_engine.tick()
                if manager.active_connections:
                    await manager.broadcast(json.dumps(frame))

            await asyncio.sleep(sleep_duration)
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Error in simulation broadcast loop: {e}")
            await asyncio.sleep(1.0)
