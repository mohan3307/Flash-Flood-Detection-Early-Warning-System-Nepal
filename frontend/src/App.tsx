import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { DemoModeBanner } from './components/DemoModeBanner';
import { RiskSummaryCard } from './components/RiskSummaryCard';
import { LiveSensorCards } from './components/LiveSensorCards';
import { ExplainableAI } from './components/ExplainableAI';
import { FalseAlarmCard } from './components/FalseAlarmCard';
import { ActiveAlerts } from './components/ActiveAlerts';
import { SensorHealth } from './components/SensorHealth';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { MultiSensorChart } from './components/charts/MultiSensorChart';
import { FloodRiskMap } from './components/map/FloodRiskMap';
import { ModelPerformanceModal } from './components/ModelPerformanceModal';
import { IntegrationsModal } from './components/integrations/IntegrationsModal';

import { StreamFrame, ZoneState, HistoricalReading } from './types';
import { streamSocket } from './services/websocket';
import { fetchSimulationFrame } from './services/api';
import { Radio } from 'lucide-react';

export function App() {
  const [frame, setFrame] = useState<StreamFrame | null>(null);
  const [history, setHistory] = useState<HistoricalReading[]>([]);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState<boolean>(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState<boolean>(false);
  const [selectedZoneCode, setSelectedZoneCode] = useState<string>('ZONE-B');

  // Unified frame ingest handler
  const handleIncomingFrame = (newFrame: StreamFrame) => {
    if (!newFrame || !newFrame.primary_zone) return;
    setFrame(newFrame);

    // Append to historical rolling chart data
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });

    setHistory((prev) => {
      // Avoid inserting exact duplicate frames if WebSocket and poll fire in the same second
      if (prev.length > 0 && prev[prev.length - 1].timestamp === newFrame.timestamp) {
        return prev;
      }
      const next = [
        ...prev,
        {
          timeLabel,
          timestamp: newFrame.timestamp,
          rainfall: newFrame.primary_zone.rainfall_intensity,
          waterLevel: newFrame.primary_zone.water_level,
          rateOfRise: newFrame.primary_zone.rate_of_rise,
          riskProbability: newFrame.primary_zone.probability,
          riskLevel: newFrame.primary_zone.risk_level,
        },
      ];
      // Keep max 150 points in memory
      return next.slice(-150);
    });
  };

  useEffect(() => {
    // 1. Initial REST frame fetch for instantaneous rendering
    fetchSimulationFrame()
      .then(handleIncomingFrame)
      .catch((e) => console.log('Initial REST fetch fallback waiting for stream...', e));

    // 2. Connect live WebSocket stream
    streamSocket.connect();
    const unsubscribe = streamSocket.subscribe(handleIncomingFrame);

    // 3. Active 1Hz heartbeat polling to guarantee continuous real-time data ticks
    const pollInterval = setInterval(() => {
      fetchSimulationFrame()
        .then(handleIncomingFrame)
        .catch(() => {});
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
      streamSocket.disconnect();
    };
  }, []);

  if (!frame) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4] flex items-center justify-center mb-4 shadow-xl shadow-cyan-500/20 relative">
          <Radio className="w-6 h-6 text-[#4cd7f6] animate-pulse" />
        </div>
        <h2 className="text-base font-bold text-white tracking-wide font-['Space_Grotesk']">
          INITIALIZING SENSORA TELEMETRY ENGINE...
        </h2>
        <p className="text-xs text-[#869397] font-mono mt-1">
          Synchronizing 4 catchment sensor nodes & AI hydrological models
        </p>
      </div>
    );
  }

  // Selected Zone or Primary Zone (Zone B - Pul Bazaar)
  const activeZone =
    frame.zones.find((z) => z.zone_code === selectedZoneCode) || frame.primary_zone;

  const onlineSensors = frame.zones.filter((z) => z.status === 'ONLINE').length;

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col selection:bg-[#06b6d4] selection:text-[#003640]">
      {/* Top Header */}
      <Header
        activeAlertsCount={frame.alerts_count}
        onlineSensorsCount={onlineSensors}
        totalSensorsCount={frame.zones.length}
        onOpenPerformance={() => setIsPerformanceOpen(true)}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        scenario={frame.scenario}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-5 lg:p-6 space-y-5">
        {/* Hackathon Judge Guided Stepper */}
        <DemoModeBanner
          currentScenario={frame.scenario}
          onOpenPerformance={() => setIsPerformanceOpen(true)}
          activeAlertsCount={frame.alerts_count}
        />

        {/* Active Alerts Emergency Banner */}
        <ActiveAlerts
          alerts={frame.active_alerts}
          leadTimeMinutes={frame.lead_time_minutes}
        />

        {/* Top Risk & Explainability Section (Equal Height Grid) */}
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

        {/* Multi-Sensor Charts & Scenario Controls */}
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
              onSelectZone={(code) => setSelectedZoneCode(code)}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222a3d] bg-[#060e20] py-5 px-4 mt-8 text-xs font-mono text-[#869397]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-['Space_Grotesk'] text-sm">SENSORA</span>
            <span>// AI-Powered Flash Flood Detection & Early Warning System</span>
          </div>
          <div className="text-center md:text-right space-y-0.5">
            <p className="text-[#dae2fd]">
              Himalayan Catchment Surveillance • Melamchi-Indrawati Basin, Sindhupalchok, Nepal
            </p>
            <p className="text-[10px] text-[#869397]">
              Defense-Grade Telemetry Architecture • Hardware-Ready for LoRaWAN & ESP32 Ingestion
            </p>
          </div>
        </div>
      </footer>

      {/* Model Performance Evaluation Modal */}
      <ModelPerformanceModal
        isOpen={isPerformanceOpen}
        onClose={() => setIsPerformanceOpen(false)}
      />

      {/* External API Integrations Modal */}
      <IntegrationsModal
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
      />
    </div>
  );
}

export default App;
