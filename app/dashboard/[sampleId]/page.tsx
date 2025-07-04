import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { WaterMetrics } from '@/lib/tensorflow';
import { assessWaterSafety, getSafetyBadgeColor } from '@/lib/safety';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WaterQualityChart } from '@/components/WaterQualityChart';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface PageProps {
  params: { sampleId: string };
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

export default async function SampleDashboard({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  const sample = await getSample(params.sampleId, session.user.id);
  
  if (!sample) {
    notFound();
  }

  const safety = assessWaterSafety(sample.metrics);

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
          <h1 className="text-3xl font-bold">Water Quality Analysis</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(sample.createdAt), 'PPpp')}
            </div>
            {sample.lat && sample.lng && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {sample.lat.toFixed(4)}, {sample.lng.toFixed(4)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Safety Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overall Water Safety
            <Badge className={getSafetyBadgeColor(safety.overall)}>
              {safety.overall.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {safety.recommendations.map((rec, index) => (
              <p key={index} className="text-sm text-gray-600">
                • {rec}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">pH Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sample.metrics.pH}</div>
            <Badge size="sm" className={getSafetyBadgeColor(safety.pH)}>
              {safety.pH}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">
              Ideal: 6.5-8.5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Chlorine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sample.metrics.chlorine} ppm</div>
            <Badge size="sm" className={getSafetyBadgeColor(safety.chlorine)}>
              {safety.chlorine}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">
              Ideal: 0.2-1.0 ppm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Heavy Metals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sample.metrics.heavyMetalScore}/10</div>
            <Badge size="sm" className={getSafetyBadgeColor(safety.heavyMetal)}>
              {safety.heavyMetal}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">
              Lower is better
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Turbidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sample.metrics.turbidity} NTU</div>
            <Badge size="sm" className={getSafetyBadgeColor(safety.turbidity)}>
              {safety.turbidity}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">
              Ideal: &lt;1 NTU
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Water Quality Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <WaterQualityChart metrics={sample.metrics} safety={safety} />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 justify-center">
        <Link href="/camera">
          <Button>
            Scan Another Sample
          </Button>
        </Link>
        <Link href="/history">
          <Button variant="outline">
            View All Samples
          </Button>
        </Link>
      </div>
    </div>
  );
} 