import React from 'react';
import { CloudRain, Waves, Gauge, Thermometer, Radio, Wifi, BatteryCharging } from 'lucide-react';
import { ZoneState } from '../types';

interface LiveSensorCardsProps {
  primaryZone: ZoneState;
}

export const LiveSensorCards: React.FC<LiveSensorCardsProps> = ({ primaryZone }) => {
  const isRainHigh = primaryZone.rainfall_intensity > 60;
  const isWaterHigh = primaryZone.water_level > 3.2;
  const isRiseHigh = primaryZone.rate_of_rise > 0.25;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
      {/* Rainfall Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between transition-all duration-300 ${
          isRainHigh
            ? 'glass-card-cyan border-cyan-400/60 ring-1 ring-cyan-400/50'
            : 'bg-[#030712]/80 border-slate-800'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
              Precipitation
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {primaryZone.rainfall_intensity.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">mm/hr</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-slate-800">
          <span className="text-slate-400 font-medium">Optical Sensor</span>
          <span
            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              primaryZone.rainfall_intensity > 80
                ? 'bg-red-950 text-red-300 border border-red-500'
                : primaryZone.rainfall_intensity > 35
                ? 'bg-amber-950 text-amber-300 border border-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            {primaryZone.rainfall_intensity > 80 ? 'CLOUDBURST' : primaryZone.rainfall_intensity > 35 ? 'HEAVY' : 'NORMAL'}
          </span>
        </div>
      </div>

      {/* Water Level Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between transition-all duration-300 ${
          isWaterHigh
            ? 'glass-card-danger border-red-500/60 ring-1 ring-red-500/50'
            : 'bg-[#030712]/80 border-slate-800'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
              River Stage
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {primaryZone.water_level.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">meters</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-slate-800">
          <span className="text-slate-400 font-medium">Radar Hydro-gauge</span>
          <span
            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              primaryZone.water_level > 3.4
                ? 'bg-red-950 text-red-300 border border-red-500'
                : primaryZone.water_level > 2.0
                ? 'bg-amber-950 text-amber-300 border border-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            {primaryZone.water_level > 3.4 ? 'BANKFULL' : primaryZone.water_level > 2.0 ? 'ELEVATED' : 'SAFE'}
          </span>
        </div>
      </div>

      {/* Rate of Rise Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between transition-all duration-300 ${
          isRiseHigh
            ? 'glass-card-danger border-red-500/60 ring-1 ring-red-500/50'
            : 'bg-[#030712]/80 border-slate-800'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
              Surge Velocity
            </span>
            <div className="p-2 rounded-xl bg-red-950/60 text-red-400 border border-red-500/30">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {primaryZone.rate_of_rise > 0 ? `+${primaryZone.rate_of_rise.toFixed(2)}` : primaryZone.rate_of_rise.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">m/hr</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-slate-800">
          <span className="text-slate-400 font-medium">Rise Momentum</span>
          <span
            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              primaryZone.rate_of_rise > 0.3
                ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                : primaryZone.rate_of_rise > 0.1
                ? 'bg-amber-950 text-amber-300 border border-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            {primaryZone.rate_of_rise > 0.3 ? 'CRITICAL SURGE' : primaryZone.rate_of_rise > 0.1 ? 'RISING' : 'STABLE'}
          </span>
        </div>
      </div>

      {/* Temperature Card */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover bg-[#030712]/80 border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
              Atmosphere
            </span>
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/30">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {primaryZone.temperature.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">°C</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-slate-800">
          <span className="text-slate-400 font-medium">Himalayan Basin</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 font-bold text-[10px] border border-slate-700">
            SYNOPTIC
          </span>
        </div>
      </div>

      {/* Sensor Status Card */}
      <div className="col-span-2 sm:col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl glass-panel glass-panel-hover bg-[#030712]/80 border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
              Telemetry Node
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                primaryZone.status === 'ONLINE'
                  ? 'bg-emerald-400 radar-dot text-emerald-400'
                  : primaryZone.status === 'DEGRADED'
                  ? 'bg-amber-400'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-xl font-extrabold font-mono text-white tracking-wide">
              {primaryZone.status}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2.5 border-t border-slate-800 font-bold">
          <span className="flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            {primaryZone.battery_level}% Batt
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Wifi className="w-3.5 h-3.5" />
            LoRaWAN
          </span>
        </div>
      </div>
    </div>
  );
};
