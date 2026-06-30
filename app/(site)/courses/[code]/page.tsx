import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourseByCode, getCourses } from '@/lib/data/public'
import { CourseDetailPage } from '@/components/courses/course-detail'

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    code: (course.code || '').toLowerCase(),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const course = await getCourseByCode((await params).code.toUpperCase())
  if (!course) {
    return { title: 'Program Not Found' }
  }
  return {
    title: `${course.name} (${course.code.toUpperCase()})`,
    description: course.overview || `Learn more about the ${course.name} program at National College Jayanagar.`,
  }
}

export default async function CoursePage({ params }: { params: Promise<{ code: string }> }) {
  const course = await getCourseByCode((await params).code.toUpperCase())

  if (!course) {
    notFound()
  }

  return <CourseDetailPage course={course} />
}
