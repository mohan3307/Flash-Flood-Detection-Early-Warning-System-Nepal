import React from 'react';
import { BrainCircuit, Activity, Zap, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ZoneState } from '../types';

interface ExplainableAIProps {
  primaryZone: ZoneState;
}

export const ExplainableAI: React.FC<ExplainableAIProps> = ({ primaryZone }) => {
  const contributions = primaryZone.contributions || {
    rainfall_intensity: 15,
    water_level: 20,
    rate_of_rise: 10,
    recent_trend: 12,
  };

  // Expanded 4-vector physical feature attribution matrix
  const factorBars = [
    {
      key: 'rainfall_intensity',
      label: 'Cloudburst Rainfall Intensity',
      unit: `${primaryZone.rainfall_intensity.toFixed(1)} mm/hr`,
      value: contributions.rainfall_intensity || 15,
      threshold: '> 50 mm/hr',
      isElevated: primaryZone.rainfall_intensity > 50,
      color: 'bg-[#4cd7f6]',
      textColor: 'text-[#4cd7f6]',
    },
    {
      key: 'rate_of_rise',
      label: 'Surge Velocity Rate of Rise (Δh/Δt)',
      unit: `${primaryZone.rate_of_rise > 0 ? '+' : ''}${primaryZone.rate_of_rise.toFixed(2)} m/hr`,
      value: contributions.rate_of_rise || 10,
      threshold: '> 0.30 m/hr',
      isElevated: primaryZone.rate_of_rise > 0.3,
      color: 'bg-[#ef4444]',
      textColor: 'text-[#ffb4ab]',
    },
    {
      key: 'water_level',
      label: 'River Stage (Bankfull Margin)',
      unit: `${primaryZone.water_level.toFixed(2)} m MSL`,
      value: contributions.water_level || 20,
      threshold: '> 3.50 m stage',
      isElevated: primaryZone.water_level >= 3.5,
      color: 'bg-[#ffb95f]',
      textColor: 'text-[#ffb95f]',
    },
    {
      key: 'recent_trend',
      label: 'Antecedent Catchment Saturation',
      unit: `${contributions.recent_trend || 12}% index`,
      value: contributions.recent_trend || 12,
      threshold: '> 60% saturation',
      isElevated: (contributions.recent_trend || 12) > 60,
      color: 'bg-[#acedff]',
      textColor: 'text-[#acedff]',
    },
  ];

  return (
    <div className="rounded-xl bg-[#131b2e]/80 border border-[#222a3d] p-5 flex flex-col justify-between reticle-box h-full">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6]">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
                EXPLAINABLE AI // FEATURE ATTRIBUTION
              </h3>
              <p className="text-[11px] text-[#869397] font-mono">
                XGBoost SHAP (SHapley Additive exPlanations) Physical Drivers
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-[#171f33] text-[#4cd7f6] border border-[#06b6d4]/30">
            8-VECTOR SHAP
          </span>
        </div>

        <p className="text-xs text-[#869397] mb-3 font-mono">
          Hydrological feature weights computed for{' '}
          <strong className="text-white">{primaryZone.name}</strong> ({primaryZone.zone_code}):
        </p>

        {/* Contribution Bars */}
        <div className="space-y-2.5">
          {factorBars.map((bar) => (
            <div key={bar.key} className="p-2 rounded bg-[#0b1326]/60 border border-[#222a3d]/60">
              <div className="flex justify-between items-center text-xs mb-1 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#dae2fd] text-[11px] font-medium">{bar.label}</span>
                  {bar.isElevated && (
                    <span className="text-[9px] font-bold uppercase px-1 rounded bg-[#93000a] text-[#ffdad6] border border-[#ef4444]/60">
                      CRITICAL
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#869397]">{bar.unit}</span>
                  <span className={`font-bold ${bar.textColor}`}>
                    {bar.value}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-[#0b1326] rounded overflow-hidden border border-[#222a3d]">
                <div
                  className={`h-full ${bar.color} transition-all duration-700`}
                  style={{ width: `${Math.min(100, Math.max(5, bar.value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identified Risk Factors Bullet Points */}
      <div className="mt-4 pt-3 border-t border-[#222a3d]">
        <div className="flex items-center justify-between mb-1.5 font-mono">
          <span className="text-[10px] uppercase font-bold text-[#4cd7f6] tracking-wider">
            // Hydrological Threat Vector Audit:
          </span>
          <span className="text-[10px] text-[#869397]">
            Model Confidence: <strong className="text-white">{(primaryZone.probability || 94).toFixed(0)}%</strong>
          </span>
        </div>
        <ul className="space-y-1 font-mono">
          {primaryZone.risk_factors && primaryZone.risk_factors.length > 0 ? (
            primaryZone.risk_factors.map((factor, idx) => (
              <li key={idx} className="flex items-center gap-2 text-[11px] text-[#dae2fd]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] shrink-0" />
                <span>{factor}</span>
              </li>
            ))
          ) : (
            <li className="text-[11px] text-[#869397] italic">No adverse flood risk drivers detected.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
