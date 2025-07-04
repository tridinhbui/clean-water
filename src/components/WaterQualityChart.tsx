'use client';

import { Droplets, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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

interface WaterQualityChartProps {
  metrics: WaterMetrics;
  className?: string;
}

export function WaterQualityChart({ metrics, className = "" }: WaterQualityChartProps) {
  const parameters = [
    { 
      name: 'pH Level', 
      value: metrics.pH, 
      unit: '', 
      ideal: { min: 6.5, max: 8.5 }, 
      color: 'blue',
      description: 'Acidity/Alkalinity balance'
    },
    { 
      name: 'Chlorine', 
      value: metrics.chlorine, 
      unit: 'ppm', 
      ideal: { min: 0.2, max: 2.0 }, 
      color: 'green',
      description: 'Disinfection level'
    },
    { 
      name: 'Turbidity', 
      value: metrics.turbidity, 
      unit: 'NTU', 
      ideal: { min: 0, max: 1.0 }, 
      color: 'yellow',
      description: 'Water clarity'
    },
    { 
      name: 'Heavy Metals', 
      value: metrics.heavyMetalScore, 
      unit: '/10', 
      ideal: { min: 0, max: 3.0 }, 
      color: 'red',
      description: 'Metal contamination score'
    },
  ];

  // Add optional parameters if they exist
  const optionalParams = [];
  if (metrics.temperature !== undefined) {
    optionalParams.push({
      name: 'Temperature',
      value: metrics.temperature,
      unit: '°C',
      ideal: { min: 15, max: 25 },
      color: 'orange',
      description: 'Water temperature'
    });
  }
  if (metrics.dissolvedOxygen !== undefined) {
    optionalParams.push({
      name: 'Dissolved Oxygen',
      value: metrics.dissolvedOxygen,
      unit: 'mg/L',
      ideal: { min: 6, max: 14 },
      color: 'cyan',
      description: 'Oxygen content'
    });
  }

  const allParameters = [...parameters, ...optionalParams];

  const getStatus = (value: number, ideal: { min: number; max: number }) => {
    if (value >= ideal.min && value <= ideal.max) return 'good';
    if (value < ideal.min * 0.8 || value > ideal.max * 1.2) return 'poor';
    return 'caution';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'caution': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'poor': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'caution': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const overallScore = allParameters.reduce((acc, param) => {
    const status = getStatus(param.value, param.ideal);
    return acc + (status === 'good' ? 100 : status === 'caution' ? 60 : 30);
  }, 0) / allParameters.length;

  const overallStatus = overallScore >= 80 ? 'good' : overallScore >= 60 ? 'caution' : 'poor';

  const RadialProgress = ({ value, max, color }: { value: number; max: number; color: string }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`text-${color}-500 transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{value.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Water Quality Analysis</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border ${getStatusColor(overallStatus)}`}>
          <div className="flex items-center gap-1">
            {getStatusIcon(overallStatus)}
            <span className="text-sm font-medium capitalize">{overallStatus}</span>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex justify-center mb-4">
          <RadialProgress value={overallScore} max={100} color="blue" />
        </div>
        <h4 className="text-xl font-semibold mb-2">Overall Quality Score</h4>
        <p className="text-gray-600 text-sm">
          {overallScore >= 80 ? 'Excellent water quality' : 
           overallScore >= 60 ? 'Good with minor concerns' : 
           'Needs attention'}
        </p>
      </div>

      {/* Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allParameters.map((param, index) => {
          const status = getStatus(param.value, param.ideal);
          const statusColor = getStatusColor(status);
          
          return (
            <div key={index} className={`p-4 rounded-lg border ${statusColor}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{param.name}</h4>
                  <p className="text-xs opacity-75">{param.description}</p>
                </div>
                {getStatusIcon(status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{param.value.toFixed(2)}</span>
                  <span className="text-sm opacity-75">{param.unit}</span>
                </div>
                
                <div className="text-xs opacity-75">
                  Ideal range: {param.ideal.min} - {param.ideal.max} {param.unit}
                </div>
                
                {/* Visual bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ease-out bg-${param.color}-500`}
                    style={{ 
                      width: `${Math.min((param.value / (param.ideal.max * 1.5)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Good</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span>Caution</span>
        </div>
        <div className="flex items-center gap-1">
          <XCircle className="w-4 h-4 text-red-500" />
          <span>Poor</span>
        </div>
      </div>
    </div>
  );
} 