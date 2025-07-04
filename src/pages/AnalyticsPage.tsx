import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Droplets,
  Clock,
  Calendar,
  Filter
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const analytics = {
    totalTests: 156,
    safeTests: 134,
    cautionTests: 18,
    unsafeTests: 4,
    averageScore: 87.3,
    trend: '+12%'
  };

  const recentTests = [
    { id: 1, date: '2024-01-15', score: 92, status: 'safe', location: 'Kitchen Tap' },
    { id: 2, date: '2024-01-14', score: 78, status: 'caution', location: 'Bathroom Sink' },
    { id: 3, date: '2024-01-13', score: 95, status: 'safe', location: 'Garden Hose' },
    { id: 4, date: '2024-01-12', score: 85, status: 'safe', location: 'Kitchen Tap' },
    { id: 5, date: '2024-01-11', score: 65, status: 'caution', location: 'Well Water' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800';
      case 'unsafe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Water Quality Analytics</h1>
                <p className="text-gray-600">Track your water quality trends and insights</p>
              </div>
              <div className="flex gap-2">
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={timeRange === range ? 'btn-magical' : 'glass'}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalTests}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{analytics.trend}</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.averageScore}</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-full">
                  <Activity className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-gray-500">Quality Grade: </span>
                <Badge className="ml-2 bg-green-100 text-green-800">Excellent</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Safe Tests</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.safeTests}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Droplets className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-gray-500">
                  {Math.round((analytics.safeTests / analytics.totalTests) * 100)}% of all tests
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Issues Found</p>
                  <p className="text-3xl font-bold text-amber-600">{analytics.cautionTests + analytics.unsafeTests}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <TrendingDown className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-gray-500">Requires attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tests */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Recent Water Tests
              </CardTitle>
              <Button variant="outline" size="sm" className="glass">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{test.date}</span>
                    </div>
                    <div>
                      <p className="font-medium">{test.location}</p>
                      <p className="text-sm text-gray-600">Score: {test.score}/100</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(test.status)}>
                    {test.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Water Quality Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Interactive charts coming soon</p>
                <p className="text-sm">Advanced analytics dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 