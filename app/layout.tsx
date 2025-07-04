import { Inter } from 'next/font/google';
// import { Providers } from '@/lib/providers';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CleanWater Scan - AI Water Quality Analysis',
  description: 'Advanced AI-powered water quality testing and monitoring for safe drinking water',
  keywords: ['water quality', 'AI analysis', 'water testing', 'health', 'safety'],
  authors: [{ name: 'CleanWater Team' }],
  creator: 'CleanWater Scan',
  publisher: 'CleanWater Technologies',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  themeColor: '#3B82F6',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'CleanWater Scan',
    title: 'CleanWater Scan - AI Water Quality Analysis',
    description: 'Advanced AI-powered water quality testing and monitoring for safe drinking water',
    url: 'https://cleanwater-scan.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CleanWater Scan - Water Quality Testing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CleanWater Scan - AI Water Quality Analysis',
    description: 'Advanced AI-powered water quality testing and monitoring for safe drinking water',
    images: ['/og-image.png'],
  },
  appleWebApp: {
    title: 'CleanWater Scan',
    statusBarStyle: 'default',
    capable: true,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'CleanWater',
    'application-name': 'CleanWater Scan',
    'msapplication-TileColor': '#3B82F6',
    'msapplication-config': '/browserconfig.xml',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CleanWater" />
        <meta name="application-name" content="CleanWater Scan" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {/* Disabled NextAuth Providers for serverless deployment */}
          <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <AnimatedBackground />
            
            {/* Glass overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
            
            {/* Main content */}
            <div className="relative z-10">
              <Navigation />
              <main className="pb-16 md:pb-0">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
} 