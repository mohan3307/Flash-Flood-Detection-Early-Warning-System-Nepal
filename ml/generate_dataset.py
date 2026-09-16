"""
Synthetic Dataset Generator for SENSORA Flash Flood Early Warning System.

NOTE: This script generates SYNTHETIC / SIMULATED environmental data for research
and prototyping purposes. It does not represent real-world certified sensor data.
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

np.random.seed(42)

def generate_synthetic_flood_data(total_samples=12000, output_path="data/synthetic_flood_data.csv"):
    """
    Generates a realistic multi-sensor time-series dataset covering:
    - Normal seasonal baseline
    - Heavy persistent rainfall
    - Mountain flash flood surges
    - False-alarm isolated sensor spikes
    - Hydrological recession / recovery
    """
    print(f"Generating {total_samples} synthetic sensor records...")
    
    records = []
    current_time = datetime(2026, 7, 15, 0, 0, 0) # Simulated monsoon season
    
    water_level = 1.2
    rainfall = 2.0
    temp = 24.0
    
    scenarios = ["normal", "heavy_rain", "flash_flood", "false_alarm", "recovery"]
    scenario_weights = [0.45, 0.25, 0.15, 0.08, 0.07]
    
    current_scenario = "normal"
    scenario_steps_remaining = 200
    
    water_level_history = [1.2] * 10
    rainfall_history = [2.0] * 10

    for i in range(total_samples):
        current_time += timedelta(minutes=10)
        
        if scenario_steps_remaining <= 0:
            current_scenario = np.random.choice(scenarios, p=scenario_weights)
            scenario_steps_remaining = np.random.randint(50, 250)
            
        if current_scenario == "normal":
            target_rain = np.random.uniform(0.0, 12.0)
            rainfall = 0.8 * rainfall + 0.2 * target_rain + np.random.normal(0, 0.5)
            rainfall = max(0.0, rainfall)
            
            target_wl = 1.1 + (rainfall / 30.0)
            water_level = 0.9 * water_level + 0.1 * target_wl + np.random.normal(0, 0.02)
            temp = 23.0 + 3.0 * np.sin(i / 72.0) + np.random.normal(0, 0.3)
            
        elif current_scenario == "heavy_rain":
            target_rain = np.random.uniform(40.0, 75.0)
            rainfall = 0.7 * rainfall + 0.3 * target_rain + np.random.normal(0, 2.0)
            
            lagged_effect = np.mean(rainfall_history[-5:]) / 35.0
            water_level += 0.015 * lagged_effect + np.random.normal(0, 0.01)
            water_level = min(3.4, max(1.8, water_level))
            temp = 19.5 + np.random.normal(0, 0.4)
            
        elif current_scenario == "flash_flood":
            target_rain = np.random.uniform(85.0, 145.0)
            rainfall = 0.6 * rainfall + 0.4 * target_rain + np.random.normal(0, 3.5)
            
            surge_rate = 0.045 + (rainfall / 1000.0)
            water_level += surge_rate + np.random.normal(0, 0.02)
            water_level = min(6.8, max(2.5, water_level))
            temp = 17.0 + np.random.normal(0, 0.5)
            
        elif current_scenario == "false_alarm":
            rainfall = np.random.uniform(85.0, 120.0)
            water_level = np.random.uniform(1.0, 1.6)
            temp = 22.0 + np.random.normal(0, 0.5)
            
        elif current_scenario == "recovery":
            rainfall = max(0.0, rainfall * 0.85 + np.random.normal(0, 0.5))
            water_level = max(1.1, water_level - 0.04 + np.random.normal(0, 0.01))
            temp = 21.0 + np.random.normal(0, 0.3)

        scenario_steps_remaining -= 1
        
        prev_wl = water_level_history[-1]
        prev_rain = rainfall_history[-1]
        
        water_level_change = round(water_level - prev_wl, 4)
        rainfall_change = round(rainfall - prev_rain, 2)
        
        rate_of_rise = round(water_level_change * 6.0, 4)
        
        water_level_history.append(water_level)
        rainfall_history.append(rainfall)
        if len(water_level_history) > 18:
            water_level_history.pop(0)
            rainfall_history.pop(0)
            
        rolling_rainfall_3h = round(float(np.mean(rainfall_history)), 2)
        rolling_water_level_trend = round(float(water_level - water_level_history[0]), 3)
        
        if (water_level >= 3.4 and rate_of_rise >= 0.10) or \
           (rate_of_rise >= 0.32 and rainfall >= 55.0 and water_level >= 2.2) or \
           (water_level >= 4.0):
            risk_label = "HIGH"
        elif (water_level >= 2.0) or \
             (rainfall >= 40.0 and rate_of_rise > 0.08) or \
             (rolling_rainfall_3h >= 45.0) or \
             (current_scenario == "false_alarm" and rainfall > 80.0):
            if current_scenario == "false_alarm":
                risk_label = "LOW" if water_level < 1.4 else "MEDIUM"
            else:
                risk_label = "MEDIUM"
        else:
            risk_label = "LOW"

        records.append({
            "timestamp": current_time.isoformat(),
            "rainfall_intensity": round(float(rainfall), 2),
            "water_level": round(float(water_level), 3),
            "rate_of_rise": rate_of_rise,
            "rainfall_change": rainfall_change,
            "water_level_change": water_level_change,
            "rolling_rainfall_3h": rolling_rainfall_3h,
            "rolling_water_level_trend": rolling_water_level_trend,
            "temperature": round(float(temp), 1),
            "scenario": current_scenario,
            "flood_risk": risk_label
        })
        
    df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {len(df)} samples saved to {output_path}")
    print("Class distribution:")
    print(df["flood_risk"].value_counts(normalize=True).round(3))
    return df

if __name__ == "__main__":
    generate_synthetic_flood_data()
