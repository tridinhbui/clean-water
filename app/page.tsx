import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Droplets, 
  Sparkles, 
  Shield, 
  Zap, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Waves,
  TestTube,
  BarChart3,
  MapPin
} from 'lucide-react';

const features = [
  {
    icon: <Camera className="w-6 h-6" />,
    title: "AI-Powered Analysis",
    description: "Advanced computer vision analyzes your water sample in seconds",
    color: "text-blue-600"
  },
  {
    icon: <TestTube className="w-6 h-6" />,
    title: "Multi-Parameter Testing",
    description: "pH, chlorine, heavy metals, turbidity and more parameters",
    color: "text-cyan-600"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Safety Assessment",
    description: "Instant safety ratings with WHO standard compliance",
    color: "text-blue-700"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Trend Analysis",
    description: "Track water quality changes over time with detailed reports",
    color: "text-sky-600"
  }
];

const stats = [
  { value: "99.2%", label: "Analysis Accuracy", icon: <CheckCircle className="w-4 h-4" /> },
  { value: "< 5s", label: "Analysis Time", icon: <Zap className="w-4 h-4" /> },
  { value: "15+", label: "Parameters Tested", icon: <TestTube className="w-4 h-4" /> },
  { value: "24/7", label: "Available", icon: <Shield className="w-4 h-4" /> }
];

const sampleData = [
  { parameter: "pH Level", value: 7.2, status: "safe", icon: <Droplets className="w-4 h-4" /> },
  { parameter: "Chlorine", value: "0.8 ppm", status: "safe", icon: <Sparkles className="w-4 h-4" /> },
  { parameter: "Heavy Metals", value: "2.1/10", status: "safe", icon: <Shield className="w-4 h-4" /> },
  { parameter: "Turbidity", value: "1.2 NTU", status: "caution", icon: <Waves className="w-4 h-4" /> }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Water Quality Testing
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Clean Water Analysis
              <span className="block text-4xl md:text-5xl mt-2">Made Simple</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Instantly analyze water quality with advanced AI technology. 
              Get comprehensive results in seconds, not days.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/camera">
                <Button size="lg" className="btn-magical text-lg px-8 py-4">
                  <Camera className="w-5 h-5 mr-2" />
                  Start Analysis
                </Button>
              </Link>
              <Link href="/ui-demo">
                <Button size="lg" variant="outline" className="glass text-lg px-8 py-4">
                  <Sparkles className="w-5 h-5 mr-2" />
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-3 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-blue-800 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gradient">
              Advanced Water Quality Testing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive water analysis 
              with laboratory-grade accuracy in real-time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-magical">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 ${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Analysis Demo */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 text-gradient">
                See Analysis in Action
              </h2>
              <p className="text-xl text-gray-600">
                Experience our real-time water quality analysis results
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sample Image */}
              <Card className="glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center text-blue-600">
                      <Camera className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">Water Sample</p>
                      <p className="text-sm">Clear, filtered water</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <MapPin className="w-3 h-3 mr-1" />
                      Sample Location: Lab Test
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Analysis Results */}
              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gradient">
                    <TestTube className="w-5 h-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-blue-600">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{item.parameter}</div>
                          <div className="text-sm text-gray-600">{item.value}</div>
                        </div>
                      </div>
                      <Badge className={
                        item.status === 'safe' ? 'status-safe' : 
                        item.status === 'caution' ? 'status-caution' : 'status-unsafe'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Badge className="status-safe text-lg px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Safe to Drink
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Test Your Water?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who trust our AI-powered water quality analysis. 
              Get started in seconds with just your smartphone camera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/camera">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                  <Camera className="w-5 h-5 mr-2" />
                  Start Free Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/ui-demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 