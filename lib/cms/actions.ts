'use server'

import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'
import { TABLE_CONFIGS } from '@/lib/cms/tables'

const ALLOWED_TABLES = new Set(TABLE_CONFIGS.map((t) => t.table))

function isValidTable(table: string): boolean {
  return ALLOWED_TABLES.has(table)
}

export async function deleteRow(table: string, id: string): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const { error } = await postgresClient.delete(table, id)
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function toggleActive(table: string, id: string, value: boolean): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const { error } = await postgresClient.update(table, id, { is_active: value })
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function updateSortOrder(table: string, id: string, sortOrder: number): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const { error } = await postgresClient.update(table, id, { sort_order: sortOrder })
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function saveRow(table: string, data: Record<string, unknown>, id?: string): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  if (id) {
    const { error } = await postgresClient.update(table, id, data as Record<string, any>)
    if (error) return { error: error.message }
  } else {
    // Generate UUID if table needs UUID for primary key
    const payload = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data
    }
    const { error } = await postgresClient.insert(table, payload)
    if (error) return { error: error.message }
  }
  revalidateAdmin(table)
  return { ok: true }
}

function revalidateAdmin(table: string) {
  try {
    revalidatePath('/cms')
    revalidatePath(`/cms/${table}`)
    revalidatePath('/', 'layout')
  } catch {}
}

// Contact message status
export async function updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied') {
  const update: Record<string, unknown> = { status }
  if (status === 'read') update.read_at = new Date().toISOString()
  if (status === 'replied') update.replied_at = new Date().toISOString()
  const { error } = await postgresClient.update('contact_messages', id, update)
  if (error) return { error: error.message }
  revalidatePath('/cms/messages')
  return { ok: true }
}

export async function deleteMessage(id: string) {
  const { error } = await postgresClient.delete('contact_messages', id)
  if (error) return { error: error.message }
  revalidatePath('/cms/messages')
  return { ok: true }
}

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

export async function saveMultipleResults(
  studentId: string,
  semester: number,
  academicYear: string,
  examinationType: string,
  subjects: Array<{
    subject_code: string
    subject_name: string
    internal_marks?: number | null
    external_marks?: number | null
    max_marks?: number | null
    grade?: string | null
    credits?: number | null
    result_status?: string | null
    is_active?: boolean
  }>
): Promise<{ error?: string } & { ok?: boolean }> {
  try {
    // 1. Delete existing results & summaries for student + semester
    await postgresClient.query('DELETE FROM results WHERE student_id = $1 AND semester = $2', [studentId, semester])
    await postgresClient.query('DELETE FROM result_summaries WHERE student_id = $1 AND semester = $2', [studentId, semester])

    let totalCredits = 0
    let earnedCredits = 0
    let gradePointsSum = 0
    let hasFail = false

    // 2. Insert results
    for (const subject of subjects) {
      const internal = subject.internal_marks !== undefined && subject.internal_marks !== null && String(subject.internal_marks) !== '' ? Number(subject.internal_marks) : null
      const external = subject.external_marks !== undefined && subject.external_marks !== null && String(subject.external_marks) !== '' ? Number(subject.external_marks) : null
      const totalMarks = (internal ?? 0) + (external ?? 0)
      const maxMarks = subject.max_marks !== undefined && subject.max_marks !== null && String(subject.max_marks) !== '' ? Number(subject.max_marks) : 100

      // Determine status
      let status = subject.result_status
      if (!status) {
        status = totalMarks >= maxMarks * 0.4 ? 'PASS' : 'FAIL'
      }

      const c = subject.credits !== undefined && subject.credits !== null && String(subject.credits) !== '' ? Number(subject.credits) : 0
      totalCredits += c
      if (status === 'PASS') {
        earnedCredits += c
      } else {
        hasFail = true
      }

      const points = getGradePoints(subject.grade || null)
      gradePointsSum += points * c

      const resultId = crypto.randomUUID()
      const { error: resErr } = await postgresClient.insert('results', {
        id: resultId,
        student_id: studentId,
        semester: Number(semester),
        academic_year: academicYear,
        examination_type: examinationType,
        subject_code: subject.subject_code,
        subject_name: subject.subject_name,
        internal_marks: internal,
        external_marks: external,
        total_marks: totalMarks,
        max_marks: maxMarks,
        grade: subject.grade || null,
        credits: c,
        result_status: status,
        is_active: subject.is_active !== undefined ? Boolean(subject.is_active) : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      if (resErr) {
        throw new Error(`Failed to insert mark for ${subject.subject_code}: ${resErr.message}`)
      }
    }

    // 3. Calculate SGPA and CGPA
    const sgpa = totalCredits > 0 ? Number((gradePointsSum / totalCredits).toFixed(2)) : 0

    // Fetch previous summaries to average them for CGPA
    const { data: previousSummaries } = await postgresClient
      .from('result_summaries')
      .select('sgpa')
      .eq('student_id', studentId)

    const prevSgpaList: number[] = (previousSummaries || [])
      .map((s: any) => s.sgpa)
      .filter((val: any) => val !== null && val !== undefined)

    prevSgpaList.push(sgpa)
    const cgpa = prevSgpaList.length > 0
      ? Number((prevSgpaList.reduce((acc, curr) => acc + curr, 0) / prevSgpaList.length).toFixed(2))
      : sgpa

    // 4. Insert result summary
    const summaryId = crypto.randomUUID()
    const { error: sumErr } = await postgresClient.insert('result_summaries', {
      id: summaryId,
      student_id: studentId,
      semester: Number(semester),
      academic_year: academicYear,
      examination_type: examinationType,
      sgpa,
      cgpa,
      total_credits: totalCredits,
      earned_credits: earnedCredits,
      result_status: hasFail ? 'FAIL' : 'PASS',
      published_at: new Date().toISOString(),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    if (sumErr) {
      throw new Error(`Failed to write result summary: ${sumErr.message}`)
    }

    revalidateAdmin('results')
    return { ok: true }
  } catch (err: any) {
    return { error: err.message || 'An error occurred while saving results.' }
  }
}


