import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { HistoricalReading } from '../../types';
import { BarChart2, TrendingUp } from 'lucide-react';

interface MultiSensorChartProps {
  data: HistoricalReading[];
}

export const MultiSensorChart: React.FC<MultiSensorChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rainfall' | 'water_level' | 'rate_of_rise' | 'risk'>('all');
  const [timeRange, setTimeRange] = useState<number>(30);
  const [showForecast, setShowForecast] = useState<boolean>(true);

  // Latest telemetry reading
  const latest = data.length > 0 ? data[data.length - 1] : null;
  const currentWaterLevel = latest ? latest.waterLevel : 1.2;
  const currentRateOfRise = latest ? latest.rateOfRise : 0.05;

  // Extrapolate forward hydrograph projection (+15m, +30m, +45m)
  const chartData = useMemo(() => {
    const historical = data.slice(-timeRange).map((d) => ({
      ...d,
      isForecast: false,
      forecastWaterLevel: null as number | null,
    }));

    if (!showForecast || historical.length === 0) {
      return historical;
    }

    const lastPoint = historical[historical.length - 1];
    const baseStage = lastPoint.waterLevel;
    const surgeMultiplier = Math.max(0, lastPoint.rateOfRise);

    // Dynamic crest dampening based on hydrological routing
    const proj15 = Math.max(0.5, Number((baseStage + surgeMultiplier * 0.25).toFixed(2)));
    const proj30 = Math.max(0.5, Number((baseStage + surgeMultiplier * 0.45).toFixed(2)));
    const proj45 = Math.max(0.5, Number((baseStage + surgeMultiplier * 0.60).toFixed(2)));

    // Connect the last historical point with the forecast
    historical[historical.length - 1] = {
      ...lastPoint,
      forecastWaterLevel: baseStage,
    };

    const forecastPoints = [
      {
        timeLabel: '+15m (Est)',
        timestamp: '',
        rainfall: Math.max(0, Number((lastPoint.rainfall * 0.9).toFixed(1))),
        waterLevel: null as any,
        forecastWaterLevel: proj15,
        rateOfRise: lastPoint.rateOfRise,
        riskProbability: Math.min(100, Math.round(lastPoint.riskProbability * 1.08)),
        riskLevel: lastPoint.riskLevel,
        isForecast: true,
      },
      {
        timeLabel: '+30m (Est)',
        timestamp: '',
        rainfall: Math.max(0, Number((lastPoint.rainfall * 0.8).toFixed(1))),
        waterLevel: null as any,
        forecastWaterLevel: proj30,
        rateOfRise: lastPoint.rateOfRise * 0.9,
        riskProbability: Math.min(100, Math.round(lastPoint.riskProbability * 1.12)),
        riskLevel: lastPoint.riskLevel,
        isForecast: true,
      },
      {
        timeLabel: '+45m (Crest)',
        timestamp: '',
        rainfall: Math.max(0, Number((lastPoint.rainfall * 0.65).toFixed(1))),
        waterLevel: null as any,
        forecastWaterLevel: proj45,
        rateOfRise: lastPoint.rateOfRise * 0.7,
        riskProbability: Math.min(100, Math.round(lastPoint.riskProbability * 1.15)),
        riskLevel: lastPoint.riskLevel,
        isForecast: true,
      },
    ];

    return [...historical, ...forecastPoints];
  }, [data, timeRange, showForecast]);

  // Projected peak calculation
  const projectedPeak = latest
    ? Math.max(
        latest.waterLevel,
        Number((latest.waterLevel + Math.max(0, latest.rateOfRise) * 0.6).toFixed(2))
      )
    : 1.2;

  const isWarningStage = currentWaterLevel >= 3.5 || projectedPeak >= 3.5;
  const isDangerStage = currentWaterLevel >= 4.5 || projectedPeak >= 4.5;

  return (
    <div className="rounded-xl bg-[#131b2e]/80 border border-[#222a3d] p-5 reticle-box">
      {/* Chart Header & Controls */}
      <div className="flex flex-col gap-2.5 mb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
                  HYDROLOGICAL TIME SERIES & CREST FORECAST
                </h3>
                {showForecast && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#171f33] text-[#4cd7f6] border border-[#06b6d4]/30">
                    +45m AI FORECAST
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#869397] font-mono">
                Left: River Stage (m) & Surge (m/h) • Right: Rainfall (mm/h) & Flood Risk (%)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForecast(!showForecast)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer transition border font-mono text-xs ${
              showForecast
                ? 'bg-[#06b6d4]/15 border-[#06b6d4] text-[#4cd7f6]'
                : 'bg-[#0b1326] border-[#222a3d] text-[#869397] hover:text-[#dae2fd]'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>{showForecast ? 'Forecast: ON' : 'Forecast: OFF'}</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#222a3d]/70 font-mono text-xs">
          {/* Metric Filter Tabs */}
          <div className="flex items-center rounded bg-[#0b1326] p-0.5 border border-[#222a3d]">
            {[
              { id: 'all', label: 'All Vectors' },
              { id: 'rainfall', label: 'Rain Only' },
              { id: 'water_level', label: 'Stage Only' },
              { id: 'rate_of_rise', label: 'Surge Only' },
              { id: 'risk', label: 'Risk Only' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2 py-0.5 rounded cursor-pointer transition text-[11px] ${
                  activeTab === tab.id
                    ? 'bg-[#222a3d] text-[#4cd7f6] font-bold border border-[#06b6d4]/40'
                    : 'text-[#869397] hover:text-[#dae2fd]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center rounded bg-[#0b1326] p-0.5 border border-[#222a3d]">
            {[
              { label: '10m', val: 15 },
              { label: '30m', val: 30 },
              { label: '1h', val: 60 },
              { label: 'All', val: 120 },
            ].map((t) => (
              <button
                key={t.label}
                onClick={() => setTimeRange(t.val)}
                className={`px-2 py-0.5 rounded cursor-pointer transition text-[11px] ${
                  timeRange === t.val ? 'bg-[#06b6d4] text-[#003640] font-bold' : 'text-[#869397] hover:text-[#dae2fd]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Crest Forecast Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 font-mono text-xs">
        <div className="p-2 rounded bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
          <span className="text-[#869397] text-[11px]">Current Stage:</span>
          <span className="font-bold text-white text-xs">{currentWaterLevel.toFixed(2)} m</span>
        </div>
        <div className="p-2 rounded bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
          <span className="text-[#869397] text-[11px]">Surge Velocity:</span>
          <span
            className={`font-bold text-xs ${
              currentRateOfRise > 0.3 ? 'text-[#ef4444]' : currentRateOfRise > 0.1 ? 'text-[#ffb95f]' : 'text-[#10b981]'
            }`}
          >
            {currentRateOfRise > 0 ? `+${currentRateOfRise.toFixed(2)}` : currentRateOfRise.toFixed(2)} m/hr
          </span>
        </div>
        <div className="p-2 rounded bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
          <span className="text-[#869397] text-[11px]">Proj. Crest (45m):</span>
          <span
            className={`font-bold text-xs ${
              projectedPeak >= 4.5
                ? 'text-[#ef4444] animate-pulse'
                : projectedPeak >= 3.5
                ? 'text-[#ffb95f]'
                : 'text-[#4cd7f6]'
            }`}
          >
            ~{projectedPeak.toFixed(2)} m
          </span>
        </div>
        <div className="p-2 rounded bg-[#0b1326] border border-[#222a3d] flex items-center justify-between">
          <span className="text-[#869397] text-[11px]">Bankfull Margin:</span>
          <span
            className={`font-bold text-xs ${
              isDangerStage ? 'text-[#ef4444]' : isWarningStage ? 'text-[#ffb95f]' : 'text-[#10b981]'
            }`}
          >
            {currentWaterLevel >= 3.5 ? 'BREACH RISK' : `${(3.5 - currentWaterLevel).toFixed(2)}m to Warning`}
          </span>
        </div>
      </div>

      {/* Recharts Area with Independent Left / Right Scales */}
      <div className="h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#222a3d" />
            <XAxis
              dataKey="timeLabel"
              stroke="#869397"
              fontSize={10}
              tickLine={false}
              fontFamily="JetBrains Mono"
            />

            {/* Left Y-Axis: River Stage (meters) */}
            {(activeTab === 'all' || activeTab === 'water_level' || activeTab === 'rate_of_rise') && (
              <YAxis
                yAxisId="stageLeft"
                stroke="#ffb95f"
                fontSize={10}
                tickLine={false}
                fontFamily="JetBrains Mono"
                domain={[0, 6.0]}
                ticks={[0, 1.5, 3.0, 4.5, 6.0]}
                allowDataOverflow={true}
                unit="m"
                label={{
                  value: 'Stage (m)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#ffb95f',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                  offset: 15,
                }}
              />
            )}

            {/* Right Y-Axis: Rainfall (mm/hr) & Flood Risk (%) */}
            {(activeTab === 'all' || activeTab === 'rainfall' || activeTab === 'risk') && (
              <YAxis
                yAxisId="rainRight"
                orientation="right"
                stroke="#4cd7f6"
                fontSize={10}
                tickLine={false}
                fontFamily="JetBrains Mono"
                domain={[0, 100]}
                label={{
                  value: 'Rain (mm/h) / Risk (%)',
                  angle: 90,
                  position: 'insideRight',
                  fill: '#4cd7f6',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                  offset: 15,
                }}
              />
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: '#131b2e',
                borderColor: '#06b6d4',
                borderRadius: '0.5rem',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                color: '#dae2fd',
                boxShadow: '0 12px 25px -3px rgba(0, 0, 0, 0.75)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '8px' }} />

            {/* Threshold Reference Lines on Stage Axis */}
            {(activeTab === 'all' || activeTab === 'water_level') && (
              <>
                <ReferenceLine
                  yAxisId="stageLeft"
                  y={3.5}
                  stroke="#ffb95f"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Warning (3.5m)',
                    fill: '#ffb95f',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />
                <ReferenceLine
                  yAxisId="stageLeft"
                  y={4.5}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Bankfull Breach (4.5m)',
                    fill: '#ef4444',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />
              </>
            )}

            {/* River Stage (m) - on Left Axis */}
            {(activeTab === 'all' || activeTab === 'water_level') && (
              <Line
                yAxisId="stageLeft"
                type="monotone"
                dataKey="waterLevel"
                name="River Stage (m)"
                stroke="#ffb95f"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Projected Forecast Line (m) - on Left Axis */}
            {showForecast && (activeTab === 'all' || activeTab === 'water_level') && (
              <Line
                yAxisId="stageLeft"
                type="monotone"
                dataKey="forecastWaterLevel"
                name="AI Crest Proj. (m)"
                stroke="#ffddb8"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#ffddb8' }}
                isAnimationActive={false}
              />
            )}

            {/* Surge Velocity (m/hr) - on Left Axis */}
            {(activeTab === 'all' || activeTab === 'rate_of_rise') && (
              <Line
                yAxisId="stageLeft"
                type="monotone"
                dataKey="rateOfRise"
                name="Surge Velocity (m/hr)"
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Rainfall (mm/hr) - on Right Axis */}
            {(activeTab === 'all' || activeTab === 'rainfall') && (
              <Line
                yAxisId="rainRight"
                type="monotone"
                dataKey="rainfall"
                name="Rainfall (mm/hr)"
                stroke="#4cd7f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Flood Risk (%) - on Right Axis */}
            {(activeTab === 'all' || activeTab === 'risk') && (
              <Line
                yAxisId="rainRight"
                type="monotone"
                dataKey="riskProbability"
                name="Flood Risk (%)"
                stroke="#acedff"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
