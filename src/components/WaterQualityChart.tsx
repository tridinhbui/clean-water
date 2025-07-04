import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface WaterMetrics {
  pH: number;
  chlorine: number;
  turbidity: number;
  heavyMetalScore: number;
}

interface WaterQualityChartProps {
  metrics: WaterMetrics;
  className?: string;
}

export function WaterQualityChart({ metrics, className = "" }: WaterQualityChartProps) {
  const parameters = [
    { name: 'pH Level', value: metrics.pH, ideal: 7.0, unit: '', color: 'bg-blue-500', max: 14 },
    { name: 'Chlorine', value: metrics.chlorine, ideal: 1.0, unit: 'ppm', color: 'bg-green-500', max: 5 },
    { name: 'Turbidity', value: metrics.turbidity, ideal: 1.0, unit: 'NTU', color: 'bg-yellow-500', max: 10 },
    { name: 'Heavy Metals', value: metrics.heavyMetalScore, ideal: 2.0, unit: '/10', color: 'bg-red-500', max: 10 }
  ];

  const getValuePercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  const getTrendIcon = (value: number, ideal: number) => {
    const diff = Math.abs(value - ideal);
    if (diff <= 0.5) return <TrendingUp className="w-3 h-3 text-green-500" />;
    return <TrendingDown className="w-3 h-3 text-yellow-500" />;
  };

  const getStatusColor = (value: number, ideal: number) => {
    const diff = Math.abs(value - ideal);
    if (diff <= 0.5) return 'text-green-600';
    if (diff <= 1.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Water Quality Metrics</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parameters.map((param, index) => {
          const percentage = getValuePercentage(param.value, param.max);
          
          return (
            <div key={index} className="p-4 bg-white/50 rounded-lg border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{param.name}</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(param.value, param.ideal)}
                  <span className={`text-sm font-medium ${getStatusColor(param.value, param.ideal)}`}>
                    {param.value}{param.unit}
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${param.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span className="text-green-600 font-medium">Ideal: {param.ideal}{param.unit}</span>
                <span>{param.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Quality Score */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <h4 className="font-semibold text-lg mb-4">Overall Water Quality</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {parameters.map((param, index) => {
              const isGood = Math.abs(param.value - param.ideal) <= 0.5;
              return (
                <div key={index} className="text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    isGood ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {isGood ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600">{param.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Chart Placeholder */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <div className="text-center text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Interactive Charts Coming Soon</p>
          <p className="text-sm">Advanced analytics and trending data will be available here</p>
        </div>
      </div>

      {/* Safety Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Safe Range</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Caution</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Outside Safe Range</span>
        </div>
      </div>
    </div>
  );
} 