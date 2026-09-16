import React, { useState } from 'react';
import { ZoneState } from '../../types';
import {
  Droplets,
  Waves,
  Activity,
  Layers,
  ArrowDownRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sliders,
  Gauge,
  Compass,
  Database,
  Satellite,
  Radio,
} from 'lucide-react';

interface WaterContentViewProps {
  zones: ZoneState[];
  selectedZoneCode: string;
  onSelectZone: (zoneCode: string) => void;
  activeZone: ZoneState;
}

export const WaterContentView: React.FC<WaterContentViewProps> = ({
  zones,
  selectedZoneCode,
  onSelectZone,
  activeZone,
}) => {
  const [simulatedVWC, setSimulatedVWC] = useState<number>(
    activeZone.soil_water_content_pct || 68
  );

  // Live or fallback metrics
  const liveVWC = activeZone.soil_water_content_pct || 68.4;
  const channelDischarge = activeZone.channel_discharge_m3s || 142.5;
  const runoffCoef = activeZone.runoff_coefficient || 0.62;
  const topsoil = activeZone.soil_moisture_depths?.topsoil_10cm || 72.0;
  const rootzone = activeZone.soil_moisture_depths?.rootzone_40cm || 65.0;
  const deepAquifer = activeZone.soil_moisture_depths?.deep_100cm || 58.0;

  // Max bankfull capacity for Melamchi channel cross-section
  const BANKFULL_CAPACITY_M3S = 450.0;
  const channelCapacityPct = Math.min(
    100,
    Math.round((channelDischarge / BANKFULL_CAPACITY_M3S) * 100)
  );

  // Simulated Infiltration & Runoff calculations for interactive slider
  const simInfiltrationRate = Math.max(
    1.2,
    Number((50.0 * Math.pow(1 - simulatedVWC / 100, 1.8)).toFixed(1))
  );
  const simRunoffCoeff = Math.min(
    0.95,
    Number((0.1 + Math.pow(simulatedVWC / 100, 2.4) * 0.85).toFixed(2))
  );
  const simLeadTime = Math.max(
    15,
    Math.round(80 - (simulatedVWC / 100) * 60)
  );

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40 shadow-lg shadow-cyan-500/10">
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Water Content & Infiltration Dynamics in Flood Detection
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#06b6d4]/20 text-[#4cd7f6] border border-[#06b6d4]/40 rounded">
                Volumetric Water Content (VWC)
              </span>
            </div>
            <p className="text-xs text-[#869397] font-mono mt-0.5">
              Hydraulic coupling between antecedent soil saturation, infiltration capacity, and instant overland runoff surges
            </p>
          </div>
        </div>

        {/* Live Saturation State Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-[#0b1326] px-3 py-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Station Soil State</span>
            <span
              className={`font-bold text-sm ${
                liveVWC > 80
                  ? 'text-[#ef4444]'
                  : liveVWC > 60
                  ? 'text-[#ffb95f]'
                  : 'text-[#10b981]'
              }`}
            >
              {liveVWC > 80
                ? 'HYDRO-SATURATED (DANGER)'
                : liveVWC > 60
                ? 'MOIST SOIL (WATCH)'
                : 'UNSATURATED (SAFE)'}
            </span>
          </div>
          <div className="bg-[#0b1326] px-3 py-2 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] block">Runoff Ratio</span>
            <span className="font-bold text-[#4cd7f6] text-sm">
              {(runoffCoef * 100).toFixed(0)}% Surface Runoff
            </span>
          </div>
        </div>
      </div>

      {/* Core Water Content Telemetry KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Volumetric Water Content (VWC) */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#869397] font-mono">Soil Water Content (VWC)</span>
            <Droplets className="w-4 h-4 text-[#4cd7f6]" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-white">
              {liveVWC.toFixed(1)} <span className="text-xs text-[#869397]">%</span>
            </div>
            <div className="text-[11px] font-mono text-[#869397] mt-1">
              Field Capacity: 75% • Saturation: 85%
            </div>
          </div>
          <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                liveVWC >= 85
                  ? 'bg-[#ef4444]'
                  : liveVWC >= 70
                  ? 'bg-[#ffb95f]'
                  : 'bg-[#10b981]'
              }`}
              style={{ width: `${Math.min(100, liveVWC)}%` }}
            />
          </div>
        </div>

        {/* River Discharge Flow Q (m3/s) */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#869397] font-mono">Channel Discharge Volume</span>
            <Waves className="w-4 h-4 text-[#ffb95f]" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#ffb95f]">
              {channelDischarge.toFixed(1)}{' '}
              <span className="text-xs text-[#869397]">m³/s</span>
            </div>
            <div className="text-[11px] font-mono text-[#869397] mt-1">
              Bankfull Holding: {BANKFULL_CAPACITY_M3S} m³/s ({channelCapacityPct}%)
            </div>
          </div>
          <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                channelCapacityPct >= 85
                  ? 'bg-[#ef4444]'
                  : channelCapacityPct >= 65
                  ? 'bg-[#ffb95f]'
                  : 'bg-[#10b981]'
              }`}
              style={{ width: `${channelCapacityPct}%` }}
            />
          </div>
        </div>

        {/* Infiltration Capacity */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#869397] font-mono">Catchment Infiltration</span>
            <ArrowDownRight className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#10b981]">
              {(50.0 * Math.pow(1 - liveVWC / 100, 1.8)).toFixed(1)}{' '}
              <span className="text-xs text-[#869397]">mm/h</span>
            </div>
            <div className="text-[11px] font-mono text-[#869397] mt-1">
              Soil Pore Water Absorbency Rate
            </div>
          </div>
          <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10b981] transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  ((50.0 * Math.pow(1 - liveVWC / 100, 1.8)) / 50.0) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Runoff Generation Coefficient */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#869397] font-mono">Runoff Generation (C)</span>
            <Activity className="w-4 h-4 text-[#4cd7f6]" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#4cd7f6]">
              {runoffCoef.toFixed(2)}{' '}
              <span className="text-xs text-[#869397]">
                ({(runoffCoef * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#869397] mt-1">
              Precipitation Overland Surge Yield
            </div>
          </div>
          <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                runoffCoef >= 0.75
                  ? 'bg-[#ef4444]'
                  : runoffCoef >= 0.5
                  ? 'bg-[#ffb95f]'
                  : 'bg-[#4cd7f6]'
              }`}
              style={{ width: `${runoffCoef * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Scientific Soil Strata Showcase Card */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 relative h-72 sm:h-96 overflow-hidden">
          <img
            src="/assets/images/water_content_hydrodynamics.jpg"
            alt="3D Soil Volumetric Water Content and Infiltration Cutaway in Flood Detection"
            className="w-full h-full object-cover filter brightness-95 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#131b2e]" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b1326]/90 border border-[#06b6d4]/50 backdrop-blur-md text-[#4cd7f6] text-[11px] font-mono font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>3D SOIL MOISTURE STRATA & RUNOFF DYNAMICS</span>
          </div>
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-[#0b1326]/80 text-[#dae2fd] text-[10px] font-mono border border-[#222a3d]">
            In-Situ TDR Probe Ingestion • Topsoil (0-10cm) / Root Zone (10-40cm) / Aquifer (40-100cm)
          </div>
        </div>

        <div className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40 rounded font-bold">
                PHYSICS-INFORMED HYDROLOGY
              </span>
              <span className="text-xs text-[#869397] font-mono">
                Horton Infiltration Law
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Why Water Content Governs Flash Floods
            </h3>
            <p className="text-xs text-[#869397] leading-relaxed mt-1">
              Dry soil acts as a natural sponge, absorbing heavy rainfall without causing downstream surges. However, once continuous rainfall elevates <strong className="text-white">Soil Water Content (VWC) above 85%</strong>, pore water pressures max out and infiltration halts completely.
            </p>
          </div>

          {/* 3 Strata Real-Time Depth Gauges */}
          <div className="space-y-2 font-mono text-xs">
            {/* Strata 1 */}
            <div className="p-2.5 rounded-lg bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-[11px]">
                  Topsoil Stratum (0 - 10 cm)
                </div>
                <div className="text-[10px] text-[#869397]">
                  Instant Surface Response • TDR Sensor 01
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#4cd7f6] font-bold text-sm">
                  {topsoil.toFixed(1)}%
                </span>
                <span className="text-[9px] text-[#869397] block">Saturation</span>
              </div>
            </div>

            {/* Strata 2 */}
            <div className="p-2.5 rounded-lg bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-[11px]">
                  Subsurface Root Zone (10 - 40 cm)
                </div>
                <div className="text-[10px] text-[#869397]">
                  Soil Moisture Buffer • TDR Sensor 02
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#ffb95f] font-bold text-sm">
                  {rootzone.toFixed(1)}%
                </span>
                <span className="text-[9px] text-[#869397] block">Saturation</span>
              </div>
            </div>

            {/* Strata 3 */}
            <div className="p-2.5 rounded-lg bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-[11px]">
                  Deep Bedrock Aquifer (40 - 100 cm)
                </div>
                <div className="text-[10px] text-[#869397]">
                  Baseflow Storage • TDR Sensor 03
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#10b981] font-bold text-sm">
                  {deepAquifer.toFixed(1)}%
                </span>
                <span className="text-[9px] text-[#869397] block">Saturation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Water Content vs Runoff Generator Simulator */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#222a3d]">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#4cd7f6]" />
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Interactive Soil Moisture & Flash Flood Threshold Explorer
              </h3>
            </div>
            <p className="text-xs text-[#869397] font-mono mt-0.5">
              Simulate soil water saturation levels to observe how infiltration collapses and unleashes flash floods
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#869397]">Simulated VWC:</span>
            <span className="text-[#4cd7f6] font-bold text-base px-2.5 py-0.5 rounded bg-[#0b1326] border border-[#06b6d4]/40">
              {simulatedVWC}%
            </span>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#869397]">
            <span>Dry Soil (20% VWC)</span>
            <span className="text-[#10b981]">Field Capacity (65% VWC)</span>
            <span className="text-[#ffb95f]">Critical Threshold (80% VWC)</span>
            <span className="text-[#ef4444]">Debris Flood Runoff (100% VWC)</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={simulatedVWC}
            onChange={(e) => setSimulatedVWC(Number(e.target.value))}
            className="w-full h-2 bg-[#0b1326] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
          />
        </div>

        {/* Simulation Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 font-mono text-xs">
          <div className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d]">
            <div className="text-[#869397] text-[10px]">Infiltration Rate (Absorption)</div>
            <div className="text-xl font-bold text-white mt-1">
              {simInfiltrationRate} <span className="text-xs text-[#869397]">mm/hr</span>
            </div>
            <p className="text-[10px] text-[#869397] mt-1">
              {simulatedVWC > 80
                ? 'Pores saturated. Soil cannot absorb rainfall.'
                : 'Pores unsaturated. Rain actively infiltrates.'}
            </p>
          </div>

          <div className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d]">
            <div className="text-[#869397] text-[10px]">Overland Runoff Coefficient</div>
            <div
              className={`text-xl font-bold mt-1 ${
                simRunoffCoeff > 0.75
                  ? 'text-[#ef4444]'
                  : simRunoffCoeff > 0.45
                  ? 'text-[#ffb95f]'
                  : 'text-[#10b981]'
              }`}
            >
              {(simRunoffCoeff * 100).toFixed(0)}% Surface Flow
            </div>
            <p className="text-[10px] text-[#869397] mt-1">
              {simRunoffCoeff > 0.75
                ? 'Imminent flash flood surge generation!'
                : 'Safe hydrological buffer margin.'}
            </p>
          </div>

          <div className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d]">
            <div className="text-[#869397] text-[10px]">Flood Wave Transit Lag</div>
            <div className="text-xl font-bold text-[#4cd7f6] mt-1">
              ~{simLeadTime} <span className="text-xs text-[#869397]">Minutes</span>
            </div>
            <p className="text-[10px] text-[#869397] mt-1">
              Time from heavy cloudburst to downstream river crest at Melamchi Pul Bazaar.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Station Catchment Soil Water Content Grid */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#ffb95f]" />
            <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
              Catchment Station Water Content & Discharge Comparison
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#869397]">
            4 INTEGRATED LORAWAN NODES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 font-mono text-xs">
          {zones.map((z) => {
            const isSelected = z.zone_code === selectedZoneCode;
            const vwcVal = z.soil_water_content_pct || 68.0;
            const qVal = z.channel_discharge_m3s || 120.0;
            const capPct = Math.min(100, Math.round((qVal / BANKFULL_CAPACITY_M3S) * 100));

            return (
              <div
                key={z.zone_code}
                onClick={() => onSelectZone(z.zone_code)}
                className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#06b6d4]/15 border-[#06b6d4]/60 text-white font-bold shadow-md shadow-cyan-500/10'
                    : 'bg-[#0b1326] border-[#222a3d] text-[#869397] hover:bg-[#171f33] hover:text-[#dae2fd]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-[11px] truncate">
                      {z.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#171f33] text-[#4cd7f6] border border-[#222a3d]">
                      {z.zone_code}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#869397] mt-0.5">
                    Elevation: {z.elevation_m}m MSL
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#222a3d]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#869397]">Soil Moisture:</span>
                    <strong
                      className={`${
                        vwcVal > 80
                          ? 'text-[#ef4444]'
                          : vwcVal > 60
                          ? 'text-[#ffb95f]'
                          : 'text-[#10b981]'
                      }`}
                    >
                      {vwcVal.toFixed(1)}% VWC
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#869397]">River Flow (Q):</span>
                    <strong className="text-[#4cd7f6]">
                      {qVal.toFixed(1)} m³/s
                    </strong>
                  </div>

                  <div className="w-full bg-[#070e1c] h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${
                        capPct > 80 ? 'bg-[#ef4444]' : capPct > 55 ? 'bg-[#ffb95f]' : 'bg-[#10b981]'
                      }`}
                      style={{ width: `${capPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
