import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { WaterMetrics } from '@/lib/tensorflow';
import { assessWaterSafety, getSafetyBadgeColor } from '@/lib/safety';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

async function getUserSamples(userId: string) {
  const samples = await prisma.sample.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20, // Limit to latest 20 samples
  });

  return samples.map(sample => ({
    ...sample,
    metrics: sample.metrics as WaterMetrics,
  }));
}

export default async function History() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Please sign in to view your water quality history.
            </p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const samples = await getUserSamples(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Water Quality History</h1>
          <p className="text-gray-600 mt-2">
            Your recent water quality analyses
          </p>
        </div>
        <Link href="/camera">
          <Button>
            <Camera className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </Link>
      </div>

      {/* Samples Grid */}
      {samples.length === 0 ? (
        <Card>
          <CardContent className="text-center p-12">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Water Samples Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start analyzing water quality by taking your first photo.
            </p>
            <Link href="/camera">
              <Button>
                <Camera className="w-4 h-4 mr-2" />
                Take First Sample
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {samples.map((sample) => {
            const safety = assessWaterSafety(sample.metrics);
            
            return (
              <Card key={sample.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Sample Analysis
                    </CardTitle>
                    <Badge className={getSafetyBadgeColor(safety.overall)}>
                      {safety.overall.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(sample.createdAt), 'MMM dd, yyyy')}
                  </div>
                  {sample.lat && sample.lng && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {sample.lat.toFixed(4)}, {sample.lng.toFixed(4)}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">pH</p>
                      <p className="font-semibold">{sample.metrics.pH}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Chlorine</p>
                      <p className="font-semibold">{sample.metrics.chlorine} ppm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Heavy Metals</p>
                      <p className="font-semibold">{sample.metrics.heavyMetalScore}/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Turbidity</p>
                      <p className="font-semibold">{sample.metrics.turbidity} NTU</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link href={`/dashboard/${sample.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {samples.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{samples.length}</p>
                <p className="text-sm text-gray-600">Total Samples</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {samples.filter(s => assessWaterSafety(s.metrics).overall === 'safe').length}
                </p>
                <p className="text-sm text-gray-600">Safe Results</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {samples.filter(s => assessWaterSafety(s.metrics).overall === 'caution').length}
                </p>
                <p className="text-sm text-gray-600">Caution Results</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {samples.filter(s => assessWaterSafety(s.metrics).overall === 'unsafe').length}
                </p>
                <p className="text-sm text-gray-600">Unsafe Results</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 