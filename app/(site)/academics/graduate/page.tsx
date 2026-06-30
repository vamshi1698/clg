import { Metadata } from 'next'
import { getCourses } from '@/lib/data/public'
import { GraduatePageClient } from '@/components/academics/graduate-page'

export const metadata: Metadata = {
  title: 'Postgraduate Programs - National College Jayanagar',
  description: 'Deepen your expertise with our specialized 2-year postgraduate programs across business, technology, sciences, and humanities at National College Jayanagar.',
}

export default async function GraduatePage() {
  const courses = await getCourses({ level: 'pg' })
  return <GraduatePageClient courses={courses} />
}
