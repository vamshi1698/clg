import { Metadata } from 'next'
import { getCourses } from '@/lib/data/public'
import { AdmissionsPage } from '@/components/admissions/admissions-page'

export const metadata: Metadata = {
  title: 'Admissions 2026-27 | National College Jayanagar',
  description: 'Apply online for undergraduate and postgraduate admissions at National College Jayanagar.',
}

export default async function Admissions() {
  const courses = await getCourses()
  return <AdmissionsPage courses={courses} />
}
