import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, RotateCcw, MapPin, Sparkles } from 'lucide-react';
import { analyzeWaterSample } from '@/lib/waterAnalysis';

export default function WaterCamera() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'environment' },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }

      // Get location if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => console.log('Location not available:', error)
        );
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      alert('Camera access is required for water analysis');
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      
      // Stop camera stream
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const analyzeWater = useCallback(async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeWaterSample(capturedImage);
      // Navigate to results page with the sample ID
      navigate(`/results/${result.sampleId}`);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [capturedImage, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto glass border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-gradient">
              <Camera className="w-6 h-6 text-blue-600" />
              Water Quality Scanner
            </CardTitle>
            <p className="text-gray-600">
              Take a clear photo of your water sample for AI analysis
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Camera/Photo Display */}
            <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden shadow-inner">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured water sample"
                  className="w-full h-80 object-cover rounded-lg"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-80 object-cover rounded-lg"
                  style={{ display: isStreaming ? 'block' : 'none' }}
                />
              )}
              
              {!isStreaming && !capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-blue-500">
                    <Camera className="w-16 h-16 mx-auto mb-4" />
                    <p>Camera not started</p>
                  </div>
                </div>
              )}

              {/* Camera grid overlay */}
              {isStreaming && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/20" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Location Status */}
            {location && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <MapPin className="w-4 h-4" />
                <span>Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!isStreaming && !capturedImage && (
                <Button onClick={startCamera} className="flex-1 btn-magical">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              )}

              {isStreaming && (
                <Button onClick={capturePhoto} className="flex-1 btn-magical">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
              )}

              {capturedImage && (
                <>
                  <Button variant="outline" onClick={retakePhoto} className="glass">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button 
                    onClick={analyzeWater} 
                    disabled={isAnalyzing}
                    className="flex-1 btn-magical"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Enhanced Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Tips for Best Results:
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Use bright, natural lighting for optimal image quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Fill the entire frame with your water sample</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Keep the camera steady and avoid camera shake</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Avoid shadows, reflections, and glare on the water surface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Use a clear, transparent container for best analysis</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 