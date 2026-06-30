import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visit Us | National College Jayanagar, Bangalore',
  description: 'Plan your visit to National College Jayanagar, Bangalore. Get directions by car, BMTC bus, and metro. Book guided campus tours and explore our facilities.',
  keywords: ['visit National College Jayanagar', 'college campus tour Bangalore', 'how to reach National College', 'Jayanagar college address', 'BMTC bus National College', 'Bangalore college directions'],
  alternates: { canonical: '/visitors' },
  openGraph: {
    title: 'Visit National College Jayanagar | Campus Tours & Directions',
    description: 'Plan your visit to National College Jayanagar. Book a guided campus tour, get directions by car, BMTC bus, or metro, and experience our vibrant campus.',
    url: 'https://nationalcollege.edu.in/visitors',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'National College Jayanagar Campus' }],
  },
}

export default function VisitorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
