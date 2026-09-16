import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  LineChart,
  BrainCircuit,
  SlidersHorizontal,
  Radio,
  BarChart3,
  RadioReceiver,
  FileSpreadsheet,
  Check,
  ChevronDown,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { ZoneState } from '../types';

interface MenuBarProps {
  zones: ZoneState[];
  selectedZoneCode: string;
  onSelectZone: (zoneCode: string) => void;
  onOpenPerformance: () => void;
  onOpenIntegrations: () => void;
  activeAlertsCount: number;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  zones,
  selectedZoneCode,
  onSelectZone,
  onOpenPerformance,
  onOpenIntegrations,
  activeAlertsCount,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [copiedSitRep, setCopiedSitRep] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const scrollToSection = (id: string, tabKey: string) => {
    setActiveTab(tabKey);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 115;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleExportSitRep = () => {
    const timestamp = new Date().toISOString();
    const activeZone = zones.find((z) => z.zone_code === selectedZoneCode) || zones[0];
    const sitRepText = `=== SENSORA TACTICAL DISASTER MANAGEMENT SITUATION REPORT ===
Timestamp: ${timestamp}
Target Catchment: Sindhupalchok, Nepal (Melamchi-Indrawati Corridor)
Selected Station: ${activeZone?.name || 'Pul Bazaar'} (${activeZone?.zone_code})
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

  const navItems = [
    { id: 'overview', label: 'Telemetry HUD', icon: LayoutDashboard, target: 'overview-section' },
    { id: 'gis-map', label: 'Tactical GIS Map', icon: MapPin, target: 'gis-map-section' },
    { id: 'hydrograph', label: 'Hydrograph & AI Forecast', icon: LineChart, target: 'hydrograph-section' },
    { id: 'xai', label: 'Explainable AI & SHAP', icon: BrainCircuit, target: 'xai-section' },
    { id: 'simulator', label: 'Scenario Lab', icon: SlidersHorizontal, target: 'simulator-section' },
    { id: 'nodes', label: 'Sensor Array (LoRa)', icon: Radio, target: 'nodes-section' },
  ];

  return (
    <nav className="border-b border-[#222a3d] bg-[#0c1427]/95 backdrop-blur-xl sticky top-[57px] z-40 px-3 sm:px-6 py-1.5 font-mono shadow-lg shadow-black/25">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.target, item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/50 shadow-sm shadow-cyan-500/10 font-bold'
                    : 'text-[#869397] hover:text-[#dae2fd] hover:bg-[#131b2e]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4cd7f6]' : 'text-[#869397]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Navigation Toggle Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131b2e] border border-[#222a3d] text-[#4cd7f6] text-xs font-bold"
          >
            {isMobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            <span>MENU</span>
          </button>
          <span className="text-xs text-[#869397] truncate max-w-[120px]">
            {navItems.find((n) => n.id === activeTab)?.label}
          </span>
        </div>

        {/* Right: Quick Station Selector & Direct Tactical Tools */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Target Station Selector */}
          <div className="flex items-center bg-[#070e1c] p-0.5 rounded-lg border border-[#222a3d]">
            <span className="text-[10px] text-[#869397] px-1.5 font-bold uppercase hidden sm:inline">
              Station:
            </span>
            {zones.map((z) => {
              const isSelected = z.zone_code === selectedZoneCode;
              const isHigh = z.risk_level === 'HIGH';
              const isMedium = z.risk_level === 'MEDIUM';
              const dotColor = isHigh ? 'bg-[#ef4444]' : isMedium ? 'bg-[#ffb95f]' : 'bg-[#10b981]';

              return (
                <button
                  key={z.zone_code}
                  onClick={() => onSelectZone(z.zone_code)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#06b6d4] text-[#000000] font-bold shadow-sm'
                      : 'text-[#869397] hover:text-[#dae2fd]'
                  }`}
                  title={`${z.name} (${z.elevation_m}m MSL)`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  <span>{z.zone_code.replace('ZONE-', 'Z')}</span>
                </button>
              );
            })}
          </div>

          {/* Quick SitRep Clipboard Export Button */}
          <button
            onClick={handleExportSitRep}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer border ${
              copiedSitRep
                ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                : 'bg-[#131b2e] hover:bg-[#1a233a] border-[#222a3d] text-[#dae2fd] hover:text-white'
            }`}
            title="Copy standardized UN/DEOC emergency SitRep to clipboard"
          >
            {copiedSitRep ? <Check className="w-3.5 h-3.5" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-[#4cd7f6]" />}
            <span>{copiedSitRep ? 'SITREP COPIED' : 'EXPORT SITREP'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-2 border-t border-[#222a3d] grid grid-cols-2 gap-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.target, item.id)}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all text-left ${
                  isActive
                    ? 'bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/40 font-bold'
                    : 'bg-[#131b2e] text-[#869397] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="col-span-2 flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenPerformance();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#131b2e] text-[#4cd7f6] text-xs border border-[#222a3d]"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>ML BENCHMARKS</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenIntegrations();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#131b2e] text-[#4cd7f6] text-xs border border-[#222a3d]"
            >
              <RadioReceiver className="w-3.5 h-3.5" />
              <span>EXTERNAL APIS</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
