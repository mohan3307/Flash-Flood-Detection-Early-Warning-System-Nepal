import React, { useState } from 'react';
import { Siren, Volume2, VolumeX, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { AlertItem } from '../types';

interface ActiveAlertsProps {
  alerts: AlertItem[];
  leadTimeMinutes: number;
}

export const ActiveAlerts: React.FC<ActiveAlertsProps> = ({ alerts, leadTimeMinutes }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);

  const playAlertChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (!isAudioEnabled) {
      playAlertChime();
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="rounded-xl bg-[#131b2e]/80 border border-[#222a3d] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#10b981]/15 text-[#10b981]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
                NO ACTIVE INCIDENT ALERTS
              </h3>
              <p className="text-xs text-[#869397] font-mono">
                All 4 monitored catchment sectors operating within standard baseflow parameters.
              </p>
            </div>
          </div>
          <span className="text-xs text-[#10b981] font-mono font-semibold px-2.5 py-1 rounded bg-[#10b981]/15 border border-[#10b981]/30">
            SECTORS ALL CLEAR
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-xl bg-gradient-to-r from-[#93000a]/50 via-[#171f33] to-[#0b1326] border border-[#ef4444] p-5 shadow-2xl shadow-red-950/40 relative overflow-hidden reticle-box"
        >
          {/* Animated Hazard Edge Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ef4444] via-[#ffb95f] to-[#ef4444] animate-pulse" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#ef4444] text-[#090d16] shadow-lg shadow-red-600/30 animate-pulse">
                <Siren className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] border border-[#ef4444]">
                    EMERGENCY FLASH FLOOD BREACH
                  </span>
                  <h3 className="text-base font-extrabold text-white tracking-tight font-['Space_Grotesk']">
                    {alert.headline}
                  </h3>
                </div>
                <p className="text-xs text-[#ffb4ab] mt-1 font-mono">
                  Location: <strong className="text-white">{alert.zone_name}</strong> ({alert.zone_code})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end lg:self-auto font-mono">
              {/* Lead Time Countdown Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1326] border border-[#ef4444]/60 text-[#ffb4ab] text-xs">
                <Clock className="w-4 h-4 text-[#ef4444]" />
                <span>Est. Lead Time:</span>
                <span className="font-bold text-white text-sm text-[#4cd7f6]">
                  ~{alert.lead_time_minutes || leadTimeMinutes}m
                </span>
              </div>

              {/* Siren Audio Toggle */}
              <button
                onClick={toggleAudio}
                className="p-2 rounded-lg bg-[#171f33] border border-[#3d494c] text-[#dae2fd] hover:text-white hover:bg-[#222a3d] transition cursor-pointer"
                title={isAudioEnabled ? 'Mute Alert Siren' : 'Enable Emergency Siren Audio'}
              >
                {isAudioEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#ef4444] animate-bounce" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#869397]" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#3d494c] text-xs font-mono">
            {/* Trigger Reason */}
            <div className="p-3 rounded-lg bg-[#0b1326]/80 border border-[#222a3d]">
              <span className="text-[10px] font-bold uppercase text-[#ffb4ab] block mb-1">
                // Trigger Telemetry Vector:
              </span>
              <p className="text-[#dae2fd] leading-relaxed">{alert.reason}</p>
            </div>

            {/* SOP Action Checklist */}
            <div className="p-3 rounded-lg bg-[#0b1326]/80 border border-[#222a3d]">
              <span className="text-[10px] font-bold uppercase text-[#4cd7f6] block mb-1">
                // Mandatory Standard Operating Procedure (SOP):
              </span>
              <p className="text-[#dae2fd] leading-relaxed">
                {alert.recommended_action}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
