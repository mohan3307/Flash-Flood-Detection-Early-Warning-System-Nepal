import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { ZoneState } from '../types';

interface ExplainableAIProps {
  primaryZone: ZoneState;
}

export const ExplainableAI: React.FC<ExplainableAIProps> = ({ primaryZone }) => {
  const contributions = primaryZone.contributions || {
    rainfall_intensity: 15,
    water_level: 20,
    rate_of_rise: 10,
    recent_trend: 12
  };

  const factorBars = [
    {
      key: 'rainfall_intensity',
      label: 'Precipitation Intensity (Helambu)',
      value: contributions.rainfall_intensity,
      color: 'bg-[#4cd7f6]',
      textColor: 'text-[#4cd7f6]'
    },
    {
      key: 'rate_of_rise',
      label: 'Rate of Rise Surge Velocity',
      value: contributions.rate_of_rise,
      color: 'bg-[#ef4444]',
      textColor: 'text-[#ffb4ab]'
    },
    {
      key: 'water_level',
      label: 'River Stage (Bankfull Proximity)',
      value: contributions.water_level,
      color: 'bg-[#ffb95f]',
      textColor: 'text-[#ffb95f]'
    },
    {
      key: 'recent_trend',
      label: '3-Hour Catchment Soil Saturation',
      value: contributions.recent_trend,
      color: 'bg-[#acedff]',
      textColor: 'text-[#acedff]'
    }
  ];

  return (
    <div className="rounded-xl bg-[#131b2e]/80 border border-[#222a3d] p-5 flex flex-col justify-between reticle-box">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6]">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
              EXPLAINABLE AI // FEATURE ATTRIBUTION MATRIX
            </h3>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#171f33] text-[#4cd7f6] border border-[#06b6d4]/30">
            XGBoost Tree SHAP
          </span>
        </div>

        <p className="text-xs text-[#869397] mb-3.5">
          Real-time physical factor attribution weights computed by the ML ensemble for{' '}
          <strong className="text-white font-mono">{primaryZone.zone_code}</strong>:
        </p>

        {/* Contribution Bars */}
        <div className="space-y-2.5">
          {factorBars.map((bar) => (
            <div key={bar.key}>
              <div className="flex justify-between items-center text-xs mb-1 font-mono">
                <span className="text-[#dae2fd] text-[11px]">{bar.label}</span>
                <span className={`font-semibold ${bar.textColor}`}>
                  {bar.value}%
                </span>
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
        <span className="text-[10px] uppercase font-mono font-bold text-[#4cd7f6] tracking-wider block mb-1.5">
          // Hydrological Driver Audit:
        </span>
        <ul className="space-y-1 font-mono">
          {primaryZone.risk_factors && primaryZone.risk_factors.length > 0 ? (
            primaryZone.risk_factors.map((factor, idx) => (
              <li key={idx} className="flex items-center gap-2 text-[11px] text-[#dae2fd]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] shrink-0" />
                <span>{factor}</span>
              </li>
            ))
          ) : (
            <li className="text-[11px] text-[#869397] italic">No adverse risk drivers detected.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
