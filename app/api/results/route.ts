import { NextResponse } from 'next/server'
import { getStudentByCredentials, getStudentResults, getStudentResultSummaries } from '@/lib/data/public'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const registerNumber = String(body.registerNumber || '').trim()
  const dateOfBirth = String(body.dateOfBirth || '').trim()

  if (!registerNumber || !dateOfBirth) {
    return NextResponse.json(
      { error: 'Register number and date of birth are required' },
      { status: 400 }
    )
  }

  const student = await getStudentByCredentials(registerNumber, dateOfBirth)
  if (!student) {
    return NextResponse.json(
      { error: 'No student found with the provided details.' },
      { status: 404 }
    )
  }

  const [results, summaries] = await Promise.all([
    getStudentResults(student.id as string),
    getStudentResultSummaries(student.id as string),
  ])

  return NextResponse.json({
    student: {
      id: student.id,
      name: student.name,
      register_number: student.register_number,
      course_name: student.course_name,
      department_name: student.department_name,
    },
    results,
    summaries,
  })
}
