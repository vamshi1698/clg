import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus Life | National College Jayanagar',
  description: 'Explore vibrant campus life at National College Jayanagar — student hostels, sports & athletics, arts & culture, dining, clubs, fitness center, and campus transport in Bangalore.',
  keywords: ['campus life National College', 'student hostels Jayanagar', 'college sports Bangalore', 'student clubs Bangalore', 'college arts culture', 'National College facilities'],
  alternates: { canonical: '/campus-life' },
  openGraph: {
    title: 'Campus Life at National College Jayanagar',
    description: 'Beyond classrooms — discover vibrant student life with 15+ clubs, sports grounds, hostels, cafeterias, and cultural fests at National College, Bangalore.',
    url: 'https://nationalcollege.edu.in/campus-life',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'National College Campus Life' }],
  },
}

export default function CampusLifeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
