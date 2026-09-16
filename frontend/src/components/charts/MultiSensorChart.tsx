import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { HistoricalReading } from '../../types';
import { BarChart2 } from 'lucide-react';

interface MultiSensorChartProps {
  data: HistoricalReading[];
}

export const MultiSensorChart: React.FC<MultiSensorChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rainfall' | 'water_level' | 'rate_of_rise' | 'risk'>('all');
  const [timeRange, setTimeRange] = useState<number>(30);

  const filteredData = data.slice(-timeRange);

  return (
    <div className="rounded-xl bg-[#131b2e]/80 border border-[#222a3d] p-5 reticle-box">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6]">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
              REAL-TIME HYDRO-METEOROLOGICAL TIME SERIES
            </h3>
            <p className="text-xs text-[#869397] font-mono">
              Precipitation vs River Stage vs Surge Velocity vs AI Flood Risk
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Time Range Selector */}
          <div className="flex items-center rounded bg-[#0b1326] p-1 border border-[#222a3d]">
            {[
              { label: '10m', val: 15 },
              { label: '30m', val: 30 },
              { label: '1h', val: 60 },
              { label: 'All', val: 120 }
            ].map((t) => (
              <button
                key={t.label}
                onClick={() => setTimeRange(t.val)}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  timeRange === t.val ? 'bg-[#06b6d4] text-[#003640] font-bold' : 'text-[#869397] hover:text-[#dae2fd]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Metric Filter Tabs */}
          <div className="flex items-center rounded bg-[#0b1326] p-1 border border-[#222a3d]">
            {[
              { id: 'all', label: 'All Vectors' },
              { id: 'rainfall', label: 'Rain' },
              { id: 'water_level', label: 'Stage' },
              { id: 'rate_of_rise', label: 'Surge' },
              { id: 'risk', label: 'Risk %' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  activeTab === tab.id ? 'bg-[#222a3d] text-[#4cd7f6] font-bold border border-[#06b6d4]/40' : 'text-[#869397] hover:text-[#dae2fd]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Area */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#222a3d" />
            <XAxis
              dataKey="timeLabel"
              stroke="#869397"
              fontSize={10}
              tickLine={false}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              yAxisId="left"
              stroke="#869397"
              fontSize={10}
              tickLine={false}
              fontFamily="JetBrains Mono"
              domain={['auto', 'auto']}
            />
            {activeTab === 'all' && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#ffb95f"
                fontSize={10}
                tickLine={false}
                fontFamily="JetBrains Mono"
                domain={[0, 100]}
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

            {(activeTab === 'all' || activeTab === 'rainfall') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="rainfall"
                name="Rainfall (mm/hr)"
                stroke="#4cd7f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {(activeTab === 'all' || activeTab === 'water_level') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="waterLevel"
                name="Water Level (m)"
                stroke="#ffb95f"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {(activeTab === 'all' || activeTab === 'rate_of_rise') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="rateOfRise"
                name="Surge Velocity (m/hr)"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={false}
                isAnimationActive={false}
              />
            )}

            {(activeTab === 'all' || activeTab === 'risk') && (
              <Line
                yAxisId={activeTab === 'all' ? 'right' : 'left'}
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
