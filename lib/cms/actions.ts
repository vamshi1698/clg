'use server'

import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'
import { TABLE_CONFIGS } from '@/lib/cms/tables'
import { getSession } from '@/lib/cms/auth'
import { canAccessTable } from '@/lib/cms/roles'

const ALLOWED_TABLES = new Set(TABLE_CONFIGS.map((t) => t.table))

function isValidTable(table: string): boolean {
  return ALLOWED_TABLES.has(table)
}

async function verifyActionPermission(table: string, isWriteOperation: boolean = false): Promise<{ error?: string } | null> {
  const session = await getSession()
  if (!session) {
    return { error: 'Unauthorized' }
  }
  if (!canAccessTable(session.role, table)) {
    return { error: 'Unauthorized' }
  }
  if (isWriteOperation && table === 'activity_logs') {
    return { error: 'Action not allowed on activity_logs' }
  }
  return null
}

export async function logCmsActivity(action: string, table: string, details: string) {
  try {
    const session = await getSession()
    if (!session) return
    const payload = {
      id: crypto.randomUUID(),
      admin_name: session.name,
      admin_email: session.email,
      admin_role: session.role,
      action,
      target_table: table,
      details,
      created_at: new Date().toISOString()
    }
    await postgresClient.insert('activity_logs', payload)
  } catch (err) {
    console.error('Failed to log CMS activity:', err)
  }
}

export async function deleteRow(table: string, id: string): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  let error
  if (table === 'students') {
    const res = await postgresClient.update(table, id, { is_deleted: true })
    error = res.error
  } else {
    const res = await postgresClient.delete(table, id)
    error = res.error
  }
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('DELETE', table, `Deleted record ID: ${id}`)
  revalidateAdmin(table)
  return { ok: true }
}

export async function deleteRowPermanent(table: string, id: string): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  const { error } = await postgresClient.delete(table, id)
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('DELETE_PERMANENT', table, `Permanently deleted record ID: ${id}`)
  revalidateAdmin(table)
  return { ok: true }
}

export async function restoreRow(table: string, id: string): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  const { error } = await postgresClient.update(table, id, { is_deleted: false })
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('RESTORE', table, `Restored record ID: ${id}`)
  revalidateAdmin(table)
  return { ok: true }
}

export async function deleteRows(table: string, ids: string[]): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  let error
  if (table === 'students') {
    const { error: err } = await postgresClient.query('UPDATE students SET is_deleted = true WHERE id = ANY($1)', [ids])
    error = err
  } else {
    const { error: err } = await postgresClient.query(`DELETE FROM "${table}" WHERE id = ANY($1)`, [ids])
    error = err
  }
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('DELETE_BATCH', table, `Deleted batch of record IDs: ${ids.join(', ')}`)
  revalidateAdmin(table)
  return { ok: true }
}

export async function deleteRowsPermanent(table: string, ids: string[]): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  const { error } = await postgresClient.query(`DELETE FROM "${table}" WHERE id = ANY($1)`, [ids])
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('DELETE_BATCH_PERMANENT', table, `Permanently deleted batch of record IDs: ${ids.join(', ')}`)
  revalidateAdmin(table)
  return { ok: true }
}

export async function restoreRows(table: string, ids: string[]): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  const { error } = await postgresClient.query(`UPDATE "${table}" SET is_deleted = false WHERE id = ANY($1)`, [ids])
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('RESTORE_BATCH', table, `Restored batch of record IDs: ${ids.join(', ')}`)
  revalidateAdmin(table)
  return { ok: true }
}

export async function toggleActive(table: string, id: string, value: boolean): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  const { error } = await postgresClient.update(table, id, { is_active: value })
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('TOGGLE_ACTIVE', table, `Toggled active status of record ID: ${id} to ${value}`)
  revalidateAdmin(table)
  return { ok: true }
}

export async function updateSortOrder(table: string, id: string, sortOrder: number): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  const { error } = await postgresClient.update(table, id, { sort_order: sortOrder })
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('UPDATE_SORT_ORDER', table, `Updated sort order of record ID: ${id} to ${sortOrder}`)
  revalidateAdmin(table)
  return { ok: true }
}

export async function saveRow(table: string, data: Record<string, unknown>, id?: string): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const authErr = await verifyActionPermission(table, true)
  if (authErr) return authErr

  if (id) {
    const { error } = await postgresClient.update(table, id, data as Record<string, any>)
    if (error) return { error: formatDatabaseError(error) }
    await logCmsActivity('UPDATE', table, `Updated record ID: ${id}. Data keys: ${Object.keys(data).join(', ')}`)
  } else {
    // Generate UUID if table needs UUID for primary key
    const payload = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data
    }
    const { error } = await postgresClient.insert(table, payload)
    if (error) return { error: formatDatabaseError(error) }
    await logCmsActivity('INSERT', table, `Created new record. Data keys: ${Object.keys(data).join(', ')}`)
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
  const authErr = await verifyActionPermission('contact_messages', true)
  if (authErr) return authErr

  const update: Record<string, unknown> = { status }
  if (status === 'read') update.read_at = new Date().toISOString()
  if (status === 'replied') update.replied_at = new Date().toISOString()
  const { error } = await postgresClient.update('contact_messages', id, update)
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('UPDATE_MESSAGE_STATUS', 'contact_messages', `Marked message ID ${id} as ${status}`)
  revalidatePath('/cms/messages')
  return { ok: true }
}

export async function deleteMessage(id: string) {
  const authErr = await verifyActionPermission('contact_messages', true)
  if (authErr) return authErr

  const { error } = await postgresClient.delete('contact_messages', id)
  if (error) return { error: formatDatabaseError(error) }
  await logCmsActivity('DELETE_MESSAGE', 'contact_messages', `Deleted contact message ID ${id}`)
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
        throw new Error(`Failed to insert mark for ${subject.subject_code}: ${formatDatabaseError(resErr)}`)
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
      throw new Error(`Failed to write result summary: ${formatDatabaseError(sumErr)}`)
    }

    revalidateAdmin('results')
    return { ok: true }
  } catch (err: any) {
    return { error: err.message || 'An error occurred while saving results.' }
  }
}

function formatDatabaseError(error: any): string {
  if (!error) return 'An unknown error occurred.'

  const code = error.code
  const message = error.message || ''
  const detail = error.detail || ''
  const constraint = error.constraint || ''
  const table = error.table || ''
  const column = error.column || ''

  switch (code) {
    case '23505': { // Unique constraint
      const match = detail.match(/Key \(([^)]+)\)=\(([^)]+)\) already exists/)
      if (match) {
        const [, field, value] = match
        return `A record with ${field.replace('_key', '').replace('_id', '')} "${value}" already exists. Please use a unique value.`
      }
      return 'A record with this unique value already exists.'
    }
    
    case '23503': { // Foreign key
      if (message.includes('delete') || message.includes('update')) {
        const match = message.match(/violates foreign key constraint "([^"]+)" on table "([^"]+)"/)
        if (match) {
          const [, , referencingTable] = match
          return `Cannot delete or modify this record because it is currently linked to one or more items in "${formatTableName(referencingTable)}".`
        }
        return 'Cannot delete or modify this record because it is referenced by other items in the database. Please remove those links first.'
      } else {
        const match = detail.match(/Key \(([^)]+)\)=\(([^)]+)\) is not present in table "([^"]+)"/)
        if (match) {
          const [, field, , parentTable] = match
          return `The selected ${field.replace('_id', '')} does not exist in "${formatTableName(parentTable)}". Please select a valid option.`
        }
        return 'This record references another item that does not exist.'
      }
    }
    
    case '23502': { // Not null
      if (column) {
        return `The field "${formatColumnName(column)}" cannot be empty.`
      }
      const match = message.match(/column "([^"]+)" violates not-null constraint/)
      if (match) {
        return `The field "${formatColumnName(match[1])}" is required and cannot be empty.`
      }
      return 'A required field was left empty.'
    }
    
    case '23514': {
      return 'The entered data violates validation rules configured for this table.'
    }

    case '22001': {
      if (column) {
        return `The value in "${formatColumnName(column)}" is too long. Please shorten it.`
      }
      return 'One of the values entered exceeds the maximum character limit.'
    }

    default:
      if (detail) {
        return `${message}. Detail: ${detail}`
      }
      return message || 'A database error occurred.'
  }
}

function formatTableName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatColumnName(name: string): string {
  return name
    .replace('_id', '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}


