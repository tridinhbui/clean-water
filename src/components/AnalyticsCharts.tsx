'use client';

import { BarChart3, TrendingUp, LineChart } from 'lucide-react';

interface WaterMetrics {
  pH: number;
  chlorine: number;
  turbidity: number;
  heavyMetalScore: number;
}

interface Sample {
  id: string;
  createdAt: string | Date;
  metrics: WaterMetrics;
}

interface AnalyticsChartsProps {
  samples: Sample[];
  className?: string;
}

export function AnalyticsCharts({ samples, className = "" }: AnalyticsChartsProps) {
  // Mock data for demonstration
  const chartData = samples.slice(0, 10).map((sample, index) => ({
    date: new Date(sample.createdAt).toLocaleDateString(),
    pH: sample.metrics.pH,
    chlorine: sample.metrics.chlorine,
    turbidity: sample.metrics.turbidity,
    score: Math.round((sample.metrics.pH / 14 + (2 - sample.metrics.chlorine) / 2 + (5 - sample.metrics.turbidity) / 5 + (10 - sample.metrics.heavyMetalScore) / 10) * 25)
  }));

  const averages = {
    pH: samples.length > 0 ? (samples.reduce((acc, s) => acc + s.metrics.pH, 0) / samples.length).toFixed(1) : '0',
    chlorine: samples.length > 0 ? (samples.reduce((acc, s) => acc + s.metrics.chlorine, 0) / samples.length).toFixed(1) : '0',
    turbidity: samples.length > 0 ? (samples.reduce((acc, s) => acc + s.metrics.turbidity, 0) / samples.length).toFixed(1) : '0',
    heavyMetal: samples.length > 0 ? (samples.reduce((acc, s) => acc + s.metrics.heavyMetalScore, 0) / samples.length).toFixed(1) : '0'
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Analytics Overview</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white/50 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-blue-600">{averages.pH}</div>
          <div className="text-sm text-gray-600">Avg pH</div>
        </div>
        <div className="p-4 bg-white/50 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-green-600">{averages.chlorine}</div>
          <div className="text-sm text-gray-600">Avg Chlorine</div>
        </div>
        <div className="p-4 bg-white/50 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-yellow-600">{averages.turbidity}</div>
          <div className="text-sm text-gray-600">Avg Turbidity</div>
        </div>
        <div className="p-4 bg-white/50 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-red-600">{averages.heavyMetal}</div>
          <div className="text-sm text-gray-600">Avg Heavy Metals</div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <div className="text-center text-gray-500">
          <LineChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-xl font-medium mb-2">Interactive Analytics Charts</h4>
          <p className="text-sm mb-4">Advanced time-series analysis coming soon</p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trend Analysis
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Comparative Views
            </span>
            <span className="flex items-center gap-1">
              <LineChart className="w-3 h-3" />
              Time Series
            </span>
          </div>
        </div>
      </div>

      {/* Recent Samples Table */}
      {samples.length > 0 && (
        <div className="bg-white/50 rounded-lg border border-white/20 overflow-hidden">
          <div className="p-4 border-b border-white/20">
            <h4 className="font-medium">Recent Samples</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">pH</th>
                  <th className="px-4 py-2 text-left">Chlorine</th>
                  <th className="px-4 py-2 text-left">Turbidity</th>
                  <th className="px-4 py-2 text-left">Heavy Metals</th>
                </tr>
              </thead>
              <tbody>
                {samples.slice(0, 5).map((sample, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-2">
                      {new Date(sample.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{sample.metrics.pH}</td>
                    <td className="px-4 py-2">{sample.metrics.chlorine}</td>
                    <td className="px-4 py-2">{sample.metrics.turbidity}</td>
                    <td className="px-4 py-2">{sample.metrics.heavyMetalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {samples.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No data available for analytics</p>
          <p className="text-sm">Take some water quality tests to see charts and trends here</p>
        </div>
      )}
    </div>
  );
} 