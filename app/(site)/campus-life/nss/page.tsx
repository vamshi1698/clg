import type { Metadata } from 'next'
import { NSSPage as NSSComponent } from '@/components/campus-life/nss-page'

export const metadata: Metadata = {
  title: 'NSS Unit | National Service Scheme | National College Jayanagar',
  description: 'Discover the National Service Scheme (NSS) unit at National College Jayanagar. Participate in community service, health drives, environmental campaigns, and social responsibility programs.',
  keywords: ['NSS National College Jayanagar', 'National Service Scheme Bangalore', 'NSS volunteer college', 'community service college', 'NSS camps'],
  alternates: { canonical: '/campus-life/nss' },
  openGraph: {
    title: 'NSS Unit | National College Jayanagar',
    description: 'Join the NSS unit at National College Jayanagar for community service, environmental projects, and social responsibility.',
    url: 'https://nationalcollege.edu.in/campus-life/nss',
    type: 'website',
  },
}

export default function NSSPage() {
  return <NSSComponent />
}
