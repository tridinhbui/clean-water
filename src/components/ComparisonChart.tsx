'use client';

import { useEffect, useState } from 'react';
import { WaterMetrics } from '@/lib/tensorflow';
import { BarChart3, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

// Dynamic import to avoid SSR issues
let Chart: any;

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

interface ComparisonChartProps {
  beforeSample: Sample;
  afterSample: Sample;
  className?: string;
}

export function ComparisonChart({ beforeSample, afterSample, className = "" }: ComparisonChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const loadChart = async () => {
      const module = await import('react-apexcharts');
      Chart = module.default;
      setIsClient(true);
    };
    
    loadChart();
  }, []);

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
    return ((after - before) / before * 100).toFixed(1);
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 400,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        grouped: true,
        borderRadius: 3,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(2),
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
    xaxis: {
      categories: ['pH', 'Chlorine (ppm)','Bronze', 'Heavy Metals', 'Turbidity (NTU)'],
    },
    yaxis: {
      title: {
        text: 'Values',
      },
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const chartSeries = [
    {
      name: 'Before',
      data: [
        beforeSample.metrics.pH,
        beforeSample.metrics.chlorine,
        beforeSample.metrics.heavyMetalScore,
        beforeSample.metrics.turbidity,
      ],
    },
    {
      name: 'After',
      data: [
        afterSample.metrics.pH,
        afterSample.metrics.chlorine,
        afterSample.metrics.heavyMetalScore,
        afterSample.metrics.turbidity,
      ],
    },
  ];

  const radarOptions = {
    chart: {
      type: 'radar',
      height: 400,
    },
    xaxis: {
      categories: ['pH', 'Chlorine', 'Heavy Metals', 'Turbidity'],
    },
    colors: ['#3B82F6', '#10B981'],
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.1,
    },
    markers: {
      size: 4,
    },
    legend: {
      position: 'top',
    },
  };

  // Normalize values for radar chart (0-100 scale)
  const normalizeValue = (value: number, metric: string) => {
    switch (metric) {
      case 'pH':
        return (value / 14) * 100;
      case 'chlorine':
        return (value / 2) * 100;
      case 'heavyMetalScore':
        return (1 - value / 10) * 100; // Inverted - lower is better
      case 'turbidity':
        return (1 - value / 5) * 100; // Inverted - lower is better
      default:
        return value;
    }
  };

  const radarSeries = [
    {
      name: 'Before',
      data: [
        normalizeValue(beforeSample.metrics.pH, 'pH'),
        normalizeValue(beforeSample.metrics.chlorine, 'chlorine'),
        normalizeValue(beforeSample.metrics.heavyMetalScore, 'heavyMetalScore'),
        normalizeValue(beforeSample.metrics.turbidity, 'turbidity'),
      ],
    },
    {
      name: 'After',
      data: [
        normalizeValue(afterSample.metrics.pH, 'pH'),
        normalizeValue(afterSample.metrics.chlorine, 'chlorine'),
        normalizeValue(afterSample.metrics.heavyMetalScore, 'heavyMetalScore'),
        normalizeValue(afterSample.metrics.turbidity, 'turbidity'),
      ],
    },
  ];

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Sample Comparison</h3>
      </div>

      {/* Comparison Table */}
      <div className="bg-white/50 rounded-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Parameter</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Before</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">After</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Change</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">% Change</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param, index) => {
                const change = param.after - param.before;
                const percentChange = getPercentageChange(param.before, param.after);
                
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">{param.name}</td>
                    <td className="px-4 py-3 text-center">
                      {param.before}{param.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {param.after}{param.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getChangeIcon(param.before, param.after)}
                        <span className={getChangeColor(param.before, param.after, param.ideal)}>
                          {change > 0 ? '+' : ''}{change.toFixed(2)}{param.unit}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={getChangeColor(param.before, param.after, param.ideal)}>
                        {percentChange > 0 ? '+' : ''}{percentChange}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parameters.map((param, index) => (
          <div key={index} className="p-4 bg-white/50 rounded-lg border border-white/20">
            <h4 className="font-medium mb-3">{param.name}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Before:</span>
                <span className="font-medium">{param.before}{param.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((param.before / (param.name.includes('pH') ? 14 : 10)) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600">After:</span>
                <span className="font-medium">{param.after}{param.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((param.after / (param.name.includes('pH') ? 14 : 10)) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">
                  Ideal: {param.ideal}{param.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <div className="text-center text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-xl font-medium mb-2">Interactive Comparison Charts</h4>
          <p className="text-sm mb-4">Advanced side-by-side analysis coming soon</p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Bar Charts
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trend Lines
            </span>
            <span className="flex items-center gap-1">
              <ArrowLeftRight className="w-3 h-3" />
              Side-by-Side
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-white/50 rounded-lg border border-white/20">
        <h4 className="font-medium mb-2">Summary</h4>
        <div className="text-sm text-gray-600">
          <p>Before: {new Date(beforeSample.createdAt).toLocaleDateString()}</p>
          <p>After: {new Date(afterSample.createdAt).toLocaleDateString()}</p>
          <p className="mt-2">
            Overall trend: {
              parameters.filter(p => Math.abs(p.after - p.ideal) < Math.abs(p.before - p.ideal)).length > 
              parameters.filter(p => Math.abs(p.after - p.ideal) > Math.abs(p.before - p.ideal)).length
                ? 'Improving' : 'Needs attention'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 