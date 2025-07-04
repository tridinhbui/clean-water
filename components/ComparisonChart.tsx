'use client';

import { useEffect, useState } from 'react';
import { WaterMetrics } from '@/lib/tensorflow';

// Dynamic import to avoid SSR issues
let Chart: any;

interface ComparisonChartProps {
  beforeSample: { metrics: WaterMetrics; createdAt: Date };
  afterSample: { metrics: WaterMetrics; createdAt: Date };
}

export function ComparisonChart({ beforeSample, afterSample }: ComparisonChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const loadChart = async () => {
      const module = await import('react-apexcharts');
      Chart = module.default;
      setIsClient(true);
    };
    
    loadChart();
  }, []);

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
    <div className="space-y-8">
      {/* Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Metric Comparison</h3>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={400}
        />
      </div>

      {/* Radar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Quality Profile</h3>
        <Chart
          options={radarOptions}
          series={radarSeries}
          type="radar"
          height={400}
        />
        <p className="text-sm text-gray-600 text-center mt-2">
          Values normalized for visualization (higher = better quality)
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {Math.abs(beforeSample.metrics.pH - afterSample.metrics.pH).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">pH Difference</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {Math.abs(beforeSample.metrics.chlorine - afterSample.metrics.chlorine).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Chlorine Difference</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {Math.abs(beforeSample.metrics.heavyMetalScore - afterSample.metrics.heavyMetalScore).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Heavy Metals Difference</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {Math.abs(beforeSample.metrics.turbidity - afterSample.metrics.turbidity).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Turbidity Difference</p>
        </div>
      </div>
    </div>
  );
} 