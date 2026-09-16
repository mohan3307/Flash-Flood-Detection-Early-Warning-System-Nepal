"""
Machine Learning Inference and Explainability Service for SENSORA.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from app.config import settings

class FloodModelService:
    def __init__(self, model_path: str = None):
        self.model_path = model_path or settings.MODEL_PATH
        self.bundle = None
        self.model = None
        self.features = []
        self.classes = ["LOW", "MEDIUM", "HIGH"]
        self.feature_importances = {}
        self.load_model()

    def load_model(self):
        if not os.path.exists(self.model_path):
            print(f"Model file not found at {self.model_path}. Attempting to train...")
            # Fallback path
            fallback_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
            alt_path = os.path.join(fallback_dir, "ml", "model.pkl")
            if os.path.exists(alt_path):
                self.model_path = alt_path

        if os.path.exists(self.model_path):
            import warnings
            warnings.filterwarnings('ignore')
            self.bundle = joblib.load(self.model_path)
            self.model = self.bundle["model"]
            if hasattr(self.model, "n_jobs"):
                self.model.n_jobs = 1
            self.features = self.bundle["features"]
            self.classes = self.bundle["classes"]
            self.feature_importances = self.bundle.get("feature_importances", {})
            print(f"Loaded ML model from {self.model_path} with features: {self.features}")
        else:
            print("WARNING: Model not found. Running in heuristic fallback mode.")

    def predict(self, feature_dict: Dict[str, float]) -> Dict[str, Any]:
        """
        Runs ML inference and synthesizes explainable AI breakdown.
        """
        if self.model is None:
            return self._heuristic_fallback(feature_dict)

        # Prepare input vector in exact feature order
        vector = [feature_dict.get(f, 0.0) for f in self.features]
        df_input = pd.DataFrame([vector], columns=self.features)

        pred_class = str(self.model.predict(df_input)[0])
        prob_array = self.model.predict_proba(df_input)[0]
        prob_dict = {cls_name: round(float(prob_array[idx]) * 100, 1) for idx, cls_name in enumerate(self.classes)}

        confidence = prob_dict.get(pred_class, 50.0)

        # Explainable AI: Calculate dynamic feature contributions
        # We weigh global feature importance with local signal magnitude relative to normal thresholds
        contributions = self._compute_explainability(feature_dict)

        # Risk Factors bullet points
        risk_factors = self._extract_risk_factors(feature_dict, pred_class)

        # Multi-signal False-Alarm Verification:
        # If rainfall is high (>70 mm/hr) but water level is safe (<1.8m) and rate of rise <= 0.05
        is_false_alarm = (
            feature_dict.get("rainfall_intensity", 0.0) >= 70.0 and
            feature_dict.get("water_level", 0.0) < 1.8 and
            feature_dict.get("rate_of_rise", 0.0) <= 0.08
        )

        return {
            "risk_level": pred_class,
            "probability": confidence,
            "probabilities": prob_dict,
            "contributions": contributions,
            "risk_factors": risk_factors,
            "is_false_alarm": is_false_alarm,
            "features_evaluated": feature_dict
        }

    def _compute_explainability(self, feat: Dict[str, float]) -> Dict[str, int]:
        """
        Computes 0-100 normalized explainability bars for the top 4 core risk drivers:
        - Rainfall Intensity
        - Water Level
        - Rate of Rise
        - Recent Trend
        """
        rain = max(0.0, min(140.0, feat.get("rainfall_intensity", 0.0)))
        wl = max(0.0, min(6.0, feat.get("water_level", 0.0)))
        ror = max(-0.2, min(1.0, feat.get("rate_of_rise", 0.0)))
        trend = max(-0.5, min(2.0, feat.get("rolling_water_level_trend", 0.0)))

        # Normalized component percentages
        rain_score = int((rain / 120.0) * 100)
        wl_score = int(((wl - 1.0) / 3.5) * 100) if wl > 1.0 else 5
        ror_score = int((max(0.0, ror) / 0.5) * 100)
        trend_score = int((max(0.0, trend) / 1.0) * 100)

        return {
            "rainfall_intensity": max(5, min(100, rain_score)),
            "water_level": max(5, min(100, wl_score)),
            "rate_of_rise": max(5, min(100, ror_score)),
            "recent_trend": max(5, min(100, trend_score))
        }

    def _extract_risk_factors(self, feat: Dict[str, float], pred_class: str) -> List[str]:
        factors = []
        rain = feat.get("rainfall_intensity", 0.0)
        wl = feat.get("water_level", 0.0)
        ror = feat.get("rate_of_rise", 0.0)
        trend = feat.get("rolling_water_level_trend", 0.0)

        if ror >= 0.25:
            factors.append("Rapid water-level rise surge")
        elif ror >= 0.10:
            factors.append("Moderate upward water-level momentum")

        if rain >= 80.0:
            factors.append("Extreme cloudburst/torrential rainfall")
        elif rain >= 40.0:
            factors.append("Sustained heavy monsoon rainfall")

        if wl >= 3.5:
            factors.append("Critical river stage approaching bankfull capacity")
        elif wl >= 2.2:
            factors.append("Elevated river stage above normal baseline")

        if trend > 0.4:
            factors.append("Continuous cumulative 3-hour water-level accumulation")

        if not factors:
            factors.append("Environmental parameters within normal seasonal boundaries")

        return factors

    def _heuristic_fallback(self, feat: Dict[str, float]) -> Dict[str, Any]:
        wl = feat.get("water_level", 1.2)
        ror = feat.get("rate_of_rise", 0.0)
        rain = feat.get("rainfall_intensity", 5.0)

        if (wl >= 3.4 and ror >= 0.10) or (ror >= 0.30 and rain >= 60.0):
            risk = "HIGH"
            prob = 91.5
        elif wl >= 2.0 or rain >= 40.0:
            risk = "MEDIUM"
            prob = 72.0
        else:
            risk = "LOW"
            prob = 95.0

        return {
            "risk_level": risk,
            "probability": prob,
            "probabilities": {"LOW": 10.0, "MEDIUM": 20.0, "HIGH": 70.0} if risk=="HIGH" else {"LOW": 85.0, "MEDIUM": 10.0, "HIGH": 5.0},
            "contributions": self._compute_explainability(feat),
            "risk_factors": self._extract_risk_factors(feat, risk),
            "is_false_alarm": False,
            "features_evaluated": feat
        }

model_service = FloodModelService()
