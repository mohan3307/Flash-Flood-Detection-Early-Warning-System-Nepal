import React from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { ZoneState } from '../types';
import { setScenario } from '../services/api';

interface FalseAlarmCardProps {
  primaryZone: ZoneState;
  scenario: string;
}

export const FalseAlarmCard: React.FC<FalseAlarmCardProps> = ({ primaryZone, scenario }) => {
  const isFalseAlarmScenario = scenario === 'false_alarm';

  return (
    <div
      className={`rounded-xl border p-5 transition-all reticle-box ${
        isFalseAlarmScenario
          ? 'bg-[#131b2e] border-[#10b981] shadow-lg shadow-emerald-950/40 ring-1 ring-[#10b981]/40'
          : 'bg-[#131b2e]/80 border-[#222a3d]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#10b981]/15 text-[#10b981]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
              MULTI-SIGNAL FALSE-ALARM REDUCTION
            </h3>
            <p className="text-[11px] text-[#869397] font-mono">
              Hydro-physical cross-corroboration vs single-vector thresholds
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
            isFalseAlarmScenario
              ? 'bg-[#10b981]/20 text-[#6ee7b7] border-[#10b981]/40 animate-pulse'
              : 'bg-[#171f33] text-[#869397] border-[#222a3d]'
          }`}
        >
          {isFalseAlarmScenario ? 'ACTIVE SUPPRESSION' : 'COUPLED GUARD'}
        </span>
      </div>

      <p className="text-xs text-[#869397] mb-3 leading-relaxed">
        Legacy sirens trigger false alarms during isolated rain squalls. SENSORA requires physical coupling between precipitation, river stage rise, and surge velocity to verify genuine breach threats.
      </p>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5 font-mono">
        {/* Legacy Flawed Approach */}
        <div className="p-3 rounded-lg bg-[#0b1326] border border-[#93000a]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ffb4ab] mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Legacy Single-Threshold</span>
            </div>
            <p className="text-[11px] text-[#869397] mb-2">
              Rainfall &gt; 80 mm/hr &rarr; <span className="text-[#ef4444] font-bold">FALSE SIREN!</span>
            </p>
          </div>
          <div className="text-[10px] text-[#ffb4ab]/80 bg-[#93000a]/20 p-1.5 rounded border border-[#93000a]/30">
            ⚠ Causes false evacuation, economic loss, and siren fatigue.
          </div>
        </div>

        {/* SENSORA Multi-Signal */}
        <div className="p-3 rounded-lg bg-[#0b1326] border border-[#10b981]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10b981] mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>SENSORA Coupled Engine</span>
            </div>
            <p className="text-[11px] text-[#869397] mb-2">
              Requires <strong className="text-white">Rain + Stage + Rise Velocity</strong>.
            </p>
          </div>
          <div className="text-[10px] text-[#6ee7b7]/80 bg-[#10b981]/15 p-1.5 rounded border border-[#10b981]/30">
            ✓ Filters gauge splashing, debris hits, and harmless brief squalls.
          </div>
        </div>
      </div>

      {/* Live System Assessment */}
      {isFalseAlarmScenario ? (
        <div className="p-3 rounded-lg bg-[#10b981]/10 border border-[#10b981]/40 text-[#6ee7b7] text-xs font-mono">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-white">
            <CheckCircle className="w-4 h-4 text-[#10b981]" />
            <span>False-Alarm Suppression Active</span>
          </div>
          <p className="text-[11px] text-[#dae2fd] leading-relaxed">
            Rain gauge reads <strong className="text-white">{primaryZone.rainfall_intensity.toFixed(1)} mm/hr</strong>, but river stage is stable at <strong className="text-white">{primaryZone.water_level.toFixed(2)} m</strong> with low surge (<strong className="text-white">{primaryZone.rate_of_rise} m/hr</strong>). Status: <span className="font-bold text-[#4cd7f6] uppercase">Monitoring – insufficient evidence for flood breach</span>.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0b1326] border border-[#222a3d] text-xs font-mono">
          <span className="text-[#869397] text-[11px]">
            Test multi-signal rejection live:
          </span>
          <button
            onClick={() => setScenario('false_alarm')}
            className="flex items-center gap-1.5 text-[#4cd7f6] hover:text-white font-bold cursor-pointer text-xs transition px-2.5 py-1 rounded bg-[#171f33] hover:bg-[#222a3d] border border-[#06b6d4]/30"
          >
            <span>Trigger False Alarm Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
