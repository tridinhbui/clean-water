import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { WaterMetrics } from '@/lib/tensorflow';
import { assessWaterSafety, getSafetyBadgeColor } from '@/lib/safety';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComparisonChart } from '@/components/ComparisonChart';
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface PageProps {
  searchParams: { before?: string; after?: string };
}

async function getSample(sampleId: string, userId: string) {
  const sample = await prisma.sample.findFirst({
    where: {
      id: sampleId,
      userId: userId,
    },
  });

  if (!sample) {
    return null;
  }

  return {
    ...sample,
    metrics: sample.metrics as WaterMetrics,
  };
}

async function getRecentSamples(userId: string, limit = 10) {
  const samples = await prisma.sample.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return samples.map(sample => ({
    ...sample,
    metrics: sample.metrics as WaterMetrics,
  }));
}

export default async function ComparePage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Please sign in to compare water quality samples.
            </p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { before, after } = searchParams;
  
  // Get samples for comparison
  let beforeSample = null;
  let afterSample = null;
  
  if (before) {
    beforeSample = await getSample(before, session.user.id);
  }
  
  if (after) {
    afterSample = await getSample(after, session.user.id);
  }

  const recentSamples = await getRecentSamples(session.user.id);

  const calculateImprovement = (beforeVal: number, afterVal: number, inverse = false) => {
    const change = inverse ? beforeVal - afterVal : afterVal - beforeVal;
    const percentChange = ((change / beforeVal) * 100);
    return {
      change,
      percentChange,
      isImproved: inverse ? change > 0 : change > 0,
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/history">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Sample Comparison</h1>
          <p className="text-gray-600 mt-2">
            Compare water quality metrics between different samples
          </p>
        </div>
      </div>

      {/* Sample Selection */}
      {(!beforeSample || !afterSample) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Samples to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3">Before Sample</h3>
                {beforeSample ? (
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">
                      {format(new Date(beforeSample.createdAt), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      pH: {beforeSample.metrics.pH} | Chlorine: {beforeSample.metrics.chlorine}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No sample selected</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">After Sample</h3>
                {afterSample ? (
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">
                      {format(new Date(afterSample.createdAt), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      pH: {afterSample.metrics.pH} | Chlorine: {afterSample.metrics.chlorine}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No sample selected</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Recent Samples</h3>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {recentSamples.map((sample) => (
                  <div key={sample.id} className="flex gap-2">
                    <Link href={`/compare?before=${sample.id}&after=${after || ''}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        As Before
                      </Button>
                    </Link>
                    <Link href={`/compare?before=${before || ''}&after=${sample.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        As After
                      </Button>
                    </Link>
                    <div className="text-xs text-gray-500 min-w-0">
                      {format(new Date(sample.createdAt), 'MMM dd')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Results */}
      {beforeSample && afterSample && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Before Sample */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Before Sample</CardTitle>
                  <Badge className={getSafetyBadgeColor(assessWaterSafety(beforeSample.metrics).overall)}>
                    {assessWaterSafety(beforeSample.metrics).overall.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(beforeSample.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">pH</p>
                    <p className="text-lg font-bold">{beforeSample.metrics.pH}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chlorine</p>
                    <p className="text-lg font-bold">{beforeSample.metrics.chlorine} ppm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heavy Metals</p>
                    <p className="text-lg font-bold">{beforeSample.metrics.heavyMetalScore}/10</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Turbidity</p>
                    <p className="text-lg font-bold">{beforeSample.metrics.turbidity} NTU</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* After Sample */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>After Sample</CardTitle>
                  <Badge className={getSafetyBadgeColor(assessWaterSafety(afterSample.metrics).overall)}>
                    {assessWaterSafety(afterSample.metrics).overall.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(afterSample.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">pH</p>
                    <p className="text-lg font-bold">{afterSample.metrics.pH}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chlorine</p>
                    <p className="text-lg font-bold">{afterSample.metrics.chlorine} ppm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heavy Metals</p>
                    <p className="text-lg font-bold">{afterSample.metrics.heavyMetalScore}/10</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Turbidity</p>
                    <p className="text-lg font-bold">{afterSample.metrics.turbidity} NTU</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Analysis */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Change Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* pH Change */}
                {(() => {
                  const improvement = calculateImprovement(beforeSample.metrics.pH, afterSample.metrics.pH);
                  return (
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-1 ${improvement.isImproved ? 'text-green-600' : 'text-red-600'}`}>
                        {improvement.isImproved ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {improvement.change > 0 ? '+' : ''}{improvement.change.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">pH Change</p>
                    </div>
                  );
                })()}

                {/* Chlorine Change */}
                {(() => {
                  const improvement = calculateImprovement(beforeSample.metrics.chlorine, afterSample.metrics.chlorine);
                  return (
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-1 ${improvement.isImproved ? 'text-green-600' : 'text-red-600'}`}>
                        {improvement.isImproved ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {improvement.change > 0 ? '+' : ''}{improvement.change.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Chlorine Change</p>
                    </div>
                  );
                })()}

                {/* Heavy Metals Change (inverse - lower is better) */}
                {(() => {
                  const improvement = calculateImprovement(beforeSample.metrics.heavyMetalScore, afterSample.metrics.heavyMetalScore, true);
                  return (
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-1 ${improvement.isImproved ? 'text-green-600' : 'text-red-600'}`}>
                        {improvement.isImproved ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {improvement.change > 0 ? '-' : '+'}{Math.abs(improvement.change).toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Heavy Metals</p>
                    </div>
                  );
                })()}

                {/* Turbidity Change (inverse - lower is better) */}
                {(() => {
                  const improvement = calculateImprovement(beforeSample.metrics.turbidity, afterSample.metrics.turbidity, true);
                  return (
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-1 ${improvement.isImproved ? 'text-green-600' : 'text-red-600'}`}>
                        {improvement.isImproved ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {improvement.change > 0 ? '-' : '+'}{Math.abs(improvement.change).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Turbidity</p>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonChart beforeSample={beforeSample} afterSample={afterSample} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 