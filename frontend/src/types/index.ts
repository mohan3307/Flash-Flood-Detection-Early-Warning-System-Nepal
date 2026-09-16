export interface RiskContributions {
  rainfall_intensity: number;
  water_level: number;
  rate_of_rise: number;
  recent_trend: number;
}

export interface ZoneState {
  zone_code: string;
  name: string;
  subtext: string;
  sensor_id: string;
  sensor_name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  rainfall_intensity: number;
  water_level: number;
  rate_of_rise: number;
  temperature: number;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  battery_level: number;
  signal_strength: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  probability: number;
  probabilities: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
  contributions: RiskContributions;
  risk_factors: string[];
  is_false_alarm: boolean;
  false_alarm_message: string | null;
  recommended_action: string;
  soil_water_content_pct?: number;
  channel_discharge_m3s?: number;
  soil_moisture_depths?: {
    topsoil_10cm: number;
    rootzone_40cm: number;
    deep_100cm: number;
  };
  runoff_coefficient?: number;
  last_update: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  zone_code: string;
  zone_name: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  probability: number;
  headline: string;
  reason: string;
  recommended_action: string;
  lead_time_minutes: number;
}

export interface StreamFrame {
  timestamp: string;
  scenario: string;
  speed: number;
  is_running: boolean;
  tick: number;
  overall_risk: "LOW" | "MEDIUM" | "HIGH";
  lead_time_minutes: number;
  primary_zone: ZoneState;
  zones: ZoneState[];
  active_alerts: AlertItem[];
  alerts_count: number;
}

export interface ModelMetrics {
  prototype_disclaimer: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  false_alarm_rate: number;
  warning_lead_time: {
    average_minutes: number;
    best_minutes: number;
    min_minutes: number;
    episodes_evaluated?: number;
  };
  confusion_matrix: {
    classes: string[];
    matrix: number[][];
  };
  per_class_metrics: Record<string, {
    precision: number;
    recall: number;
    f1_score: number;
    support: number;
  }>;
  feature_importances: Record<string, number>;
  scenarios_summary: {
    total_scenarios_evaluated: number;
    correct_warnings: number;
    missed_warnings: number;
    false_warnings: number;
  };
}

export interface HistoricalReading {
  timeLabel: string;
  timestamp: string;
  rainfall: number;
  waterLevel: number;
  rateOfRise: number;
  riskProbability: number;
  riskLevel: string;
}
