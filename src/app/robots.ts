import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/h-vault/', '/api/'],
    },
    sitemap: 'https://helima.com/sitemap.xml',
  }
}
