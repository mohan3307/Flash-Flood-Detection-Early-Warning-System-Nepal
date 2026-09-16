import React from 'react';
import { ZoneState } from '../../types';
import { SensorHealth } from '../SensorHealth';
import {
  Radio,
  Wifi,
  BatteryCharging,
  Sun,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Server,
  Zap,
  Camera,
  Layers,
  MapPin,
} from 'lucide-react';

interface SensorNodesViewProps {
  zones: ZoneState[];
  selectedZoneCode: string;
  onSelectZone: (zoneCode: string) => void;
}

const HARDWARE_COMPONENTS = [
  {
    name: 'ESP32-S3 LoRa Edge MCU',
    spec: 'Dual-core 240MHz, SX1262 LoRa @ 868MHz',
    status: 'OPTIMAL',
    power: '3.3V Ultra-low Sleep',
    notes: 'Edge anomaly filtering & AES-128 payload encryption',
  },
  {
    name: 'MaxBotix Ultrasonic MB7389',
    spec: 'IP67 Range: 0.5m - 10.0m (1mm Resolution)',
    status: 'OPTIMAL',
    power: '4.5V Regulated',
    notes: 'Temperature-compensated water stage sounding',
  },
  {
    name: 'Davis Instruments Tipping Bucket',
    spec: '0.2mm per tip, Aerodynamic Catchment Area',
    status: 'OPTIMAL',
    power: 'Passive Reed Switch',
    notes: 'Pulse-interrupt counter with debris filter basket',
  },
  {
    name: 'Solar MPPT & LiFePO4 Cell',
    spec: '20W Mono Panel + 12.8V 6Ah LiFePO4',
    status: 'CHARGING',
    power: '13.4V / 1.8A Peak',
    notes: '72-Hour autonomy during prolonged monsoon cloudbursts',
  },
];

export const SensorNodesView: React.FC<SensorNodesViewProps> = ({
  zones,
  selectedZoneCode,
  onSelectZone,
}) => {
  const onlineCount = zones.filter((z) => z.status === 'ONLINE').length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40 shadow-lg shadow-cyan-500/10">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                LoRaWAN Sensor Array & Hardware Telemetry Hub
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 rounded">
                868 MHz LoRa Gateway Active
              </span>
            </div>
            <p className="text-xs text-[#869397] font-mono mt-0.5">
              Live hardware diagnostics, battery voltages, LoRa packet delivery ratio, and sensor noise filters
            </p>
          </div>
        </div>

        {/* Node Health Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto font-mono text-xs">
          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Active Nodes</span>
            <span className="font-bold text-[#10b981] text-sm">
              {onlineCount}/{zones.length} Online
            </span>
          </div>
          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Packet Delivery</span>
            <span className="font-bold text-[#4cd7f6] text-sm">99.8%</span>
          </div>
          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Avg. Latency</span>
            <span className="font-bold text-[#dae2fd] text-sm">180 ms</span>
          </div>
          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Solar Harvest</span>
            <span className="font-bold text-[#ffb95f] text-sm">14.2W</span>
          </div>
        </div>
      </div>

      {/* Real-world Field Deployment Photo Card */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-6 relative h-64 sm:h-72 lg:h-auto overflow-hidden">
          <img
            src="/assets/images/station_telemetry.jpg"
            alt="Field Deployment of LoRa Telemetry Station on Melamchi River"
            className="w-full h-full object-cover filter brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#131b2e]" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b1326]/90 border border-[#06b6d4]/50 backdrop-blur-md text-[#4cd7f6] text-[11px] font-mono font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>FIELD DEPLOYMENT // ZONE B RIVERBANK</span>
          </div>
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-[#0b1326]/80 text-[#dae2fd] text-[10px] font-mono border border-[#222a3d]">
            Melamchi Pul Bazaar Station (870m MSL) • Sindhupalchok, Nepal
          </div>
        </div>

        <div className="lg:col-span-6 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 rounded font-bold">
                PHYSICAL HARDWARE SPECIFICATION
              </span>
              <span className="text-xs text-[#869397] font-mono">
                Model: Sensora-Node-v2
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Autonomous Solar-Powered LoRaWAN River Station
            </h3>
            <p className="text-xs text-[#869397] leading-relaxed mt-1">
              Field-deployed alongside the Melamchi River gorge. Continuously monitors water stage elevation via downward ultrasonic pulses and records rainfall volume using pulse interrupts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            <div className="bg-[#0b1326] p-2.5 rounded-lg border border-[#222a3d]">
              <div className="flex items-center gap-1.5 text-[#4cd7f6] font-bold text-[11px]">
                <Sun className="w-3.5 h-3.5" />
                <span>20W Solar + LiFePO4</span>
              </div>
              <p className="text-[10px] text-[#869397] mt-0.5">
                Full 72-hour battery reserve during heavy monsoon overcast.
              </p>
            </div>

            <div className="bg-[#0b1326] p-2.5 rounded-lg border border-[#222a3d]">
              <div className="flex items-center gap-1.5 text-[#ffb95f] font-bold text-[11px]">
                <Activity className="w-3.5 h-3.5" />
                <span>Ultrasonic Sonar Arm</span>
              </div>
              <p className="text-[10px] text-[#869397] mt-0.5">
                Cantilever bracket extended directly over river centerline.
              </p>
            </div>

            <div className="bg-[#0b1326] p-2.5 rounded-lg border border-[#222a3d]">
              <div className="flex items-center gap-1.5 text-[#10b981] font-bold text-[11px]">
                <Wifi className="w-3.5 h-3.5" />
                <span>SX1262 LoRa Radio</span>
              </div>
              <p className="text-[10px] text-[#869397] mt-0.5">
                Up to 15km line-of-sight range along mountain river corridors.
              </p>
            </div>

            <div className="bg-[#0b1326] p-2.5 rounded-lg border border-[#222a3d]">
              <div className="flex items-center gap-1.5 text-[#dae2fd] font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>IP67 Enclosure</span>
              </div>
              <p className="text-[10px] text-[#869397] mt-0.5">
                Hermetically sealed against mountain rains and debris splatter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Nodes Health Overview */}
      <SensorHealth zones={zones} />

      {/* Hardware Telemetry & Architecture Specifications */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#4cd7f6]" />
            <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
              Sub-Gigahertz LoRaWAN Edge Hardware Diagnostics
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#869397]">
            HARDWARE-READY FOR NEPAL DEPLOYMENT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 font-mono text-xs">
          {HARDWARE_COMPONENTS.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#0b1326] border border-[#222a3d] flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px] truncate">
                    {item.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold">
                    {item.status}
                  </span>
                </div>
                <div className="text-[10px] text-[#4cd7f6] mt-1 font-mono">
                  {item.spec}
                </div>
                <p className="text-[10px] text-[#869397] mt-1.5 leading-relaxed">
                  {item.notes}
                </p>
              </div>

              <div className="pt-2 border-t border-[#222a3d] text-[10px] text-[#ffb95f] flex items-center justify-between">
                <span>Power Bus:</span>
                <span className="font-bold">{item.power}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
