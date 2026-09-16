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
import { Radio, Mountain, MapPin, Eye, Camera } from 'lucide-react';

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
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Real-time Catchment Visual Hero Strip */}
      <div className="relative rounded-2xl overflow-hidden border border-[#222a3d] bg-[#131b2e] shadow-xl">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src="/assets/images/melamchi_valley.jpg"
            alt="Melamchi Catchment Surveillance Nepal"
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070e1c] via-[#070e1c]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c] via-transparent to-transparent" />

          {/* Hero Overlay Content */}
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#06b6d4]/20 border border-[#06b6d4]/50 backdrop-blur-md text-[#4cd7f6] text-[11px] font-mono font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>HIMALAYAN RIVER CATCHMENT RADAR</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-[#0b1326]/80 border border-[#222a3d] text-[#869397] text-[11px] font-mono">
                  Sindhupalchok, Nepal
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] font-bold">
                  4 STATIONS ACTIVE
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
                  Melamchi-Indrawati River Surveillance Corridor
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#dae2fd]/80 max-w-2xl mt-1 leading-relaxed">
                Autonomous multi-station early warning matrix operating along 26km of steep hydraulic gradient (2,480m to 785m MSL) with AI flash flood prediction & false alarm suppression.
              </p>
            </div>
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
