'use client';

import { useEffect, useState } from 'react';
import { WaterMetrics } from '@/lib/tensorflow';
import { SafetyAssessment } from '@/lib/safety';

// Dynamic import to avoid SSR issues
let ApexCharts: any;
let Chart: any;

interface WaterQualityChartProps {
  metrics: WaterMetrics;
  safety: SafetyAssessment;
}

export function WaterQualityChart({ metrics, safety }: WaterQualityChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Dynamic import for client-side only
    const loadChart = async () => {
      const module = await import('react-apexcharts');
      Chart = module.default;
      setIsClient(true);
    };
    
    loadChart();
  }, []);

  const getColorByLevel = (level: string) => {
    switch (level) {
      case 'safe': return '#10B981';
      case 'caution': return '#F59E0B';
      case 'unsafe': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const gaugeOptions = {
    chart: {
      type: 'radialBar',
      height: 250,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '60%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: '20px',
            fontWeight: 600,
          },
        },
      },
    },
    colors: [
      getColorByLevel(safety.pH),
      getColorByLevel(safety.chlorine),
      getColorByLevel(safety.heavyMetal),
      getColorByLevel(safety.turbidity),
    ],
    labels: ['pH', 'Chlorine', 'Heavy Metals', 'Turbidity'],
    legend: {
      show: true,
      position: 'bottom',
    },
  };

  // Normalize metrics to 0-100 scale for display
  const normalizeMetrics = () => {
    return [
      Math.round((metrics.pH / 14) * 100), // pH 0-14 scale
      Math.round((metrics.chlorine / 2) * 100), // Chlorine 0-2 ppm scale
      Math.round((1 - metrics.heavyMetalScore / 10) * 100), // Heavy metals (inverted)
      Math.round((1 - metrics.turbidity / 5) * 100), // Turbidity (inverted)
    ];
  };

  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 300,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        const labels = ['pH', 'Chlorine (ppm)', 'Heavy Metals', 'Turbidity (NTU)'];
        const values = [metrics.pH, metrics.chlorine, metrics.heavyMetalScore, metrics.turbidity];
        return values[opts.dataPointIndex].toString();
      },
    },
    colors: [
      getColorByLevel(safety.pH),
      getColorByLevel(safety.chlorine),
      getColorByLevel(safety.heavyMetal),
      getColorByLevel(safety.turbidity),
    ],
    xaxis: {
      categories: ['pH', 'Chlorine', 'Heavy Metals', 'Turbidity'],
    },
    yaxis: {
      title: {
        text: 'Levels',
      },
    },
    legend: {
      show: false,
    },
  };

  const barChartSeries = [
    {
      name: 'Water Quality Metrics',
      data: [metrics.pH, metrics.chlorine, metrics.heavyMetalScore, metrics.turbidity],
    },
  ];

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Gauge Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Quality Overview</h3>
        <Chart
          options={gaugeOptions}
          series={normalizeMetrics()}
          type="radialBar"
          height={300}
        />
      </div>

      {/* Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Detailed Metrics</h3>
        <Chart
          options={barChartOptions}
          series={barChartSeries}
          type="bar"
          height={300}
        />
      </div>

      {/* Safety Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Safe</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Caution</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Unsafe</span>
        </div>
      </div>
    </div>
  );
} 