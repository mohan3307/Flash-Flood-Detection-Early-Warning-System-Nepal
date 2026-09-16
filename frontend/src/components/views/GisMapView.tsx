import React, { useState } from 'react';
import { ZoneState } from '../../types';
import { FloodRiskMap } from '../map/FloodRiskMap';
import {
  MapPin,
  Shield,
  Radio,
  Compass,
  Mountain,
  AlertTriangle,
  ArrowDownRight,
  ShieldAlert,
  Building,
  Camera,
  Maximize2,
  ExternalLink,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface GisMapViewProps {
  zones: ZoneState[];
  selectedZoneCode: string;
  onSelectZone: (zoneCode: string) => void;
  scenario?: string;
}

const CRITICAL_INFRASTRUCTURE = [
  {
    name: 'Melamchi Higher Secondary School',
    type: 'Designated Safe High-Ground Shelter',
    elevation: '935m MSL',
    clearance: '+65m above river bed',
    capacity: '450 Persons',
    status: 'ACTIVE & STOCKED',
  },
  {
    name: 'Bahunepati Emergency Helipad',
    type: 'Medical Evacuation & Casualty Post',
    elevation: '785m MSL',
    clearance: '+65m safe terrace',
    capacity: '320 Persons',
    status: 'OPERATIONAL',
  },
  {
    name: 'Sindhupalchok DEOC Forward Outpost',
    type: 'Incident Command Radio Repeater',
    elevation: '1,120m MSL',
    clearance: '+400m ridge elevation',
    capacity: '80 Personnel',
    status: 'SECURE',
  },
  {
    name: 'Melamchi Bailey Bridge',
    type: 'Critical River Crossing Barrier',
    elevation: '870m MSL',
    clearance: 'Submersible Risk at 3.5m',
    capacity: 'Automated Gate Closure',
    status: 'SURVEILLANCE ACTIVE',
  },
];

export const GisMapView: React.FC<GisMapViewProps> = ({
  zones,
  selectedZoneCode,
  onSelectZone,
  scenario,
}) => {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const activeZone =
    zones.find((z) => z.zone_code === selectedZoneCode) || zones[0];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Station Live Telemetry Banner */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40 shadow-md shadow-cyan-500/10">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk'] tracking-tight">
                {activeZone?.name || 'Sindhupalchok Basin'}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#06b6d4]/20 text-[#4cd7f6] border border-[#06b6d4]/40 rounded">
                {activeZone?.zone_code}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                  activeZone?.risk_level === 'HIGH'
                    ? 'bg-[#ef4444]/20 text-[#ffb4ab] border border-[#ef4444]/50 animate-pulse'
                    : activeZone?.risk_level === 'MEDIUM'
                    ? 'bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/50'
                    : 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50'
                }`}
              >
                {activeZone?.risk_level} THREAT ({activeZone?.probability.toFixed(0)}%)
              </span>
            </div>
            <p className="text-xs text-[#869397] font-mono mt-0.5">
              Lat: {activeZone?.latitude.toFixed(4)}°N • Lng: {activeZone?.longitude.toFixed(4)}°E • Elevation: {activeZone?.elevation_m}m MSL
            </p>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto font-mono text-xs">
          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Precipitation</span>
            <span className="font-bold text-[#4cd7f6] text-sm">
              {activeZone?.rainfall_intensity.toFixed(1)} mm/h
            </span>
          </div>
          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">River Stage</span>
            <span className="font-bold text-[#ffb95f] text-sm">
              {activeZone?.water_level.toFixed(2)} m
            </span>
          </div>
          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Surge Rate</span>
            <span
              className={`font-bold text-sm ${
                activeZone?.rate_of_rise > 0 ? 'text-[#ef4444]' : 'text-[#10b981]'
              }`}
            >
              {activeZone?.rate_of_rise > 0 ? '+' : ''}
              {activeZone?.rate_of_rise.toFixed(2)} m/h
            </span>
          </div>
          <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Lead Time</span>
            <span className="font-bold text-[#dae2fd] text-sm">
              {activeZone?.risk_level === 'HIGH' ? '18 mins' : '45 mins'}
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Interactive Map */}
      <FloodRiskMap
        zones={zones}
        selectedZoneCode={selectedZoneCode}
        onSelectZone={onSelectZone}
        scenario={scenario}
      />

      {/* Real-time Field Surveillance Imagery: Catchment & Evacuation Shelters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Melamchi Catchment Valley Aerial Imagery */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl overflow-hidden group relative">
          <div className="relative h-56 sm:h-64 overflow-hidden">
            <img
              src="/assets/images/melamchi_valley.jpg"
              alt="Melamchi-Indrawati River Basin Aerial Survey"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/40 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b1326]/90 border border-[#06b6d4]/50 backdrop-blur-md text-[#4cd7f6] text-[11px] font-mono font-bold">
              <Camera className="w-3.5 h-3.5" />
              <span>AERIAL CATCHMENT SURVEILLANCE</span>
            </div>
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981] text-[10px] font-mono font-bold">
              LIVE OPTICAL FEED
            </div>
          </div>
          <div className="p-4 bg-[#131b2e]">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Melamchi-Indrawati River Corridor & Confluence
              </h4>
              <span className="text-[10px] font-mono text-[#869397]">
                2,480m → 785m MSL
              </span>
            </div>
            <p className="text-xs text-[#869397] leading-relaxed">
              Optical high-resolution aerial survey tracking hydraulic channel bottleneck points, vulnerable Bailey bridge crossings, and downstream terraced settlements.
            </p>
          </div>
        </div>

        {/* High-Ground Safe Evacuation Shelter Photo */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl overflow-hidden group relative">
          <div className="relative h-56 sm:h-64 overflow-hidden">
            <img
              src="/assets/images/evacuation_shelter.jpg"
              alt="Designated Safe Evacuation Highland Shelter"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/40 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b1326]/90 border border-[#10b981]/50 backdrop-blur-md text-[#10b981] text-[11px] font-mono font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>SAFE HIGHLAND SHELTER (935m MSL)</span>
            </div>
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#06b6d4]/20 border border-[#06b6d4]/50 text-[#4cd7f6] text-[10px] font-mono font-bold">
              CLEARANCE: +65m
            </div>
          </div>
          <div className="p-4 bg-[#131b2e]">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Melamchi Secondary School Community Assembly
              </h4>
              <span className="text-[10px] font-mono text-[#10b981] font-bold">
                CAPACITY: 450 PERSONS
              </span>
            </div>
            <p className="text-xs text-[#869397] leading-relaxed">
              Designated high-ground flood evacuation compound. Equipped with trauma medical kits, Red Cross emergency shelters, and emergency radio communications.
            </p>
          </div>
        </div>
      </div>

      {/* Catchment Stations Profile & Infrastructure Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 4-Station Corridor Profile */}
        <div className="lg:col-span-6 bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-[#4cd7f6]" />
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Himalayan Hydraulic Gradient (26km Corridor)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#869397]">
              2,480m → 785m MSL
            </span>
          </div>

          <div className="space-y-2 mt-3 font-mono text-xs">
            {zones.map((z, idx) => {
              const isSelected = z.zone_code === selectedZoneCode;
              const isHigh = z.risk_level === 'HIGH';
              return (
                <div
                  key={z.zone_code}
                  onClick={() => onSelectZone(z.zone_code)}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#06b6d4]/15 border-[#06b6d4]/60 text-white font-bold shadow-md shadow-cyan-500/10'
                      : 'bg-[#0b1326] border-[#222a3d] text-[#869397] hover:bg-[#171f33] hover:text-[#dae2fd]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#171f33] text-[#4cd7f6] flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-white font-semibold flex items-center gap-1.5">
                        <span>{z.name}</span>
                        <span className="text-[10px] text-[#869397]">({z.zone_code})</span>
                      </div>
                      <div className="text-[10px] text-[#869397]">
                        {z.elevation_m}m MSL • {z.subtext}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isHigh
                          ? 'bg-[#ef4444]/20 text-[#ef4444]'
                          : z.risk_level === 'MEDIUM'
                          ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                          : 'bg-[#10b981]/20 text-[#10b981]'
                      }`}
                    >
                      {z.risk_level}
                    </span>
                    <div className="text-[10px] text-[#dae2fd] mt-0.5">
                      {z.water_level.toFixed(2)}m / {z.rainfall_intensity.toFixed(0)}mm/h
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Critical Evacuation & Safe Shelter Matrix */}
        <div className="lg:col-span-6 bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10b981]" />
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Designated Safe Shelters & Highland Assembly
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#10b981] font-bold">
              UN/DEOC VERIFIED
            </span>
          </div>

          <div className="space-y-2 mt-3 font-mono text-xs">
            {CRITICAL_INFRASTRUCTURE.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#0b1326] border border-[#222a3d] flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-white font-semibold truncate text-[11px]">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-[#869397] truncate">
                    {item.type} • {item.elevation} ({item.clearance})
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold block">
                    {item.capacity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
