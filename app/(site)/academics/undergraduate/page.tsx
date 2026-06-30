import { Metadata } from 'next'
import { getCourses } from '@/lib/data/public'
import { UndergraduatePageClient } from '@/components/academics/undergraduate-page'

export const metadata: Metadata = {
  title: 'Undergraduate Programs - National College Jayanagar',
  description: 'Choose from a wide range of 3-year undergraduate degree programs across Arts, Science, Commerce, and Technology at National College Jayanagar.',
}

export default async function UndergraduatePage() {
  const courses = await getCourses({ level: 'ug' })
  return <UndergraduatePageClient courses={courses} />
}
