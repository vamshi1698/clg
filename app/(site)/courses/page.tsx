import { Metadata } from 'next'
import { Suspense } from 'react'
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
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50/30 flex items-center justify-center text-slate-400 font-semibold">Loading...</div>}>
      <CoursesPage courses={courses} departments={departments} />
    </Suspense>
  )
}
