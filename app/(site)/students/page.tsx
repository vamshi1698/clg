import { Metadata } from 'next'
import { getImportantDates } from '@/lib/data/public'
import { StudentsPage } from '@/components/students/students-page'

export const metadata: Metadata = {
  title: 'Student Resources',
  description: 'Everything you need to navigate academic life — from portals and calendars to clubs, career support, and wellness services at National College Jayanagar.',
}

export default async function Students() {
  const importantDates = await getImportantDates()
  return <StudentsPage importantDates={importantDates} />
}
