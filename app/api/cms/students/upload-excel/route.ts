import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'
import { getSession } from '@/lib/cms/auth'

export const dynamic = 'force-dynamic'

function parseExcelDate(val: any): string {
  if (val instanceof Date) {
    return val.toISOString().split('T')[0]
  }
  if (typeof val === 'number') {
    // Excel date serial number conversion
    const date = new Date(Math.round((val - 25569) * 86400 * 1000))
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  }
  if (typeof val === 'string') {
    const cleaned = val.trim()
    const match = cleaned.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
    if (match) {
      return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
    }
    const d = new Date(cleaned)
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0]
    }
  }
  return ''
}

function findHeader(headers: string[], options: string[]): string | undefined {
  return headers.find((h) => {
    const cleaned = h.toLowerCase().replace(/[^a-z0-9]/g, '')
    return options.some((opt) => {
      const optCleaned = opt.toLowerCase().replace(/[^a-z0-9]/g, '')
      return cleaned === optCleaned
    })
  })
}

export async function POST(req: Request) {
  try {
    // Authentication guard — require valid CMS admin session
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array', cellDates: true })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Excel sheet is empty' }, { status: 400 })
    }

    const headers = Object.keys(rows[0] as object)

    const nameField = findHeader(headers, ['name', 'student_name', 'student name'])
    const regNoField = findHeader(headers, ['register_number', 'reg_no', 'register number', 'reg no', 'registration number'])
    const dobField = findHeader(headers, ['date_of_birth', 'dob', 'date of birth'])
    const deptCodeField = findHeader(headers, ['department_code', 'department', 'department code', 'dept_code'])
    const courseCodeField = findHeader(headers, ['course_code', 'course', 'course code'])
    const academicYearField = findHeader(headers, ['academic_year', 'academic year', 'year'])
    const semesterField = findHeader(headers, ['semester', 'sem', 'semester number'])

    if (!nameField || !regNoField) {
      return NextResponse.json({ error: 'Excel sheet must contain at least "name" and "register_number" columns.' }, { status: 400 })
    }

    // Load depts & courses maps
    const { data: depts } = await postgresClient.from('departments').select('id, code')
    const { data: courses } = await postgresClient.from('courses').select('id, code')

    const deptCodeMap = new Map((depts || []).map((d: any) => [d.code.toLowerCase(), d.id]))
    const courseCodeMap = new Map((courses || []).map((c: any) => [c.code.toLowerCase(), c.id]))

    let importedCount = 0
    const errors: string[] = []

    for (const r of rows) {
      const row = r as any
      const regNo = String(row[regNoField] || '').trim()
      const name = String(row[nameField] || '').trim()
      
      if (!regNo || !name) {
        errors.push(`Row skipped: missing Register Number or Name`)
        continue
      }

      const dob = dobField && row[dobField] ? parseExcelDate(row[dobField]) : '2000-01-01'
      const deptCode = deptCodeField ? String(row[deptCodeField] || '').trim() : ''
      const courseCode = courseCodeField ? String(row[courseCodeField] || '').trim() : ''
      const academicYear = academicYearField ? String(row[academicYearField] || '').trim() : ''
      const semesterVal = semesterField ? parseInt(row[semesterField], 10) : null
      const semester = isNaN(semesterVal as number) ? null : semesterVal

      const deptId = deptCode ? deptCodeMap.get(deptCode.toLowerCase()) : null
      const courseId = courseCode ? courseCodeMap.get(courseCode.toLowerCase()) : null

      try {
        // Check if student already exists
        const { data: existing } = await postgresClient
          .from('students')
          .select('id')
          .eq('register_number', regNo)
          .single()

        if (existing) {
          const studentId = (existing as any).id
          const { error: updErr } = await postgresClient.update('students', studentId, {
            name,
            date_of_birth: dob,
            department_id: deptId || null,
            course_id: courseId || null,
            academic_year: academicYear || null,
            semester: semester,
            updated_at: new Date().toISOString()
          })
          if (updErr) {
            errors.push(`Reg No ${regNo}: Update error: ${updErr.message}`)
          } else {
            importedCount++
          }
        } else {
          const studentId = crypto.randomUUID()
          const { error: insErr } = await postgresClient.insert('students', {
            id: studentId,
            register_number: regNo,
            name,
            date_of_birth: dob,
            department_id: deptId || null,
            course_id: courseId || null,
            academic_year: academicYear || null,
            semester: semester,
            is_active: true,
            is_deleted: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          if (insErr) {
            errors.push(`Reg No ${regNo}: Insert error: ${insErr.message}`)
          } else {
            importedCount++
          }
        }
      } catch (err: any) {
        errors.push(`Reg No ${regNo}: Unexpected error: ${err.message}`)
      }
    }

    return NextResponse.json({
      ok: true,
      importedCount,
      errors: errors.length > 0 ? errors : null
    })
  } catch (error: any) {
    console.error('Bulk Students Import Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred during import.' }, { status: 500 })
  }
}
