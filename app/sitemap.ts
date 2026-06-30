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

  // Static pages with priorities
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/academics`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/academics/undergraduate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/academics/graduate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/departments`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/admissions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/faculty`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/campus-life`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/alumni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/results`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/parents`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/visitors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/students`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Department pages
  const departmentPages: MetadataRoute.Sitemap = departments.map((dept) => ({
    url: `${baseUrl}/departments/${dept.code.toLowerCase()}`,
    lastModified: new Date(dept.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Course pages
  const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.code.toLowerCase()}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // News pages
  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'never',
    priority: 0.5,
  }))

  // Future events only (past events need not be indexed)
  const futureEvents = events.filter((e) => new Date(e.event_date) >= new Date())
  const eventPages: MetadataRoute.Sitemap = futureEvents.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(event.updated_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...departmentPages,
    ...coursePages,
    ...newsPages,
    ...eventPages,
  ]
}
