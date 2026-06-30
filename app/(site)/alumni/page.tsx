import type { Metadata } from 'next'
import { getAlumniStats, getAlumniWays, getTestimonials, getEvents } from '@/lib/data/public'
import { AlumniPage } from '@/components/alumni/alumni-page'

export const metadata: Metadata = {
  title: 'Alumni Network | National College Jayanagar',
  description: 'Join the 20,000+ strong National College Jayanagar alumni network spanning 45+ countries. Connect, mentor, give back, and stay engaged with your alma mater.',
  keywords: ['National College alumni', 'alumni network Bangalore', 'National College Jayanagar graduates', 'alumni mentorship', 'college alumni India', 'Jayanagar college alumni'],
  alternates: { canonical: '/alumni' },
  openGraph: {
    title: 'Alumni Network | National College Jayanagar',
    description: '20,000+ alumni across 45+ countries. Stay connected, mentor students, attend reunions, and give back to National College Jayanagar.',
    url: 'https://nationalcollege.edu.in/alumni',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'National College Alumni Network' }],
  },
}

export default async function AlumniRoute() {
  const [alumniStats, alumniWays, testimonials, events] = await Promise.all([
    getAlumniStats(),
    getAlumniWays(),
    getTestimonials({ featured: true }),
    getEvents({ upcoming: true, limit: 3 }),
  ])

  return (
    <AlumniPage
      alumniStats={alumniStats}
      alumniWays={alumniWays}
      testimonials={testimonials}
      upcomingEvents={events}
    />
  )
}
