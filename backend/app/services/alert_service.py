"""
Alert Service and SOP Recommendation Engine for SENSORA.
"""

from typing import Dict, Any, List
from datetime import datetime

class AlertService:
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
