import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle, TrendingUp, TrendingDown, Minus, Clock, Gauge } from 'lucide-react';
import { ZoneState } from '../types';

interface RiskSummaryCardProps {
  overallRisk: "LOW" | "MEDIUM" | "HIGH";
  primaryZone: ZoneState;
  leadTimeMinutes: number;
  scenario: string;
}

export const RiskSummaryCard: React.FC<RiskSummaryCardProps> = ({
  overallRisk,
  primaryZone,
  leadTimeMinutes,
  scenario
}) => {
  const isHigh = overallRisk === 'HIGH';
  const isMedium = overallRisk === 'MEDIUM';
  const isLow = overallRisk === 'LOW';

  const riskColorConfig = {
    HIGH: {
      bg: 'glass-card-danger',
      border: 'border-red-500/70 shadow-red-950/50',
      badge: 'bg-red-950/80 text-red-200 border-red-500/80 shadow-md shadow-red-950/50',
      text: 'text-red-400',
      statusText: 'CRITICAL WARNING: MANDATORY EVACUATION',
      desc: 'Severe upstream cloudburst surge detected. River stage exceeding bankfull capacity.'
    },
    MEDIUM: {
      bg: 'glass-card-amber',
      border: 'border-amber-500/70 shadow-amber-950/50',
      badge: 'bg-amber-950/80 text-amber-200 border-amber-500/80 shadow-md shadow-amber-950/50',
      text: 'text-amber-400',
      statusText: 'SURGE ADVISORY: STANDBY PROTOCOL',
      desc: 'Steady water-level rise with sustained monsoon rainfall. Telemetry watch frequency doubled.'
    },
    LOW: {
      bg: 'glass-card-emerald',
      border: 'border-emerald-500/70 shadow-emerald-950/50',
      badge: 'bg-emerald-950/80 text-emerald-200 border-emerald-500/80 shadow-md shadow-emerald-950/50',
      text: 'text-emerald-400',
      statusText: 'NOMINAL FLOW: BASELINE CONDITIONS',
      desc: 'Hydrological and meteorological parameters within seasonal safety limits.'
    }
  }[overallRisk];

  const trend = primaryZone.rate_of_rise;
  const isSurging = trend > 0.15;
  const isReceding = trend < -0.05;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 ${riskColorConfig.bg} border ${riskColorConfig.border} shadow-2xl transition-all duration-500 h-full flex flex-col justify-between`}
    >
      {/* Background ambient HUD glow */}
      {isHigh && (
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] uppercase font-mono font-extrabold tracking-widest text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              // SECTOR THREAT EVALUATION
            </span>
            <span className="text-[10px] bg-slate-900/90 text-slate-200 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono font-bold">
              {primaryZone.zone_code} ({primaryZone.subtext})
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border border-slate-700/80 bg-slate-900/80 shadow-inner">
            {isSurging ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                <span className="text-red-400 font-extrabold">SURGE VELOCITY ACTIVE</span>
              </>
            ) : isReceding ? (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">RECEDING STAGE</span>
              </>
            ) : (
              <>
                <Minus className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">STEADY BASEFLOW</span>
              </>
            )}
          </div>
        </div>

        {/* Central Risk Banner */}
        <div className="my-2 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-4">
              <span className={`text-4xl sm:text-5xl font-black tracking-tight font-['Outfit'] ${riskColorConfig.text}`}>
                {overallRisk}
              </span>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  {primaryZone.probability.toFixed(1)}%
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Ensemble ML Confidence
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wide border ${riskColorConfig.badge}`}
              >
                {isHigh && <AlertTriangle className="w-4 h-4 animate-bounce" />}
                {isMedium && <AlertCircle className="w-4 h-4" />}
                {isLow && <ShieldCheck className="w-4 h-4" />}
                {riskColorConfig.statusText}
              </span>
            </div>
          </div>

          {/* Warning Lead Time Counter Pod */}
          {(isHigh || isMedium) && (
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 self-stretch sm:self-auto shadow-xl">
              <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
                  Est. Warning Lead Time
                </span>
                <span className="text-2xl font-extrabold font-mono text-cyan-400">
                  ~{leadTimeMinutes} mins
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Description & Contributing Summary */}
        <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-sans">
          <p className="text-slate-200 font-medium leading-relaxed">
            {riskColorConfig.desc}
          </p>
          <div className="text-slate-400 font-mono text-[11px] shrink-0 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            Surge Momentum: <span className="text-white font-extrabold font-mono">{primaryZone.rate_of_rise > 0 ? `+${primaryZone.rate_of_rise}` : primaryZone.rate_of_rise} m/hr</span>
          </div>
        </div>
      </div>
    </div>
  );
};
