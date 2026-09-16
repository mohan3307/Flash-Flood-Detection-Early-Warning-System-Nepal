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

import { StreamFrame, ZoneState, HistoricalReading } from './types';
import { streamSocket } from './services/websocket';
import { fetchZones, fetchRisk } from './services/api';

export function App() {
  const [frame, setFrame] = useState<StreamFrame | null>(null);
  const [history, setHistory] = useState<HistoricalReading[]>([]);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState<boolean>(false);
  const [selectedZoneCode, setSelectedZoneCode] = useState<string>('ZONE-B');

  // Fallback initial state if socket is connecting
  useEffect(() => {
    // Initial fetch via REST
    fetchRisk()
      .then((riskData) => {
        fetchZones().then((zones) => {
          if (zones && zones.length > 0) {
            const primary = zones.find((z) => z.zone_code === 'ZONE-B') || zones[0];
            setFrame({
              timestamp: new Date().toISOString(),
              scenario: 'normal',
              speed: 1,
              is_running: true,
              tick: 1,
              overall_risk: riskData.overall_risk || 'LOW',
              lead_time_minutes: riskData.lead_time_minutes || 45.0,
              primary_zone: primary,
              zones: zones,
              active_alerts: [],
              alerts_count: 0,
            });
          }
        });
      })
      .catch((e) => console.log('Initial REST fetch fallback waiting for stream...', e));

    // Connect WebSocket
    streamSocket.connect();

    const unsubscribe = streamSocket.subscribe((newFrame: StreamFrame) => {
      setFrame(newFrame);

      // Append to historical rolling chart data
      const now = new Date();
      const timeLabel = now.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });

      setHistory((prev) => {
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
    });

    return () => {
      unsubscribe();
      streamSocket.disconnect();
    };
  }, []);

  if (!frame) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-spin flex items-center justify-center mb-4 shadow-xl shadow-indigo-600/30">
          <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-wide">Connecting to SENSORA Telemetry Engine...</h2>
        <p className="text-xs text-slate-400 mt-1">Initializing AI flood risk model & simulation streams</p>
      </div>
    );
  }

  // Selected Zone or Primary Zone (Zone B - Pul Bazaar)
  const activeZone =
    frame.zones.find((z) => z.zone_code === selectedZoneCode) || frame.primary_zone;

  const onlineSensors = frame.zones.filter((z) => z.status === 'ONLINE').length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeAlertsCount={frame.alerts_count}
        onlineSensorsCount={onlineSensors}
        totalSensorsCount={frame.zones.length}
        onOpenPerformance={() => setIsPerformanceOpen(true)}
        scenario={frame.scenario}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
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

        {/* Top Risk & Explainability Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <RiskSummaryCard
              overallRisk={frame.overall_risk}
              primaryZone={activeZone}
              leadTimeMinutes={frame.lead_time_minutes}
              scenario={frame.scenario}
            />
          </div>
          <div className="lg:col-span-5">
            <ExplainableAI primaryZone={activeZone} />
          </div>
        </div>

        {/* Live Sensor Cards */}
        <LiveSensorCards primaryZone={activeZone} />

        {/* Multi-Sensor Charts & Scenario Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Charts and Scenario Simulator */}
          <div className="lg:col-span-7 space-y-6">
            <MultiSensorChart data={history} />
            <ScenarioSimulator
              currentScenario={frame.scenario}
              speed={frame.speed}
              isRunning={frame.is_running}
            />
          </div>

          {/* Right Column: Interactive Map & False Alarm Reduction */}
          <div className="lg:col-span-5 space-y-6">
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
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-4 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SENSORA</span>
            <span>– AI-Powered Flash Flood Detection & Early Warning System</span>
          </div>
          <div className="text-center md:text-right space-y-1">
            <p>Designed for steep Himalayan catchments (Melamchi/Indrawati Basin, Sindhupalchok, Nepal).</p>
            <p className="text-[11px] text-slate-600">
              Prototype Software Demonstration • Telemetry Simulated • Hardware-Ready for ESP32/LoRaWAN Ingestion
            </p>
          </div>
        </div>
      </footer>

      {/* Model Performance Evaluation Modal */}
      <ModelPerformanceModal
        isOpen={isPerformanceOpen}
        onClose={() => setIsPerformanceOpen(false)}
      />
    </div>
  );
}

export default App;
