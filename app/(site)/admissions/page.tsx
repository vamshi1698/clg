import { Metadata } from 'next'
import { getImportantDates, getCourses } from '@/lib/data/public'
import { AdmissionsPage } from '@/components/admissions/admissions-page'

export const metadata: Metadata = {
  title: 'Admissions',
  description: 'Learn about the admission process, eligibility requirements, and important deadlines for undergraduate and postgraduate courses at National College Jayanagar.',
}

export default async function Admissions() {
  const [importantDates, courses] = await Promise.all([
    getImportantDates(),
    getCourses()
  ])
  return <AdmissionsPage importantDates={importantDates} courses={courses} />
}
