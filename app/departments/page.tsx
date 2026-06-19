import { Metadata } from 'next'
import { getDepartments } from '@/lib/data/public'
import { DepartmentsPage } from '@/components/departments/departments-page'

export const metadata: Metadata = {
  title: 'Departments',
  description: 'Explore our diverse academic departments offering undergraduate and postgraduate programs in Science, Commerce, Management, and Arts.',
}

export default async function Departments() {
  const departments = await getDepartments()
  return <DepartmentsPage departments={departments} />
}
