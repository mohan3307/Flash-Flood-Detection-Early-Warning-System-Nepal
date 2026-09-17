"""
Hydrological zone definitions for SENSORA.
Comprehensive Nationwide Early Warning Array covering major flood-prone river basins across Nepal:
- Melamchi-Indrawati River Basin (Sindhupalchok)
- Bhotekoshi-Sunkoshi Trans-Himalayan Corridor
- Kathmandu Valley Drainage System (Bagmati & Bishnumati)
- Gandaki & Narayani Basin (Pokhara Seti & Chitwan Floodplain)
- Koshi Basin Eastern Plains (Saptakoshi Barrage)
- Karnali & Mahakali Far-Western River Delta Systems
"""

from typing import List, Dict, Any

ZONES_METADATA: List[Dict[str, Any]] = [
    # 1. Melamchi Upper Gorge (Sindhupalchok)
    {
        "zone_code": "ZONE-A",
        "name": "Zone A - Mountain River Catchment",
        "subtext": "Melamchi Upper Gorge (Helambu Sector)",
        "latitude": 27.9712,
        "longitude": 85.5784,
        "elevation_m": 2480,
        "sensor_id": "SNSR-NP-001",
        "sensor_name": "Helambu Himalayan Debris Station",
        "slope_gradient": "Very Steep (18%)",
        "vulnerability": "Glacial outburst & cloudburst debris chute",
        "upstream_lag_minutes": 0,
        "base_water_level": 1.2,
        "bankfull_threshold": 3.4
    },
    # 2. Melamchi Pul Bazaar Settlement (Sindhupalchok)
    {
        "zone_code": "ZONE-B",
        "name": "Zone B - Downstream Settlement",
        "subtext": "Melamchi Pul Bazaar Floodplain",
        "latitude": 27.8329,
        "longitude": 85.5818,
        "elevation_m": 870,
        "sensor_id": "SNSR-NP-002",
        "sensor_name": "Pul Bazaar Riverbank Hydrogauge",
        "slope_gradient": "Moderate (6%)",
        "vulnerability": "High density market and residential hub",
        "upstream_lag_minutes": 25,
        "base_water_level": 1.4,
        "bankfull_threshold": 3.6
    },
    # 3. Bahunepati Agricultural Plain (Sindhupalchok)
    {
        "zone_code": "ZONE-C",
        "name": "Zone C - Low-Lying Community",
        "subtext": "Bahunepati Agricultural Terrace",
        "latitude": 27.7654,
        "longitude": 85.5942,
        "elevation_m": 720,
        "sensor_id": "SNSR-NP-003",
        "sensor_name": "Bahunepati Floodplain Station",
        "slope_gradient": "Low (2%)",
        "vulnerability": "Agricultural inundation & health post access",
        "upstream_lag_minutes": 45,
        "base_water_level": 1.3,
        "bankfull_threshold": 3.2
    },
    # 4. Indrawati Confluence Gateway (Sindhupalchok)
    {
        "zone_code": "ZONE-D",
        "name": "Zone D - River Junction",
        "subtext": "Indrawati-Melamchi Confluence",
        "latitude": 27.7121,
        "longitude": 85.6025,
        "elevation_m": 640,
        "sensor_id": "SNSR-NP-004",
        "sensor_name": "Indrawati Confluence Array",
        "slope_gradient": "Gentle (1.5%)",
        "vulnerability": "Backwater surge and suspension bridge risk",
        "upstream_lag_minutes": 60,
        "base_water_level": 1.5,
        "bankfull_threshold": 3.8
    },
    # 5. Bhotekoshi Tatopani Hydro Node (Trans-Himalayan Border Sector)
    {
        "zone_code": "ZONE-E",
        "name": "Zone E - Trans-Himalayan Border",
        "subtext": "Tatopani Bhotekoshi Hydro Node",
        "latitude": 27.9100,
        "longitude": 85.9000,
        "elevation_m": 1450,
        "sensor_id": "SNSR-NP-005",
        "sensor_name": "Tatopani Border Torrent Sensor",
        "slope_gradient": "Extreme (22%)",
        "vulnerability": "Cross-border GLOF torrent & thermal spring corridor",
        "upstream_lag_minutes": 10,
        "base_water_level": 1.6,
        "bankfull_threshold": 4.0
    },
    # 6. Barhabise Highway Corridor (Arniko Highway Sector)
    {
        "zone_code": "ZONE-F",
        "name": "Zone F - Highway Transit Sector",
        "subtext": "Barhabise Arniko Highway Station",
        "latitude": 27.8600,
        "longitude": 85.8700,
        "elevation_m": 820,
        "sensor_id": "SNSR-NP-006",
        "sensor_name": "Barhabise Highway Hydrometer",
        "slope_gradient": "Steep (14%)",
        "vulnerability": "Commercial artery highway embankment breach",
        "upstream_lag_minutes": 20,
        "base_water_level": 1.5,
        "bankfull_threshold": 3.7
    },
    # 7. Dolalghat Sunkoshi Confluence Post (Kavre / Sindhupalchok Border)
    {
        "zone_code": "ZONE-G",
        "name": "Zone G - Major Trunk Confluence",
        "subtext": "Dolalghat Sunkoshi Junction",
        "latitude": 27.6375,
        "longitude": 85.7061,
        "elevation_m": 610,
        "sensor_id": "SNSR-NP-007",
        "sensor_name": "Dolalghat Confluence Radar",
        "slope_gradient": "Low (1.8%)",
        "vulnerability": "Multi-river basin convergence & bridge submersions",
        "upstream_lag_minutes": 55,
        "base_water_level": 1.8,
        "bankfull_threshold": 4.2
    },
    # 8. Sundarijal Shivapuri Headwaters (Kathmandu Valley Northern Catchment)
    {
        "zone_code": "ZONE-H",
        "name": "Zone H - Capital Northern Ridge",
        "subtext": "Sundarijal Shivapuri Reservoir Intake",
        "latitude": 27.8000,
        "longitude": 85.4200,
        "elevation_m": 1420,
        "sensor_id": "SNSR-NP-008",
        "sensor_name": "Sundarijal Bagmati Intake Gauge",
        "slope_gradient": "Steep (16%)",
        "vulnerability": "Water supply intake & cloudburst reservoir overflow",
        "upstream_lag_minutes": 15,
        "base_water_level": 1.1,
        "bankfull_threshold": 3.1
    },
    # 9. Balkhu Bagmati Corridor (Kathmandu Urban Core)
    {
        "zone_code": "ZONE-I",
        "name": "Zone I - Capital Urban Center",
        "subtext": "Balkhu & Bagmati Urban Corridor",
        "latitude": 27.6800,
        "longitude": 85.3100,
        "elevation_m": 1290,
        "sensor_id": "SNSR-NP-009",
        "sensor_name": "Balkhu City Riverside Transducer",
        "slope_gradient": "Flat (0.8%)",
        "vulnerability": "High density urban inundation & vegetable market floodplain",
        "upstream_lag_minutes": 35,
        "base_water_level": 1.4,
        "bankfull_threshold": 3.3
    },
    # 10. Chobar Gorge Exit (Kathmandu Valley Outlet)
    {
        "zone_code": "ZONE-J",
        "name": "Zone J - Capital Basin Exit",
        "subtext": "Chobar Gorge Outlet Station",
        "latitude": 27.6500,
        "longitude": 85.2900,
        "elevation_m": 1250,
        "sensor_id": "SNSR-NP-010",
        "sensor_name": "Chobar Narrow Gorge Hydrometer",
        "slope_gradient": "Moderate (4%)",
        "vulnerability": "Narrow rock bottleneck causing valley-wide backwater backing",
        "upstream_lag_minutes": 50,
        "base_water_level": 1.6,
        "bankfull_threshold": 3.9
    },
    # 11. Pokhara Seti River Gorge Array (Kaski District / Western Nepal)
    {
        "zone_code": "ZONE-K",
        "name": "Zone K - Western Glacial Basin",
        "subtext": "Pokhara Seti River Gorge Sector",
        "latitude": 28.2096,
        "longitude": 83.9856,
        "elevation_m": 820,
        "sensor_id": "SNSR-NP-011",
        "sensor_name": "Seti River Gorge Outburst Sensor",
        "slope_gradient": "Very Steep Vertical (25%)",
        "vulnerability": "Underground canyon outburst flood & tourist settlement",
        "upstream_lag_minutes": 20,
        "base_water_level": 1.3,
        "bankfull_threshold": 3.5
    },
    # 12. Trisuli Highway Corridor (Dhading / Prithvi Highway Sector)
    {
        "zone_code": "ZONE-L",
        "name": "Zone L - Arterial Highway Corridor",
        "subtext": "Trisuli River Landslide Sector",
        "latitude": 27.8000,
        "longitude": 84.8200,
        "elevation_m": 340,
        "sensor_id": "SNSR-NP-012",
        "sensor_name": "Trisuli Highway Debris Sensor",
        "slope_gradient": "Steep (12%)",
        "vulnerability": "Prithvi Highway lifeline blockage & rafting camps",
        "upstream_lag_minutes": 40,
        "base_water_level": 1.7,
        "bankfull_threshold": 4.1
    },
    # 13. Devghat Narayani Floodplain (Chitwan Sector / Terai Entrance)
    {
        "zone_code": "ZONE-M",
        "name": "Zone M - Central Terai Entrance",
        "subtext": "Devghat Narayani Confluence",
        "latitude": 27.7000,
        "longitude": 84.4200,
        "elevation_m": 180,
        "sensor_id": "SNSR-NP-013",
        "sensor_name": "Narayani River Delta Array",
        "slope_gradient": "Low (1.2%)",
        "vulnerability": "Religious pilgrimage ghats & agricultural floodplains",
        "upstream_lag_minutes": 70,
        "base_water_level": 2.0,
        "bankfull_threshold": 4.5
    },
    # 14. Chatara Koshi Barrage Early Warning Node (Sunsari / Saptakoshi Sector)
    {
        "zone_code": "ZONE-N",
        "name": "Zone N - Eastern Koshi Mega-Basin",
        "subtext": "Chatara Saptakoshi Barrage Intake",
        "latitude": 26.8700,
        "longitude": 87.1500,
        "elevation_m": 140,
        "sensor_id": "SNSR-NP-014",
        "sensor_name": "Saptakoshi Barrage Master Array",
        "slope_gradient": "Gentle (0.5%)",
        "vulnerability": "Massive eastern Terai embankment failure & barrage gates",
        "upstream_lag_minutes": 90,
        "base_water_level": 2.2,
        "bankfull_threshold": 5.0
    },
    # 15. Karnali Chisapani Gorge Radar (Kailali / Far-Western Nepal)
    {
        "zone_code": "ZONE-O",
        "name": "Zone O - Far-Western Karnali Basin",
        "subtext": "Chisapani Karnali Gorge Bridge",
        "latitude": 28.6400,
        "longitude": 81.2800,
        "elevation_m": 190,
        "sensor_id": "SNSR-NP-015",
        "sensor_name": "Karnali Cable Bridge Hydrogauge",
        "slope_gradient": "Low (1.0%)",
        "vulnerability": "Karnali island communities & cable bridge clearance",
        "upstream_lag_minutes": 80,
        "base_water_level": 2.1,
        "bankfull_threshold": 4.8
    },
    # 16. Mahakali Dodhara-Chandani Flood Station (Kanchanpur / Sudurpashchim Border)
    {
        "zone_code": "ZONE-P",
        "name": "Zone P - Sudurpashchim Border Sector",
        "subtext": "Dodhara-Chandani Mahakali River",
        "latitude": 28.9100,
        "longitude": 80.0800,
        "elevation_m": 175,
        "sensor_id": "SNSR-NP-016",
        "sensor_name": "Mahakali Multi-Span Bridge Station",
        "slope_gradient": "Low (0.8%)",
        "vulnerability": "Border river erosion & suspension bridge access",
        "upstream_lag_minutes": 85,
        "base_water_level": 1.9,
        "bankfull_threshold": 4.6
    },
]
