import { Metadata } from 'next'
import { getCourses, getDepartments } from '@/lib/data/public'
import { CoursesPage } from '@/components/courses/courses-page'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Explore undergraduate, postgraduate, and diploma programs in Science, Commerce, Engineering, and Management at National College Jayanagar.',
}

export default async function Courses() {
  const [courses, departments] = await Promise.all([
    getCourses(),
    getDepartments(),
  ])
  return <CoursesPage courses={courses} departments={departments} />
}
