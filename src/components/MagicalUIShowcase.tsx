'use client';

export function MagicalUIShowcase() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Hero Section with Magical Gradient */}
      <section className="text-center py-16 bg-gradient-mystical rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-6xl font-bold text-gradient mb-4">
            CleanWater Scan
          </h1>
          <p className="text-xl text-white/90 mb-8">
            AI-Powered Water Quality Analysis Platform
          </p>
          <button className="btn-magical px-8 py-3 rounded-xl text-lg font-semibold">
            Start Analysis
          </button>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="float absolute top-10 left-10 w-16 h-16 bg-white/20 rounded-full blur-sm"></div>
          <div className="float-delayed absolute top-20 right-20 w-12 h-12 bg-white/15 rounded-full blur-sm"></div>
          <div className="float absolute bottom-16 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-md"></div>
        </div>
      </section>

      {/* Glass Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Water Quality Card */}
        <div className="card-magical rounded-2xl p-6 relative group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Water Quality</h3>
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center glow">
              <span className="text-white text-lg">💧</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/80">pH Level</span>
              <span className="text-green-400 font-semibold">7.2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Chlorine</span>
              <span className="text-blue-400 font-semibold">0.5 ppm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Turbidity</span>
              <span className="text-yellow-400 font-semibold">1.2 NTU</span>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-primary w-3/4 rounded-full shimmer"></div>
          </div>
        </div>

        {/* Analysis Progress Card */}
        <div className="card-magical rounded-2xl p-6 relative">
          <h3 className="text-xl font-bold text-white mb-4">Analysis Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center glow">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-white/90">Image Captured</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center pulse-glow">
                <span className="text-white text-sm">⚡</span>
              </div>
              <span className="text-white/90">AI Processing</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/40">
                <span className="text-white/60 text-sm"></span>
              </div>
              <span className="text-white/60">Generate Report</span>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="card-magical rounded-2xl p-6 relative">
          <h3 className="text-xl font-bold text-white mb-4">Sample Location</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📍</span>
              <span className="text-white/90">Current Location</span>
            </div>
            <div className="text-sm text-white/70 space-y-1">
              <p>Lat: 10.7769° N</p>
              <p>Lng: 106.7009° E</p>
              <p>Accuracy: ±5m</p>
            </div>
            <button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-all duration-300 glow-hover">
              View on Map
            </button>
          </div>
        </div>
      </section>

      {/* Magical Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gradient">Interactive Elements</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn-magical px-6 py-3 rounded-xl">
            Primary Action
          </button>
          <button className="px-6 py-3 rounded-xl bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all duration-300 glow-hover">
            Secondary Action
          </button>
          <button className="px-6 py-3 rounded-xl bg-gradient-secondary text-white transition-all duration-300 glow-hover">
            Accent Action
          </button>
        </div>
      </section>

      {/* Data Visualization Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Card */}
        <div className="card-magical rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quality Trends</h3>
          <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 pulse-glow">
                <span className="text-white text-xl">📊</span>
              </div>
              <p className="text-white/70">Interactive Chart</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="card-magical rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-gradient">142</div>
              <div className="text-white/70 text-sm">Samples</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-gradient">98%</div>
              <div className="text-white/70 text-sm">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-gradient">24/7</div>
              <div className="text-white/70 text-sm">Monitoring</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-gradient">5★</div>
              <div className="text-white/70 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Cards */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-gradient">Notifications</h2>
        
        {/* Success Notification */}
        <div className="glass rounded-xl p-4 border-l-4 border-green-400">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center glow">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h4 className="text-white font-semibold">Analysis Complete</h4>
              <p className="text-white/70 text-sm">Water quality is within safe parameters</p>
            </div>
          </div>
        </div>

        {/* Warning Notification */}
        <div className="glass rounded-xl p-4 border-l-4 border-yellow-400">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center pulse-glow">
              <span className="text-white text-sm">⚠</span>
            </div>
            <div>
              <h4 className="text-white font-semibold">Attention Required</h4>
              <p className="text-white/70 text-sm">Chlorine levels slightly elevated</p>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        <div className="glass rounded-xl p-4 border-l-4 border-red-400">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center glow">
              <span className="text-white text-sm">✕</span>
            </div>
            <div>
              <h4 className="text-white font-semibold">Action Required</h4>
              <p className="text-white/70 text-sm">Water quality below safe standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8">
        <div className="inline-flex items-center space-x-2 text-white/70">
          <span>✨</span>
          <span>Powered by Advanced AI Technology</span>
          <span>✨</span>
        </div>
      </footer>
    </div>
  );
} 