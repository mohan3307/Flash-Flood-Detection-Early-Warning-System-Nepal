import React, { useState } from 'react';
import { AlertItem, ZoneState } from '../../types';
import { ActiveAlerts } from '../ActiveAlerts';
import {
  AlertTriangle,
  BellRing,
  Volume2,
  FileSpreadsheet,
  Check,
  Radio,
  Clock,
  ShieldAlert,
  Send,
  MessageSquare,
  Users,
  Camera,
  ShieldCheck,
  RadioTower,
} from 'lucide-react';

interface AlertsViewProps {
  alerts: AlertItem[];
  leadTimeMinutes: number;
  zones: ZoneState[];
  selectedZoneCode: string;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  leadTimeMinutes,
  zones,
  selectedZoneCode,
}) => {
  const [copiedSitRep, setCopiedSitRep] = useState<boolean>(false);
  const [dispatchedSMS, setDispatchedSMS] = useState<boolean>(false);

  const activeZone =
    zones.find((z) => z.zone_code === selectedZoneCode) || zones[0];

  const handleExportSitRep = () => {
    const timestamp = new Date().toISOString();
    const sitRepText = `=== SENSORA TACTICAL DISASTER MANAGEMENT SITUATION REPORT ===
Timestamp: ${timestamp}
Target Catchment: Sindhupalchok, Nepal (Melamchi-Indrawati Corridor)
Selected Station: ${activeZone?.name || 'Pul Bazaar'} (${activeZone?.zone_code})
Threat Status: ${alerts.length > 0 ? 'CRITICAL ALERT' : 'NOMINAL'}
Active Incident Alerts: ${alerts.length}
Lead Time to Crest: ${leadTimeMinutes} Minutes
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

  const handleSimulateBroadcast = () => {
    setDispatchedSMS(true);
    setTimeout(() => setDispatchedSMS(false), 3000);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-lg border shadow-lg ${
              alerts.length > 0
                ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/50 animate-pulse shadow-red-500/20'
                : 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40'
            }`}
          >
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Active Incident Alerts & Evacuation Dispatch Center
              </h2>
              <span
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                  alerts.length > 0
                    ? 'bg-[#ef4444]/20 text-[#ffb4ab] border border-[#ef4444]/50'
                    : 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40'
                }`}
              >
                {alerts.length > 0 ? `${alerts.length} INCIDENTS ACTIVE` : 'ALL NOMINAL'}
              </span>
            </div>
            <p className="text-xs text-[#869397] font-mono mt-0.5">
              Automated SOP triggers, acoustic siren broadcast, and downstream settlement evacuation protocols
            </p>
          </div>
        </div>

        {/* Lead-Time Countdown & 1-Click SitRep */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          <div className="bg-[#0b1326] px-3 py-2 rounded-lg border border-[#222a3d] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ffb95f]" />
            <div>
              <span className="text-[9px] text-[#869397] block">Evacuation Window</span>
              <span className="font-bold text-white text-sm">
                {leadTimeMinutes} Minutes
              </span>
            </div>
          </div>

          <button
            onClick={handleExportSitRep}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              copiedSitRep
                ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                : 'bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 border-[#06b6d4]/50 text-[#4cd7f6]'
            }`}
          >
            {copiedSitRep ? <Check className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>{copiedSitRep ? 'SITREP COPIED!' : 'EXPORT SITREP'}</span>
          </button>
        </div>
      </div>

      {/* Main Active Alerts Emergency Banner */}
      <ActiveAlerts alerts={alerts} leadTimeMinutes={leadTimeMinutes} />

      {/* Real-world Operations Center Photo Card */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 relative h-64 sm:h-80 overflow-hidden">
          <img
            src="/assets/images/command_center.jpg"
            alt="National Emergency Operations Center (DEOC / NDRRMA) Nepal"
            className="w-full h-full object-cover filter brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#131b2e]" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b1326]/90 border border-[#06b6d4]/50 backdrop-blur-md text-[#4cd7f6] text-[11px] font-mono font-bold">
            <RadioTower className="w-3.5 h-3.5" />
            <span>NEPAL DEOC INCIDENT COMMAND CENTER</span>
          </div>
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-[#0b1326]/80 text-[#dae2fd] text-[10px] font-mono border border-[#222a3d]">
            National Disaster Risk Reduction & Management Authority (NDRRMA) • Singha Durbar / Sindhupalchok
          </div>
        </div>

        <div className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#ef4444]/20 text-[#ffb4ab] border border-[#ef4444]/40 rounded font-bold">
                INCIDENT RESPONSE PROTOCOL
              </span>
              <span className="text-xs text-[#869397] font-mono">
                Level 3 SOP
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Multi-Agency Disaster Coordination Desk
            </h3>
            <p className="text-xs text-[#869397] leading-relaxed mt-1">
              Integrated early warning feed connected directly to Nepal Armed Police Force (APF), Department of Hydrology and Meteorology (DHM), and local municipal ward sirens.
            </p>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2 rounded bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
              <span className="text-[#869397]">DEOC Emergency Hotline:</span>
              <strong className="text-[#4cd7f6]">1155 (Toll-Free)</strong>
            </div>
            <div className="p-2 rounded bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
              <span className="text-[#869397]">APF Search & Rescue:</span>
              <strong className="text-[#ffb95f]">1114 / Melamchi Base</strong>
            </div>
            <div className="p-2 rounded bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
              <span className="text-[#869397]">Automated Siren Delay:</span>
              <strong className="text-[#10b981]">&lt; 1.2 seconds</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual Emergency Alert Broadcaster & Downstream Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: CAP Standard Emergency Broadcast Simulator */}
        <div className="lg:col-span-7 bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#4cd7f6]" />
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  Automated Multilingual CAP SMS & Cell Broadcast
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#10b981] font-bold">
                NTC & NCELL GATEWAY
              </span>
            </div>

            <div className="space-y-3 mt-3 font-mono text-xs">
              {/* Nepali SMS Alert */}
              <div className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#ffb95f]">
                    🇳🇵 नेपाली (Nepali Emergency SMS Broadcast)
                  </span>
                  <span className="text-[10px] text-[#869397]">CAP v1.2</span>
                </div>
                <p className="text-[11px] text-[#dae2fd] leading-relaxed">
                  "चेतावनी! मेलम्ची-इन्द्रावती नदीमा बाढीको खतरा छ। जलसतह {activeZone?.water_level.toFixed(1)} मिटर पुगेको छ। तुरुन्त सुरक्षित उच्च स्थान वा मेलम्ची मावि सुरक्षित केन्द्रमा जानुहोस्। - जिल्ला विपद् व्यवस्थापन (DEOC)"
                </p>
              </div>

              {/* English SMS Alert */}
              <div className="bg-[#0b1326] p-3 rounded-lg border border-[#222a3d]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#4cd7f6]">
                    🌐 English (Standard UN Disaster Broadcast)
                  </span>
                  <span className="text-[10px] text-[#869397]">OASIS CAP</span>
                </div>
                <p className="text-[11px] text-[#dae2fd] leading-relaxed">
                  "FLASH FLOOD ALERT: Melamchi River stage at {activeZone?.water_level.toFixed(2)}m (Critical). Evacuation lead-time is {leadTimeMinutes} mins. Move immediately to high-ground shelters. - Sindhupalchok DEOC"
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222a3d] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#869397]">
              Covers Ward 11, Pul Bazaar, Helambu, Bahunepati (Est. 4,200 residents)
            </span>
            <button
              onClick={handleSimulateBroadcast}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                dispatchedSMS
                  ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]'
                  : 'bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ffb4ab] border-[#ef4444]/50'
              }`}
            >
              {dispatchedSMS ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{dispatchedSMS ? 'BROADCAST DISPATCHED!' : 'DISPATCH CELL ALERT'}</span>
            </button>
          </div>
        </div>

        {/* Right: Downstream Population Risk Summary */}
        <div className="lg:col-span-5 bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ffb95f]" />
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  Downstream Settlement Impact Matrix
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#869397]">
                POPULATION AT RISK
              </span>
            </div>

            <div className="space-y-2 mt-3 font-mono text-xs">
              {[
                { name: 'Melamchi Pul Bazaar', pop: '1,850 Residents', risk: 'HIGH HAZARD', delay: '0 mins (Immediate)' },
                { name: 'Bahunepati Lowlands', pop: '1,200 Residents', risk: 'HIGH HAZARD', delay: '+18 mins wave transit' },
                { name: 'Tarke Ghyang Ridge', pop: '650 Residents', risk: 'SAFE (UPLAND)', delay: 'No flood impact' },
                { name: 'Helambu Valley Base', pop: '900 Residents', risk: 'MEDIUM WATCH', delay: '+8 mins surge' },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#0b1326] border border-[#222a3d] flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-bold text-[11px]">{row.name}</div>
                    <div className="text-[10px] text-[#869397]">{row.pop} • {row.delay}</div>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      row.risk.includes('HIGH')
                        ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                        : row.risk.includes('MEDIUM')
                        ? 'bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/40'
                        : 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                    }`}
                  >
                    {row.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222a3d] text-[10px] font-mono text-[#869397]">
            Emergency Dispatch Line: DEOC Sindhupalchok <strong className="text-white">1155</strong> / Armed Police Force <strong className="text-white">1114</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
