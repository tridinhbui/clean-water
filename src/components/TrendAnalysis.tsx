'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaterMetrics } from '@/lib/tensorflow';
import { assessWaterSafety } from '@/lib/safety';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, subDays, differenceInDays } from 'date-fns';

interface TrendAnalysisProps {
  samples: Array<{
    id: string;
    createdAt: Date;
    metrics: WaterMetrics;
  }>;
}

interface TrendInsight {
  metric: string;
  trend: 'improving' | 'declining' | 'stable';
  change: number;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export function TrendAnalysis({ samples }: TrendAnalysisProps) {
  if (samples.length < 3) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Insufficient Data</h3>
            <p className="text-gray-600">
              We need at least 3 samples to perform trend analysis. Take more samples to see insights here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedSamples = [...samples].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const calculateTrend = (values: number[]): { trend: 'improving' | 'declining' | 'stable'; change: number } => {
    if (values.length < 2) return { trend: 'stable', change: 0 };
    
    const recent = values.slice(-3); // Last 3 values
    const older = values.slice(0, Math.max(1, values.length - 3)); // Earlier values
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const change = recentAvg - olderAvg;
    const threshold = 0.1; // Sensitivity threshold
    
    if (Math.abs(change) < threshold) return { trend: 'stable', change };
    return { trend: change > 0 ? 'improving' : 'declining', change };
  };

  // Extract metric arrays
  const phValues = sortedSamples.map(s => s.metrics.pH);
  const chlorineValues = sortedSamples.map(s => s.metrics.chlorine);
  const heavyMetalValues = sortedSamples.map(s => s.metrics.heavyMetalScore);
  const turbidityValues = sortedSamples.map(s => s.metrics.turbidity);

  // Calculate trends
  const phTrend = calculateTrend(phValues);
  const chlorineTrend = calculateTrend(chlorineValues);
  const heavyMetalTrend = calculateTrend(heavyMetalValues);
  const turbidityTrend = calculateTrend(turbidityValues);

  const insights: TrendInsight[] = [
    {
      metric: 'pH Levels',
      trend: Math.abs(phTrend.change) > 0.5 ? (phTrend.trend === 'improving' ? 'improving' : 'declining') : 'stable',
      change: phTrend.change,
      severity: Math.abs(phTrend.change) > 1 ? 'high' : Math.abs(phTrend.change) > 0.5 ? 'medium' : 'low',
      message: Math.abs(phTrend.change) > 0.5 
        ? `pH levels have ${phTrend.trend === 'improving' ? 'increased' : 'decreased'} by ${Math.abs(phTrend.change).toFixed(2)} units recently`
        : 'pH levels are stable within acceptable range'
    },
    {
      metric: 'Chlorine Content',
      trend: chlorineTrend.trend,
      change: chlorineTrend.change,
      severity: Math.abs(chlorineTrend.change) > 0.5 ? 'high' : Math.abs(chlorineTrend.change) > 0.2 ? 'medium' : 'low',
      message: Math.abs(chlorineTrend.change) > 0.2
        ? `Chlorine levels ${chlorineTrend.trend === 'improving' ? 'increased' : 'decreased'} by ${Math.abs(chlorineTrend.change).toFixed(2)} ppm`
        : 'Chlorine levels are consistent'
    },
    {
      metric: 'Heavy Metal Contamination',
      trend: heavyMetalTrend.trend === 'declining' ? 'improving' : heavyMetalTrend.trend === 'improving' ? 'declining' : 'stable', // Inverted for heavy metals
      change: -heavyMetalTrend.change, // Inverted
      severity: Math.abs(heavyMetalTrend.change) > 1 ? 'high' : Math.abs(heavyMetalTrend.change) > 0.5 ? 'medium' : 'low',
      message: Math.abs(heavyMetalTrend.change) > 0.5
        ? `Heavy metal contamination has ${heavyMetalTrend.trend === 'declining' ? 'decreased' : 'increased'} recently`
        : 'Heavy metal levels are stable'
    },
    {
      metric: 'Water Clarity (Turbidity)',
      trend: turbidityTrend.trend === 'declining' ? 'improving' : turbidityTrend.trend === 'improving' ? 'declining' : 'stable', // Inverted for turbidity
      change: -turbidityTrend.change, // Inverted
      severity: Math.abs(turbidityTrend.change) > 1 ? 'high' : Math.abs(turbidityTrend.change) > 0.5 ? 'medium' : 'low',
      message: Math.abs(turbidityTrend.change) > 0.5
        ? `Water clarity has ${turbidityTrend.trend === 'declining' ? 'improved' : 'decreased'} by ${Math.abs(turbidityTrend.change).toFixed(2)} NTU`
        : 'Water clarity is consistent'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High Impact</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Impact</Badge>;
      default:
        return <Badge variant="outline">Low Impact</Badge>;
    }
  };

  // Calculate overall water quality trend
  const safetyScores = sortedSamples.map(sample => {
    const safety = assessWaterSafety(sample.metrics);
    return safety.overall === 'safe' ? 3 : safety.overall === 'warning' ? 2 : 1;
  });

  const recentSafetyAvg = safetyScores.slice(-3).reduce((sum, score) => sum + score, 0) / Math.min(3, safetyScores.length);
  const olderSafetyAvg = safetyScores.slice(0, -3).length > 0 
    ? safetyScores.slice(0, -3).reduce((sum, score) => sum + score, 0) / safetyScores.slice(0, -3).length 
    : recentSafetyAvg;

  const overallTrend = recentSafetyAvg > olderSafetyAvg ? 'improving' : recentSafetyAvg < olderSafetyAvg ? 'declining' : 'stable';

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Detailed Trend Analysis
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on {samples.length} samples over {differenceInDays(new Date(sortedSamples[sortedSamples.length - 1].createdAt), new Date(sortedSamples[0].createdAt))} days
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Assessment */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            {getTrendIcon(overallTrend)}
            <h3 className="font-semibold">Overall Water Quality Trend</h3>
          </div>
          <p className="text-sm text-gray-600">
            Your water quality is{' '}
            <span className={`font-medium ${
              overallTrend === 'improving' ? 'text-green-600' : 
              overallTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {overallTrend === 'improving' ? 'improving' : overallTrend === 'declining' ? 'declining' : 'stable'}
            </span>{' '}
            based on recent measurements.
          </p>
        </div>

        {/* Individual Metric Insights */}
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTrendIcon(insight.trend)}
                  <h4 className="font-medium">{insight.metric}</h4>
                </div>
                {getSeverityBadge(insight.severity)}
              </div>
              <p className="text-sm text-gray-600">{insight.message}</p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-900">Recommendations</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            {insights.some(i => i.trend === 'declining' && i.severity === 'high') && (
              <li>• Consider professional water testing for declining metrics</li>
            )}
            {overallTrend === 'improving' && (
              <li>• Continue current water treatment practices</li>
            )}
            <li>• Monitor trends regularly with consistent testing</li>
            <li>• Keep track of any changes in water sources or treatment</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 