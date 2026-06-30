import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDepartmentByCode, getDepartments, getFaculty, getCourses } from '@/lib/data/public'
import { DepartmentDetailPage } from '@/components/departments/department-detail'

export async function generateStaticParams() {
  const departments = await getDepartments()
  return departments.map((dept) => ({
    code: (dept.code || '').toLowerCase(),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const department = await getDepartmentByCode((await params).code.toUpperCase())
  if (!department) {
    return { title: 'Department Not Found' }
  }
  return {
    title: department.name,
    description: department.description || department.overview,
  }
}

export default async function DepartmentPage({ params }: { params: Promise<{ code: string }> }) {
  const [department, faculty, courses] = await Promise.all([
    getDepartmentByCode((await params).code.toUpperCase()),
    getFaculty({ departmentId: undefined }),
    getCourses(),
  ])

  if (!department) {
    notFound()
  }

  const deptFaculty = faculty.filter(f => f.department_id === department.id)
  const deptCourses = courses.filter(c => c.department_id === department.id)

  return (
    <DepartmentDetailPage
      department={department}
      faculty={deptFaculty}
      courses={deptCourses}
    />
  )
}
