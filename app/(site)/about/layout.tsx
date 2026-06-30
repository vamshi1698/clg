import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | National College Jayanagar',
  description: 'Learn about National College Jayanagar — our 60-year legacy, vision, mission, core values, NAAC A++ accreditation, and our commitment to holistic higher education in Bangalore.',
  keywords: ['National College history', 'about National College Jayanagar', 'NAAC A++ college Bangalore', 'autonomous college Jayanagar', 'higher education Bangalore', 'college vision mission'],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About National College Jayanagar | 60 Years of Excellence',
    description: 'From a modest beginning in 1965 to a NAAC A++ landmark institution — discover our journey, values, and the people behind National College Jayanagar.',
    url: 'https://nationalcollege.edu.in/about',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'National College Campus' }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
