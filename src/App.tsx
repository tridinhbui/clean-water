import { Routes, Route } from 'react-router-dom'
import { Navigation } from '@/components/Navigation'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AnimatedBackground } from '@/components/AnimatedBackground'

// Pages
import HomePage from '@/pages/HomePage'
import CameraPage from '@/pages/CameraPage'
import ResultsPage from '@/pages/ResultsPage'
import UIDemo from '@/pages/UIDemo'
import AnalyticsPage from '@/pages/AnalyticsPage'
import HistoryPage from '@/pages/HistoryPage'
import ComparePage from '@/pages/ComparePage'
import ExportPage from '@/pages/ExportPage'
import NotificationsPage from '@/pages/NotificationsPage'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground />
        
        {/* Glass overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
        
        {/* Main content */}
        <div className="relative z-10">
          <Navigation />
          <main className="pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/camera" element={<CameraPage />} />
              <Route path="/results/:sampleId" element={<ResultsPage />} />
              <Route path="/ui-demo" element={<UIDemo />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/export" element={<ExportPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App 