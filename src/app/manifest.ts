import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Profit Loop AI',
    short_name: 'Profit Loop',
    description:
      'AI-powered lead generation, email outreach, and automated traffic — all in one platform.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0c0a0e',
    theme_color: '#0c0a0e',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}
