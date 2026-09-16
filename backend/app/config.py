"""
Configuration settings for SENSORA backend.
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SENSORA"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sensora.db")
    
    # ML Model path
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "ml", "model.pkl")
    )
    METRICS_PATH: str = os.getenv(
        "METRICS_PATH",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "ml", "metrics.json")
    )

    # Simulation Defaults
    BASE_TICK_SECONDS: float = 1.0
    DEFAULT_SPEED_MULTIPLIER: int = 1

    class Config:
        case_sensitive = True

settings = Settings()
