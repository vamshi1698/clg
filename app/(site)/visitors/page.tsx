import type { Metadata } from 'next'
import { VisitorsPage as VisitorsComponent } from '@/components/visitors/visitors-page'

export const metadata: Metadata = {
  title: 'Campus Tour & Visitors Guide | National College Jayanagar',
  description: 'Visitor guide for National College Jayanagar. Access directions for traveling by metro, BMTC bus, or car, parking slots, campus tours booking, and facilities guide.',
  keywords: ['National College Jayanagar directions', 'college campus tour Bangalore', 'nearest metro Jayanagar college', 'parking South Gate Jayanagar', 'visit National College'],
  alternates: { canonical: '/visitors' },
  openGraph: {
    title: 'Campus Tour & Visitors Guide | National College Jayanagar',
    description: 'Find travel directions, guide slots, campus tours booking, and safety tips for visiting National College Jayanagar.',
    url: 'https://nationalcollege.edu.in/visitors',
    type: 'website',
  },
}

export default function VisitorsPage() {
  return <VisitorsComponent />
}
