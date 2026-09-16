import React, { useState } from 'react';
import { HistoricalReading, ZoneState } from '../../types';
import { MultiSensorChart } from '../charts/MultiSensorChart';
import {
  LineChart,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Waves,
  Calendar,
} from 'lucide-react';

interface HydrographViewProps {
  history: HistoricalReading[];
  activeZone: ZoneState;
}

export const HydrographView: React.FC<HydrographViewProps> = ({
  history,
  activeZone,
}) => {
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const latest = history.length > 0 ? history[history.length - 1] : null;
  const currentStage = activeZone?.water_level || (latest ? latest.waterLevel : 1.2);
  const currentRainfall = activeZone?.rainfall_intensity || (latest ? latest.rainfall : 12.0);
  const currentRateOfRise = activeZone?.rate_of_rise || (latest ? latest.rateOfRise : 0.05);

  // Projected +45m peak
  const projectedPeak = Number(
    (currentStage + Math.max(0, currentRateOfRise) * 0.6).toFixed(2)
  );

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const header = 'Timestamp,TimeLabel,Precipitation_mm_hr,Stage_m,Surge_m_hr,RiskProbability_pct,RiskLevel\n';
    const rows = history
      .map(
        (h) =>
          `${h.timestamp},${h.timeLabel},${h.rainfall},${h.waterLevel},${h.rateOfRise},${h.riskProbability},${h.riskLevel}`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensora_telemetry_${activeZone?.zone_code || 'ZONE-B'}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Hydrograph Metric KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Stage */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#869397] font-mono">Current River Stage</span>
            <Waves className="w-4 h-4 text-[#ffb95f]" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#ffb95f]">
              {currentStage.toFixed(2)} <span className="text-xs text-[#869397]">m</span>
            </div>
            <div className="text-[11px] font-mono text-[#869397] mt-1">
              Warning: 3.5m • Breach: 4.5m
            </div>
          </div>
          <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentStage >= 4.5
                  ? 'bg-[#ef4444]'
                  : currentStage >= 3.5
                  ? 'bg-[#ffb95f]'
                  : 'bg-[#10b981]'
              }`}
              style={{ width: `${Math.min(100, (currentStage / 6.0) * 100)}%` }}
            />
          </div>
        </div>

        {/* Precipitation Rate */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#869397] font-mono">Precipitation Intensity</span>
            <TrendingUp className="w-4 h-4 text-[#4cd7f6]" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#4cd7f6]">
              {currentRainfall.toFixed(1)} <span className="text-xs text-[#869397]">mm/h</span>
            </div>
            <div className="text-[11px] font-mono text-[#869397] mt-1">
              Catchment Cloudburst Sensor
            </div>
          </div>
          <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4cd7f6] transition-all duration-500"
              style={{ width: `${Math.min(100, (currentRainfall / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Surge Velocity */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#869397] font-mono">Surge Rate of Rise</span>
            <ArrowUpRight
              className={`w-4 h-4 ${
                currentRateOfRise > 0 ? 'text-[#ef4444]' : 'text-[#10b981]'
              }`}
            />
          </div>
          <div className="my-2">
            <div
              className={`text-2xl font-bold font-mono ${
                currentRateOfRise > 0 ? 'text-[#ef4444]' : 'text-[#10b981]'
              }`}
            >
              {currentRateOfRise > 0 ? '+' : ''}
              {currentRateOfRise.toFixed(2)}{' '}
              <span className="text-xs text-[#869397]">m/hr</span>
            </div>
            <div className="text-[11px] font-mono text-[#869397] mt-1">
              Hydraulic Wave Velocity
            </div>
          </div>
          <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentRateOfRise > 0.3 ? 'bg-[#ef4444]' : 'bg-[#10b981]'
              }`}
              style={{ width: `${Math.min(100, (Math.max(0, currentRateOfRise) / 1.5) * 100)}%` }}
            />
          </div>
        </div>

        {/* AI Crest Projection */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#869397] font-mono">+45m AI Crest Peak</span>
            <Clock className="w-4 h-4 text-[#ffb95f]" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#ffb95f]">
              {projectedPeak.toFixed(2)} <span className="text-xs text-[#869397]">m</span>
            </div>
            <div className="text-[11px] font-mono text-[#869397] mt-1">
              Routing Model Forecast
            </div>
          </div>
          <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ffb95f] transition-all duration-500"
              style={{ width: `${Math.min(100, (projectedPeak / 6.0) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main MultiSensorChart */}
      <MultiSensorChart data={history} />

      {/* Real-Time Telemetry Log Table */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#222a3d]">
          <div>
            <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
              Live Rolling Telemetry Stream Log ({history.length} Ingested Samples)
            </h3>
            <p className="text-xs text-[#869397] font-mono">
              High-frequency 1Hz sensor buffer with stage, precipitation, and ML confidence
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
              downloaded
                ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]'
                : 'bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 text-[#4cd7f6] border-[#06b6d4]/40'
            }`}
          >
            {downloaded ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'CSV EXPORTED' : 'EXPORT CSV LOG'}</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-72 mt-3 scrollbar-thin">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0b1326] text-[#869397] sticky top-0 border-b border-[#222a3d]">
              <tr>
                <th className="p-2">Time (NPT)</th>
                <th className="p-2">Rainfall (mm/h)</th>
                <th className="p-2">River Stage (m)</th>
                <th className="p-2">Surge Velocity (m/h)</th>
                <th className="p-2">Risk Probability</th>
                <th className="p-2">Threat Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222a3d]/50">
              {history
                .slice()
                .reverse()
                .slice(0, 30)
                .map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#171f33] transition-colors">
                    <td className="p-2 text-white font-bold">{row.timeLabel}</td>
                    <td className="p-2 text-[#4cd7f6]">{row.rainfall.toFixed(1)}</td>
                    <td className="p-2 text-[#ffb95f]">{row.waterLevel.toFixed(2)}</td>
                    <td
                      className={`p-2 ${
                        row.rateOfRise > 0 ? 'text-[#ef4444]' : 'text-[#10b981]'
                      }`}
                    >
                      {row.rateOfRise > 0 ? '+' : ''}
                      {row.rateOfRise.toFixed(2)}
                    </td>
                    <td className="p-2 text-[#dae2fd]">{row.riskProbability.toFixed(1)}%</td>
                    <td className="p-2">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          row.riskLevel === 'HIGH'
                            ? 'bg-[#ef4444]/20 text-[#ffb4ab] border border-[#ef4444]/40'
                            : row.riskLevel === 'MEDIUM'
                            ? 'bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/40'
                            : 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                        }`}
                      >
                        {row.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
