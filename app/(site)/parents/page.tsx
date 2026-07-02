import type { Metadata } from 'next'
import { ParentsPage as ParentsComponent } from '@/components/parents/parents-page'

export const metadata: Metadata = {
  title: 'For Parents & Families | National College Jayanagar',
  description: 'Access academic progress portals, fee payment schedules, notice boards, and direct welfare hotlines. Parent resource directory at National College Jayanagar.',
  keywords: ['National College parent portal', 'parent teacher association Jayanagar', 'college fee portal', 'academic progress tracker', 'student welfare office Jayanagar'],
  alternates: { canonical: '/parents' },
  openGraph: {
    title: 'Resources for Parents & Families | National College Jayanagar',
    description: 'Find important links for parent portals, direct welfare hotlines, and FAQs at National College Jayanagar.',
    url: 'https://nationalcollege.edu.in/parents',
    type: 'website',
  },
}

export default function ParentsPage() {
  return <ParentsComponent />
}
