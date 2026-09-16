import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck, BarChart3, Clock, Radio, RadioReceiver, BellRing } from 'lucide-react';

interface HeaderProps {
  activeAlertsCount: number;
  onlineSensorsCount: number;
  totalSensorsCount: number;
  onOpenPerformance: () => void;
  onOpenIntegrations?: () => void;
  scenario: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeAlertsCount,
  onlineSensorsCount,
  totalSensorsCount,
  onOpenPerformance,
  onOpenIntegrations,
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
    <header className="sticky top-0 z-50 px-4 lg:px-8 py-3 glass-panel border-b border-cyan-500/20 bg-[#030712]/85 backdrop-blur-2xl shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 relative group transition-all duration-300 hover:scale-105">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 radar-dot text-emerald-400 border-2 border-[#030712]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit'] flex items-center gap-1.5">
                SENSORA <span className="text-cyan-400 font-medium text-xs sm:text-sm font-['Space_Grotesk'] tracking-widest">// COMMAND MATRIX</span>
              </h1>
              <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm">
                Himalayan Basin Telemetry
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Sindhupalchok Catchment Nodes 01-04 • Melamchi-Indrawati Corridor
            </p>
          </div>
        </div>

        {/* System Telemetry & Status Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Live Status Beacon */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-950/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 radar-dot" />
            <span className="font-extrabold tracking-wider text-[11px]">LIVE STREAM</span>
          </div>

          {/* Current Time Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-200 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{currentTime || '00:00:00 NPT'}</span>
          </div>

          {/* Active Nodes */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-200">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Nodes:</span>
            <span className="font-bold text-white">
              {onlineSensorsCount}/{totalSensorsCount} Active
            </span>
          </div>

          {/* Active Alerts */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold transition-all ${
              activeAlertsCount > 0
                ? 'glass-card-danger text-red-200 animate-pulse'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${activeAlertsCount > 0 ? 'text-red-400' : 'text-slate-400'}`} />
            <span>Status:</span>
            <span className="font-extrabold">
              {activeAlertsCount > 0 ? `${activeAlertsCount} CRITICAL ALERT` : 'NOMINAL'}
            </span>
          </div>

          {/* API Integrations Modal Trigger */}
          <button
            onClick={onOpenIntegrations}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-bold font-mono text-xs border border-cyan-500/40 transition-all cursor-pointer shadow-md hover:shadow-cyan-500/20 active:scale-95"
            title="Manage Twilio, LoRaWAN, MQTT, Google Maps, OpenWeather, and Gemini AI Integrations"
          >
            <RadioReceiver className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXTERNAL APIS (8)</span>
          </button>

          {/* Model Performance Modal Trigger */}
          <button
            onClick={onOpenPerformance}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold font-mono text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer border border-cyan-300 hover:scale-105 active:scale-95"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>ML BENCHMARKS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
