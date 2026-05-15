import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Helima',
    short_name: 'Helima',
    description:
      'Premium fashion and lifestyle products — curated with care, delivered with love.',
    icons: [
      {
        src: '/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/apple-icon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    theme_color: '#09071c',
    background_color: '#09071c',
    display: 'standalone',
    scope: '/',
    start_url: '/',
  }
}
