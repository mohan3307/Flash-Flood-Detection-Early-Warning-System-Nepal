import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  LineChart,
  BrainCircuit,
  SlidersHorizontal,
  Radio,
  AlertTriangle,
  FileSpreadsheet,
  BarChart3,
  RadioReceiver,
  ChevronLeft,
  ChevronRight,
  Check,
  Activity,
  Layers,
  ShieldCheck,
  ExternalLink,
  Zap,
  Droplets,
} from 'lucide-react';
import { ZoneState } from '../types';

export type ActiveViewType =
  | 'overview'
  | 'gis-map'
  | 'hydrograph'
  | 'water-content'
  | 'xai'
  | 'simulator'
  | 'nodes'
  | 'alerts';

interface SidebarProps {
  activeView: ActiveViewType;
  onSelectView: (view: ActiveViewType) => void;
  zones: ZoneState[];
  selectedZoneCode: string;
  onSelectZone: (zoneCode: string) => void;
  onOpenPerformance: () => void;
  onOpenIntegrations: () => void;
  activeAlertsCount: number;
  onlineSensorsCount: number;
  totalSensorsCount: number;
  scenario: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  zones,
  selectedZoneCode,
  onSelectZone,
  onOpenPerformance,
  onOpenIntegrations,
  activeAlertsCount,
  onlineSensorsCount,
  totalSensorsCount,
  scenario,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [copiedSitRep, setCopiedSitRep] = useState<boolean>(false);

  const navItems: {
    id: ActiveViewType;
    label: string;
    shortLabel: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Telemetry HUD',
      shortLabel: 'Overview',
      description: 'Command Matrix & Executive Summary',
      icon: LayoutDashboard,
    },
    {
      id: 'gis-map',
      label: 'Tactical GIS Map',
      shortLabel: 'Map',
      description: 'High-Res Satellite & Flood Polygons',
      icon: MapPin,
      badge: 'GIS',
      badgeColor: 'bg-[#06b6d4]/15 text-[#4cd7f6] border-[#06b6d4]/40',
    },
    {
      id: 'hydrograph',
      label: 'Hydrograph & AI Forecast',
      shortLabel: 'Hydrograph',
      description: 'Stage, Rainfall & +45m AI Crest Projection',
      icon: LineChart,
      badge: '+45m AI',
      badgeColor: 'bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/40',
    },
    {
      id: 'water-content',
      label: 'Water Content & Runoff',
      shortLabel: 'Water Content',
      description: 'Soil Saturation (VWC%) & Channel Discharge',
      icon: Droplets,
      badge: 'VWC %',
      badgeColor: 'bg-[#06b6d4]/15 text-[#4cd7f6] border-[#06b6d4]/40',
    },
    {
      id: 'xai',
      label: 'Explainable AI & SHAP',
      shortLabel: 'XAI / SHAP',
      description: '8-Feature Attribution & False Alarm Filter',
      icon: BrainCircuit,
    },
    {
      id: 'simulator',
      label: 'Scenario Simulator',
      shortLabel: 'Simulator',
      description: 'Cloudburst & GLOF Hydraulic Testbed',
      icon: SlidersHorizontal,
    },
    {
      id: 'nodes',
      label: 'Sensor Array (LoRa)',
      shortLabel: 'Sensors',
      description: 'ESP32 Nodes, Battery & Signal Health',
      icon: Radio,
      badge: `${onlineSensorsCount}/${totalSensorsCount}`,
      badgeColor:
        onlineSensorsCount === totalSensorsCount
          ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40'
          : 'bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/40',
    },
    {
      id: 'alerts',
      label: 'Active Alerts & Siren',
      shortLabel: 'Alerts',
      description: 'Incident Dispatch & Evacuation SOP',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount} ACTIVE` : undefined,
      badgeColor: 'bg-[#ef4444]/20 text-[#ffb4ab] border-[#ef4444]/50 animate-pulse',
    },
  ];

  const handleExportSitRep = () => {
    const timestamp = new Date().toISOString();
    const activeZone = zones.find((z) => z.zone_code === selectedZoneCode) || zones[0];
    const sitRepText = `=== SENSORA TACTICAL DISASTER MANAGEMENT SITUATION REPORT ===
Timestamp: ${timestamp}
Target Catchment: Sindhupalchok, Nepal (Melamchi-Indrawati Corridor)
Selected Station: ${activeZone?.name || 'Pul Bazaar'} (${activeZone?.zone_code})
Current Scenario: ${scenario}
Threat Status: ${activeAlertsCount > 0 ? 'CRITICAL ALERT' : 'NOMINAL'}
Active Incident Alerts: ${activeAlertsCount}
Precipitation Intensity: ${activeZone?.rainfall_intensity.toFixed(1)} mm/hr
River Stage: ${activeZone?.water_level.toFixed(2)} m (Warning: 3.5m, Breach: 4.5m)
Surge Velocity: ${activeZone?.rate_of_rise > 0 ? '+' : ''}${activeZone?.rate_of_rise.toFixed(2)} m/hr
Risk Level: ${activeZone?.risk_level} (${activeZone?.probability.toFixed(1)}% confidence)
SOP Directive: ${activeZone?.recommended_action}
Hardware Health: ${zones.filter((z) => z.status === 'ONLINE').length}/${zones.length} Stations Active
=============================================================`;

    navigator.clipboard.writeText(sitRepText);
    setCopiedSitRep(true);
    setTimeout(() => setCopiedSitRep(false), 2500);
  };

  return (
    <aside
      className={`glass-panel border-r border-cyan-500/20 bg-[#030712]/95 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none shadow-2xl ${
        isCollapsed ? 'w-16' : 'w-64 sm:w-72'
      }`}
    >
      {/* Top Header / Branding & Collapse Toggle */}
      <div className="p-3.5 border-b border-cyan-500/20 flex items-center justify-between gap-2">
        <div className={`flex items-center gap-2.5 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 relative group transition-all duration-300 hover:scale-105">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 radar-dot text-emerald-400 border border-[#030712]" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white font-['Outfit'] text-base tracking-wide">
                  SENSORA
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold shadow-sm">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                Nepal Catchment Defense
              </p>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Modules */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 scrollbar-thin">
        {/* Navigation Category Label */}
        {!isCollapsed && (
          <div className="px-2 pt-1.5 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400/70 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Tactical Modules</span>
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all text-left cursor-pointer group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-950/40 to-emerald-500/10 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-500/10 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              }`}
              title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
            >
              {/* Active vertical glow indicator */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-lg shadow-cyan-400" />
              )}

              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                    : 'bg-slate-900/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate font-semibold text-[12px]">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border shrink-0 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 group-hover:text-slate-400 truncate leading-tight mt-0.5">
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}

        {/* Station Quick Selector in Sidebar */}
        <div className="pt-3">
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400/70 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Catchment Stations</span>
              </span>
              <span className="text-cyan-400 text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                {zones.length} NODES
              </span>
            </div>
          )}

          <div className={`space-y-1.5 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {zones.map((z) => {
              const isSelected = z.zone_code === selectedZoneCode;
              const isHigh = z.risk_level === 'HIGH';
              const isMedium = z.risk_level === 'MEDIUM';
              const dotColor = isHigh
                ? 'bg-red-500'
                : isMedium
                ? 'bg-amber-400'
                : 'bg-emerald-400';

              if (isCollapsed) {
                return (
                  <button
                    key={z.zone_code}
                    onClick={() => onSelectZone(z.zone_code)}
                    className={`w-10 h-9 rounded-xl flex items-center justify-center font-mono text-[10px] font-extrabold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-cyan-500/40'
                    }`}
                    title={`${z.name} (${z.zone_code}) - Risk: ${z.risk_level}`}
                  >
                    <span className="relative">
                      {z.zone_code.replace('ZONE-', 'Z')}
                      <span
                        className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full ${dotColor} ${isHigh ? 'animate-ping' : ''}`}
                      />
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={z.zone_code}
                  onClick={() => onSelectZone(z.zone_code)}
                  className={`w-full flex items-center justify-between p-2 px-3 rounded-xl text-xs font-mono transition-all text-left cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-950/60 text-white border-cyan-400/70 font-bold shadow-md shadow-cyan-950/50'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800/80 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor} ${isHigh ? 'animate-pulse' : ''}`} />
                    <div className="truncate">
                      <div className="text-[11px] font-bold truncate text-white leading-tight">
                        {z.name}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {z.zone_code} • {z.elevation_m}m MSL
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                      {z.water_level.toFixed(2)}m
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 block">
                      {z.rainfall_intensity.toFixed(0)} mm/h
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Hub & Utility Tools */}
        <div className="pt-3">
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400/70 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Tactical Utilities</span>
            </div>
          )}

          <div className="space-y-1.5">
            {/* Quick SitRep Exporter */}
            <button
              onClick={handleExportSitRep}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-mono transition-all text-left cursor-pointer border ${
                copiedSitRep
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/50'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 text-slate-200'
              } ${isCollapsed ? 'justify-center p-2' : ''}`}
              title="Copy standardized UN/DEOC Situation Report to clipboard"
            >
              {copiedSitRep ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
              {!isCollapsed && (
                <span className="truncate font-bold text-[11px]">
                  {copiedSitRep ? 'SITREP COPIED!' : 'EXPORT SITREP (1-CLICK)'}
                </span>
              )}
            </button>

            {/* ML Benchmark Modal Trigger */}
            <button
              onClick={onOpenPerformance}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-mono bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer ${
                isCollapsed ? 'justify-center p-2' : ''
              }`}
              title="Open ML Models Benchmark & Evaluation Center"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400 shrink-0" />
              {!isCollapsed && (
                <span className="truncate text-[11px] font-medium">ML Benchmark Suite</span>
              )}
            </button>

            {/* External APIs Modal Trigger */}
            <button
              onClick={onOpenIntegrations}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-mono bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer ${
                isCollapsed ? 'justify-center p-2' : ''
              }`}
              title="Open 8 External API Integrations Hub"
            >
              <RadioReceiver className="w-4 h-4 text-cyan-400 shrink-0" />
              {!isCollapsed && (
                <span className="truncate text-[11px] font-medium">8 External APIs Hub</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer / System Status & Collapse Toggle (When Collapsed) */}
      <div className="p-3 border-t border-cyan-500/20 bg-[#030712]">
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Telemetry Stream</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 radar-dot" />
                1Hz ACTIVE
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Scenario: <span className="text-white font-bold">{scenario}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
