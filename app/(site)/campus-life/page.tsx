import type { Metadata } from 'next'
import { CampusLifePage as CampusLifeComponent } from '@/components/campus-life/campus-life-page'

export const metadata: Metadata = {
  title: 'Campus Life & Hostels | National College Jayanagar',
  description: 'Explore the vibrant campus life at National College Jayanagar. Access student hostels, sports grounds, athletic infrastructure, dining facilities, cafeterias, and student clubs.',
  keywords: ['National College Jayanagar campus life', 'student hostels Bangalore', 'college sports grounds', 'Jayanagar college hostels', 'student clubs Jayanagar'],
  alternates: { canonical: '/campus-life' },
  openGraph: {
    title: 'Campus Life & Hostels | National College Jayanagar',
    description: 'Explore student hostels, sports grounds, cultural activities, cafeterias, and vibrant clubs at National College Jayanagar.',
    url: 'https://nationalcollege.edu.in/campus-life',
    type: 'website',
  },
}

export default function CampusLifePage() {
  return <CampusLifeComponent />
}
