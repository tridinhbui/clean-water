'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WaterMetrics } from '@/lib/tensorflow';
import { assessWaterSafety } from '@/lib/safety';
import { Download, FileText, Table, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/lib/hooks/useToast';

interface Sample {
  id: string;
  createdAt: Date;
  lat: number;
  lng: number;
  metrics: WaterMetrics;
}

interface ExportOptionsProps {
  samples: Sample[];
}

export function ExportOptions({ samples }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState<'pdf' | 'csv' | null>(null);

  const generateCSV = () => {
    const headers = [
      'Sample ID',
      'Date',
      'Time', 
      'Latitude',
      'Longitude',
      'pH',
      'Chlorine (ppm)',
      'Heavy Metal Score',
      'Turbidity (NTU)',
      'Overall Safety'
    ];

    const csvData = samples.map(sample => {
      const safety = assessWaterSafety(sample.metrics);
      return [
        sample.id,
        format(new Date(sample.createdAt), 'yyyy-MM-dd'),
        format(new Date(sample.createdAt), 'HH:mm:ss'),
        sample.lat.toFixed(6),
        sample.lng.toFixed(6),
        sample.metrics.pH,
        sample.metrics.chlorine,
        sample.metrics.heavyMetalScore,
        sample.metrics.turbidity,
        safety.overall
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  };

  const downloadCSV = async () => {
    setIsExporting('csv');
    
    try {
      const csvContent = generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `water-quality-samples-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: 'Export Successful',
        description: 'CSV file has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export CSV file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(null);
    }
  };

  const generatePDFContent = () => {
    // Create HTML content for PDF generation
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Water Quality Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f8f9fa; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
            .sample { border: 1px solid #ddd; margin-bottom: 20px; padding: 15px; border-radius: 8px; }
            .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 10px 0; }
            .metric { background: #f1f3f4; padding: 8px; border-radius: 4px; }
            .safe { background: #d4edda; }
            .warning { background: #fff3cd; }
            .danger { background: #f8d7da; }
            .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Water Quality Analysis Report</h1>
            <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
            <p>Total Samples: ${samples.length}</p>
          </div>
          
          <div class="summary">
            <h2>Summary Statistics</h2>
            <div class="metrics">
              <div class="metric">
                <strong>Average pH:</strong> ${(samples.reduce((sum, s) => sum + s.metrics.pH, 0) / samples.length).toFixed(2)}
              </div>
              <div class="metric">
                <strong>Average Chlorine:</strong> ${(samples.reduce((sum, s) => sum + s.metrics.chlorine, 0) / samples.length).toFixed(2)} ppm
              </div>
              <div class="metric">
                <strong>Average Heavy Metals:</strong> ${(samples.reduce((sum, s) => sum + s.metrics.heavyMetalScore, 0) / samples.length).toFixed(1)}/10
              </div>
              <div class="metric">
                <strong>Average Turbidity:</strong> ${(samples.reduce((sum, s) => sum + s.metrics.turbidity, 0) / samples.length).toFixed(2)} NTU
              </div>
            </div>
          </div>

          ${samples.map(sample => {
            const safety = assessWaterSafety(sample.metrics);
            return `
              <div class="sample ${safety.overall}">
                <h3>Sample ${sample.id.slice(-8)}</h3>
                <p><strong>Date:</strong> ${format(new Date(sample.createdAt), 'MMMM dd, yyyy HH:mm')}</p>
                <p><strong>Location:</strong> ${sample.lat.toFixed(6)}, ${sample.lng.toFixed(6)}</p>
                <p><strong>Overall Safety:</strong> <span class="badge ${safety.overall}">${safety.overall.toUpperCase()}</span></p>
                
                <div class="metrics">
                  <div class="metric">
                    <strong>pH:</strong> ${sample.metrics.pH}
                    <br><small>Status: ${safety.pH}</small>
                  </div>
                  <div class="metric">
                    <strong>Chlorine:</strong> ${sample.metrics.chlorine} ppm
                    <br><small>Status: ${safety.chlorine}</small>
                  </div>
                  <div class="metric">
                    <strong>Heavy Metals:</strong> ${sample.metrics.heavyMetalScore}/10
                    <br><small>Status: ${safety.heavyMetal}</small>
                  </div>
                  <div class="metric">
                    <strong>Turbidity:</strong> ${sample.metrics.turbidity} NTU
                    <br><small>Status: ${safety.turbidity}</small>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </body>
      </html>
    `;
  };

  const downloadPDF = async () => {
    setIsExporting('pdf');
    
    try {
      // Use browser's print functionality to save as PDF
      const htmlContent = generatePDFContent();
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Wait for content to load
        setTimeout(() => {
          newWindow.print();
          newWindow.close();
        }, 1000);
      }
      
      toast({
        title: 'PDF Generated',
        description: 'PDF report has been generated. Please save it using your browser\'s print dialog.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* PDF Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate a comprehensive PDF report with detailed analysis, charts, and safety assessments.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Sample Data</span>
              <Badge variant="outline">✓ Included</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Safety Analysis</span>
              <Badge variant="outline">✓ Included</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Summary Statistics</span>
              <Badge variant="outline">✓ Included</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Location Data</span>
              <Badge variant="outline">✓ Included</Badge>
            </div>
          </div>
          
          <Button 
            onClick={downloadPDF}
            disabled={isExporting === 'pdf' || samples.length === 0}
            className="w-full"
          >
            {isExporting === 'pdf' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* CSV Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            CSV Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Export raw data in CSV format for spreadsheet analysis or data processing.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>All Metrics</span>
              <Badge variant="outline">✓ Included</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Timestamps</span>
              <Badge variant="outline">✓ Included</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>GPS Coordinates</span>
              <Badge variant="outline">✓ Included</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Safety Ratings</span>
              <Badge variant="outline">✓ Included</Badge>
            </div>
          </div>
          
          <Button 
            onClick={downloadCSV}
            variant="outline"
            disabled={isExporting === 'csv' || samples.length === 0}
            className="w-full"
          >
            {isExporting === 'csv' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating CSV...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download CSV Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 