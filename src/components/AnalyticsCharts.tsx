'use client';

import { TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { useState } from 'react';

interface WaterMetrics {
  pH: number;
  chlorine: number;
  turbidity: number;
  heavyMetalScore: number;
  temperature?: number;
  dissolvedOxygen?: number;
  totalDissolvedSolids?: number;
  bacterial?: number;
}

interface AnalyticsData {
  timestamp: string;
  metrics: WaterMetrics;
  location?: string;
}

interface AnalyticsChartsProps {
  data: AnalyticsData[];
  className?: string;
}

export function AnalyticsCharts({ data = [], className = "" }: AnalyticsChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState<keyof WaterMetrics>('pH');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const metrics = [
    { key: 'pH' as const, label: 'pH Level', unit: '', ideal: 7.0, color: 'blue' },
    { key: 'chlorine' as const, label: 'Chlorine', unit: 'ppm', ideal: 1.0, color: 'green' },
    { key: 'turbidity' as const, label: 'Turbidity', unit: 'NTU', ideal: 1.0, color: 'yellow' },
    { key: 'heavyMetalScore' as const, label: 'Heavy Metals', unit: '/10', ideal: 2.0, color: 'red' },
  ];

  const getFilteredData = () => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return data.filter(item => new Date(item.timestamp) >= cutoff);
  };

  const filteredData = getFilteredData();
  const selectedMetricData = metrics.find(m => m.key === selectedMetric)!;

  const SimpleLineChart = () => {
    if (!filteredData.length) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No data available</p>
          </div>
        </div>
      );
    }

    const values = filteredData.map(item => item.metrics[selectedMetric] || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    return (
      <div className="h-64 p-4 relative">
        <div className="h-full flex items-end gap-2">
          {filteredData.map((item, index) => {
            const value = item.metrics[selectedMetric] || 0;
            const height = ((value - minValue) / range) * 200 + 20;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`bg-${selectedMetricData.color}-500 rounded-t transition-all duration-300 min-w-2`}
                  style={{ height: `${height}px` }}
                  title={`${new Date(item.timestamp).toLocaleDateString()}: ${value.toFixed(2)}${selectedMetricData.unit}`}
                />
                <div className="text-xs text-gray-500 mt-1 transform -rotate-45">
                  {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>{maxValue.toFixed(1)}</span>
          <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
          <span>{minValue.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  const StatCard = ({ metric }: { metric: typeof metrics[0] }) => {
    const latestValue = filteredData.length > 0 ? filteredData[filteredData.length - 1].metrics[metric.key] || 0 : 0;
    const previousValue = filteredData.length > 1 ? filteredData[filteredData.length - 2].metrics[metric.key] || 0 : latestValue;
    const trend = latestValue > previousValue ? 'up' : latestValue < previousValue ? 'down' : 'stable';
    const percentChange = previousValue !== 0 ? ((latestValue - previousValue) / previousValue * 100) : 0;

    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">{metric.label}</h3>
          {trend !== 'stable' && (
            <TrendingUp className={`w-4 h-4 ${trend === 'up' ? 'text-green-500' : 'text-red-500 transform rotate-180'}`} />
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{latestValue.toFixed(2)}</span>
          <span className="text-sm text-gray-500">{metric.unit}</span>
        </div>
        {trend !== 'stable' && (
          <div className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}% from previous
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          Ideal: {metric.ideal}{metric.unit}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Water Quality Analytics</h2>
        </div>
        
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <StatCard key={metric.key} metric={metric} />
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Trend Analysis</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as keyof WaterMetrics)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            {metrics.map((metric) => (
              <option key={metric.key} value={metric.key}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
        
        <SimpleLineChart />
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Total Samples</div>
            <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
          </div>
          <div>
            <div className="text-gray-500">Date Range</div>
            <div className="font-medium">
              {filteredData.length > 0 && (
                <>
                  {new Date(filteredData[0].timestamp).toLocaleDateString()} - {' '}
                  {new Date(filteredData[filteredData.length - 1].timestamp).toLocaleDateString()}
                </>
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Quality Status</div>
            <div className="font-medium text-green-600">Monitored</div>
          </div>
        </div>
      </div>
    </div>
  );
} 