"""
Hydrological zone definitions for SENSORA.
Modeled on the high-risk Melamchi/Indrawati Himalayan river catchment in Sindhupalchok, Nepal.
"""

from typing import List, Dict, Any

ZONES_METADATA: List[Dict[str, Any]] = [
    {
        "zone_code": "ZONE-A",
        "name": "Zone A - Mountain River Catchment",
        "subtext": "Melamchi Upper Gorge",
        "latitude": 27.9712,
        "longitude": 85.5784,
        "elevation_m": 2480,
        "sensor_id": "SNSR-NP-001",
        "sensor_name": "Melamchi Upper Gorge Station",
        "slope_gradient": "Very Steep (18%)",
        "vulnerability": "High erosion and flash flood source",
        "upstream_lag_minutes": 0,
        "base_water_level": 1.2,
        "bankfull_threshold": 3.4
    },
    {
        "zone_code": "ZONE-B",
        "name": "Zone B - Downstream Village",
        "subtext": "Melamchi Pul Bazaar Settlement",
        "latitude": 27.8329,
        "longitude": 85.5818,
        "elevation_m": 870,
        "sensor_id": "SNSR-NP-002",
        "sensor_name": "Pul Bazaar Riverbank Station",
        "slope_gradient": "Moderate (6%)",
        "vulnerability": "High density population and commercial hub",
        "upstream_lag_minutes": 25,
        "base_water_level": 1.4,
        "bankfull_threshold": 3.6
    },
    {
        "zone_code": "ZONE-C",
        "name": "Zone C - Low-Lying Community",
        "subtext": "Bahunepati Agricultural Plain",
        "latitude": 27.7654,
        "longitude": 85.5942,
        "elevation_m": 720,
        "sensor_id": "SNSR-NP-003",
        "sensor_name": "Bahunepati Floodplain Station",
        "slope_gradient": "Low (2%)",
        "vulnerability": "Agricultural inundation and schools",
        "upstream_lag_minutes": 45,
        "base_water_level": 1.3,
        "bankfull_threshold": 3.2
    },
    {
        "zone_code": "ZONE-D",
        "name": "Zone D - River Junction",
        "subtext": "Indrawati-Melamchi Confluence",
        "latitude": 27.7121,
        "longitude": 85.6025,
        "elevation_m": 640,
        "sensor_id": "SNSR-NP-004",
        "sensor_name": "Indrawati Confluence Gateway",
        "slope_gradient": "Gentle (1.5%)",
        "vulnerability": "Backwater surge and structural bridge risk",
        "upstream_lag_minutes": 60,
        "base_water_level": 1.5,
        "bankfull_threshold": 3.8
    }
]
