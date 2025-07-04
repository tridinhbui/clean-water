import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Image, 
  Calendar,
  Filter,
  Check,
  Mail,
  Share2
} from 'lucide-react';

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRaw, setIncludeRaw] = useState(false);

  // Mock export data
  const exportStats = {
    totalSamples: 156,
    safeResults: 134,
    cautionResults: 18,
    unsafeResults: 4,
    dateRange: '2023-12-15 to 2024-01-15'
  };

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Professional formatted report with charts and summaries',
      icon: FileText,
      size: '2.1 MB'
    },
    {
      id: 'csv',
      name: 'CSV Data',
      description: 'Raw data in spreadsheet format for analysis',
      icon: BarChart3,
      size: '0.3 MB'
    },
    {
      id: 'json',
      name: 'JSON Export',
      description: 'Machine-readable format for developers',
      icon: FileText,
      size: '0.5 MB'
    },
    {
      id: 'images',
      name: 'Chart Images',
      description: 'PNG images of all charts and graphs',
      icon: Image,
      size: '1.2 MB'
    }
  ];

  const handleExport = () => {
    // Simulate export process
    console.log(`Exporting ${selectedFormat} for ${selectedPeriod}`);
    // In a real app, this would trigger the actual export
  };

  const handleEmailReport = () => {
    console.log('Sending email report...');
  };

  const handleShareLink = () => {
    console.log('Generating share link...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Export Data</h1>
                <p className="text-gray-600">Download your water quality test results and reports</p>
              </div>
              <Download className="w-8 h-8 text-blue-600" />
            </div>
          </CardHeader>
        </Card>

        {/* Export Summary */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Export Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{exportStats.totalSamples}</div>
                <div className="text-sm text-gray-600">Total Samples</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{exportStats.safeResults}</div>
                <div className="text-sm text-gray-600">Safe Results</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{exportStats.cautionResults}</div>
                <div className="text-sm text-gray-600">Caution</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{exportStats.unsafeResults}</div>
                <div className="text-sm text-gray-600">Unsafe</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Date Range: {exportStats.dateRange}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Format Selection */}
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Export Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exportFormats.map((format) => (
                <div
                  key={format.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <format.icon className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{format.name}</div>
                        <div className="text-sm text-gray-600">{format.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">~{format.size}</div>
                      {selectedFormat === format.id && (
                        <Check className="w-4 h-4 text-green-500 mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Export Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Time Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {['7d', '30d', '90d', 'all'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className={selectedPeriod === period ? 'btn-magical' : 'glass'}
                    >
                      {period === 'all' ? 'All Time' : period.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Include Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Include</label>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div>
                    <div className="font-medium">Charts & Graphs</div>
                    <div className="text-sm text-gray-600">Visual representations of data</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div>
                    <div className="font-medium">Raw Data</div>
                    <div className="text-sm text-gray-600">Detailed measurement values</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeRaw}
                    onChange={(e) => setIncludeRaw(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Actions */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Export Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                onClick={handleExport}
                className="btn-magical h-12 text-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download {selectedFormat.toUpperCase()}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleEmailReport}
                className="glass h-12 text-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Report
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShareLink}
                className="glass h-12 text-lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Exports */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Recent Exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: '2024-01-15', format: 'PDF', size: '2.1 MB', status: 'completed' },
                { date: '2024-01-10', format: 'CSV', size: '0.3 MB', status: 'completed' },
                { date: '2024-01-05', format: 'JSON', size: '0.5 MB', status: 'completed' },
              ].map((export_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">{export_.format} Export</div>
                      <div className="text-sm text-gray-600">{export_.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{export_.size}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {export_.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="glass">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 