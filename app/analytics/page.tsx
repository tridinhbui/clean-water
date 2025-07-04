import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { WaterMetrics } from '@/lib/tensorflow';
import { assessWaterSafety } from '@/lib/safety';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { TrendAnalysis } from '@/components/TrendAnalysis';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar,
  ArrowLeft,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import Link from 'next/link';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

async function getUserSamples(userId: string, days = 30) {
  const cutoffDate = subDays(new Date(), days);
  
  const samples = await prisma.sample.findMany({
    where: { 
      userId,
      createdAt: {
        gte: cutoffDate
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return samples.map(sample => ({
    ...sample,
    metrics: sample.metrics as WaterMetrics,
  }));
}

function calculateTrends(samples: Array<{ metrics: WaterMetrics; createdAt: Date }>) {
  if (samples.length < 2) return null;

  const sortedSamples = [...samples].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const first = sortedSamples[0];
  const last = sortedSamples[sortedSamples.length - 1];

  return {
    ph: {
      change: last.metrics.pH - first.metrics.pH,
      trend: last.metrics.pH > first.metrics.pH ? 'up' : 'down',
    },
    chlorine: {
      change: last.metrics.chlorine - first.metrics.chlorine,
      trend: last.metrics.chlorine > first.metrics.chlorine ? 'up' : 'down',
    },
    heavyMetals: {
      change: last.metrics.heavyMetalScore - first.metrics.heavyMetalScore,
      trend: last.metrics.heavyMetalScore < first.metrics.heavyMetalScore ? 'up' : 'down', // Lower is better
    },
    turbidity: {
      change: last.metrics.turbidity - first.metrics.turbidity,
      trend: last.metrics.turbidity < first.metrics.turbidity ? 'up' : 'down', // Lower is better
    },
  };
}

function getSafetyDistribution(samples: Array<{ metrics: WaterMetrics }>) {
  const distribution = {
    safe: 0,
    warning: 0,
    danger: 0,
  };

  samples.forEach(sample => {
    const safety = assessWaterSafety(sample.metrics);
    distribution[safety.overall as keyof typeof distribution]++;
  });

  return distribution;
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Please sign in to view your analytics.
            </p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [samples30, samples7, samples90] = await Promise.all([
    getUserSamples(session.user.id, 30),
    getUserSamples(session.user.id, 7),
    getUserSamples(session.user.id, 90),
  ]);

  const trends = calculateTrends(samples30);
  const safetyDistribution = getSafetyDistribution(samples30);

  const totalSamples = samples30.length;
  const weeklyAverage = samples7.length;
  const monthlyAverage = samples30.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Water Quality Analytics</h1>
          <p className="text-gray-600 mt-2">
            Detailed insights and trends from your water quality data
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Samples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSamples}</div>
            <p className="text-xs text-gray-600">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Weekly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyAverage}</div>
            <p className="text-xs text-gray-600">Tests per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Safe Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {safetyDistribution.safe}
            </div>
            <p className="text-xs text-gray-600">
              {totalSamples > 0 ? Math.round((safetyDistribution.safe / totalSamples) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alert Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {safetyDistribution.danger}
            </div>
            <p className="text-xs text-gray-600">
              {totalSamples > 0 ? Math.round((safetyDistribution.danger / totalSamples) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trends Section */}
      {trends && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              30-Day Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-2 ${trends.ph.trend === 'up' ? 'text-blue-600' : 'text-blue-800'}`}>
                  {trends.ph.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {trends.ph.change > 0 ? '+' : ''}{trends.ph.change.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">pH Change</p>
              </div>

              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-2 ${trends.chlorine.trend === 'up' ? 'text-green-600' : 'text-green-800'}`}>
                  {trends.chlorine.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {trends.chlorine.change > 0 ? '+' : ''}{trends.chlorine.change.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Chlorine Change</p>
              </div>

              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-2 ${trends.heavyMetals.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.heavyMetals.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {Math.abs(trends.heavyMetals.change).toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Heavy Metals</p>
              </div>

              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-2 ${trends.turbidity.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.turbidity.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {Math.abs(trends.turbidity.change).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Turbidity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Time Series Charts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Metrics Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts samples={samples30} />
          </CardContent>
        </Card>

        {/* Safety Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Safety Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Safe</span>
                </div>
                <span className="text-sm font-medium">{safetyDistribution.safe}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Warning</span>
                </div>
                <span className="text-sm font-medium">{safetyDistribution.warning}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Danger</span>
                </div>
                <span className="text-sm font-medium">{safetyDistribution.danger}</span>
              </div>
            </div>
            
            {/* Visual representation */}
            <div className="mt-6">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 float-left"
                  style={{ width: `${totalSamples > 0 ? (safetyDistribution.safe / totalSamples) * 100 : 0}%` }}
                ></div>
                <div 
                  className="h-full bg-yellow-500 float-left"
                  style={{ width: `${totalSamples > 0 ? (safetyDistribution.warning / totalSamples) * 100 : 0}%` }}
                ></div>
                <div 
                  className="h-full bg-red-500 float-left"
                  style={{ width: `${totalSamples > 0 ? (safetyDistribution.danger / totalSamples) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <TrendAnalysis samples={samples90} />
    </div>
  );
} 