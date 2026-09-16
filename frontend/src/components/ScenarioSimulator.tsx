import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Sliders, FastForward } from 'lucide-react';
import { setScenario, setSimulationSpeed, startSimulation, pauseSimulation, resetSimulation } from '../services/api';

interface ScenarioSimulatorProps {
  currentScenario: string;
  speed: number;
  isRunning: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  currentScenario,
  speed,
  isRunning,
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(false);
  const [customRain, setCustomRain] = useState<number>(45);
  const [customWater, setCustomWater] = useState<number>(2.2);

  const scenarios = [
    {
      id: 'normal',
      name: 'Normal Baseflow',
      desc: 'Baseflow 1.2m, rain <12mm/hr, nominal state.',
      color: 'hover:border-[#10b981]/50 hover:bg-[#10b981]/10',
      activeColor: 'bg-[#10b981]/15 border-[#10b981] text-[#10b981] ring-1 ring-[#10b981]/40',
    },
    {
      id: 'heavy_rain',
      name: 'Monsoon Downpour',
      desc: 'Sustained 55-75 mm/hr, stage climbs to Medium.',
      color: 'hover:border-[#ffb95f]/50 hover:bg-[#ffb95f]/10',
      activeColor: 'bg-[#ffb95f]/15 border-[#ffb95f] text-[#ffb95f] ring-1 ring-[#ffb95f]/40',
    },
    {
      id: 'flash_flood',
      name: 'Flash Flood Event',
      desc: 'Cloudburst >90mm/hr, surge >0.38m/hr -> High Warning.',
      color: 'hover:border-[#ef4444]/50 hover:bg-[#ef4444]/10',
      activeColor: 'bg-[#ef4444]/15 border-[#ef4444] text-[#ffb4ab] ring-1 ring-[#ef4444]/40',
    },
    {
      id: 'false_alarm',
      name: 'Sensor Glitch / Rejection',
      desc: 'Rain spike (95mm/hr) without stage rise. Alert suppressed.',
      color: 'hover:border-[#06b6d4]/50 hover:bg-[#06b6d4]/10',
      activeColor: 'bg-[#06b6d4]/15 border-[#06b6d4] text-[#4cd7f6] ring-1 ring-[#06b6d4]/40',
    },
    {
      id: 'recovery',
      name: 'Post-Flood Recession',
      desc: 'Precipitation ceases, stage returns to baseline.',
      color: 'hover:border-[#38bdf8]/50 hover:bg-[#38bdf8]/10',
      activeColor: 'bg-[#38bdf8]/15 border-[#38bdf8] text-[#38bdf8] ring-1 ring-[#38bdf8]/40',
    },
  ];

  const speeds = [1, 2, 5, 10];

  const handleSelectScenario = async (id: string) => {
    try {
      await setScenario(id);
    } catch (e) {
      console.error('Failed to set scenario:', e);
    }
  };

  const handleCustomApply = async () => {
    try {
      await setScenario('custom', { rainfall: customRain, water_level: customWater });
    } catch (e) {
      console.error('Failed to apply custom scenario:', e);
    }
  };

  return (
    <div className="rounded-xl bg-[#131b2e]/80 border border-[#222a3d] p-5 reticle-box">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6]">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
              HYDROLOGICAL SCENARIO SIMULATION CONSOLE
            </h3>
          </div>
          <p className="text-xs text-[#869397] font-mono mt-0.5">
            Inject synthetic catchment events to test multi-sensor AI decision models
          </p>
        </div>

        {/* Playback Controls & Speed Multipliers */}
        <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto font-mono text-xs">
          {/* Play / Pause */}
          <button
            onClick={() => (isRunning ? pauseSimulation() : startSimulation())}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold cursor-pointer transition ${
              isRunning
                ? 'bg-[#ffb95f] hover:bg-[#ffddb8] text-[#472a00]'
                : 'bg-[#10b981] hover:bg-[#6ee7b7] text-[#003640]'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'PAUSE' : 'RESUME'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => resetSimulation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] border border-[#222a3d] cursor-pointer transition font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center rounded bg-[#0b1326] p-1 border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] font-bold px-1.5">SPD:</span>
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setSimulationSpeed(s)}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                  speed === s
                    ? 'bg-[#06b6d4] text-[#003640]'
                    : 'text-[#869397] hover:text-[#dae2fd]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Preset Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mb-3.5 font-mono">
        {scenarios.map((sc) => {
          const isActive = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isActive
                  ? sc.activeColor
                  : `bg-[#0b1326]/70 border-[#222a3d] text-[#dae2fd] ${sc.color}`
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs font-['Space_Grotesk']">{sc.name}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse" />}
              </div>
              <p className="text-[11px] text-[#869397] leading-snug line-clamp-2">
                {sc.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Custom Scenario Sliders Toggle */}
      <div className="pt-2 border-t border-[#222a3d] font-mono">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsCustomOpen(!isCustomOpen)}
            className="text-xs text-[#4cd7f6] hover:text-white font-bold flex items-center gap-1.5 cursor-pointer transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isCustomOpen ? '[- HIDE CUSTOM SLIDERS]' : '[+ OPEN PARAMETER INJECTION SLIDERS]'}</span>
          </button>
          <span className="text-[11px] text-[#869397]">
            Active Preset: <strong className="text-white uppercase">{currentScenario}</strong>
          </span>
        </div>

        {isCustomOpen && (
          <div className="mt-3 p-3.5 rounded-lg bg-[#0b1326] border border-[#222a3d] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 text-[#dae2fd]">
                <span>Target Precipitation: <strong className="text-[#4cd7f6]">{customRain} mm/hr</strong></span>
                <span className="text-[#869397]">(0 - 150)</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={customRain}
                onChange={(e) => setCustomRain(Number(e.target.value))}
                className="w-full accent-[#06b6d4]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-[#dae2fd]">
                <span>Target River Stage: <strong className="text-[#ffb95f]">{customWater.toFixed(2)} m</strong></span>
                <span className="text-[#869397]">(0.8 - 6.0)</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="6.0"
                step="0.1"
                value={customWater}
                onChange={(e) => setCustomWater(Number(e.target.value))}
                className="w-full accent-[#ffb95f]"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleCustomApply}
                className="px-4 py-1.5 rounded bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold cursor-pointer transition shadow text-xs"
              >
                INJECT SYNTHETIC VALUES
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
