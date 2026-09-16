import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck, BarChart3, Clock, Radio, RadioReceiver, BellRing } from 'lucide-react';

interface HeaderProps {
  activeAlertsCount: number;
  onlineSensorsCount: number;
  totalSensorsCount: number;
  onOpenPerformance: () => void;
  scenario: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeAlertsCount,
  onlineSensorsCount,
  totalSensorsCount,
  onOpenPerformance,
  scenario
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' NPT');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-[#222a3d] bg-[#0b1326]/90 backdrop-blur-xl sticky top-0 z-50 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/40 flex items-center justify-center shadow-lg shadow-cyan-500/15 relative">
            <Radio className="w-5 h-5 text-[#4cd7f6] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] radar-dot text-[#10b981]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                SENSORA <span className="text-[#4cd7f6] font-normal text-sm">// COMMAND MATRIX</span>
              </h1>
              <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-[#171f33] text-[#4cd7f6] border border-[#06b6d4]/30">
                Himalayan Basin Telemetry
              </span>
            </div>
            <p className="text-[11px] text-[#bcc9cd] font-mono">
              Sindhupalchok Catchment Node 01-04 • Melamchi-Indrawati Corridor
            </p>
          </div>
        </div>

        {/* Prototype Integrity Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded bg-[#171f33] border border-[#ffb95f]/30 text-[#ffb95f] text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ffb95f]" />
          <span>Integrity: Simulated ESP32 Telemetry & Hydrological GIS Feed</span>
        </div>

        {/* System Telemetry & Status Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono">
          {/* Live Status Beacon */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#131b2e] border border-[#10b981]/40 text-[#10b981]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] radar-dot text-[#10b981]" />
            <span className="font-bold tracking-wider">LIVE STREAM</span>
          </div>

          {/* Current Time Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131b2e] border border-[#222a3d] text-[#dae2fd]">
            <Clock className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span>{currentTime || '00:00:00 NPT'}</span>
          </div>

          {/* Active Nodes */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131b2e] border border-[#222a3d] text-[#dae2fd]">
            <Activity className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span className="text-[#869397]">Nodes:</span>
            <span className="font-bold text-white">
              {onlineSensorsCount}/{totalSensorsCount} Active
            </span>
          </div>

          {/* Active Alerts */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border font-medium ${
              activeAlertsCount > 0
                ? 'bg-[#93000a]/30 border-[#ef4444] text-[#ffb4ab] animate-pulse'
                : 'bg-[#131b2e] border-[#222a3d] text-[#869397]'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${activeAlertsCount > 0 ? 'text-[#ef4444]' : 'text-[#869397]'}`} />
            <span>Status:</span>
            <span className="font-bold text-white">
              {activeAlertsCount > 0 ? `${activeAlertsCount} CRITICAL ALERT` : 'NOMINAL'}
            </span>
          </div>

          {/* Model Performance Modal Trigger */}
          <button
            onClick={onOpenPerformance}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold font-mono text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer border border-[#4cd7f6]"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>ML BENCHMARKS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
