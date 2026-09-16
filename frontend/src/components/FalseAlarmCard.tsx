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
    <div className={`rounded-xl border p-4 transition-all reticle-box ${
      isFalseAlarmScenario
        ? 'bg-[#131b2e] border-[#10b981] shadow-lg shadow-emerald-950/40 ring-1 ring-[#10b981]/40'
        : 'bg-[#131b2e]/80 border-[#222a3d]'
    }`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#10b981]/15 text-[#10b981]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
            MULTI-SIGNAL FALSE-ALARM REDUCTION
          </h3>
        </div>
        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
          isFalseAlarmScenario
            ? 'bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/40 animate-pulse'
            : 'bg-[#171f33] text-[#869397]'
        }`}>
          {isFalseAlarmScenario ? 'ACTIVE SUPPRESSION' : 'COUPLED GUARD'}
        </span>
      </div>

      <p className="text-xs text-[#869397] mb-3">
        Legacy single-threshold warning systems cause panic by triggering sirens on rain squalls alone.
        SENSORA enforces hydrological coupling between precipitation, river stage, and surge velocity.
      </p>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3 font-mono">
        {/* Legacy Flawed Approach */}
        <div className="p-3 rounded-lg bg-[#0b1326] border border-[#93000a]/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ffb4ab] mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Legacy Single Threshold</span>
          </div>
          <p className="text-[11px] text-[#869397] mb-1.5">
            Rainfall &gt; 80 mm/hr &rarr; <span className="text-[#ef4444] font-bold">FALSE EMERGENCY SIREN!</span>
          </p>
          <div className="text-[10px] text-[#ffb4ab]/80 bg-[#93000a]/20 p-1.5 rounded border border-[#93000a]/30">
            ⚠ Causes false evacuation, community panic, and alarm fatigue.
          </div>
        </div>

        {/* SENSORA Multi-Signal */}
        <div className="p-3 rounded-lg bg-[#0b1326] border border-[#10b981]/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10b981] mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>SENSORA Coupled Engine</span>
          </div>
          <p className="text-[11px] text-[#869397] mb-1.5">
            Requires <strong className="text-white">Rain + Stage + Rise Velocity</strong>.
          </p>
          <div className="text-[10px] text-[#6ee7b7]/80 bg-[#10b981]/15 p-1.5 rounded border border-[#10b981]/30">
            ✓ Filters gauge debris, splashing, and isolated harmless squalls.
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
            Rain gauge reads <strong className="text-white">{primaryZone.rainfall_intensity.toFixed(1)} mm/hr</strong>, but river stage is stable at <strong className="text-white">{primaryZone.water_level.toFixed(2)} m</strong> with low surge (<strong className="text-white">{primaryZone.rate_of_rise} m/hr</strong>). Status: <span className="font-bold text-[#4cd7f6] uppercase">Monitoring – insufficient evidence for high flood risk</span>.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b1326] border border-[#222a3d] text-xs">
          <span className="text-[#869397] text-[11px] font-mono">
            Test multi-signal rejection live:
          </span>
          <button
            onClick={() => setScenario('false_alarm')}
            className="flex items-center gap-1 text-[#4cd7f6] hover:text-white font-mono font-bold cursor-pointer text-xs transition"
          >
            <span>Trigger False Alarm Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
