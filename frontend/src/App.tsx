import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveViewType } from './components/Sidebar';
import { ModelPerformanceModal } from './components/ModelPerformanceModal';
import { IntegrationsModal } from './components/integrations/IntegrationsModal';

import { OverviewView } from './components/views/OverviewView';
import { GisMapView } from './components/views/GisMapView';
import { HydrographView } from './components/views/HydrographView';
import { XaiView } from './components/views/XaiView';
import { SimulatorView } from './components/views/SimulatorView';
import { SensorNodesView } from './components/views/SensorNodesView';
import { AlertsView } from './components/views/AlertsView';

import { StreamFrame, HistoricalReading } from './types';
import { streamSocket } from './services/websocket';
import { fetchSimulationFrame } from './services/api';
import {
  Radio,
  Menu,
  X,
  LayoutDashboard,
  MapPin,
  LineChart,
  BrainCircuit,
  SlidersHorizontal,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export function App() {
  const [frame, setFrame] = useState<StreamFrame | null>(null);
  const [history, setHistory] = useState<HistoricalReading[]>([]);
  const [activeView, setActiveView] = useState<ActiveViewType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState<boolean>(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState<boolean>(false);
  const [selectedZoneCode, setSelectedZoneCode] = useState<string>('ZONE-B');

  // Unified frame ingest handler (Continuous 1Hz Telemetry Stream)
  const handleIncomingFrame = (newFrame: StreamFrame) => {
    if (!newFrame || !newFrame.primary_zone) return;
    setFrame(newFrame);

    // Append to historical rolling chart data
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('en-US', {
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
    });

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

  const viewTitles: Record<ActiveViewType, { title: string; subtitle: string }> = {
    overview: {
      title: 'COMMAND MATRIX & TELEMETRY HUD',
      subtitle: 'Integrated Himalayan Catchment Surveillance & AI Risk Overview',
    },
    'gis-map': {
      title: 'TACTICAL GIS CATCHMENT MAP',
      subtitle: 'High-Resolution Satellite Orthomosaic & Inundation Polygons',
    },
    hydrograph: {
      title: 'HYDROGRAPH & AI CREST FORECASTING',
      subtitle: 'Dual-Axis River Stage, Cloudburst Intensity & +45m Projection',
    },
    xai: {
      title: 'EXPLAINABLE AI & SHAP ATTRIBUTION',
      subtitle: '8-Feature Hydrological Weights & False Alarm Suppression Filter',
    },
    simulator: {
      title: 'SCENARIO & SHOCKWAVE SIMULATOR LAB',
      subtitle: 'Interactive Hydraulic Testbed & Extreme Monsoonal Injection',
    },
    nodes: {
      title: 'LoRaWAN SENSOR ARRAY & HARDWARE VITALS',
      subtitle: 'ESP32 Nodes, Battery Voltages, Packet RSSI & Transducer Diagnostics',
    },
    alerts: {
      title: 'ACTIVE INCIDENT ALERTS & EVACUATION SOP',
      subtitle: 'Acoustic Siren Triggers, CAP Broadcast & UN/DEOC Situation Report',
    },
  };

  const currentViewInfo = viewTitles[activeView] || viewTitles.overview;

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

      {/* Main Workspace Layout with Vertical Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Vertical Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar
            activeView={activeView}
            onSelectView={(v) => setActiveView(v)}
            zones={frame.zones}
            selectedZoneCode={selectedZoneCode}
            onSelectZone={(code) => setSelectedZoneCode(code)}
            onOpenPerformance={() => setIsPerformanceOpen(true)}
            onOpenIntegrations={() => setIsIntegrationsOpen(true)}
            activeAlertsCount={frame.alerts_count}
            onlineSensorsCount={onlineSensors}
            totalSensorsCount={frame.zones.length}
            scenario={frame.scenario}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Floating Menu Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-3.5 rounded-full bg-[#06b6d4] text-[#000000] shadow-xl shadow-cyan-500/30 font-bold flex items-center justify-center cursor-pointer border border-[#4cd7f6]"
            title="Toggle Navigation Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex">
            <div className="w-72 h-full bg-[#070e1c] shadow-2xl flex flex-col">
              <Sidebar
                activeView={activeView}
                onSelectView={(v) => {
                  setActiveView(v);
                  setIsMobileSidebarOpen(false);
                }}
                zones={frame.zones}
                selectedZoneCode={selectedZoneCode}
                onSelectZone={(code) => {
                  setSelectedZoneCode(code);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenPerformance={() => {
                  setIsPerformanceOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenIntegrations={() => {
                  setIsIntegrationsOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                activeAlertsCount={frame.alerts_count}
                onlineSensorsCount={onlineSensors}
                totalSensorsCount={frame.zones.length}
                scenario={frame.scenario}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileSidebarOpen(false)}
              />
            </div>
            <div
              className="flex-1"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        )}

        {/* Dedicated Main Content Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-5 lg:p-6 space-y-4">
          {/* Active View Title & Breadcrumb Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222a3d]/80 font-mono">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#869397]">SENSORA</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#5f6e73]" />
              <span className="text-[#4cd7f6] font-bold uppercase tracking-wider">
                {activeView.replace('-', ' ')}
              </span>
              <span className="text-[#869397] hidden lg:inline">•</span>
              <span className="text-[#dae2fd] text-[11px] hidden lg:inline">
                {currentViewInfo.subtitle}
              </span>
            </div>

            {/* Quick Switcher View Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'overview' as ActiveViewType, label: 'Overview', icon: LayoutDashboard },
                { id: 'gis-map' as ActiveViewType, label: 'GIS Map', icon: MapPin },
                { id: 'hydrograph' as ActiveViewType, label: 'Hydrograph', icon: LineChart },
                { id: 'xai' as ActiveViewType, label: 'XAI', icon: BrainCircuit },
                { id: 'simulator' as ActiveViewType, label: 'Simulator', icon: SlidersHorizontal },
                { id: 'nodes' as ActiveViewType, label: 'Nodes', icon: Radio },
                { id: 'alerts' as ActiveViewType, label: 'Alerts', icon: AlertTriangle },
              ].map((pill) => {
                const PillIcon = pill.icon;
                const isSelected = activeView === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActiveView(pill.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#06b6d4] text-[#000000] font-bold shadow-sm shadow-cyan-500/20'
                        : 'bg-[#131b2e] hover:bg-[#1a233a] text-[#869397] hover:text-[#dae2fd] border border-[#222a3d]'
                    }`}
                  >
                    <PillIcon className={`w-3 h-3 ${isSelected ? 'text-[#000000]' : 'text-[#869397]'}`} />
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Render Separate Dedicated View */}
          {activeView === 'overview' && (
            <OverviewView
              frame={frame}
              activeZone={activeZone}
              history={history}
              selectedZoneCode={selectedZoneCode}
              onSelectZone={(code) => setSelectedZoneCode(code)}
              onOpenPerformance={() => setIsPerformanceOpen(true)}
            />
          )}

          {activeView === 'gis-map' && (
            <GisMapView
              zones={frame.zones}
              selectedZoneCode={selectedZoneCode}
              onSelectZone={(code) => setSelectedZoneCode(code)}
              scenario={frame.scenario}
            />
          )}

          {activeView === 'hydrograph' && (
            <HydrographView
              history={history}
              activeZone={activeZone}
            />
          )}

          {activeView === 'xai' && (
            <XaiView
              primaryZone={activeZone}
              scenario={frame.scenario}
            />
          )}

          {activeView === 'simulator' && (
            <SimulatorView
              frame={frame}
              activeZone={activeZone}
            />
          )}

          {activeView === 'nodes' && (
            <SensorNodesView
              zones={frame.zones}
              selectedZoneCode={selectedZoneCode}
              onSelectZone={(code) => setSelectedZoneCode(code)}
            />
          )}

          {activeView === 'alerts' && (
            <AlertsView
              alerts={frame.active_alerts}
              leadTimeMinutes={frame.lead_time_minutes}
              zones={frame.zones}
              selectedZoneCode={selectedZoneCode}
            />
          )}

          {/* Footer */}
          <footer className="border-t border-[#222a3d] bg-[#060e20] py-4 px-4 mt-6 text-xs font-mono text-[#869397] rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-['Space_Grotesk'] text-sm">SENSORA</span>
                <span>// Himalayan Flash Flood Early Warning System</span>
              </div>
              <div className="text-center md:text-right space-y-0.5">
                <p className="text-[#dae2fd]">
                  Sindhupalchok Catchment Surveillance • Melamchi-Indrawati Basin Corridor
                </p>
                <p className="text-[10px] text-[#869397]">
                  Continuous Dual Telemetry (WebSocket + REST 1Hz) • Hardware-Ready LoRaWAN Ingestion
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>

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
