import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components/ui/placeholder-page'

export const metadata: Metadata = {
  title: 'Faculty & Staff Portal | National College Jayanagar',
  description: 'Resources, guidelines, portals, and information for faculty and staff members of National College Jayanagar, Bangalore.',
  alternates: { canonical: '/faculty-staff' },
  robots: { index: false, follow: false },
}

export default function FacultyStaffPage() {
  return <PlaceholderPage title="Faculty & Staff Portal" description="Resources, guidelines, and portals for faculty and staff members." />
}
