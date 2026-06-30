import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Parents | National College Jayanagar',
  description: 'Resources and information for parents of National College Jayanagar students — access academic progress, attendance, fee information, exam results, and important contacts.',
  keywords: ['National College parents', 'parent portal Bangalore college', 'student attendance Jayanagar', 'college fee payment', 'parent teacher meeting National College', 'student welfare Bangalore'],
  alternates: { canonical: '/parents' },
  openGraph: {
    title: 'For Parents | National College Jayanagar',
    description: "Stay informed and involved in your child's academic journey at National College. Access portals, contacts, and key information for parents.",
    url: 'https://nationalcollege.edu.in/parents',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'National College Parent Resources' }],
  },
}

export default function ParentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
