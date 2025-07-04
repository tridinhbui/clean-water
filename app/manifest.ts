import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CleanWater Scan',
    short_name: 'CleanWater',
    description: 'AI-powered water quality analysis and monitoring',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3B82F6',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['utilities', 'health', 'productivity'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
    shortcuts: [
      {
        name: 'Take Water Sample',
        short_name: 'Scan',
        description: 'Quickly analyze water quality',
        url: '/camera',
        icons: [{ src: '/favicon.ico', sizes: '32x32' }]
      },
      {
        name: 'View History',
        short_name: 'History',
        description: 'See past water tests',
        url: '/history',
        icons: [{ src: '/favicon.ico', sizes: '32x32' }]
      },
      {
        name: 'Analytics',
        short_name: 'Analytics',
        description: 'View water quality trends',
        url: '/analytics',
        icons: [{ src: '/favicon.ico', sizes: '32x32' }]
      }
    ],
    prefer_related_applications: false,
  }
} 