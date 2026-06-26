import { postgresClient } from '@/lib/postgres/client'
import type { TableConfig, FieldConfig } from './tables'

export interface ReferenceData {
  [fieldName: string]: { value: string; label: string }[]
}

/** Resolve select fields with empty options to actual DB rows. */
export async function resolveReferenceOptions(config: TableConfig): Promise<ReferenceData> {
  const result: ReferenceData = {}
  for (const field of config.fields) {
    if (field.type !== 'select') continue
    if (field.options && field.options.length > 0) continue

    const ref = referenceFor(field)
    if (!ref) continue

    const postgres = postgresClient
    let query = postgres.from(ref.table).select(`${ref.value}, ${ref.label}`)
    if (ref.table === 'students') {
      query = query.select(`${ref.value}, ${ref.label}, register_number`)
    }
    if (ref.table === 'courses') {
      query = query.select(`${ref.value}, ${ref.label}, code`)
    }
    const { data, error } = await query.order(ref.label, { ascending: true })

    if (error || !data) {
      result[field.name] = []
      continue
    }
    result[field.name] = (data as any[]).map((row: any) => ({
      value: row[ref.value],
      label: ref.table === 'students'
        ? `${row[ref.label]} (${row.register_number})`
        : ref.table === 'courses'
        ? `${row[ref.label]} (${row.code})`
        : row[ref.label],
    }))
  }
  return result
}

function referenceFor(field: FieldConfig) {
  switch (field.name) {
    case 'department_id':
      return { table: 'departments', label: 'name', value: 'id' }
    case 'course_id':
      return { table: 'courses', label: 'name', value: 'id' }
    case 'student_id':
      return { table: 'students', label: 'name', value: 'id' }
    default:
      return null
  }
}

export async function fetchRows(config: TableConfig, id?: string): Promise<any[] | any | null> {
  const postgres = postgresClient
  const select = config.select || '*'
  const orderBy = config.orderColumn || 'created_at'
  const ascending = config.orderColumn === 'sort_order' || config.orderColumn === 'year'

  let resultData: any = null

  if (id) {
    const { data, error } = await postgres
      .from(config.table)
      .select(select)
      .eq('id', id)
      .single()
    if (!error) resultData = data
  } else {
    const { data, error } = await postgres
      .from(config.table)
      .select(select)
      .order(orderBy, { ascending })
    if (!error) resultData = data || []
  }

  if (!resultData) return id ? null : []

  const rows = Array.isArray(resultData) ? resultData : [resultData]

  const hasCourseId = config.fields.some(f => f.name === 'course_id')
  const hasDeptId = config.fields.some(f => f.name === 'department_id')
  const hasStudentId = config.fields.some(f => f.name === 'student_id')

  const [coursesRes, deptsRes, studentsRes] = await Promise.all([
    hasCourseId ? postgresClient.from('courses').select('id, name, code') : null,
    hasDeptId ? postgresClient.from('departments').select('id, name, code') : null,
    hasStudentId ? postgresClient.from('students').select('id, name, register_number') : null,
  ])

  const courses = coursesRes?.data as any[] | null
  const depts = deptsRes?.data as any[] | null
  const students = studentsRes?.data as any[] | null

  for (const row of rows) {
    if (hasCourseId && row.course_id) {
      const match = courses?.find(c => c.id === row.course_id)
      if (match) {
        row.courses = { name: `${match.name} (${match.code.toUpperCase()})` }
      }
    }
    if (hasDeptId && row.department_id) {
      const match = depts?.find(d => d.id === row.department_id)
      if (match) {
        row.departments = { name: `${match.name} (${match.code.toUpperCase()})` }
      }
    }
    if (hasStudentId && row.student_id) {
      const match = students?.find(s => s.id === row.student_id)
      if (match) {
        row.students = { name: `${match.name} (${match.register_number})` }
      }
    }
  }

  return id ? rows[0] : rows
}

export async function fetchSingleton(config: TableConfig): Promise<any | null> {
  const postgres = postgresClient
  const { data, error } = await postgres
    .from(config.table)
    .select('*')
    .limit(1)
    .order('id', { ascending: true })
  if (error || !data || (data as any[]).length === 0) return null
  return (data as any[])[0]
}

