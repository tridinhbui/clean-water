'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  RotateCcw, 
  Zap, 
  MapPin, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Sun,
  Moon,
  Focus,
  Grid,
  Sparkles,
  Droplets
} from 'lucide-react';
import { toast } from '@/lib/hooks/useToast';

interface CameraSettings {
  flashMode: 'auto' | 'on' | 'off';
  resolution: 'low' | 'medium' | 'high';
  gridLines: boolean;
  focusMode: 'auto' | 'manual';
}

export default function EnhancedWaterCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    flashMode: 'auto',
    resolution: 'high',
    gridLines: false,
    focusMode: 'auto'
  });
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');

  // Get available camera devices
  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !currentDeviceId) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error enumerating devices:', error);
    }
  };

  // Enhanced camera initialization
  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: currentDeviceId ? { exact: currentDeviceId } : undefined,
          width: { ideal: cameraSettings.resolution === 'high' ? 1920 : cameraSettings.resolution === 'medium' ? 1280 : 640 },
          height: { ideal: cameraSettings.resolution === 'high' ? 1080 : cameraSettings.resolution === 'medium' ? 720 : 480 },
          facingMode: 'environment',
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      setError('Camera access denied or not available');
      console.error('Camera error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user location with enhanced accuracy
  const getCurrentLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  };

  // Enhanced image capture with post-processing
  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsLoading(true);
      setAnalysisProgress(10);

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Apply image enhancements
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const enhancedImageData = enhanceImageForAnalysis(imageData);
      context.putImageData(enhancedImageData, 0, 0);

      setAnalysisProgress(30);

      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);

      setAnalysisProgress(50);

      // Get location
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      setAnalysisProgress(70);

      // Analyze the image
      await analyzeWaterSample(imageDataUrl, currentLocation);

    } catch (error) {
      setError('Failed to capture and analyze image');
      console.error('Capture error:', error);
      toast({
        title: 'Capture Failed',
        description: 'Failed to capture or analyze the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setAnalysisProgress(0);
    }
  }, []);

  // Image enhancement function
  const enhanceImageForAnalysis = (imageData: ImageData): ImageData => {
    const data = imageData.data;
    
    // Apply brightness and contrast adjustments
    for (let i = 0; i < data.length; i += 4) {
      // Brightness enhancement
      data[i] = Math.min(255, data[i] * 1.1);     // Red
      data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
      data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
      
      // Contrast enhancement
      data[i] = ((data[i] - 128) * 1.2) + 128;
      data[i + 1] = ((data[i + 1] - 128) * 1.2) + 128;
      data[i + 2] = ((data[i + 2] - 128) * 1.2) + 128;
      
      // Clamp values
      data[i] = Math.max(0, Math.min(255, data[i]));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
    }
    
    return imageData;
  };

  const analyzeWaterSample = async (imageData: string, location: { lat: number; lng: number }) => {
    setAnalysisProgress(80);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        lat: location.lat,
        lng: location.lng,
      }),
    });

    setAnalysisProgress(90);

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    const result = await response.json();
    setAnalysisProgress(100);

    // Show success message
    toast({
      title: 'Analysis Complete',
      description: 'Water sample has been analyzed successfully.',
    });

    // Navigate to results
    setTimeout(() => {
      router.push(`/dashboard/${result.sampleId}`);
    }, 1000);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const switchCamera = () => {
    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setCurrentDeviceId(devices[nextIndex]?.deviceId || '');
    stopCamera();
    setTimeout(() => initializeCamera(), 100);
  };

  useEffect(() => {
    getCameraDevices();
    getCurrentLocation()
      .then(setLocation)
      .catch(console.error);

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (currentDeviceId && !isCameraActive) {
      initializeCamera();
    }
  }, [currentDeviceId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Camera className="w-6 h-6" />
              Enhanced Water Analysis
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {location ? (
                <span>Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              ) : (
                <span>Getting location...</span>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Camera Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Camera Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600">Resolution</label>
                <select
                  value={cameraSettings.resolution}
                  onChange={(e) => setCameraSettings(prev => ({ ...prev, resolution: e.target.value as any }))}
                  className="w-full text-sm border rounded px-2 py-1"
                >
                  <option value="low">Low (640p)</option>
                  <option value="medium">Medium (720p)</option>
                  <option value="high">High (1080p)</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600">Flash</label>
                <select
                  value={cameraSettings.flashMode}
                  onChange={(e) => setCameraSettings(prev => ({ ...prev, flashMode: e.target.value as any }))}
                  className="w-full text-sm border rounded px-2 py-1"
                >
                  <option value="auto">Auto</option>
                  <option value="on">On</option>
                  <option value="off">Off</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Grid Lines</label>
              <button
                onClick={() => setCameraSettings(prev => ({ ...prev, gridLines: !prev.gridLines }))}
                className={`px-2 py-1 text-xs rounded ${cameraSettings.gridLines ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
              >
                <Grid className="w-3 h-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Camera View */}
        <Card>
          <CardContent className="p-0">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Grid Lines Overlay */}
                  {cameraSettings.gridLines && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="border border-white/30" />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Focus indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 border-2 border-white/50 rounded-full" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  {isLoading ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Initializing camera...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">Camera not active</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        {analysisProgress > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analyzing sample...</span>
                  <span className="text-sm text-gray-600">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} variant="default" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera Controls */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={switchCamera}
            disabled={isLoading || devices.length <= 1}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            onClick={isCameraActive ? captureImage : initializeCamera}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isCameraActive ? (
              <Camera className="w-6 h-6" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setCameraSettings(prev => ({ ...prev, flashMode: prev.flashMode === 'on' ? 'off' : 'on' }))}
            disabled={isLoading}
            className="flex-1"
          >
            {cameraSettings.flashMode === 'on' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
} 