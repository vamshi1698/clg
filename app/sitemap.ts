import { MetadataRoute } from 'next'
import { getCourses, getDepartments, getNews, getEvents } from '@/lib/data/public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nationalcollege.edu.in'

  const [courses, departments, news, events] = await Promise.all([
    getCourses(),
    getDepartments(),
    getNews(),
    getEvents(),
  ])

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/departments',
    '/courses',
    '/faculty',
    '/news',
    '/events',
    '/gallery',
    '/results',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Department pages
  const departmentPages = departments.map((dept) => ({
    url: `${baseUrl}/departments/${dept.code.toLowerCase()}`,
    lastModified: new Date(dept.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Course pages
  const coursePages = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.code.toLowerCase()}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // News pages
  const newsPages = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'never' as const,
    priority: 0.5,
  }))

  // Event pages
  const eventPages = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(event.updated_at),
    changeFrequency: 'never' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...departmentPages,
    ...coursePages,
    ...newsPages,
    ...eventPages,
  ]
}
