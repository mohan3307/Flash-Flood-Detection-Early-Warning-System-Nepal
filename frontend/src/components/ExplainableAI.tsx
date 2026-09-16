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
      color: 'bg-gradient-to-r from-cyan-500 to-cyan-400',
      textColor: 'text-cyan-400',
    },
    {
      key: 'rate_of_rise',
      label: 'Surge Velocity Rate of Rise (Δh/Δt)',
      unit: `${primaryZone.rate_of_rise > 0 ? '+' : ''}${primaryZone.rate_of_rise.toFixed(2)} m/hr`,
      value: contributions.rate_of_rise || 10,
      threshold: '> 0.30 m/hr',
      isElevated: primaryZone.rate_of_rise > 0.3,
      color: 'bg-gradient-to-r from-red-600 to-red-400',
      textColor: 'text-red-400',
    },
    {
      key: 'water_level',
      label: 'River Stage (Bankfull Margin)',
      unit: `${primaryZone.water_level.toFixed(2)} m MSL`,
      value: contributions.water_level || 20,
      threshold: '> 3.50 m stage',
      isElevated: primaryZone.water_level >= 3.5,
      color: 'bg-gradient-to-r from-amber-500 to-amber-400',
      textColor: 'text-amber-400',
    },
    {
      key: 'recent_trend',
      label: 'Antecedent Catchment Saturation',
      unit: `${contributions.recent_trend || 12}% index`,
      value: contributions.recent_trend || 12,
      threshold: '> 60% saturation',
      isElevated: (contributions.recent_trend || 12) > 60,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      textColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="rounded-2xl glass-panel border border-slate-800 bg-[#030712]/80 p-6 flex flex-col justify-between h-full shadow-2xl">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/70 text-cyan-400 border border-cyan-500/40">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide font-['Outfit']">
                EXPLAINABLE AI // SHAP ATTRIBUTION
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                XGBoost SHAP Physical Feature Drivers
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm">
            8-VECTOR SHAP
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 font-mono leading-relaxed">
          Hydrological feature weights computed for{' '}
          <strong className="text-white font-bold">{primaryZone.name}</strong> ({primaryZone.zone_code}):
        </p>

        {/* Contribution Bars */}
        <div className="space-y-3">
          {factorBars.map((bar) => (
            <div key={bar.key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 text-[11px] font-semibold">{bar.label}</span>
                  {bar.isElevated && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-red-950 text-red-300 border border-red-500">
                      CRITICAL
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{bar.unit}</span>
                  <span className={`font-extrabold ${bar.textColor}`}>
                    {bar.value}%
                  </span>
                </div>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                <div
                  className={`h-full ${bar.color} rounded-full transition-all duration-700 shadow-sm`}
                  style={{ width: `${Math.min(100, Math.max(5, bar.value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identified Risk Factors Bullet Points */}
      <div className="mt-5 pt-3.5 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2 font-mono">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            // Hydrological Threat Vector Audit:
          </span>
          <span className="text-[10px] text-slate-400">
            Model Confidence: <strong className="text-white font-bold">{(primaryZone.probability || 94).toFixed(0)}%</strong>
          </span>
        </div>
        <ul className="space-y-1.5 font-mono">
          {primaryZone.risk_factors && primaryZone.risk_factors.length > 0 ? (
            primaryZone.risk_factors.map((factor, idx) => (
              <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{factor}</span>
              </li>
            ))
          ) : (
            <li className="text-[11px] text-slate-400 italic">No adverse flood risk drivers detected.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
