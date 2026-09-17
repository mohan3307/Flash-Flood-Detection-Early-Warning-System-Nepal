import React from 'react';
import { StreamFrame, ZoneState, HistoricalReading } from '../../types';
import { DemoModeBanner } from '../DemoModeBanner';
import { ActiveAlerts } from '../ActiveAlerts';
import { RiskSummaryCard } from '../RiskSummaryCard';
import { ExplainableAI } from '../ExplainableAI';
import { LiveSensorCards } from '../LiveSensorCards';
import { MultiSensorChart } from '../charts/MultiSensorChart';
import { ScenarioSimulator } from '../ScenarioSimulator';
import { FloodRiskMap } from '../map/FloodRiskMap';
import { FalseAlarmCard } from '../FalseAlarmCard';
import { SensorHealth } from '../SensorHealth';
import { Radio, Mountain, MapPin, Eye, Camera, ShieldCheck, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface OverviewViewProps {
  frame: StreamFrame;
  activeZone: ZoneState;
  history: HistoricalReading[];
  selectedZoneCode: string;
  onSelectZone: (zoneCode: string) => void;
  onOpenPerformance: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  frame,
  activeZone,
  history,
  selectedZoneCode,
  onSelectZone,
  onOpenPerformance,
}) => {
  const isHighRisk = frame.overall_risk === 'HIGH';
  const isMediumRisk = frame.overall_risk === 'MEDIUM';
  const isSafeCondition = frame.overall_risk === 'LOW' && frame.alerts_count === 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Real-time Catchment Visual Hero Strip */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 bg-[#030712]/90 shadow-2xl">
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img
            src="/assets/images/melamchi_valley.jpg"
            alt="Melamchi Catchment Surveillance Nepal"
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-125 transition-all duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/40" />

          {/* Hero Overlay Content */}
          <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 backdrop-blur-md text-cyan-300 text-xs font-mono font-bold shadow-lg shadow-cyan-950/50">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>HIMALAYAN CATCHMENT RADAR</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-300 text-xs font-mono">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Sindhupalchok, Nepal
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 font-extrabold shadow-md shadow-emerald-950/50 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 radar-dot" />
                  4 STATIONS ONLINE
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-['Outfit'] tracking-tight">
                  Melamchi-Indrawati River Surveillance Corridor
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1.5 leading-relaxed font-sans">
                Autonomous multi-station early warning matrix operating along 26km of steep hydraulic gradient (2,480m to 785m MSL) with AI flash flood prediction & false alarm suppression.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* INSTANT NEPAL SAFETY CONDITION DETECTION BANNER */}
      <div
        className={`p-4 sm:p-5 rounded-2xl glass-panel border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl transition-all ${
          isSafeCondition
            ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300'
            : isMediumRisk
            ? 'border-amber-500/60 bg-amber-950/30 text-amber-200'
            : 'border-red-500/80 bg-red-950/50 text-red-100 animate-pulse'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl border shrink-0 ${
              isSafeCondition
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                : isMediumRisk
                ? 'bg-amber-950/80 border-amber-500 text-amber-400'
                : 'bg-red-950/90 border-red-500 text-red-400 animate-bounce'
            }`}
          >
            {isSafeCondition ? (
              <ShieldCheck className="w-7 h-7" />
            ) : isMediumRisk ? (
              <AlertCircle className="w-7 h-7" />
            ) : (
              <AlertTriangle className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-300">
                // REGIONAL SAFETY CONDITION DETECTED:
              </span>
              <span
                className={`px-3 py-0.5 rounded-full font-mono text-xs font-black border ${
                  isSafeCondition
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : isMediumRisk
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-red-950 text-red-200 border-red-500'
                }`}
              >
                {isSafeCondition
                  ? '🟢 CONDITION: SAFE (NOMINAL BASELINE)'
                  : isMediumRisk
                  ? '🟡 CONDITION: MODERATE SURGE WATCH'
                  : '🔴 CONDITION: NOT SAFE (CRITICAL DANGER)'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] mt-0.5">
              {isSafeCondition
                ? 'Melamchi Catchment & Regional River Corridors are Operating under SAFE Conditions'
                : isMediumRisk
                ? 'Upstream Monsoonal Surge Detected — Elevated River Stage Watch Active'
                : 'CRITICAL DANGER DETECTED: NOT SAFE — Mandatory Evacuation Order Active'}
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {isSafeCondition
                ? 'All 4 monitoring stations report river stage margins well below warning threshold. Pedestrian footbridges & Bailey bridge crossings are open & safe.'
                : isMediumRisk
                ? 'Sustained rain causing river stage rise (+0.18m/hr). Avoid low-lying riverbank sandbanks.'
                : 'Violent hydraulic surge +0.45m/hr passing Zone B Pul Bazaar. Do NOT attempt river crossings.'}
            </p>
          </div>
        </div>
      </div>

      {/* Hackathon Judge Guided Stepper */}
      <DemoModeBanner
        currentScenario={frame.scenario}
        onOpenPerformance={onOpenPerformance}
        activeAlertsCount={frame.alerts_count}
      />

      {/* Active Alerts Emergency Banner */}
      <ActiveAlerts
        alerts={frame.active_alerts}
        leadTimeMinutes={frame.lead_time_minutes}
      />

      {/* Overview: Top Risk & Explainability Section (Equal Height Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <RiskSummaryCard
            overallRisk={frame.overall_risk}
            primaryZone={activeZone}
            leadTimeMinutes={frame.lead_time_minutes}
            scenario={frame.scenario}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <ExplainableAI primaryZone={activeZone} />
        </div>
      </div>

      {/* Live Sensor Cards */}
      <LiveSensorCards primaryZone={activeZone} />

      {/* Multi-Sensor Charts & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (7 cols): Charts and Scenario Simulator */}
        <div className="lg:col-span-7 space-y-5">
          <MultiSensorChart data={history} />
          <ScenarioSimulator
            currentScenario={frame.scenario}
            speed={frame.speed}
            isRunning={frame.is_running}
          />
        </div>

        {/* Right Column (5 cols): Interactive Map & False Alarm Reduction */}
        <div className="lg:col-span-5 space-y-5">
          <FloodRiskMap
            zones={frame.zones}
            selectedZoneCode={selectedZoneCode}
            onSelectZone={onSelectZone}
            scenario={frame.scenario}
          />
          <FalseAlarmCard
            primaryZone={activeZone}
            scenario={frame.scenario}
          />
        </div>
      </div>

      {/* Sensor Health Monitoring */}
      <SensorHealth zones={frame.zones} />
    </div>
  );
};
