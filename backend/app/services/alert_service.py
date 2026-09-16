"""
Alert Service and SOP Recommendation Engine for SENSORA.
Integrates automated Twilio emergency SMS broadcasts with cooldown deduplication.
"""

import time
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger("sensora.alerts")

class AlertService:
    def __init__(self):
        self.last_sms_dispatch_time: float = 0
        self.sms_cooldown_seconds: float = 300.0 # 5 minutes cooldown between automated SMS

    def check_and_dispatch_emergency_broadcast(
        self,
        risk_level: str,
        zone_name: str,
        headline: str,
        recommended_action: str,
        lead_time_minutes: int
    ) -> Optional[Dict[str, Any]]:
        """Automatically triggers Twilio emergency SMS when HIGH risk is reached (with cooldown)."""
        if risk_level != "HIGH":
            return None

        now = time.time()
        if (now - self.last_sms_dispatch_time) < self.sms_cooldown_seconds:
            # Cooldown active to prevent SMS spam
            return None

        self.last_sms_dispatch_time = now
        try:
            from app.services.integrations_service import integrations_service
            result = integrations_service.dispatch_twilio_sms(
                headline=headline,
                action=recommended_action,
                lead_time_minutes=lead_time_minutes,
                zone_name=zone_name
            )
            logger.info(f"Automated Twilio emergency dispatch triggered for {zone_name}: {result['status']}")
            return result
        except Exception as e:
            logger.error(f"Failed to trigger automated Twilio dispatch: {e}")
            return None

    @staticmethod
    def get_emergency_sops(risk_level: str) -> List[Dict[str, Any]]:
        if risk_level == "HIGH":
            return [
                {
                    "step": 1,
                    "target": "Downstream Communities",
                    "action": "Trigger SMS/Siren broadcast to Melamchi Pul Bazaar & Bahunepati plains.",
                    "urgency": "IMMEDIATE"
                },
                {
                    "step": 2,
                    "target": "Emergency Operations Center (DEOC)",
                    "action": "Dispatch Nepal Armed Police Force (APF) water rescue units to bridges.",
                    "urgency": "IMMEDIATE"
                },
                {
                    "step": 3,
                    "target": "Infrastructure Authorities",
                    "action": "Close vehicular access across Melamchi Bridge and low-lying arterial roads.",
                    "urgency": "WITHIN 15 MINS"
                },
                {
                    "step": 4,
                    "target": "Community Disaster Committee",
                    "action": "Move livestock and vulnerable elderly to pre-designated higher ground shelters.",
                    "urgency": "URGENT"
                }
            ]
        elif risk_level == "MEDIUM":
            return [
                {
                    "step": 1,
                    "target": "Local River Wardens",
                    "action": "Inspect river channel debris and verify gauge optical readouts.",
                    "urgency": "ACTIVE"
                },
                {
                    "step": 2,
                    "target": "Vulnerable Settlements",
                    "action": "Issue yellow standby warning; advise citizens to stay clear of riverbanks.",
                    "urgency": "ACTIVE"
                },
                {
                    "step": 3,
                    "target": "District Emergency Center",
                    "action": "Put quick-response medical and search teams on 30-minute alert standby.",
                    "urgency": "ROUTINE"
                }
            ]
        else:
            return [
                {
                    "step": 1,
                    "target": "Automated Telemetry System",
                    "action": "Routine hydrologic telemetry streaming every 1 second.",
                    "urgency": "NORMAL"
                },
                {
                    "step": 2,
                    "target": "Monitoring Personnel",
                    "action": "Check daily sensor battery levels and catchment rainfall forecasts.",
                    "urgency": "NORMAL"
                }
            ]

alert_service = AlertService()
