'use client';

import { useState } from 'react';
import { WaterMetrics } from '@/lib/tensorflow';
import { BarChart3, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

interface Sample {
  id: string;
  createdAt: string | Date;
  metrics: WaterMetrics;
}

interface ComparisonChartProps {
  beforeSample: Sample;
  afterSample: Sample;
  className?: string;
}

export function ComparisonChart({ beforeSample, afterSample, className = "" }: ComparisonChartProps) {
  const [viewType, setViewType] = useState<'bar' | 'table'>('table');

  const parameters = [
    { name: 'pH Level', before: beforeSample.metrics.pH, after: afterSample.metrics.pH, unit: '', ideal: 7.0 },
    { name: 'Chlorine', before: beforeSample.metrics.chlorine, after: afterSample.metrics.chlorine, unit: 'ppm', ideal: 1.0 },
    { name: 'Turbidity', before: beforeSample.metrics.turbidity, after: afterSample.metrics.turbidity, unit: 'NTU', ideal: 1.0 },
    { name: 'Heavy Metals', before: beforeSample.metrics.heavyMetalScore, after: afterSample.metrics.heavyMetalScore, unit: '/10', ideal: 2.0 }
  ];

  const getChangeIcon = (before: number, after: number) => {
    const diff = after - before;
    if (Math.abs(diff) < 0.1) return null;
    return diff > 0 ? 
      <TrendingUp className="w-4 h-4 text-red-500" /> : 
      <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  const getChangeColor = (before: number, after: number, ideal: number) => {
    const beforeDiff = Math.abs(before - ideal);
    const afterDiff = Math.abs(after - ideal);
    
    if (afterDiff < beforeDiff) return 'text-green-600'; // Improvement
    if (afterDiff > beforeDiff) return 'text-red-600'; // Deterioration
    return 'text-gray-600'; // No significant change
  };

  const getPercentageChange = (before: number, after: number) => {
    if (before === 0) return 0;
    return Number(((after - before) / before * 100).toFixed(1));
  };

  const BarChart = () => {
    const maxValue = Math.max(
      ...parameters.flatMap(p => [p.before, p.after])
    );

    return (
      <div className="space-y-4">
        {parameters.map((param, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>{param.name}</span>
              <span className="text-gray-500">{param.unit}</span>
            </div>
            <div className="flex gap-2 items-end h-12">
              <div className="flex-1 space-y-1">
                <div className="text-xs text-gray-500">Before</div>
                <div 
                  className="bg-blue-500 rounded-t"
                  style={{ 
                    height: `${(param.before / maxValue) * 40}px`,
                    minHeight: '4px'
                  }}
                />
                <div className="text-xs text-center">{param.before.toFixed(1)}</div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-xs text-gray-500">After</div>
                <div 
                  className="bg-green-500 rounded-t"
                  style={{ 
                    height: `${(param.after / maxValue) * 40}px`,
                    minHeight: '4px'
                  }}
                />
                <div className="text-xs text-center">{param.after.toFixed(1)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Sample Comparison</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('table')}
            className={`px-3 py-1 rounded ${viewType === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
          >
            Table
          </button>
          <button
            onClick={() => setViewType('bar')}
            className={`px-3 py-1 rounded ${viewType === 'bar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
          >
            Chart
          </button>
        </div>
      </div>

      {viewType === 'bar' ? (
        <div className="p-4 border rounded-lg bg-white">
          <BarChart />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Before</th>
                <th className="border border-gray-200 px-4 py-2 text-center">After</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Change</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param, index) => {
                const change = getPercentageChange(param.before, param.after);
                const changeColor = getChangeColor(param.before, param.after, param.ideal);
                
                return (
                  <tr key={index}>
                    <td className="border border-gray-200 px-4 py-2 font-medium">
                      {param.name} {param.unit && `(${param.unit})`}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      {param.before.toFixed(2)}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      {param.after.toFixed(2)}
                    </td>
                    <td className={`border border-gray-200 px-4 py-2 text-center ${changeColor}`}>
                      {change > 0 ? '+' : ''}{change}%
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      {getChangeIcon(param.before, param.after)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 