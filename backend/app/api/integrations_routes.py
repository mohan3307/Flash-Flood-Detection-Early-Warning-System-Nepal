"""
FastAPI endpoints for SENSORA External API Integrations:
- Twilio SMS / Voice broadcast
- LoRaWAN Gateway Webhook (The Things Network v3 / ChirpStack)
- MQTT IoT Broker Ingestion
- Google Maps API status & testing
- OpenWeather Live Synoptic Weather Sync
- Earth Observation Satellite API
- Database Connection Health
- Google Gemini 1.5 Flash AI Multilingual SitRep Generator
"""

import os
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

from app.services.integrations_service import integrations_service
from app.simulation.engine import simulation_engine
from app.config import settings

router = APIRouter(prefix="/integrations", tags=["External Integrations"])

class TwilioSendRequest(BaseModel):
    recipient_phone: Optional[str] = None
    headline: str = "EMERGENCY FLASH FLOOD ALERT"
    action: str = "Immediate evacuation to Melamchi Higher Sec. School Safe Camp."
    lead_time_minutes: int = 45
    zone_name: str = "Melamchi Pul Bazaar"

class UpdateConfigRequest(BaseModel):
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    twilio_from_number: Optional[str] = None
    emergency_dispatch_phone: Optional[str] = None
    openweather_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    google_maps_api_key: Optional[str] = None
    lorawan_app_key: Optional[str] = None
    lorawan_api_key: Optional[str] = None
    satellite_api_key: Optional[str] = None
    mqtt_broker_host: Optional[str] = None

class LoRaWANUplinkRequest(BaseModel):
    end_device_ids: Optional[Dict[str, Any]] = None
    uplink_message: Optional[Dict[str, Any]] = None
    water_level: Optional[float] = None
    rainfall_intensity: Optional[float] = None
    battery_pct: Optional[int] = None

class MQTTSimulateRequest(BaseModel):
    topic: str = "sensora/nepal/catchment/telemetry"
    sensor_id: str = "SNSR-NP-001"
    water_level: float = 3.25
    rainfall_intensity: float = 65.0
    rate_of_rise: float = 0.42

class GenerateSitRepRequest(BaseModel):
    zone_code: Optional[str] = "ZONE-B"
    lead_time_minutes: int = 45

# ------------------------------------------------------------------------------
# 1. Integrations Status Overview
# ------------------------------------------------------------------------------
@router.get("/status")
def get_integrations_status():
    """Returns connectivity health, masked credentials, and metrics for all 8 external APIs."""
    return integrations_service.get_status()

# ------------------------------------------------------------------------------
# 2. Test Single Service Connection
# ------------------------------------------------------------------------------
@router.post("/test/{service_name}")
def test_integration(service_name: str):
    """Pings and tests the specified service (twilio, openweather, gemini_ai, google_maps, database, lorawan)."""
    return integrations_service.test_service(service_name)

# ------------------------------------------------------------------------------
# 3. Dynamic API Key Configuration Update
# ------------------------------------------------------------------------------
@router.post("/config")
def update_integration_config(req: UpdateConfigRequest):
    """Updates API keys in memory for immediate active use."""
    if req.twilio_account_sid is not None:
        settings.TWILIO_ACCOUNT_SID = req.twilio_account_sid.strip() or None
    if req.twilio_auth_token is not None:
        settings.TWILIO_AUTH_TOKEN = req.twilio_auth_token.strip() or None
    if req.twilio_from_number is not None:
        settings.TWILIO_FROM_NUMBER = req.twilio_from_number.strip() or None
    if req.emergency_dispatch_phone is not None:
        settings.EMERGENCY_DISPATCH_PHONE = req.emergency_dispatch_phone.strip() or None
    if req.openweather_api_key is not None:
        settings.OPENWEATHER_API_KEY = req.openweather_api_key.strip() or None
    if req.gemini_api_key is not None:
        settings.GEMINI_API_KEY = req.gemini_api_key.strip() or None
    if req.google_maps_api_key is not None:
        settings.GOOGLE_MAPS_API_KEY = req.google_maps_api_key.strip() or None
    if req.lorawan_app_key is not None:
        settings.LORAWAN_APP_KEY = req.lorawan_app_key.strip() or None
    if req.lorawan_api_key is not None:
        settings.LORAWAN_API_KEY = req.lorawan_api_key.strip() or None
    if req.satellite_api_key is not None:
        settings.SATELLITE_API_KEY = req.satellite_api_key.strip() or None
    if req.mqtt_broker_host is not None:
        settings.MQTT_BROKER_HOST = req.mqtt_broker_host.strip()

    return {
        "status": "config_updated",
        "message": "API credentials updated in memory and active across all endpoints.",
        "active_status": integrations_service.get_status()
    }

# ------------------------------------------------------------------------------
# 4. Twilio SMS Emergency Dispatch
# ------------------------------------------------------------------------------
@router.post("/twilio/send-alert")
def send_twilio_alert(req: TwilioSendRequest):
    """Dispatches real SMS alert (or logs simulated delivery) via Twilio."""
    result = integrations_service.dispatch_twilio_sms(
        recipient=req.recipient_phone,
        headline=req.headline,
        action=req.action,
        lead_time_minutes=req.lead_time_minutes,
        zone_name=req.zone_name
    )
    return result

@router.get("/twilio/logs")
def get_twilio_logs():
    """Returns log of all dispatched SMS emergency alerts."""
    return {
        "count": len(integrations_service.dispatched_sms_log),
        "logs": integrations_service.dispatched_sms_log
    }

# ------------------------------------------------------------------------------
# 5. OpenWeatherMap Synoptic Weather Sync
# ------------------------------------------------------------------------------
@router.get("/weather/live")
def get_live_weather(lat: float = 27.8329, lon: float = 85.5818):
    """Fetches live meteorological parameters for the Melamchi/Sindhupalchok catchment."""
    return integrations_service.fetch_live_weather(lat=lat, lon=lon)

# ------------------------------------------------------------------------------
# 6. Satellite Earth Observation Telemetry
# ------------------------------------------------------------------------------
@router.get("/satellite/data")
def get_satellite_data(lat: float = 27.8329, lon: float = 85.5818):
    """Returns Copernicus Sentinel soil moisture saturation and cloudburst radar reflection."""
    return integrations_service.fetch_satellite_data(lat=lat, lon=lon)

# ------------------------------------------------------------------------------
# 7. LoRaWAN Webhook Ingestion (The Things Network v3 / ChirpStack)
# ------------------------------------------------------------------------------
@router.post("/lorawan/uplink")
def ingest_lorawan_uplink(req: Dict[str, Any]):
    """Receives physical LoRaWAN gateway HTTP webhook POST payload and updates catchment state."""
    result = integrations_service.ingest_lorawan_uplink(req)
    # Forward telemetry into simulation engine
    sensor_id = result.get("device_id", "SNSR-NP-001")
    parsed = result.get("parsed_telemetry", {})
    simulation_engine.ingest_hardware_reading(
        sensor_id=sensor_id,
        rainfall_intensity=parsed.get("rainfall_intensity", 20.0),
        water_level=parsed.get("water_level", 2.0),
    )
    return result

# ------------------------------------------------------------------------------
# 8. MQTT Ingestion Simulator
# ------------------------------------------------------------------------------
@router.post("/mqtt/simulate-publish")
def simulate_mqtt_packet(req: MQTTSimulateRequest):
    """Simulates incoming MQTT payload published by an ESP32 node."""
    simulation_engine.ingest_hardware_reading(
        sensor_id=req.sensor_id,
        rainfall_intensity=req.rainfall_intensity,
        water_level=req.water_level,
        rate_of_rise=req.rate_of_rise
    )
    return {
        "status": "mqtt_packet_processed",
        "topic": req.topic,
        "payload": req.dict(),
        "broker": f"{settings.MQTT_BROKER_HOST}:{settings.MQTT_BROKER_PORT}"
    }

# ------------------------------------------------------------------------------
# 9. Google Gemini 1.5 Flash AI Situation Report Generator
# ------------------------------------------------------------------------------
@router.post("/ai/generate-sitrep")
def generate_sitrep(req: GenerateSitRepRequest):
    """Generates an executive flash flood SitRep with English and Nepali community directives."""
    zone = simulation_engine.zone_states.get(req.zone_code or "ZONE-B") or list(simulation_engine.zone_states.values())[1]
    overall_risk = "LOW"
    if any(z.get("risk_level") == "HIGH" for z in simulation_engine.zone_states.values()):
        overall_risk = "HIGH"
    elif any(z.get("risk_level") == "MEDIUM" for z in simulation_engine.zone_states.values()):
        overall_risk = "MEDIUM"
    scenario = simulation_engine.current_scenario
    
    sitrep = integrations_service.generate_ai_sitrep(
        primary_zone=zone,
        overall_risk=overall_risk,
        scenario=scenario,
        lead_time_minutes=req.lead_time_minutes
    )
    return sitrep
