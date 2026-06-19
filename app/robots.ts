import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cms/', '/api/'],
    },
    sitemap: 'https://nationalcollege.edu.in/sitemap.xml',
  }
}
