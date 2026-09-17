import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, XCircle, MapPin, Waves, Radio, Activity, ExternalLink, Download, FileSpreadsheet, ArrowUpRight, Phone, Navigation } from 'lucide-react';
import { StreamFrame, ZoneState } from '../../types';

interface SafetyStatusViewProps {
  frame: StreamFrame;
  activeZone: ZoneState;
  onSelectZone: (zoneCode: string) => void;
  onOpenIntegrations: () => void;
}

export const SafetyStatusView: React.FC<SafetyStatusViewProps> = ({
  frame,
  activeZone,
  onSelectZone,
  onOpenIntegrations,
}) => {
  const isHigh = frame.overall_risk === 'HIGH';
  const isMedium = frame.overall_risk === 'MEDIUM';
  const isSafe = frame.overall_risk === 'LOW' && frame.alerts_count === 0;

  // Calculate Overall Safety Index Percentage
  const safetyIndex = isSafe ? 98 : isMedium ? 64 : 14;

  const safetyConfig = isSafe
    ? {
        statusTitle: 'STATUS: NEPAL MONITORED CATCHMENT IS SAFE',
        badgeText: 'SAFE CONDITION',
        badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/70 shadow-emerald-950/50',
        heroBg: 'from-emerald-950/50 via-slate-900/90 to-slate-950',
        borderColor: 'border-emerald-500/60',
        glowColor: 'shadow-emerald-500/20',
        textColor: 'text-emerald-400',
        icon: ShieldCheck,
        summaryText: 'All 4 monitoring stations across Sindhupalchok (Melamchi-Indrawati river corridor) report baseline flow within seasonal safety limits. No active cloudburst or GLOF threats detected.',
        advisory: '✅ All pedestrian footbridges, Bailey bridge vehicular crossings, and regional highway corridors are OPEN & SAFE for public transit.',
        actionRequired: 'No emergency evacuation required. Maintain standard monsoonal weather awareness.',
      }
    : isMedium
    ? {
        statusTitle: 'STATUS: NEPAL CATCHMENT UNDER SURGE WATCH',
        badgeText: 'MODERATE SURGE ADVISORY',
        badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-500/70 shadow-amber-950/50',
        heroBg: 'from-amber-950/50 via-slate-900/90 to-slate-950',
        borderColor: 'border-amber-500/60',
        glowColor: 'shadow-amber-500/20',
        textColor: 'text-amber-400',
        icon: AlertCircle,
        summaryText: 'Sustained monsoonal rainfall in upper gorges causing steady river stage rise (+0.18m/hr). Localized bank overflow possible in low-lying alluvial plains.',
        advisory: '⚠️ Avoid sandbank activities and low-altitude river crossings. Local disaster management teams (CDMC) placed on active standby.',
        actionRequired: 'Prepare emergency go-bags and register mobile numbers for automated Twilio SMS alert notifications.',
      }
    : {
        statusTitle: 'STATUS: NEPAL CATCHMENT IS NOT SAFE — CRITICAL FLASH FLOOD DANGER',
        badgeText: 'NOT SAFE — MANDATORY EVACUATION',
        badgeBg: 'bg-red-950/90 text-red-100 border-red-500/90 shadow-red-950/80 animate-pulse',
        heroBg: 'from-red-950/70 via-slate-900/95 to-slate-950',
        borderColor: 'border-red-500/80',
        glowColor: 'shadow-red-500/40',
        textColor: 'text-red-400',
        icon: AlertTriangle,
        summaryText: 'CRITICAL SURGE DETECTED! Rapid upstream cloudburst runoff creating violent hydraulic surge (+0.45m/hr rate of rise). River stage exceeding 3.5m bankfull limit.',
        advisory: '🚨 DANGER: ALL RIVERBED APPROACHES CLOSED. AUTOMATED BARRIERS ACTIVATED AT MELAMCHI BAILEY BRIDGE.',
        actionRequired: 'IMMEDIATE EVACUATION ORDER FOR WARD 11, PUL BAZAAR, & RIVERSIDE SETTLEMENTS. PROCEED TO MELAMCHI HIGHER SEC. SAFE CAMP (935m MSL).',
      };

  const StatusIcon = safetyConfig.icon;

  const infrastructureStatus = [
    {
      name: 'Melamchi Pul (Bailey Bridge Crossing)',
      elevation: '870m MSL',
      status: isHigh ? 'NOT SAFE / CLOSED' : isMedium ? 'CAUTION / WATCH' : 'SAFE / OPEN',
      isSafe: !isHigh,
      clearance: isHigh ? 'Pier clearance compromised (Stage >3.5m)' : 'Normal clearance (+4.2m margin)',
    },
    {
      name: 'Melamchi Higher Sec. School Safe Camp',
      elevation: '935m MSL (+65m vertical clearance)',
      status: 'SAFE / DESIGNATED SHELTER',
      isSafe: true,
      clearance: 'Equipped with filtration & medical casualty desk',
    },
    {
      name: 'Bahunepati Emergency Helipad & Health Post',
      elevation: '785m MSL (+65m vertical clearance)',
      status: 'SAFE / ARMY CLEARING POINT',
      isSafe: true,
      clearance: 'Highland terrace safe from surge debris',
    },
    {
      name: 'Bahunepati Foot Suspension Bridge',
      elevation: '722m MSL',
      status: isHigh ? 'NOT SAFE / CLOSED' : 'SAFE / FOOT PASSAGE',
      isSafe: !isHigh,
      clearance: isHigh ? 'High velocity crest surge danger' : 'Foot passage clear to eastern ridge',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* 1. HUGE SINGLE-PAGE SAFETY CONDITION HERO DISPLAY */}
      <div className={`relative rounded-3xl overflow-hidden glass-panel border ${safetyConfig.borderColor} bg-gradient-to-br ${safetyConfig.heroBg} p-6 sm:p-8 shadow-2xl ${safetyConfig.glowColor}`}>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Top Indicator Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-extrabold border ${safetyConfig.badgeBg}`}>
                <StatusIcon className="w-4 h-4 animate-bounce" />
                <span>{safetyConfig.badgeText}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/90 text-slate-300 font-mono text-xs border border-slate-700">
                Sindhupalchok Monitored Catchment
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-500/40">
                1Hz Live Sensor Stream
              </span>
            </div>

            {/* Huge Status Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
              {safetyConfig.statusTitle}
            </h1>

            {/* Summary & Advisory */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans font-medium">
              {safetyConfig.summaryText}
            </p>

            {/* Advisory Highlight Card */}
            <div className={`p-4 rounded-2xl bg-slate-950/80 border ${safetyConfig.borderColor} text-xs sm:text-sm font-mono font-bold leading-relaxed`}>
              <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                // Official Resident & Visitor Safety Clearance:
              </div>
              <div className={safetyConfig.textColor}>{safetyConfig.advisory}</div>
              <div className="text-white mt-1.5 font-sans font-bold">{safetyConfig.actionRequired}</div>
            </div>
          </div>

          {/* Large Safety Gauge Circle Indicator */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl shrink-0 self-center lg:self-auto min-w-[200px]">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={safetyConfig.textColor}
                  strokeDasharray={`${safetyIndex}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-3xl font-black font-mono ${safetyConfig.textColor}`}>
                  {safetyIndex}%
                </span>
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400">
                  Safety Index
                </span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs font-mono font-bold text-white block">
                {isSafe ? 'CONDITION: SAFE' : isMedium ? 'CONDITION: WATCH' : 'CONDITION: NOT SAFE'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Updated {new Date().toLocaleTimeString()} NPT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BILINGUAL EMERGENCY BROADCAST BANNER (NEPALI / ENGLISH) */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-[#030712]/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-extrabold text-cyan-400 tracking-wider uppercase">
              BILINGUAL EMERGENCY CITIZEN BROADCAST // सूचना
            </span>
          </div>
          <p className="text-sm font-bold text-white font-sans">
            {isHigh
              ? 'अति जरुरी सूचना: मेलम्ची तथा इन्द्रावती तटीय क्षेत्रमा भीषण बाढीको जोखिम उत्पन्न भएको छ। तुरुन्त सुरक्षित स्थानमा जानुहोस्।'
              : isMedium
              ? 'बाढी सचेतना: नदी किनारमा बाढीको बहाव बढ्दै गएकाले सतर्कता अपनाउनुहोस्।'
              : 'सूचना: मेलम्ची जलाधार क्षेत्रमा नदीको बहाव सामान्य र सुरक्षित अवस्थामा रहेको छ।'}
          </p>
          <p className="text-xs text-slate-400">
            {isHigh
              ? 'URGENT: Flash flood alert active in Melamchi & Indrawati river banks. Move to elevated shelters immediately.'
              : 'NOTICE: River water levels are nominal. All catchment corridors are currently operating under safe baseline.'}
          </p>
        </div>

        <button
          onClick={onOpenIntegrations}
          className="px-4 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-md transition-all hover:scale-105"
        >
          <Phone className="w-4 h-4 text-cyan-400" />
          <span>SUBSCRIBE SMS ALERTS</span>
        </button>
      </div>

      {/* 3. REGIONAL RIVER BASIN SAFETY MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {frame.zones.map((z) => {
          const isZoneHigh = z.risk_level === 'HIGH';
          const isZoneMedium = z.risk_level === 'MEDIUM';
          const zoneColor = isZoneHigh ? 'text-red-400 border-red-500/60 bg-red-950/40' : isZoneMedium ? 'text-amber-400 border-amber-500/60 bg-amber-950/40' : 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40';

          return (
            <div
              key={z.zone_code}
              onClick={() => onSelectZone(z.zone_code)}
              className={`p-5 rounded-2xl glass-panel glass-panel-hover border flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                z.zone_code === activeZone.zone_code ? 'ring-2 ring-cyan-400/60 shadow-xl shadow-cyan-950/50' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {z.zone_code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold border ${zoneColor}`}>
                    {isZoneHigh ? 'NOT SAFE' : isZoneMedium ? 'WATCH' : 'SAFE'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-['Outfit'] truncate">
                    {z.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {z.subtext} • {z.elevation_m}m MSL
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Stage:</span>
                    <strong className="text-white font-bold">{z.water_level.toFixed(2)}m</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Rainfall:</span>
                    <strong className="text-cyan-400 font-bold">{z.rainfall_intensity.toFixed(0)} mm/h</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Status: <strong className="text-white">{z.status}</strong></span>
                <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                  View HUD <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. CRITICAL INFRASTRUCTURE & BRIDGES SAFETY AUDIT TABLE */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#030712]/90 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-['Outfit']">
                Infrastructure & Pedestrian Bridge Safety Matrix
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-time structural clearance and safe highland evacuation sites in Melamchi Basin
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/40">
            DEOC INTEGRATED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-3">Location / Infrastructure Name</th>
                <th className="py-3 px-3">Elevation</th>
                <th className="py-3 px-3">Safety Status</th>
                <th className="py-3 px-3">Hydraulic Clearance & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {infrastructureStatus.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                    {item.isSafe ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-bold">{item.elevation}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        item.isSafe
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                          : 'bg-red-950/80 text-red-200 border-red-500/70'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">{item.clearance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
