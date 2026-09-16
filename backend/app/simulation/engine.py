"""
Simulation Engine for SENSORA.
Generates realistic hydrologic sensor telemetry, computes rate of rise,
runs ML risk prediction, and manages scenarios and playback speed.
"""

import asyncio
import time
from datetime import datetime
from typing import Dict, Any, List, Optional
import numpy as np

from app.simulation.zones import ZONES_METADATA
from app.ml.feature_engineering import SensorFeatureBuffer
from app.ml.model_service import model_service
from app.database.session import SessionLocal
from app.database.models import SensorReading, PredictionRecord, Alert, Zone, Sensor

class SimulationEngine:
    def __init__(self):
        self.is_running: bool = True
        self.speed: int = 1
        self.current_scenario: str = "normal"
        self.tick_count: int = 0
        
        # Scenario progression timer/counter
        self.scenario_tick: int = 0
        
        # Zone runtime state
        self.zone_states: Dict[str, Dict[str, Any]] = {}
        self.feature_buffers: Dict[str, SensorFeatureBuffer] = {}
        
        # Custom parameters (for custom scenario)
        self.custom_params: Dict[str, float] = {
            "rainfall": 15.0,
            "water_level": 1.5,
            "rate_of_rise": 0.05,
            "temperature": 22.0
        }

        # Active alert cache & warning lead time tracking
        self.active_alerts: List[Dict[str, Any]] = []
        self.flood_onset_tick: Optional[int] = None
        self.first_warning_tick: Optional[int] = None
        self.lead_time_minutes: float = 45.0
        self.last_frame: Optional[Dict[str, Any]] = None

        self._init_zones()

    def _init_zones(self):
        for z in ZONES_METADATA:
            code = z["zone_code"]
            self.feature_buffers[code] = SensorFeatureBuffer(max_history=24)
            self.zone_states[code] = {
                "zone_code": code,
                "name": z["name"],
                "subtext": z["subtext"],
                "sensor_id": z["sensor_id"],
                "sensor_name": z["sensor_name"],
                "latitude": z["latitude"],
                "longitude": z["longitude"],
                "elevation_m": z["elevation_m"],
                "rainfall_intensity": 2.5,
                "water_level": z["base_water_level"],
                "rate_of_rise": 0.0,
                "temperature": 23.5,
                "status": "ONLINE",
                "battery_level": 94,
                "signal_strength": "Excellent",
                "risk_level": "LOW",
                "probability": 12.0,
                "probabilities": {"LOW": 88.0, "MEDIUM": 10.0, "HIGH": 2.0},
                "contributions": {"rainfall_intensity": 10, "water_level": 15, "rate_of_rise": 5, "recent_trend": 8},
                "risk_factors": ["Normal seasonal river baseflow"],
                "is_false_alarm": False,
                "recommended_action": "Continue automated environmental monitoring.",
                "soil_water_content_pct": 38.5,
                "channel_discharge_m3s": round(32.0 * (z["base_water_level"] ** 1.6), 1),
                "soil_moisture_depths": {"topsoil_10cm": 42.0, "rootzone_40cm": 38.0, "deep_100cm": 35.0},
                "runoff_coefficient": 0.18,
                "last_update": datetime.utcnow().isoformat()
            }
            # Prime buffers with calm base state
            self.feature_buffers[code].reset(base_wl=z["base_water_level"], base_rain=2.5, base_temp=23.5)

    def set_scenario(self, scenario: str, custom_params: Optional[Dict[str, float]] = None):
        print(f"Switching simulation scenario to: {scenario}")
        self.current_scenario = scenario
        self.scenario_tick = 0
        
        if scenario == "flash_flood":
            self.first_warning_tick = None
            self.flood_onset_tick = self.tick_count + 12 # simulated peak in ~12 ticks
            self.lead_time_minutes = 45.0
        elif scenario == "false_alarm":
            self.first_warning_tick = None
            self.flood_onset_tick = None

        if custom_params:
            self.custom_params.update(custom_params)

    def set_speed(self, speed: int):
        self.speed = max(1, min(10, speed))

    def set_running(self, running: bool):
        self.is_running = running

    def reset(self):
        self.scenario_tick = 0
        self.tick_count = 0
        self.current_scenario = "normal"
        self.active_alerts.clear()
        self.first_warning_tick = None
        self.flood_onset_tick = None
        self._init_zones()

    def set_sensor_status(self, sensor_id: str, status: str):
        for code, z in self.zone_states.items():
            if z["sensor_id"] == sensor_id:
                z["status"] = status
                if status == "OFFLINE":
                    z["signal_strength"] = "No Signal"
                elif status == "DEGRADED":
                    z["signal_strength"] = "Weak"
                else:
                    z["signal_strength"] = "Excellent"

    def tick(self) -> Dict[str, Any]:
        """
        Executes one simulation step across all 4 zones.
        Generates sensor physics, computes ML predictions, and evaluates early warnings.
        """
        self.tick_count += 1
        self.scenario_tick += 1
        timestamp = datetime.utcnow().isoformat()

        high_risk_zones = []

        for z_meta in ZONES_METADATA:
            code = z_meta["zone_code"]
            state = self.zone_states[code]
            buf = self.feature_buffers[code]
            lag_sec = z_meta["upstream_lag_minutes"]

            # Compute current sensor values based on scenario and zone lag
            cur_rain, cur_wl, cur_temp = self._step_zone_physics(code, state, z_meta)
            
            # If sensor is offline, simulate frozen reading or null
            if state["status"] == "OFFLINE":
                state["last_update"] = timestamp
                continue

            # Push to feature buffer and calculate rate of rise, rolling trends
            feats = buf.push_and_compute(cur_rain, cur_wl, cur_temp)
            
            # ML Model Inference
            inference = model_service.predict(feats)

            risk_level = inference["risk_level"]
            prob = inference["probability"]
            is_fa = inference["is_false_alarm"]

            # Multi-signal False-Alarm Safeguard:
            # If false alarm scenario is running, enforce false-alarm suppression logic
            false_alarm_msg = None
            if self.current_scenario == "false_alarm" or is_fa:
                # Rainfall is high but water level and rate of rise are safe
                if cur_rain > 65.0 and cur_wl < 2.0 and feats["rate_of_rise"] < 0.12:
                    risk_level = "LOW"
                    prob = 28.4
                    inference["risk_factors"] = [
                        "Isolated rain gauge spike detected",
                        "Water level normal and steady",
                        "Multi-signal correlation filters false warning"
                    ]
                    false_alarm_msg = "Multi-Signal Corroboration: High rain spike with low river stage. False alarm suppressed."

            # Update Zone state
            state["rainfall_intensity"] = feats["rainfall_intensity"]
            state["water_level"] = feats["water_level"]
            state["rate_of_rise"] = feats["rate_of_rise"]
            state["temperature"] = feats["temperature"]
            state["risk_level"] = risk_level
            state["probability"] = prob
            state["probabilities"] = inference["probabilities"]
            state["contributions"] = inference["contributions"]
            state["risk_factors"] = inference["risk_factors"]
            state["is_false_alarm"] = is_fa or (self.current_scenario == "false_alarm")
            state["false_alarm_message"] = false_alarm_msg
            state["recommended_action"] = self._get_recommendation(risk_level, code)
            
            # Real-time Volumetric Water Content (VWC) & Infiltration Physics
            vwc = round(min(98.5, max(28.0, 34.0 + (feats["rainfall_intensity"] * 0.48) + (feats["water_level"] * 7.2))), 1)
            state["soil_water_content_pct"] = vwc
            state["soil_moisture_depths"] = {
                "topsoil_10cm": round(min(99.0, vwc * 1.05), 1),
                "rootzone_40cm": round(min(96.0, vwc * 0.94), 1),
                "deep_100cm": round(min(92.0, vwc * 0.86), 1),
            }
            # Runoff coefficient C rises sharply when soil reaches saturation > 80%
            state["runoff_coefficient"] = round(min(0.96, max(0.14, 0.12 + (vwc / 100.0) ** 2.3 * 0.88)), 2)
            # Channel Volumetric Discharge in m3/s (Manning's open channel flow)
            state["channel_discharge_m3s"] = round(max(8.5, 33.5 * (feats["water_level"] ** 1.65)), 1)
            state["last_update"] = timestamp

            # Battery drain/signal fluctuation
            if self.tick_count % 15 == 0:
                state["battery_level"] = int(max(15, state["battery_level"] - int(np.random.choice([0, 1]))))

            if risk_level == "HIGH":
                high_risk_zones.append(state)

        # Update alerts
        self._update_alerts(high_risk_zones, timestamp)

        # Primary zone for top-level display (Zone A or Zone B)
        primary_zone = self.zone_states.get("ZONE-B") or list(self.zone_states.values())[0]
        overall_risk = "LOW"
        if any(z["risk_level"] == "HIGH" for z in self.zone_states.values()):
            overall_risk = "HIGH"
        elif any(z["risk_level"] == "MEDIUM" for z in self.zone_states.values()):
            overall_risk = "MEDIUM"

        frame = {
            "timestamp": timestamp,
            "scenario": self.current_scenario,
            "speed": self.speed,
            "is_running": self.is_running,
            "tick": self.tick_count,
            "overall_risk": overall_risk,
            "lead_time_minutes": round(self.lead_time_minutes, 1),
            "primary_zone": primary_zone,
            "zones": list(self.zone_states.values()),
            "active_alerts": self.active_alerts,
            "alerts_count": len(self.active_alerts)
        }
        self.last_frame = frame
        return frame

    def get_latest_frame(self) -> Dict[str, Any]:
        """Returns the most recent simulation frame or computes a fresh one."""
        if self.last_frame is not None:
            return self.last_frame
        return self.tick()

    def _step_zone_physics(self, code: str, state: Dict[str, Any], meta: Dict[str, Any]) -> tuple[float, float, float]:
        """
        Simulates realistic hydrological physical dynamics per scenario.
        """
        rain = state["rainfall_intensity"]
        wl = state["water_level"]
        temp = state["temperature"]
        t = self.scenario_tick

        if self.current_scenario == "normal":
            target_rain = np.random.uniform(1.0, 12.0)
            rain = 0.85 * rain + 0.15 * target_rain + np.random.normal(0, 0.4)
            rain = max(0.0, rain)

            target_wl = meta["base_water_level"] + (rain / 50.0)
            wl = 0.92 * wl + 0.08 * target_wl + np.random.normal(0, 0.01)
            wl = max(0.8, min(meta["base_water_level"] + 0.3, wl))
            temp = 23.5 + np.random.normal(0, 0.2)

        elif self.current_scenario == "heavy_rain":
            target_rain = np.random.uniform(45.0, 75.0)
            rain = 0.75 * rain + 0.25 * target_rain + np.random.normal(0, 1.5)

            # Gradual water level increase
            wl_rise = 0.02 + (rain / 2500.0)
            wl = min(3.1, wl + wl_rise + np.random.normal(0, 0.01))
            temp = 20.0 + np.random.normal(0, 0.3)

        elif self.current_scenario == "flash_flood":
            # Steep mountain cloudburst dynamic
            target_rain = min(145.0, 75.0 + t * 4.5)
            rain = 0.7 * rain + 0.3 * target_rain + np.random.normal(0, 2.0)

            # High surge rate of rise
            surge = 0.055 + (rain / 1200.0)
            wl = min(5.4, wl + surge + np.random.normal(0, 0.015))
            temp = 17.5 + np.random.normal(0, 0.3)

            # Track early warning lead time
            if self.first_warning_tick is None and wl >= 2.3:
                self.first_warning_tick = self.tick_count
            if self.first_warning_tick is not None:
                # Count down lead time realistically (from 48 down to 10 mins as water crests)
                time_elapsed_mins = (self.tick_count - self.first_warning_tick) * 2.5
                self.lead_time_minutes = max(8.0, 48.0 - time_elapsed_mins)

        elif self.current_scenario == "false_alarm":
            # Massive rain spike (e.g. 95 mm/hr) but water level remains completely stable
            rain = 92.0 + 10.0 * np.sin(t / 2.0) + np.random.normal(0, 2.0)
            wl = meta["base_water_level"] + np.random.normal(0, 0.02)
            temp = 22.0 + np.random.normal(0, 0.2)

        elif self.current_scenario == "recovery":
            # Rain drops off, river recedes
            rain = max(0.0, rain * 0.82 - 0.5)
            wl = max(meta["base_water_level"], wl - 0.045 + np.random.normal(0, 0.01))
            temp = 22.5 + np.random.normal(0, 0.2)

        elif self.current_scenario == "custom":
            p = self.custom_params
            target_rain = p.get("rainfall", 20.0)
            target_wl = p.get("water_level", 1.8)
            rain = 0.8 * rain + 0.2 * target_rain
            wl = 0.85 * wl + 0.15 * target_wl
            temp = p.get("temperature", 22.0)

        return round(float(rain), 2), round(float(wl), 3), round(float(temp), 1)

    def _get_recommendation(self, risk_level: str, zone_code: str) -> str:
        if risk_level == "HIGH":
            return (
                "CRITICAL ACTION: Activate siren, notify downstream disaster response team, "
                "issue evacuation order for riverbank settlements within 500m."
            )
        elif risk_level == "MEDIUM":
            return (
                "ADVISORY: Increase hydrological sampling rate. Notify community disaster management "
                "committee and restrict riverbed gravel mining."
            )
        else:
            return "NORMAL: River levels within standard safe monsoon thresholds. Automated monitoring active."

    def _update_alerts(self, high_risk_zones: List[Dict[str, Any]], timestamp: str):
        if not high_risk_zones:
            # Clear or expire alerts if recovery
            if self.current_scenario == "recovery" or self.current_scenario == "normal":
                self.active_alerts = []
            return

        for hz in high_risk_zones:
            exists = any(a["zone_code"] == hz["zone_code"] for a in self.active_alerts)
            if not exists:
                self.active_alerts.append({
                    "id": f"ALT-{hz['zone_code']}-{self.tick_count}",
                    "timestamp": timestamp,
                    "zone_code": hz["zone_code"],
                    "zone_name": hz["name"],
                    "risk_level": "HIGH",
                    "probability": hz["probability"],
                    "headline": f"FLASH FLOOD WARNING: {hz['name']}",
                    "reason": (
                        f"Rapid water-level surge ({hz['rate_of_rise']} m/hr) "
                        f"with intense rainfall ({hz['rainfall_intensity']} mm/hr)."
                    ),
                    "recommended_action": hz["recommended_action"],
                    "lead_time_minutes": round(self.lead_time_minutes, 1)
                })

    def ingest_hardware_reading(
        self,
        sensor_id: str,
        rainfall_intensity: float,
        water_level: float,
        temperature: float = 22.0,
        rate_of_rise: Optional[float] = None
    ) -> Dict[str, Any]:
        """Ingests live readings from hardware sensors, LoRaWAN gateways, or MQTT brokers."""
        matched_zone = "ZONE-A"
        for code, z in self.zone_states.items():
            if z.get("sensor_id") == sensor_id:
                matched_zone = code
                break

        buf = self.feature_buffers[matched_zone]
        feats = buf.push_and_compute(rainfall_intensity, water_level, temperature)
        prediction = model_service.predict(feats)

        # Update zone state with live reading
        z = self.zone_states[matched_zone]
        z["rainfall_intensity"] = round(rainfall_intensity, 2)
        z["water_level"] = round(water_level, 3)
        z["temperature"] = round(temperature, 1)
        z["rate_of_rise"] = round(rate_of_rise if rate_of_rise is not None else feats["rate_of_rise"], 3)
        z["risk_level"] = prediction["risk_level"]
        z["probability"] = prediction["probability"]
        z["probabilities"] = prediction["probabilities"]
        z["status"] = "ONLINE"
        z["last_update"] = datetime.utcnow().strftime("%H:%M:%S UTC")

        return {
            "status": "ingested",
            "sensor_id": sensor_id,
            "zone_code": matched_zone,
            "features": feats,
            "prediction": prediction
        }

simulation_engine = SimulationEngine()
