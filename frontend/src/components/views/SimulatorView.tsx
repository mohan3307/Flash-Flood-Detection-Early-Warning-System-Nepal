import React from 'react';
import { StreamFrame, ZoneState } from '../../types';
import { ScenarioSimulator } from '../ScenarioSimulator';
import {
  SlidersHorizontal,
  CloudRain,
  Flame,
  AlertTriangle,
  Zap,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SimulatorViewProps {
  frame: StreamFrame;
  activeZone: ZoneState;
}

const HISTORICAL_SCENARIOS = [
  {
    title: '1. Baseline Monsoon Flow (Normal)',
    desc: 'Seasonal rainfall (12-18 mm/hr) within safe river capacity (1.2m-1.8m stage). No evacuation required.',
    risk: 'LOW / NOMINAL',
    riskColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
  },
  {
    title: '2. High-Altitude Cloudburst (Langtang Ridge)',
    desc: 'Localized 95 mm/hr downpour at 2,480m elevation. Rapid catchment saturation triggering fast surge.',
    risk: 'MEDIUM / WATCH',
    riskColor: 'text-[#ffb95f] bg-[#ffb95f]/15 border-[#ffb95f]/30',
  },
  {
    title: '3. Flash Flood Surge (2021 Melamchi Type)',
    desc: 'Catastrophic debris flood surge exceeding 4.5m stage with +1.2 m/hr velocity. Instant sirens & evacuation.',
    risk: 'CRITICAL / BREACH',
    riskColor: 'text-[#ef4444] bg-[#ef4444]/15 border-[#ef4444]/40',
  },
  {
    title: '4. Glacial Lake Outburst Flood (GLOF Shock)',
    desc: 'Upstream moraine breach releasing sudden surge crest with zero rainfall upstream. Pure hydraulic shockwave.',
    risk: 'EXTREME GLOF',
    riskColor: 'text-[#ec4899] bg-[#ec4899]/15 border-[#ec4899]/40',
  },
  {
    title: '5. False Alarm Sensor Anomaly (Zero Rain Spike)',
    desc: 'Ultrasonic transducer glitch simulated with zero rainfall and dry upstream sensors. Suppressed by AI filter.',
    risk: 'FALSE ALARM SUPPRESSED',
    riskColor: 'text-[#38bdf8] bg-[#0284c7]/20 border-[#0284c7]/40',
  },
];

export const SimulatorView: React.FC<SimulatorViewProps> = ({ frame, activeZone }) => {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40 shadow-lg shadow-cyan-500/10">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Hydrological Scenario & Shockwave Simulator Lab
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#ffb95f]/15 text-[#ffb95f] border border-[#ffb95f]/40 rounded">
                Interactive Testbed
              </span>
            </div>
            <p className="text-xs text-[#869397] font-mono mt-0.5">
              Inject synthetic extreme meteorological events to benchmark ML detection latency and SOP alert sirens
            </p>
          </div>
        </div>

        {/* Current Running State Pill */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-[#0b1326] px-3 py-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Active Scenario</span>
            <span className="font-bold text-[#ffb95f] text-sm uppercase">
              {frame.scenario}
            </span>
          </div>
          <div className="bg-[#0b1326] px-3 py-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Engine Speed</span>
            <span className="font-bold text-[#4cd7f6] text-sm">{frame.speed}x</span>
          </div>
        </div>
      </div>

      {/* Main Scenario Simulator Console */}
      <ScenarioSimulator
        currentScenario={frame.scenario}
        speed={frame.speed}
        isRunning={frame.is_running}
      />

      {/* Benchmark Scenarios Catalog */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#222a3d]">
          <Layers className="w-4 h-4 text-[#4cd7f6]" />
          <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
            Standardized Disaster Response Benchmarks & Scenarios
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 font-mono text-xs">
          {HISTORICAL_SCENARIOS.map((sc, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg bg-[#0b1326] border border-[#222a3d] flex flex-col justify-between space-y-2 ${
                frame.scenario.toLowerCase().includes(sc.title.split(' ')[1].toLowerCase())
                  ? 'border-[#06b6d4] ring-1 ring-[#06b6d4]/40 bg-[#071324]'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-xs">{sc.title}</h4>
                </div>
                <p className="text-[11px] text-[#869397] mt-1 leading-relaxed">
                  {sc.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#222a3d]/60">
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold border ${sc.riskColor}`}
                >
                  {sc.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
