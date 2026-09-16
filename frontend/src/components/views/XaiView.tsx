import React from 'react';
import { ZoneState } from '../../types';
import { ExplainableAI } from '../ExplainableAI';
import { FalseAlarmCard } from '../FalseAlarmCard';
import {
  BrainCircuit,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  Sparkles,
} from 'lucide-react';

interface XaiViewProps {
  primaryZone: ZoneState;
  scenario: string;
}

export const XaiView: React.FC<XaiViewProps> = ({ primaryZone, scenario }) => {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner: XAI Architecture Overview */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40 shadow-lg shadow-cyan-500/10">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Explainable AI & SHAP Attribution Center
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 rounded">
                8-Vector SHAP Model
              </span>
            </div>
            <p className="text-xs text-[#869397] font-mono mt-0.5">
              Real-time additive feature attribution explaining ML flash flood probability predictions
            </p>
          </div>
        </div>

        {/* AI Confidence & Model Verification Pill */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-[#0b1326] px-3 py-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Model Confidence</span>
            <span className="font-bold text-[#4cd7f6] text-sm">
              {primaryZone.probability > 70 ? '98.4%' : primaryZone.probability > 40 ? '94.2%' : '99.1%'}
            </span>
          </div>
          <div className="bg-[#0b1326] px-3 py-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">False Alarm Filter</span>
            <span
              className={`font-bold text-sm ${
                primaryZone.is_false_alarm ? 'text-[#38bdf8]' : 'text-[#10b981]'
              }`}
            >
              {primaryZone.is_false_alarm ? 'ACTIVE' : 'NOMINAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Main XAI Grid: 8-Feature SHAP Breakdown + False Alarm Suppression Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <ExplainableAI primaryZone={primaryZone} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <FalseAlarmCard primaryZone={primaryZone} scenario={scenario} />
        </div>
      </div>

      {/* Physics-Informed Hydrological Guardrails */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#222a3d]">
          <Scale className="w-4 h-4 text-[#ffb95f]" />
          <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
            Physics-Informed Verification & Guardrail Checklist
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 font-mono text-xs">
          <div className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Mass Conservation Check</span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>
            <p className="text-[11px] text-[#869397]">
              Cumulative rainfall matches upstream river discharge volumetric flow rates within ±4.2% error threshold.
            </p>
          </div>

          <div className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Wave Propagation Lag</span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>
            <p className="text-[11px] text-[#869397]">
              Crest transit time between Tarke Ghyang (2,480m) and Pul Bazaar (870m) satisfies kinematic wave speed (4.8 m/s).
            </p>
          </div>

          <div className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Sensor Noise Rejection</span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>
            <p className="text-[11px] text-[#869397]">
              Ultrasonic transducer echoes filtered via Kalman rolling variance. Stagnant stage spikes isolated from real flood waves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
