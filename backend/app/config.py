"""
Configuration settings for SENSORA backend.
Supports all external integrations:
- Twilio SMS / Voice broadcast
- LoRaWAN Gateway Webhook (The Things Network v3 / ChirpStack)
- MQTT IoT Telemetry Broker
- Google Maps Platform API
- OpenWeather API (Live Synoptic Meteorological Data)
- Earth Observation Satellite API (Copernicus / NASA)
- External Database (PostgreSQL / Supabase / Neon / SQLite)
- Google Gemini 1.5 Flash AI SitRep Engine
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SENSORA"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # 1. Database Configuration (PostgreSQL / Supabase / Neon / SQLite)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sensora.db")
    
    # ML Model & Evaluation Paths
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

    # 2. Twilio Emergency SMS & Voice Dispatch
    TWILIO_ACCOUNT_SID: Optional[str] = os.getenv("TWILIO_ACCOUNT_SID", None)
    TWILIO_AUTH_TOKEN: Optional[str] = os.getenv("TWILIO_AUTH_TOKEN", None)
    TWILIO_FROM_NUMBER: Optional[str] = os.getenv("TWILIO_FROM_NUMBER", None)
    EMERGENCY_DISPATCH_PHONE: Optional[str] = os.getenv("EMERGENCY_DISPATCH_PHONE", "+977-9800000000")

    # 3. LoRaWAN Gateway & Webhook (The Things Network v3 / ChirpStack)
    LORAWAN_APP_KEY: Optional[str] = os.getenv("LORAWAN_APP_KEY", None)
    LORAWAN_API_KEY: Optional[str] = os.getenv("LORAWAN_API_KEY", None)
    LORAWAN_WEBHOOK_SECRET: Optional[str] = os.getenv("LORAWAN_WEBHOOK_SECRET", None)

    # 4. MQTT Broker for ESP32 Field Nodes
    MQTT_BROKER_HOST: str = os.getenv("MQTT_BROKER_HOST", "broker.hivemq.com")
    MQTT_BROKER_PORT: int = int(os.getenv("MQTT_BROKER_PORT", "1883"))
    MQTT_USERNAME: Optional[str] = os.getenv("MQTT_USERNAME", None)
    MQTT_PASSWORD: Optional[str] = os.getenv("MQTT_PASSWORD", None)
    MQTT_TOPIC: str = os.getenv("MQTT_TOPIC", "sensora/nepal/catchment/telemetry")

    # 5. Google Maps Platform API
    GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY", None)

    # 6. OpenWeatherMap API (Catchment coordinates: Melamchi 27.8329 N, 85.5818 E)
    OPENWEATHER_API_KEY: Optional[str] = os.getenv("OPENWEATHER_API_KEY", None)

    # 7. Earth Observation Satellite API (Copernicus / NASA Earthdata)
    SATELLITE_API_KEY: Optional[str] = os.getenv("SATELLITE_API_KEY", None)

    # 8. Google Gemini 1.5 Flash AI SitRep & Multilingual Notice Engine
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
