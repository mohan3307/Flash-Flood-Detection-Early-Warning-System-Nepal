"""
Database engine, sessionmaker, and initialization functions.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.database.models import Base, Zone, Sensor
from datetime import datetime

# SQLite connect args
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initial seed data for Nepal river catchment zones
DEFAULT_ZONES = [
    {
        "zone_code": "ZONE-A",
        "name": "Zone A - Mountain River Catchment",
        "description": "Upper Melamchi River Gorge (Steep slopes, cloudburst prone)",
        "latitude": 27.9712,
        "longitude": 85.5784,
        "elevation_m": 2480.0,
        "sensor_id": "SNSR-NP-001",
        "sensor_name": "Melamchi Upper Gorge Station",
    },
    {
        "zone_code": "ZONE-B",
        "name": "Zone B - Downstream Village",
        "description": "Melamchi Pul Bazaar settlement & transit corridor",
        "latitude": 27.8329,
        "longitude": 85.5818,
        "elevation_m": 870.0,
        "sensor_id": "SNSR-NP-002",
        "sensor_name": "Pul Bazaar Riverbank Station",
    },
    {
        "zone_code": "ZONE-C",
        "name": "Zone C - Low-Lying Community",
        "description": "Bahunepati Agricultural Plain & School District",
        "latitude": 27.7654,
        "longitude": 85.5942,
        "elevation_m": 720.0,
        "sensor_id": "SNSR-NP-003",
        "sensor_name": "Bahunepati Floodplain Station",
    },
    {
        "zone_code": "ZONE-D",
        "name": "Zone D - River Junction",
        "description": "Indrawati-Melamchi River Confluence Basin",
        "latitude": 27.7121,
        "longitude": 85.6025,
        "elevation_m": 640.0,
        "sensor_id": "SNSR-NP-004",
        "sensor_name": "Indrawati Confluence Gateway",
    },
]

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for z_data in DEFAULT_ZONES:
            existing = db.query(Zone).filter(Zone.zone_code == z_data["zone_code"]).first()
            if not existing:
                zone = Zone(
                    zone_code=z_data["zone_code"],
                    name=z_data["name"],
                    description=z_data["description"],
                    latitude=z_data["latitude"],
                    longitude=z_data["longitude"],
                    elevation_m=z_data["elevation_m"],
                    current_risk="LOW",
                    probability=12.5
                )
                db.add(zone)
                db.flush()

                sensor = Sensor(
                    sensor_id=z_data["sensor_id"],
                    zone_id=zone.id,
                    name=z_data["sensor_name"],
                    sensor_type="ESP32-Multi-Hydrological-Station",
                    status="ONLINE",
                    battery_level=94,
                    signal_strength="Excellent",
                    last_ping=datetime.utcnow()
                )
                db.add(sensor)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Database init warning: {e}")
    finally:
        db.close()
