'use client';

import { useEffect, useState } from 'react';
import { WaterMetrics } from '@/lib/tensorflow';
import { format } from 'date-fns';

let Chart: any;

interface AnalyticsChartsProps {
  samples: Array<{
    id: string;
    createdAt: Date;
    metrics: WaterMetrics;
  }>;
}

export function AnalyticsCharts({ samples }: AnalyticsChartsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const loadChart = async () => {
      const module = await import('react-apexcharts');
      Chart = module.default;
      setIsClient(true);
    };
    
    loadChart();
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare data for time series
  const sortedSamples = [...samples].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const timeSeriesData = sortedSamples.map(sample => ({
    x: new Date(sample.createdAt).getTime(),
    pH: sample.metrics.pH,
    chlorine: sample.metrics.chlorine,
    heavyMetal: sample.metrics.heavyMetalScore,
    turbidity: sample.metrics.turbidity,
  }));

  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'MMM dd',
      },
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
      x: {
        format: 'MMM dd, yyyy HH:mm',
      },
    },
    grid: {
      borderColor: '#f1f5f9',
    },
  };

  const series = [
    {
      name: 'pH',
      data: timeSeriesData.map(d => ({ x: d.x, y: d.pH })),
    },
    {
      name: 'Chlorine (ppm)',
      data: timeSeriesData.map(d => ({ x: d.x, y: d.chlorine })),
    },
    {
      name: 'Heavy Metals',
      data: timeSeriesData.map(d => ({ x: d.x, y: d.heavyMetal })),
    },
    {
      name: 'Turbidity (NTU)',
      data: timeSeriesData.map(d => ({ x: d.x, y: d.turbidity })),
    },
  ];

  if (samples.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available for analysis</p>
        <p className="text-sm text-gray-400 mt-2">Take some water samples to see trends here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Chart
        options={chartOptions}
        series={series}
        type="line"
        height={300}
      />
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">
            {samples.length > 0 ? (samples.reduce((sum, s) => sum + s.metrics.pH, 0) / samples.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-gray-600">Avg pH</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">
            {samples.length > 0 ? (samples.reduce((sum, s) => sum + s.metrics.chlorine, 0) / samples.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-gray-600">Avg Chlorine</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-600">
            {samples.length > 0 ? (samples.reduce((sum, s) => sum + s.metrics.heavyMetalScore, 0) / samples.length).toFixed(1) : '0.0'}
          </p>
          <p className="text-xs text-gray-600">Avg Heavy Metals</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">
            {samples.length > 0 ? (samples.reduce((sum, s) => sum + s.metrics.turbidity, 0) / samples.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-gray-600">Avg Turbidity</p>
        </div>
      </div>
    </div>
  );
} 