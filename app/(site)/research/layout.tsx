import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research & Innovation | National College Jayanagar',
  description: 'Discover pioneering research at National College Jayanagar — 50+ active projects, 120+ published papers, 8 research centers spanning life sciences, AI, environmental studies, and more.',
  keywords: ['research National College', 'college research Bangalore', 'AI research Bangalore college', 'life sciences research', 'student research projects', 'research publications Jayanagar'],
  alternates: { canonical: '/research' },
  openGraph: {
    title: 'Research & Innovation | National College Jayanagar',
    description: '50+ research projects, ₹2Cr+ in funding, and 8 dedicated research centers. National College leads the way in student-faculty collaborative research.',
    url: 'https://nationalcollege.edu.in/research',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'National College Research Lab' }],
  },
}

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
