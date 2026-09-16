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
      bg: 'from-[#93000a]/40 via-[#171f33] to-[#0b1326]',
      border: 'border-[#ef4444]/80 shadow-[#93000a]/30',
      badge: 'bg-[#93000a]/40 text-[#ffb4ab] border-[#ef4444]/60',
      text: 'text-[#ffb4ab]',
      statusText: 'CRITICAL WARNING: MANDATORY EVACUATION',
      desc: 'Severe upstream cloudburst surge detected. River stage exceeding bankfull capacity.'
    },
    MEDIUM: {
      bg: 'from-[#e79400]/25 via-[#171f33] to-[#0b1326]',
      border: 'border-[#ffb95f]/70 shadow-[#e79400]/20',
      badge: 'bg-[#e79400]/25 text-[#ffddb8] border-[#ffb95f]/60',
      text: 'text-[#ffb95f]',
      statusText: 'SURGE ADVISORY: STANDBY PROTOCOL',
      desc: 'Steady water-level rise with sustained monsoon rainfall. Telemetry watch frequency doubled.'
    },
    LOW: {
      bg: 'from-[#10b981]/15 via-[#171f33] to-[#0b1326]',
      border: 'border-[#10b981]/50 shadow-[#10b981]/10',
      badge: 'bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]/40',
      text: 'text-[#10b981]',
      statusText: 'NOMINAL FLOW: BASELINE CONDITIONS',
      desc: 'Hydrological and meteorological parameters within seasonal safety limits.'
    }
  }[overallRisk];

  const trend = primaryZone.rate_of_rise;
  const isSurging = trend > 0.15;
  const isReceding = trend < -0.05;

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${riskColorConfig.bg} border ${riskColorConfig.border} shadow-2xl transition-all duration-500 reticle-box`}
    >
      {/* Background ambient HUD glow */}
      {isHigh && (
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#ef4444]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-[#4cd7f6]">
              // SECTOR THREAT EVALUATION
            </span>
            <span className="text-[10px] bg-[#171f33] text-[#dae2fd] px-2 py-0.5 rounded border border-[#3d494c] font-mono">
              {primaryZone.zone_code} ({primaryZone.subtext})
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold border border-[#222a3d] bg-[#0b1326]/80">
            {isSurging ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-[#ef4444]" />
                <span className="text-[#ef4444]">SURGE VELOCITY ACTIVE</span>
              </>
            ) : isReceding ? (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-[#10b981]">RECEDING STAGE</span>
              </>
            ) : (
              <>
                <Minus className="w-3.5 h-3.5 text-[#869397]" />
                <span className="text-[#869397]">STEADY BASEFLOW</span>
              </>
            )}
          </div>
        </div>

        {/* Central Risk Banner */}
        <div className="my-4 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3.5">
              <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] ${riskColorConfig.text}`}>
                {overallRisk}
              </span>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  {primaryZone.probability.toFixed(1)}%
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#869397]">
                  Ensemble ML Confidence
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold tracking-wide border ${riskColorConfig.badge}`}
              >
                {isHigh && <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />}
                {isMedium && <AlertCircle className="w-3.5 h-3.5" />}
                {isLow && <ShieldCheck className="w-3.5 h-3.5" />}
                {riskColorConfig.statusText}
              </span>
            </div>
          </div>

          {/* Warning Lead Time Counter Pod */}
          {(isHigh || isMedium) && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0b1326]/90 border border-[#06b6d4]/40 self-stretch sm:self-auto shadow-inner">
              <div className="p-2 rounded bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40">
                <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#869397] block">
                  Est. Warning Lead Time
                </span>
                <span className="text-2xl font-bold font-mono text-[#4cd7f6]">
                  ~{leadTimeMinutes} mins
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Description & Contributing Summary */}
        <div className="pt-3 border-t border-[#222a3d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <p className="text-[#dae2fd]">
            {riskColorConfig.desc}
          </p>
          <div className="text-[#869397] font-mono text-[11px] shrink-0">
            Surge Momentum: <span className="text-white font-semibold font-mono">{primaryZone.rate_of_rise > 0 ? `+${primaryZone.rate_of_rise}` : primaryZone.rate_of_rise} m/hr</span>
          </div>
        </div>
      </div>
    </div>
  );
};
