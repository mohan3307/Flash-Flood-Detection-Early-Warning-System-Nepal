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
