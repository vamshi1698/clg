import type { Metadata } from 'next'
import { NCCPage as NCCComponent } from '@/components/campus-life/ncc-page'

export const metadata: Metadata = {
  title: 'NCC Unit | National Cadet Corps | National College Jayanagar',
  description: 'Explore the National Cadet Corps (NCC) unit at National College Jayanagar. Join military training, adventure camps, firing practice, and leadership development programs.',
  keywords: ['NCC National College Jayanagar', 'National Cadet Corps Bangalore', 'NCC unit college', 'NCC training camps', 'NCC certificate'],
  alternates: { canonical: '/campus-life/ncc' },
  openGraph: {
    title: 'NCC Unit | National College Jayanagar',
    description: 'Join the NCC unit at National College Jayanagar for military training, adventure activities, and leadership development.',
    url: 'https://nationalcollege.edu.in/campus-life/ncc',
    type: 'website',
  },
}

export default function NCCPage() {
  return <NCCComponent />
}
