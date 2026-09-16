"""
Feature engineering utilities for real-time sensor streams in SENSORA.
"""

from collections import deque
from typing import Dict, Any, List
import numpy as np

class SensorFeatureBuffer:
    """
    Maintains a rolling historical buffer for a single sensor station
    to compute temporal derivatives, moving averages, and hydrologic trends.
    """

    def __init__(self, max_history: int = 24):
        self.max_history = max_history
        self.water_levels = deque(maxlen=max_history)
        self.rainfalls = deque(maxlen=max_history)
        self.temperatures = deque(maxlen=max_history)
        self.timestamps = deque(maxlen=max_history)

    def push_and_compute(self, rainfall: float, water_level: float, temp: float) -> Dict[str, float]:
        prev_wl = self.water_levels[-1] if self.water_levels else water_level
        prev_rain = self.rainfalls[-1] if self.rainfalls else rainfall

        self.water_levels.append(water_level)
        self.rainfalls.append(rainfall)
        self.temperatures.append(temp)

        wl_change = round(float(water_level - prev_wl), 4)
        rain_change = round(float(rainfall - prev_rain), 2)
        
        # Rate of rise: converted to meters per hour (assuming 10-min simulated step = * 6)
        rate_of_rise = round(float(wl_change * 6.0), 4)

        rolling_rain_3h = round(float(np.mean(self.rainfalls)), 2)
        rolling_wl_trend = round(float(water_level - self.water_levels[0]), 4)

        return {
            "rainfall_intensity": round(float(rainfall), 2),
            "water_level": round(float(water_level), 3),
            "rate_of_rise": rate_of_rise,
            "rainfall_change": rain_change,
            "water_level_change": wl_change,
            "rolling_rainfall_3h": rolling_rain_3h,
            "rolling_water_level_trend": rolling_wl_trend,
            "temperature": round(float(temp), 1)
        }

    def reset(self, base_wl: float = 1.2, base_rain: float = 2.0, base_temp: float = 24.0):
        self.water_levels.clear()
        self.rainfalls.clear()
        self.temperatures.clear()
        for _ in range(6):
            self.water_levels.append(base_wl)
            self.rainfalls.append(base_rain)
            self.temperatures.append(base_temp)
