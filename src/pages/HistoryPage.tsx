import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MapPin, 
  Eye, 
  Download, 
  Filter,
  Search,
  Calendar,
  Droplets
} from 'lucide-react';

export default function HistoryPage() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock history data
  const samples = [
    {
      id: '1',
      date: '2024-01-15',
      time: '14:30',
      location: 'Kitchen Tap',
      coordinates: { lat: 10.7627, lng: 106.6602 },
      score: 92,
      status: 'safe',
      parameters: {
        ph: 7.2,
        chlorine: 0.8,
        turbidity: 0.9,
        heavyMetals: 2.1
      }
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '09:15',
      location: 'Bathroom Sink',
      coordinates: { lat: 10.7628, lng: 106.6603 },
      score: 78,
      status: 'caution',
      parameters: {
        ph: 6.8,
        chlorine: 1.2,
        turbidity: 1.8,
        heavyMetals: 3.2
      }
    },
    {
      id: '3',
      date: '2024-01-13',
      time: '16:45',
      location: 'Garden Hose',
      coordinates: { lat: 10.7629, lng: 106.6604 },
      score: 95,
      status: 'safe',
      parameters: {
        ph: 7.4,
        chlorine: 0.6,
        turbidity: 0.5,
        heavyMetals: 1.8
      }
    },
    {
      id: '4',
      date: '2024-01-12',
      time: '11:20',
      location: 'Kitchen Tap',
      coordinates: { lat: 10.7627, lng: 106.6602 },
      score: 85,
      status: 'safe',
      parameters: {
        ph: 7.0,
        chlorine: 0.9,
        turbidity: 1.1,
        heavyMetals: 2.5
      }
    },
    {
      id: '5',
      date: '2024-01-11',
      time: '08:30',
      location: 'Well Water',
      coordinates: { lat: 10.7630, lng: 106.6605 },
      score: 65,
      status: 'caution',
      parameters: {
        ph: 6.2,
        chlorine: 0.3,
        turbidity: 2.5,
        heavyMetals: 4.1
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unsafe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredSamples = samples.filter(sample => {
    if (filter === 'all') return true;
    return sample.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Test History</h1>
                <p className="text-gray-600">View and manage your water quality test results</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="glass">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" className="glass">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="glass border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              </div>
              <div className="flex gap-2">
                {['all', 'safe', 'caution', 'unsafe'].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(status)}
                    className={filter === status ? 'btn-magical' : 'glass'}
                  >
                    {status === 'all' ? 'All Tests' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm bg-white/80"
                >
                  <option value="date">Date</option>
                  <option value="score">Score</option>
                  <option value="location">Location</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{samples.length}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </CardContent>
          </Card>
          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {samples.filter(s => s.status === 'safe').length}
              </div>
              <div className="text-sm text-gray-600">Safe Results</div>
            </CardContent>
          </Card>
          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {samples.filter(s => s.status === 'caution').length}
              </div>
              <div className="text-sm text-gray-600">Caution Results</div>
            </CardContent>
          </Card>
          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(samples.reduce((acc, s) => acc + s.score, 0) / samples.length)}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Test Results ({filteredSamples.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSamples.map((sample) => (
                <div key={sample.id} className="p-6 bg-white/50 rounded-lg border border-white/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{sample.date}</span>
                          <span className="text-gray-500">{sample.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{sample.location}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">pH:</span>
                          <span className="ml-1 font-medium">{sample.parameters.ph}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Chlorine:</span>
                          <span className="ml-1 font-medium">{sample.parameters.chlorine} ppm</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Turbidity:</span>
                          <span className="ml-1 font-medium">{sample.parameters.turbidity} NTU</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Heavy Metals:</span>
                          <span className="ml-1 font-medium">{sample.parameters.heavyMetals}/10</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{sample.score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <Badge className={getStatusColor(sample.status)}>
                        {sample.status.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline" className="glass">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSamples.length === 0 && (
              <div className="text-center py-12">
                <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No test results found for the selected filter.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 