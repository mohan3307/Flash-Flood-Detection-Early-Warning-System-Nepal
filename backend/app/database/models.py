"""
SQLAlchemy ORM models for SENSORA backend.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    zone_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. "ZONE-A"
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=True)
    current_risk = Column(String(20), default="LOW")
    probability = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sensors = relationship("Sensor", back_populates="zone", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="zone", cascade="all, delete-orphan")

class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. "SNSR-NP-001"
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    name = Column(String(100), nullable=False)
    sensor_type = Column(String(50), default="Multi-Hydrological-Station") # ESP32-ready
    status = Column(String(20), default="ONLINE") # ONLINE, DEGRADED, OFFLINE
    battery_level = Column(Integer, default=95)
    signal_strength = Column(String(20), default="Excellent")
    last_ping = Column(DateTime, default=datetime.utcnow)

    zone = relationship("Zone", back_populates="sensors")
    readings = relationship("SensorReading", back_populates="sensor", cascade="all, delete-orphan")

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String(50), ForeignKey("sensors.sensor_id"), index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    rainfall_intensity = Column(Float, nullable=False) # mm/hr
    water_level = Column(Float, nullable=False)         # meters
    rate_of_rise = Column(Float, nullable=False)        # meters/hour
    temperature = Column(Float, nullable=False)         # Celsius
    scenario = Column(String(50), default="normal")

    sensor = relationship("Sensor", back_populates="readings")

class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    zone_code = Column(String(50), index=True, nullable=False)
    risk_level = Column(String(20), nullable=False) # LOW, MEDIUM, HIGH
    probability = Column(Float, nullable=False)
    rainfall_contribution = Column(Float, default=0.0)
    water_level_contribution = Column(Float, default=0.0)
    rate_of_rise_contribution = Column(Float, default=0.0)
    trend_contribution = Column(Float, default=0.0)
    raw_features = Column(Text, nullable=True)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    zone_code = Column(String(50), nullable=False)
    risk_level = Column(String(20), nullable=False)
    headline = Column(String(150), nullable=False)
    reason = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    lead_time_minutes = Column(Float, nullable=True)

    zone = relationship("Zone", back_populates="alerts")

class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(Integer, primary_key=True, index=True)
    scenario = Column(String(50), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    ticks_executed = Column(Integer, default=0)
