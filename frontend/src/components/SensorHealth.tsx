import React from 'react';
import { Radio, Battery, Wifi, ShieldCheck, Zap } from 'lucide-react';
import { ZoneState } from '../types';
import { updateSensorStatus } from '../services/api';

interface SensorHealthProps {
  zones: ZoneState[];
}

export const SensorHealth: React.FC<SensorHealthProps> = ({ zones }) => {
  const handleToggleStatus = async (sensorId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ONLINE' ? 'DEGRADED' : currentStatus === 'DEGRADED' ? 'OFFLINE' : 'ONLINE';
    try {
      await updateSensorStatus(sensorId, nextStatus);
    } catch (e) {
      console.error('Failed to update sensor status:', e);
    }
  };

  return (
    <div className="rounded-xl bg-[#131b2e]/80 border border-[#222a3d] p-5 reticle-box font-mono">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
              FIELD SENSOR TELEMETRY NETWORK // LORAWAN MESH
            </h3>
            <p className="text-xs text-[#869397]">
              Hardware diagnostic status for ESP32 river stage stations & optical rain gauges
            </p>
          </div>
        </div>

        <span className="text-xs bg-[#171f33] px-2.5 py-1 rounded text-[#4cd7f6] border border-[#222a3d]">
          4 Active Nodes // Gateway Uplink: 99.4%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {zones.map((zone) => {
          const isOnline = zone.status === 'ONLINE';
          const isDegraded = zone.status === 'DEGRADED';
          const isOffline = zone.status === 'OFFLINE';

          return (
            <div
              key={zone.sensor_id}
              className={`p-3.5 rounded-lg border transition-all ${
                isOffline
                  ? 'bg-[#93000a]/20 border-[#ef4444]/60'
                  : isDegraded
                  ? 'bg-[#e79400]/20 border-[#ffb95f]/60'
                  : 'bg-[#0b1326]/80 border-[#222a3d]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-[#4cd7f6]">
                  {zone.sensor_id}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                    isOnline
                      ? 'bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]/40'
                      : isDegraded
                      ? 'bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/40'
                      : 'bg-[#ef4444]/15 text-[#ffb4ab] border-[#ef4444]/40'
                  }`}
                >
                  {zone.status}
                </span>
              </div>

              <div className="text-xs text-white font-bold truncate mb-0.5 font-['Space_Grotesk']">
                {zone.name}
              </div>
              <div className="text-[10px] text-[#869397] mb-2.5 truncate">
                {zone.subtext} • {zone.elevation_m}m MSL
              </div>

              {/* Hardware diagnostics */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#dae2fd] bg-[#131b2e] p-2 rounded mb-2.5 border border-[#222a3d]">
                <div className="flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Batt: <strong>{zone.battery_level}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-[#4cd7f6]" />
                  <span>LoRa: <strong>{zone.signal_strength}</strong></span>
                </div>
              </div>

              {/* Status Simulation Action Toggle */}
              <button
                onClick={() => handleToggleStatus(zone.sensor_id, zone.status)}
                className="w-full text-center text-[10px] uppercase font-bold py-1 rounded bg-[#171f33] hover:bg-[#222a3d] text-[#869397] hover:text-white transition cursor-pointer border border-[#222a3d]"
              >
                Simulate Mode ({isOnline ? 'Active' : isDegraded ? 'Degraded' : 'Offline'})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
