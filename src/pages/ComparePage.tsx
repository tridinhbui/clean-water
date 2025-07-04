import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeftRight, 
  BarChart3, 
  Calendar, 
  MapPin,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export default function ComparePage() {
  const [selectedSamples, setSelectedSamples] = useState<string[]>(['1', '2']);

  // Mock comparison data
  const availableSamples = [
    {
      id: '1',
      date: '2024-01-15',
      location: 'Kitchen Tap',
      score: 92,
      status: 'safe',
      parameters: { ph: 7.2, chlorine: 0.8, turbidity: 0.9, heavyMetals: 2.1 }
    },
    {
      id: '2',
      date: '2024-01-14',
      location: 'Bathroom Sink',
      score: 78,
      status: 'caution',
      parameters: { ph: 6.8, chlorine: 1.2, turbidity: 1.8, heavyMetals: 3.2 }
    },
    {
      id: '3',
      date: '2024-01-13',
      location: 'Garden Hose',
      score: 95,
      status: 'safe',
      parameters: { ph: 7.4, chlorine: 0.6, turbidity: 0.5, heavyMetals: 1.8 }
    },
    {
      id: '4',
      date: '2024-01-12',
      location: 'Kitchen Tap',
      score: 85,
      status: 'safe',
      parameters: { ph: 7.0, chlorine: 0.9, turbidity: 1.1, heavyMetals: 2.5 }
    }
  ];

  const comparedSamples = availableSamples.filter(sample => 
    selectedSamples.includes(sample.id)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800';
      case 'unsafe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParameterComparison = (param: string, values: number[]) => {
    if (values.length < 2) return null;
    const diff = values[1] - values[0];
    const percentage = Math.abs((diff / values[0]) * 100);
    
    return {
      diff,
      percentage: percentage.toFixed(1),
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same'
    };
  };

  const addSample = (sampleId: string) => {
    if (!selectedSamples.includes(sampleId) && selectedSamples.length < 4) {
      setSelectedSamples([...selectedSamples, sampleId]);
    }
  };

  const removeSample = (sampleId: string) => {
    setSelectedSamples(selectedSamples.filter(id => id !== sampleId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Compare Tests</h1>
                <p className="text-gray-600">Compare water quality results side by side</p>
              </div>
              <ArrowLeftRight className="w-8 h-8 text-blue-600" />
            </div>
          </CardHeader>
        </Card>

        {/* Sample Selection */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Select Samples to Compare ({selectedSamples.length}/4)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableSamples.map((sample) => {
                const isSelected = selectedSamples.includes(sample.id);
                return (
                  <div 
                    key={sample.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white/50 hover:bg-white/70'
                    }`}
                    onClick={() => isSelected ? removeSample(sample.id) : addSample(sample.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getStatusColor(sample.status)}>
                        {sample.status.toUpperCase()}
                      </Badge>
                      <Button
                        size="sm"
                        variant={isSelected ? "destructive" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          isSelected ? removeSample(sample.id) : addSample(sample.id);
                        }}
                      >
                        {isSelected ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span>{sample.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span>{sample.location}</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        Score: {sample.score}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {comparedSamples.length >= 2 && (
          <>
            {/* Score Comparison */}
            <Card className="glass border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Score Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {comparedSamples.map((sample) => (
                    <div key={sample.id} className="text-center p-4 bg-white/50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{sample.location}</div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">{sample.score}</div>
                      <div className="text-xs text-gray-500">{sample.date}</div>
                      <Badge className={`mt-2 ${getStatusColor(sample.status)}`}>
                        {sample.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Parameter Comparison */}
            <Card className="glass border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Parameter Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['ph', 'chlorine', 'turbidity', 'heavyMetals'].map((param) => (
                    <div key={param} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-medium mb-3 capitalize">
                        {param === 'ph' ? 'pH Level' : 
                         param === 'heavyMetals' ? 'Heavy Metals' : 
                         param.charAt(0).toUpperCase() + param.slice(1)}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {comparedSamples.map((sample, index) => {
                          const value = sample.parameters[param as keyof typeof sample.parameters];
                          const comparison = index > 0 ? getParameterComparison(
                            param, 
                            comparedSamples.slice(0, index + 1).map(s => s.parameters[param as keyof typeof s.parameters])
                          ) : null;
                          
                          return (
                            <div key={sample.id} className="text-center p-3 bg-white/50 rounded-lg">
                              <div className="text-sm text-gray-600">{sample.location}</div>
                              <div className="text-2xl font-bold text-blue-600">
                                {value}
                                {param === 'chlorine' && ' ppm'}
                                {param === 'turbidity' && ' NTU'}
                                {param === 'heavyMetals' && '/10'}
                              </div>
                              {comparison && (
                                <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${
                                  comparison.trend === 'up' ? 'text-red-500' : 
                                  comparison.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                                }`}>
                                  {comparison.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                                  {comparison.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                                  <span>{comparison.percentage}%</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Summary */}
            <Card className="glass border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Best Performing Sample</h4>
                    <p className="text-blue-700">
                      {comparedSamples.reduce((best, current) => 
                        current.score > best.score ? current : best
                      ).location} ({comparedSamples.reduce((best, current) => 
                        current.score > best.score ? current : best
                      ).date}) with a score of {comparedSamples.reduce((best, current) => 
                        current.score > best.score ? current : best
                      ).score}
                    </p>
                  </div>
                  
                  {comparedSamples.some(s => s.status === 'caution' || s.status === 'unsafe') && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Areas of Concern</h4>
                      <p className="text-yellow-700">
                        Some samples show caution or unsafe levels. Consider retesting or improving filtration.
                      </p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Recommendations</h4>
                    <ul className="text-green-700 space-y-1">
                      <li>• Monitor locations with lower scores more frequently</li>
                      <li>• Consider installing additional filtration where needed</li>
                      <li>• Track trends over time for better insights</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {comparedSamples.length < 2 && (
          <Card className="glass border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Select at least 2 samples to compare
              </h3>
              <p className="text-gray-500">
                Choose samples from the selection above to view detailed comparisons.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 