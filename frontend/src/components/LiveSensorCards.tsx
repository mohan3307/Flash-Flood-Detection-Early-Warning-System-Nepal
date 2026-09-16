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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Rainfall Card */}
      <div className={`p-4 rounded-xl border transition-all ${
        isRainHigh ? 'bg-[#0f172a] border-[#06b6d4] shadow-lg shadow-cyan-950/40 ring-1 ring-[#4cd7f6]/40' : 'bg-[#131b2e]/80 border-[#222a3d]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-semibold text-[#869397] uppercase tracking-wider">
            Precipitation
          </span>
          <div className="p-1.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6]">
            <CloudRain className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {primaryZone.rainfall_intensity.toFixed(1)}
          </span>
          <span className="text-xs text-[#869397] font-mono">mm/hr</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#222a3d]">
          <span className="text-[#869397]">Optical Sensor</span>
          <span className={`px-1.5 py-0.5 rounded font-semibold ${
            primaryZone.rainfall_intensity > 80 ? 'bg-[#93000a] text-[#ffb4ab]' :
            primaryZone.rainfall_intensity > 35 ? 'bg-[#e79400]/30 text-[#ffb95f]' : 'bg-[#171f33] text-[#dae2fd]'
          }`}>
            {primaryZone.rainfall_intensity > 80 ? 'CLOUDBURST' : primaryZone.rainfall_intensity > 35 ? 'HEAVY' : 'NORMAL'}
          </span>
        </div>
      </div>

      {/* Water Level Card */}
      <div className={`p-4 rounded-xl border transition-all ${
        isWaterHigh ? 'bg-[#0f172a] border-[#ef4444] shadow-lg shadow-red-950/40 ring-1 ring-[#ef4444]/40' : 'bg-[#131b2e]/80 border-[#222a3d]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-semibold text-[#869397] uppercase tracking-wider">
            River Stage
          </span>
          <div className="p-1.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6]">
            <Waves className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {primaryZone.water_level.toFixed(2)}
          </span>
          <span className="text-xs text-[#869397] font-mono">meters</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#222a3d]">
          <span className="text-[#869397]">Radar Hydro-gauge</span>
          <span className={`px-1.5 py-0.5 rounded font-semibold ${
            primaryZone.water_level > 3.4 ? 'bg-[#93000a] text-[#ffb4ab]' :
            primaryZone.water_level > 2.0 ? 'bg-[#e79400]/30 text-[#ffb95f]' : 'bg-[#171f33] text-[#dae2fd]'
          }`}>
            {primaryZone.water_level > 3.4 ? 'BANKFULL' : primaryZone.water_level > 2.0 ? 'ELEVATED' : 'SAFE'}
          </span>
        </div>
      </div>

      {/* Rate of Rise Card */}
      <div className={`p-4 rounded-xl border transition-all ${
        isRiseHigh ? 'bg-[#0f172a] border-[#ef4444] shadow-lg shadow-red-950/40 ring-1 ring-[#ef4444]/40' : 'bg-[#131b2e]/80 border-[#222a3d]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-semibold text-[#869397] uppercase tracking-wider">
            Surge Velocity
          </span>
          <div className="p-1.5 rounded bg-[#ef4444]/10 text-[#ef4444]">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {primaryZone.rate_of_rise > 0 ? `+${primaryZone.rate_of_rise.toFixed(2)}` : primaryZone.rate_of_rise.toFixed(2)}
          </span>
          <span className="text-xs text-[#869397] font-mono">m/hr</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#222a3d]">
          <span className="text-[#869397]">Rise Momentum</span>
          <span className={`px-1.5 py-0.5 rounded font-semibold ${
            primaryZone.rate_of_rise > 0.30 ? 'bg-[#93000a] text-[#ffb4ab] animate-pulse' :
            primaryZone.rate_of_rise > 0.10 ? 'bg-[#e79400]/30 text-[#ffb95f]' : 'bg-[#171f33] text-[#dae2fd]'
          }`}>
            {primaryZone.rate_of_rise > 0.30 ? 'CRITICAL SURGE' : primaryZone.rate_of_rise > 0.10 ? 'RISING' : 'STABLE'}
          </span>
        </div>
      </div>

      {/* Temperature Card */}
      <div className="p-4 rounded-xl bg-[#131b2e]/80 border border-[#222a3d]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-semibold text-[#869397] uppercase tracking-wider">
            Atmosphere
          </span>
          <div className="p-1.5 rounded bg-[#ffb95f]/10 text-[#ffb95f]">
            <Thermometer className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {primaryZone.temperature.toFixed(1)}
          </span>
          <span className="text-xs text-[#869397] font-mono">°C</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#222a3d]">
          <span className="text-[#869397]">Himalayan Basin</span>
          <span className="px-1.5 py-0.5 rounded bg-[#171f33] text-[#dae2fd] font-semibold">
            SYNOPTIC
          </span>
        </div>
      </div>

      {/* Sensor Status Card */}
      <div className="col-span-2 sm:col-span-2 lg:col-span-1 p-4 rounded-xl bg-[#131b2e]/80 border border-[#222a3d] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-semibold text-[#869397] uppercase tracking-wider">
            Telemetry Node
          </span>
          <div className="p-1.5 rounded bg-[#10b981]/10 text-[#10b981]">
            <Radio className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            primaryZone.status === 'ONLINE' ? 'bg-[#10b981] radar-dot text-[#10b981]' :
            primaryZone.status === 'DEGRADED' ? 'bg-[#ffb95f]' : 'bg-[#ef4444]'
          }`} />
          <span className="text-xl font-bold font-mono text-white tracking-wide">
            {primaryZone.status}
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-[#869397] pt-2 border-t border-[#222a3d]">
          <span className="flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-[#10b981]" />
            {primaryZone.battery_level}% Batt
          </span>
          <span className="flex items-center gap-1 text-[#4cd7f6]">
            <Wifi className="w-3 h-3" />
            LoRaWAN
          </span>
        </div>
      </div>
    </div>
  );
};
