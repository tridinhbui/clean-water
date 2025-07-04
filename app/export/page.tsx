import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { WaterMetrics } from '@/lib/tensorflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExportOptions } from '@/components/ExportOptions';
import { Download, FileText, Table, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

async function getUserSamples(userId: string) {
  const samples = await prisma.sample.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return samples.map(sample => ({
    ...sample,
    metrics: sample.metrics as WaterMetrics,
  }));
}

export default async function ExportPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Please sign in to export water quality data.
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
      <div className="flex items-center gap-4 mb-8">
        <Link href="/history">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Export Data</h1>
          <p className="text-gray-600 mt-2">
            Download your water quality samples in various formats
          </p>
        </div>
      </div>

      {/* Export Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Export Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{samples.length}</p>
              <p className="text-sm text-gray-600">Total Samples</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold">PDF</p>
              <p className="text-sm text-gray-600">Detailed Report</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Table className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">CSV</p>
              <p className="text-sm text-gray-600">Raw Data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <ExportOptions samples={samples} />

      {/* Recent Samples Preview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Samples Preview</CardTitle>
          <p className="text-sm text-gray-600">
            Latest 5 samples that will be included in your export
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {samples.slice(0, 5).map((sample) => (
              <div key={sample.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">
                    Sample {sample.id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(sample.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {sample.lat.toFixed(4)}, {sample.lng.toFixed(4)}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      pH: {sample.metrics.pH}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Chlorine: {sample.metrics.chlorine}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Heavy Metals: {sample.metrics.heavyMetalScore}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Turbidity: {sample.metrics.turbidity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {samples.length > 5 && (
              <div className="text-center text-sm text-gray-500">
                ... and {samples.length - 5} more samples
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 