import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  Droplets, 
  Shield, 
  Camera,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  Heart,
  Star,
  Award,
  TestTube
} from 'lucide-react';

export default function UIDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Ocean Theme UI Showcase
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-gradient">
            Magical Ocean UI ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our beautiful water-themed interface with glass morphism, 
            ocean gradients, and interactive animations.
          </p>
        </div>

        {/* Glass Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Glass Morphism Cards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Water Quality Card */}
            <Card className="card-magical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <Droplets className="w-5 h-5" />
                  Water Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">pH Level</span>
                    <Badge className="status-safe">7.2 - Safe</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Chlorine</span>
                    <Badge className="status-safe">0.5 ppm</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Turbidity</span>
                    <Badge className="status-caution">1.2 NTU</Badge>
                  </div>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-4/5 rounded-full shimmer"></div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Progress Card */}
            <Card className="card-magical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <TestTube className="w-5 h-5" />
                  Analysis Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center glow">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">Image Captured</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center pulse-glow">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">AI Processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-blue-300">
                      <TrendingUp className="w-4 h-4 text-gray-400 m-0.5" />
                    </div>
                    <span className="text-gray-500">Generate Report</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Assessment Card */}
            <Card className="card-magical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <Shield className="w-5 h-5" />
                  Safety Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 glow">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <Badge className="status-safe text-lg px-4 py-2">
                    Safe to Drink
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    All parameters within safe limits
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Elements Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Interactive Elements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Floating Animation */}
            <Card className="glass text-center p-6">
              <div className="float text-4xl mb-4">🌊</div>
              <h4 className="font-semibold text-blue-800 mb-2">Float Animation</h4>
              <p className="text-sm text-gray-600">Gentle floating motion</p>
            </Card>

            {/* Pulse Glow */}
            <Card className="glass text-center p-6">
              <div className="pulse-glow text-4xl mb-4 inline-block bg-blue-100 rounded-full p-3">
                ✨
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Pulse Glow</h4>
              <p className="text-sm text-gray-600">Breathing light effect</p>
            </Card>

            {/* Shimmer Effect */}
            <Card className="glass text-center p-6">
              <div className="shimmer bg-gradient-primary rounded-lg h-8 mb-4"></div>
              <h4 className="font-semibold text-blue-800 mb-2">Shimmer Effect</h4>
              <p className="text-sm text-gray-600">Moving light reflection</p>
            </Card>

            {/* Interactive Glow */}
            <Card className="glass text-center p-6 interactive-glow">
              <div className="text-4xl mb-4">💎</div>
              <h4 className="font-semibold text-blue-800 mb-2">Interactive Glow</h4>
              <p className="text-sm text-gray-600">Hover for magic!</p>
            </Card>
          </div>
        </section>

        {/* Magical Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Magical Buttons</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="btn-magical">
              <Camera className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
            <Button className="btn-magical" variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              Magic Mode
            </Button>
            <Button className="glass" variant="ghost">
              <Droplets className="w-4 h-4 mr-2" />
              Glass Button
            </Button>
            <Button className="btn-magical">
              <Heart className="w-4 h-4 mr-2" />
              Ocean Theme
            </Button>
          </div>
        </section>

        {/* Status Notifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Status Notifications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="notification-ocean p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-semibold">Analysis Complete</h4>
                  <p className="text-sm">Water quality results ready</p>
                </div>
              </div>
            </div>
            <div className="status-caution p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <h4 className="font-semibold">Attention Required</h4>
                  <p className="text-sm">Turbidity levels elevated</p>
                </div>
              </div>
            </div>
            <div className="status-safe p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5" />
                <div>
                  <h4 className="font-semibold">Excellent Quality</h4>
                  <p className="text-sm">All parameters optimal</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Water Ripple Effect */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Special Effects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass p-8 text-center water-ripple">
              <Droplets className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-gradient">Water Ripple</h3>
              <p className="text-gray-600">Click to see ripple effect</p>
            </Card>
            
            <Card className="glass p-8 text-center wave">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-semibold mb-2 text-gradient">Wave Motion</h3>
              <p className="text-gray-600">Flowing wave animation</p>
            </Card>
          </div>
        </section>

        {/* Gradient Text Showcase */}
        <section className="text-center">
          <h2 className="text-5xl font-bold text-gradient mb-4">
            Ocean Gradients ✨
          </h2>
          <p className="text-xl text-gradient mb-8">
            Beautiful water-themed color combinations
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-gradient-primary p-6 rounded-lg text-white">
              <h4 className="font-semibold">Primary Gradient</h4>
              <p className="text-sm opacity-90">Deep ocean blues</p>
            </div>
            <div className="bg-gradient-ocean p-6 rounded-lg text-blue-800">
              <h4 className="font-semibold">Ocean Gradient</h4>
              <p className="text-sm opacity-80">Light to deep blue</p>
            </div>
            <div className="bg-gradient-mystical p-6 rounded-lg text-blue-900">
              <h4 className="font-semibold">Mystical Gradient</h4>
              <p className="text-sm opacity-80">Ethereal water tones</p>
            </div>
            <div className="bg-gradient-water p-6 rounded-lg text-blue-700">
              <h4 className="font-semibold">Water Gradient</h4>
              <p className="text-sm opacity-80">Pure water clarity</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 