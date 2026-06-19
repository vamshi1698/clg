import { Metadata } from 'next'
import { getFaculty, getDepartments } from '@/lib/data/public'
import { FacultyPage } from '@/components/faculty/faculty-page'

export const metadata: Metadata = {
  title: 'Faculty',
  description: 'Meet our distinguished faculty members - experienced educators and researchers dedicated to academic excellence at National College Jayanagar.',
}

export default async function Faculty() {
  const [faculty, departments] = await Promise.all([
    getFaculty(),
    getDepartments(),
  ])
  return <FacultyPage faculty={faculty} departments={departments} />
}
