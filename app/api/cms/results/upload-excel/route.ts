import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'
import { getSession } from '@/lib/cms/auth'

export const dynamic = 'force-dynamic'

function getGradePoints(grade: string | null): number {
  if (!grade) return 0
  switch (grade.toUpperCase().trim()) {
    case 'O': return 10
    case 'A+': return 9
    case 'A': return 8
    case 'B+': return 7
    case 'B': return 6
    case 'C': return 5
    case 'P': return 4
    default: return 0
  }
}

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

function findIndexedValue(row: any, options: string[], index: number): any {
  const indexStr = String(index)
  const rowKeys = Object.keys(row)
  for (const rk of rowKeys) {
    const cleanedKey = rk.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (cleanedKey.includes(indexStr)) {
      for (const opt of options) {
        if (opt === 'subject_code' && (cleanedKey.includes('subjectcode') || cleanedKey.includes('subcode') || (cleanedKey.includes('subject') && cleanedKey.includes('code')))) {
          return row[rk]
        }
        if (opt === 'subject_name' && (cleanedKey.includes('subjectname') || cleanedKey.includes('subname') || (cleanedKey.includes('subject') && cleanedKey.includes('name')))) {
          return row[rk]
        }
        if (opt === 'internal_marks' && (cleanedKey.includes('internal') || cleanedKey.includes('internals'))) {
          return row[rk]
        }
        if (opt === 'external_marks' && (cleanedKey.includes('external') || cleanedKey.includes('externals'))) {
          return row[rk]
        }
        if (opt === 'max_marks' && cleanedKey.includes('max')) {
          return row[rk]
        }
        if (opt === 'credits' && (cleanedKey.includes('credits') || cleanedKey.includes('credit'))) {
          return row[rk]
        }
        if (opt === 'grade' && cleanedKey.includes('grade')) {
          return row[rk]
        }
        if (opt === 'result_status' && (cleanedKey.includes('status') || cleanedKey.includes('resultstatus'))) {
          return row[rk]
        }
      }
    }
  }
  return undefined
}

export async function POST(req: Request) {
  try {
    // Authentication guard — require valid CMS admin session
    const session = await getSession()
    const { canAccess } = await import('@/lib/cms/roles')
    if (!session || !canAccess(session.role, 'results-upload')) {
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

    // Get list of headers from the first row keys
    const headers = Object.keys(rows[0] as object)

    // Match column headers
    const regNoField = findHeader(headers, ['register_number', 'reg_no', 'register number', 'reg no', 'registration number'])
    const nameField = findHeader(headers, ['name', 'student_name', 'student name'])
    const dobField = findHeader(headers, ['date_of_birth', 'dob', 'date of birth'])
    const courseCodeField = findHeader(headers, ['course_code', 'course', 'course code'])
    const deptCodeField = findHeader(headers, ['department_code', 'department', 'department code', 'dept_code'])
    const academicYearField = findHeader(headers, ['academic_year', 'academic year', 'year'])
    const semesterField = findHeader(headers, ['semester', 'sem', 'semester number'])
    const examTypeField = findHeader(headers, ['examination_type', 'exam_type', 'exam type'])
    const subCodeField = findHeader(headers, ['subject_code', 'subject code', 'sub_code', 'course_code_subject'])
    const subNameField = findHeader(headers, ['subject_name', 'subject name', 'sub_name', 'subject'])
    const internalField = findHeader(headers, ['internal_marks', 'internal', 'internals', 'internal marks'])
    const externalField = findHeader(headers, ['external_marks', 'external', 'externals', 'external marks'])
    const maxField = findHeader(headers, ['max_marks', 'max', 'max marks', 'maximum marks'])
    const gradeField = findHeader(headers, ['grade'])
    const creditsField = findHeader(headers, ['credits', 'credit'])
    const statusField = findHeader(headers, ['result_status', 'status', 'result status'])
    const sgpaField = findHeader(headers, ['sgpa'])
    const cgpaField = findHeader(headers, ['cgpa'])
    
    // New fields for extended format
    const totalMaxMarksField = findHeader(headers, ['total_max_marks', 'total max'])
    const totalMarksObtainedField = findHeader(headers, ['total_marks_obtained', 'total obtained', 'marks obtained'])
    const percentageField = findHeader(headers, ['percentage', '%', 'overall percentage'])
    const overallResultField = findHeader(headers, ['overall_result', 'overall result'])
    const classObtainedField = findHeader(headers, ['class_obtained', 'class', 'class obtained'])
    const progTotalMaxMarksField = findHeader(headers, ['programme_total_max_marks', 'prog total max'])
    const progTotalMarksObtainedField = findHeader(headers, ['programme_total_marks_obtained', 'prog total obtained'])
    const progTotalCreditsObtainedField = findHeader(headers, ['programme_total_credits_obtained', 'prog total credits'])
    const progCgpaField = findHeader(headers, ['programme_cgpa', 'prog cgpa'])
    const progGradeField = findHeader(headers, ['programme_grade', 'prog grade'])
    const totalMarksWordsField = findHeader(headers, ['total_marks_words', 'marks in words'])
    const progTotalMarksWordsField = findHeader(headers, ['programme_total_marks_words', 'prog marks in words'])

    // Validate presence of critical columns
    const hasIndexedColumns = headers.some(h => {
      const cleaned = h.toLowerCase().replace(/[^a-z0-9]/g, '')
      return (cleaned.includes('subject1code') || cleaned.includes('subjectcode1') || cleaned.includes('subcode1'))
    })

    if (!regNoField) {
      return NextResponse.json({ error: 'Could not find "Register Number" column in Excel.' }, { status: 400 })
    }
    if (!semesterField || !academicYearField) {
      return NextResponse.json({ error: 'Could not find "Semester" or "Academic Year" column in Excel.' }, { status: 400 })
    }
    if ((!subCodeField || !subNameField) && !hasIndexedColumns) {
      return NextResponse.json({ error: 'Could not find "Subject Code" or "Subject Name" column in Excel.' }, { status: 400 })
    }

    // Load departments & courses to resolve codes to IDs
    const { data: depts } = await postgresClient.from('departments').select('id, code')
    const { data: courses } = await postgresClient.from('courses').select('id, code')

    const deptCodeMap = new Map((depts || []).map((d: any) => [d.code.toLowerCase(), d.id]))
    const courseCodeMap = new Map((courses || []).map((c: any) => [c.code.toLowerCase(), c.id]))

    // Group rows by student (Register Number)
    const studentGroups = new Map<string, any>()

    for (const r of rows) {
      const row = r as any
      const regNo = String(row[regNoField] || '').trim()
      if (!regNo) continue

      const name = nameField ? String(row[nameField] || '').trim() : ''
      const dob = dobField ? parseExcelDate(row[dobField]) : ''
      const courseCode = courseCodeField ? String(row[courseCodeField] || '').trim() : ''
      const deptCode = deptCodeField ? String(row[deptCodeField] || '').trim() : ''
      const academicYear = academicYearField ? String(row[academicYearField] || '').trim() : ''
      const semVal = semesterField ? parseInt(row[semesterField], 10) : NaN
      const examType = examTypeField ? String(row[examTypeField] || 'Semester End Examination').trim() : 'Semester End Examination'

      if (isNaN(semVal)) continue

      const sgpa = sgpaField && row[sgpaField] !== undefined && row[sgpaField] !== '' ? Number(row[sgpaField]) : undefined
      const cgpa = cgpaField && row[cgpaField] !== undefined && row[cgpaField] !== '' ? Number(row[cgpaField]) : undefined

      if (!studentGroups.has(regNo)) {
        studentGroups.set(regNo, {
          regNo,
          name,
          dob,
          courseCode,
          deptCode,
          academicYear,
          semester: semVal,
          examType,
          sgpa,
          cgpa,
          totalMaxMarks: totalMaxMarksField && row[totalMaxMarksField] !== undefined ? Number(row[totalMaxMarksField]) : undefined,
          totalMarksObtained: totalMarksObtainedField && row[totalMarksObtainedField] !== undefined ? Number(row[totalMarksObtainedField]) : undefined,
          percentage: percentageField && row[percentageField] !== undefined ? Number(row[percentageField]) : undefined,
          overallResult: overallResultField && row[overallResultField] !== undefined ? String(row[overallResultField]).trim() : undefined,
          classObtained: classObtainedField && row[classObtainedField] !== undefined ? String(row[classObtainedField]).trim() : undefined,
          progTotalMaxMarks: progTotalMaxMarksField && row[progTotalMaxMarksField] !== undefined ? Number(row[progTotalMaxMarksField]) : undefined,
          progTotalMarksObtained: progTotalMarksObtainedField && row[progTotalMarksObtainedField] !== undefined ? Number(row[progTotalMarksObtainedField]) : undefined,
          progTotalCreditsObtained: progTotalCreditsObtainedField && row[progTotalCreditsObtainedField] !== undefined ? Number(row[progTotalCreditsObtainedField]) : undefined,
          progCgpa: progCgpaField && row[progCgpaField] !== undefined ? Number(row[progCgpaField]) : undefined,
          progGrade: progGradeField && row[progGradeField] !== undefined ? String(row[progGradeField]).trim() : undefined,
          totalMarksWords: totalMarksWordsField && row[totalMarksWordsField] !== undefined ? String(row[totalMarksWordsField]).trim() : undefined,
          progTotalMarksWords: progTotalMarksWordsField && row[progTotalMarksWordsField] !== undefined ? String(row[progTotalMarksWordsField]).trim() : undefined,
          subjects: []
        })
      }

      const group = studentGroups.get(regNo)
      // Capture details from rows that have name/dob if earlier ones didn't
      if (name && !group.name) group.name = name
      if (dob && !group.dob) group.dob = dob
      if (courseCode && !group.courseCode) group.courseCode = courseCode
      if (deptCode && !group.deptCode) group.deptCode = deptCode

      // 1. Unindexed base subject
      if (subCodeField && subNameField) {
        const subCode = String(row[subCodeField] || '').trim()
        const subName = String(row[subNameField] || '').trim()
        if (subCode && subName) {
          const internal = internalField && row[internalField] !== undefined && row[internalField] !== '' ? Number(row[internalField]) : null
          const external = externalField && row[externalField] !== undefined && row[externalField] !== '' ? Number(row[externalField]) : null
          const max = maxField && row[maxField] !== undefined && row[maxField] !== '' ? Number(row[maxField]) : 100
          const theoryMax = 60
          const theoryMin = 21
          const iaMax = 40
          const iaMin = 14
          const totalMin = 35
          const grade = gradeField && row[gradeField] !== undefined ? String(row[gradeField]).trim() : null
          const credits = creditsField && row[creditsField] !== undefined && row[creditsField] !== '' ? Number(row[creditsField]) : null
          const status = statusField && row[statusField] !== undefined ? String(row[statusField]).trim().toUpperCase() : null

          group.subjects.push({
            subCode,
            subName,
            internal,
            external,
            max,
            theoryMax,
            theoryMin,
            iaMax,
            iaMin,
            totalMin,
            grade,
            credits,
            status
          })
        }
      }

      // 2. Loop through potential indexed subjects (e.g. subject1_code ... subject20_code)
      for (let index = 1; index <= 20; index++) {
        const indexedCode = findIndexedValue(row, ['subject_code', 'sub_code'], index)
        const indexedName = findIndexedValue(row, ['subject_name', 'sub_name'], index)
        if (indexedCode !== undefined && indexedName !== undefined) {
          const subCode = String(indexedCode).trim()
          const subName = String(indexedName).trim()
          if (subCode && subName) {
            const internal = findIndexedValue(row, ['internal_marks', 'internal', 'internals'], index)
            const external = findIndexedValue(row, ['external_marks', 'external', 'externals'], index)
            const max = findIndexedValue(row, ['max_marks', 'max'], index)
            const grade = findIndexedValue(row, ['grade'], index)
            const credits = findIndexedValue(row, ['credits', 'credit'], index)
            const status = findIndexedValue(row, ['result_status', 'status'], index)

            group.subjects.push({
              subCode,
              subName,
              internal: internal !== undefined && internal !== '' ? Number(internal) : null,
              external: external !== undefined && external !== '' ? Number(external) : null,
              max: max !== undefined && max !== '' ? Number(max) : 100,
              theoryMax: 60,
              theoryMin: 21,
              iaMax: 40,
              iaMin: 14,
              totalMin: 35,
              grade: grade !== undefined ? String(grade).trim() : null,
              credits: credits !== undefined && credits !== '' ? Number(credits) : null,
              status: status !== undefined ? String(status).trim().toUpperCase() : null
            })
          }
        }
      }
    }

    let studentsImported = 0
    let marksImported = 0
    const errors: string[] = []

    const studentEntries = Array.from(studentGroups.entries())
    for (let i = 0; i < studentEntries.length; i++) {
      const [regNo, sData] = studentEntries[i]
      try {
        // Find existing student
        const { data: existingStudent } = await postgresClient
          .from('students')
          .select('*')
          .eq('register_number', regNo)
          .single()

        const courseId = sData.courseCode ? courseCodeMap.get(sData.courseCode.toLowerCase()) : null
        const deptId = sData.deptCode ? deptCodeMap.get(sData.deptCode.toLowerCase()) : null

        let studentId = ''

        if (existingStudent) {
          studentId = (existingStudent as any).id
          // Update student info if details are provided in excel
          const updates: Record<string, any> = {
            updated_at: new Date().toISOString()
          }
          if (sData.name) updates.name = sData.name
          if (sData.dob) updates.date_of_birth = sData.dob
          if (courseId) updates.course_id = courseId
          if (deptId) updates.department_id = deptId
          if (sData.academicYear) updates.academic_year = sData.academicYear
          if (sData.semester) updates.semester = sData.semester

          await postgresClient.update('students', studentId, updates)
        } else {
          studentId = crypto.randomUUID()
          const birthDate = sData.dob || '2000-01-01'
          const stdName = sData.name || `Student ${regNo}`

          const { error: insErr } = await postgresClient.insert('students', {
            id: studentId,
            register_number: regNo,
            name: stdName,
            date_of_birth: birthDate,
            course_id: courseId || null,
            department_id: deptId || null,
            academic_year: sData.academicYear || null,
            semester: sData.semester || null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

          if (insErr) {
            errors.push(`Reg No ${regNo}: Failed to create student: ${insErr.message}`)
            continue
          }
        }

        // Clean existing results & summaries for student + semester
        await postgresClient.query('DELETE FROM results WHERE student_id = $1 AND semester = $2', [studentId, sData.semester])
        await postgresClient.query('DELETE FROM result_summaries WHERE student_id = $1 AND semester = $2', [studentId, sData.semester])

        let totalCredits = 0
        let earnedCredits = 0
        let gradePointsSum = 0
        let hasFail = false

        // Insert results
        for (const subject of sData.subjects) {
          const totalMarks = (subject.internal || 0) + (subject.external || 0)
          const maxMarks = subject.max || 100

          // Determine status
          let status = subject.status
          if (!status) {
            status = totalMarks >= maxMarks * 0.4 ? 'PASS' : 'FAIL'
          }

          const c = subject.credits || 0
          totalCredits += c
          if (status === 'PASS') {
            earnedCredits += c
          } else {
            hasFail = true
          }

          const points = getGradePoints(subject.grade)
          gradePointsSum += points * c
          const creditPoints = points * c

          const resultId = crypto.randomUUID()
          const { error: resErr } = await postgresClient.insert('results', {
            id: resultId,
            student_id: studentId,
            semester: sData.semester,
            academic_year: sData.academicYear,
            examination_type: sData.examType,
            subject_code: subject.subCode,
            subject_name: subject.subName,
            internal_marks: subject.internal,
            external_marks: subject.external,
            total_marks: totalMarks,
            max_marks: maxMarks,
            theory_max_marks: subject.theoryMax,
            theory_min_marks: subject.theoryMin,
            ia_max_marks: subject.iaMax,
            ia_min_marks: subject.iaMin,
            total_min_marks: subject.totalMin,
            grade_points: points,
            credit_points: creditPoints,
            grade: subject.grade,
            credits: subject.credits,
            result_status: status,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

          if (resErr) {
            errors.push(`Reg No ${regNo}, Subject ${subject.subCode}: Failed to insert mark: ${resErr.message}`)
          } else {
            marksImported++
          }
        }

        // Calculate SGPA and CGPA
        const calculatedSgpa = totalCredits > 0 ? Number((gradePointsSum / totalCredits).toFixed(2)) : 0
        const sgpa = sData.sgpa !== undefined ? sData.sgpa : calculatedSgpa

        // Let's compute CGPA. We fetch all previous summaries to average them.
        const { data: previousSummaries } = await postgresClient
          .from('result_summaries')
          .select('sgpa')
          .eq('student_id', studentId)

        const prevSgpaList: number[] = (previousSummaries || [])
          .map((s: any) => s.sgpa)
          .filter((val: any) => val !== null && val !== undefined)

        prevSgpaList.push(sgpa)
        const computedCgpa = prevSgpaList.length > 0
          ? Number((prevSgpaList.reduce((acc, curr) => acc + curr, 0) / prevSgpaList.length).toFixed(2))
          : sgpa

        const cgpa = sData.cgpa !== undefined ? sData.cgpa : computedCgpa

        // Insert result summary
        const summaryId = crypto.randomUUID()
        const { error: sumErr } = await postgresClient.insert('result_summaries', {
          id: summaryId,
          student_id: studentId,
          semester: sData.semester,
          academic_year: sData.academicYear,
          examination_type: sData.examType,
          sgpa,
          cgpa,
          total_credits: totalCredits,
          earned_credits: earnedCredits,
          total_max_marks: sData.totalMaxMarks,
          total_marks_obtained: sData.totalMarksObtained,
          percentage: sData.percentage,
          overall_result: sData.overallResult !== undefined ? sData.overallResult : (hasFail ? 'FAIL' : 'PASS'),
          class_obtained: sData.classObtained,
          programme_total_max_marks: sData.progTotalMaxMarks,
          programme_total_marks_obtained: sData.progTotalMarksObtained,
          programme_total_credits_obtained: sData.progTotalCreditsObtained,
          programme_cgpa: sData.progCgpa,
          programme_grade: sData.progGrade,
          total_marks_words: sData.totalMarksWords,
          programme_total_marks_words: sData.progTotalMarksWords,
          result_status: hasFail ? 'FAIL' : 'PASS',
          published_at: new Date().toISOString(),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

        if (sumErr) {
          errors.push(`Reg No ${regNo}: Failed to write result summary: ${sumErr.message}`)
        }

        studentsImported++
      } catch (studentErr: any) {
        errors.push(`Reg No ${regNo}: Unexpected error: ${studentErr.message}`)
      }
    }

    if (marksImported > 0) {
      try {
        const uniqueExams = new Set<string>()
        for (const sData of Array.from(studentGroups.values())) {
          if (sData.academicYear && sData.semester) {
            const examType = sData.examType || 'Semester End Examination'
            uniqueExams.add(JSON.stringify({
              academicYear: sData.academicYear,
              semester: sData.semester,
              examType
            }))
          }
        }

        const { createExcelResultNewsAnnouncement } = await import('@/lib/actions/results-actions')
        for (const examStr of Array.from(uniqueExams)) {
          const exam = JSON.parse(examStr)
          await createExcelResultNewsAnnouncement(exam)
        }
      } catch (newsErr) {
        console.error('Failed to create excel news announcements:', newsErr)
      }
      try {
        const { logCmsActivity } = await import('@/lib/cms/actions')
        const examSummary = Array.from(studentGroups.values())[0]
        const year = examSummary?.academicYear || 'N/A'
        const sem = examSummary?.semester || 'N/A'
        const examType = examSummary?.examType || 'Semester End Examination'
        await logCmsActivity('IMPORT_EXCEL', 'results', `Imported ${studentsImported} student marks for Sem ${sem} ${examType} (${year})`)
      } catch (logErr) {
        console.error('Audit logging error:', logErr)
      }
    }

    return NextResponse.json({
      ok: true,
      studentsImported,
      marksImported,
      errors: errors.length > 0 ? errors : null
    })
  } catch (error: any) {
    console.error('Excel Import Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred during Excel import.' }, { status: 500 })
  }
}
