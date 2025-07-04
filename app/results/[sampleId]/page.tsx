'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WaterQualityChart } from '@/components/WaterQualityChart';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Camera,
  MapPin,
  Clock,
  Award,
  TrendingUp,
  Droplets,
  Thermometer,
  Activity,
  Zap,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface AnalysisResult {
  id: string;
  sampleId: string;
  metrics: {
    pH: number;
    chlorine: number;
    heavyMetalScore: number;
    turbidity: number;
    temperature?: number;
    dissolvedOxygen?: number;
    totalDissolvedSolids?: number;
    bacterial?: number;
  };
  safety: {
    overall: 'safe' | 'caution' | 'unsafe';
    pH: 'safe' | 'caution' | 'unsafe';
    chlorine: 'safe' | 'caution' | 'unsafe';
    heavyMetal: 'safe' | 'caution' | 'unsafe';
    turbidity: 'safe' | 'caution' | 'unsafe';
    recommendations: string[];
  };
  location?: { lat: number; lng: number };
  createdAt: string;
  analysisDetails: {
    imageQuality: 'excellent' | 'good' | 'fair' | 'poor';
    confidence: number;
    recommendations: string[];
    detailedFindings: Array<{
      parameter: string;
      value: number | string;
      status: string;
      impact: string;
      recommendation: string;
    }>;
  };
}

export default function ResultsPage({ params }: { params: { sampleId: string } }) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would fetch from API
    // For now, we'll simulate with localStorage or generate sample data
    const mockResult: AnalysisResult = {
      id: params.sampleId,
      sampleId: params.sampleId,
      metrics: {
        pH: 7.2,
        chlorine: 0.8,
        heavyMetalScore: 2.5,
        turbidity: 1.2,
        temperature: 22.5,
        dissolvedOxygen: 8.3,
        totalDissolvedSolids: 185,
        bacterial: 12,
      },
      safety: {
        overall: 'safe',
        pH: 'safe',
        chlorine: 'safe',
        heavyMetal: 'safe',
        turbidity: 'caution',
        recommendations: [
          'Water quality is generally safe for consumption',
          'Turbidity levels are slightly elevated - consider filtration',
          'Regular monitoring recommended'
        ]
      },
      location: { lat: 10.762622, lng: 106.660172 },
      createdAt: new Date().toISOString(),
      analysisDetails: {
        imageQuality: 'good',
        confidence: 87,
        recommendations: [
          'Water quality is generally safe for consumption',
          'Turbidity levels are slightly elevated - consider filtration',
          'Regular monitoring recommended'
        ],
        detailedFindings: [
          {
            parameter: 'pH Level',
            value: '7.2',
            status: 'safe',
            impact: 'Optimal for drinking water',
            recommendation: 'Maintain current levels'
          },
          {
            parameter: 'Chlorine',
            value: '0.8 ppm',
            status: 'safe',
            impact: 'Adequate disinfection',
            recommendation: 'Levels are appropriate'
          },
          {
            parameter: 'Heavy Metals',
            value: '2.5/10',
            status: 'safe',
            impact: 'Safe levels detected',
            recommendation: 'Continue monitoring'
          },
          {
            parameter: 'Turbidity',
            value: '1.2 NTU',
            status: 'caution',
            impact: 'Slight cloudiness',
            recommendation: 'Consider sediment filtration'
          }
        ]
      }
    };

    setTimeout(() => {
      setResult(mockResult);
      setLoading(false);
    }, 1000);
  }, [params.sampleId]);

  const getSafetyColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'caution': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'unsafe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSafetyIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-4 h-4" />;
      case 'caution': return <AlertTriangle className="w-4 h-4" />;
      case 'unsafe': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getGrade = (confidence: number) => {
    if (confidence >= 90) return 'A';
    if (confidence >= 80) return 'B';
    if (confidence >= 70) return 'C';
    if (confidence >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading Analysis Results</h3>
            <p className="text-gray-600">Please wait while we fetch your water quality report...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Results Not Found</h3>
            <p className="text-gray-600 mb-4">Could not load analysis results.</p>
            <Link href="/camera">
              <Button>
                <Camera className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/camera">
                  <Button variant="outline" size="sm" className="glass">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gradient">Water Quality Analysis</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(result.createdAt), 'PPpp')}
                    </div>
                    {result.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {result.location.lat.toFixed(4)}, {result.location.lng.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Badge className={getSafetyColor(result.safety.overall)}>
                {getSafetyIcon(result.safety.overall)}
                <span className="ml-2">{result.safety.overall.toUpperCase()}</span>
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Analysis Summary */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {getGrade(result.analysisDetails.confidence)}
                </div>
                <div className="text-sm text-gray-600">Water Quality Grade</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {result.analysisDetails.confidence}%
                </div>
                <div className="text-sm text-gray-600">Analysis Confidence</div>
                <Progress value={result.analysisDetails.confidence} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2 capitalize">
                  {result.analysisDetails.imageQuality}
                </div>
                <div className="text-sm text-gray-600">Image Quality</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                pH Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{result.metrics.pH}</div>
              <Badge size="sm" className={getSafetyColor(result.safety.pH)}>
                {getSafetyIcon(result.safety.pH)}
                <span className="ml-1">{result.safety.pH}</span>
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Ideal: 6.5-8.5</p>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Chlorine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{result.metrics.chlorine} ppm</div>
              <Badge size="sm" className={getSafetyColor(result.safety.chlorine)}>
                {getSafetyIcon(result.safety.chlorine)}
                <span className="ml-1">{result.safety.chlorine}</span>
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Ideal: 0.2-1.0 ppm</p>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Heavy Metals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{result.metrics.heavyMetalScore}/10</div>
              <Badge size="sm" className={getSafetyColor(result.safety.heavyMetal)}>
                {getSafetyIcon(result.safety.heavyMetal)}
                <span className="ml-1">{result.safety.heavyMetal}</span>
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Lower is better</p>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Turbidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{result.metrics.turbidity} NTU</div>
              <Badge size="sm" className={getSafetyColor(result.safety.turbidity)}>
                {getSafetyIcon(result.safety.turbidity)}
                <span className="ml-1">{result.safety.turbidity}</span>
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Ideal: &lt;1 NTU</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        {(result.metrics.temperature || result.metrics.dissolvedOxygen) && (
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-blue-600" />
                Additional Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.metrics.temperature && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">{result.metrics.temperature}°C</div>
                    <div className="text-sm text-gray-600">Temperature</div>
                  </div>
                )}
                {result.metrics.dissolvedOxygen && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">{result.metrics.dissolvedOxygen} mg/L</div>
                    <div className="text-sm text-gray-600">Dissolved Oxygen</div>
                  </div>
                )}
                {result.metrics.totalDissolvedSolids && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">{result.metrics.totalDissolvedSolids} ppm</div>
                    <div className="text-sm text-gray-600">Total Dissolved Solids</div>
                  </div>
                )}
                {result.metrics.bacterial && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">{result.metrics.bacterial} CFU/mL</div>
                    <div className="text-sm text-gray-600">Bacterial Count</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Findings */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.analysisDetails.detailedFindings.map((finding, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{finding.parameter}</h4>
                    <Badge className={getSafetyColor(finding.status)}>
                      {getSafetyIcon(finding.status)}
                      <span className="ml-1">{finding.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Value:</strong> {finding.value}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Impact:</strong> {finding.impact}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Recommendation:</strong> {finding.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Water Quality Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WaterQualityChart metrics={result.metrics} safety={result.safety} />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/camera">
            <Button className="btn-magical">
              <Camera className="w-4 h-4 mr-2" />
              Analyze Another Sample
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="glass"
            onClick={() => window.print()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>
    </div>
  );
} 