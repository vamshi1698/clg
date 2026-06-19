import 'server-only'
import type { TableConfig, FieldConfig } from './tables'
import type { QueryResultRow } from 'pg'
import { query, queryOne } from '@/lib/db/pool'

export interface ReferenceData {
  [fieldName: string]: { value: string; label: string }[]
}

interface ReferenceSpec {
  table: string
  label: string
  value: string
  extraLabel?: string
}

function referenceFor(field: FieldConfig): ReferenceSpec | null {
  switch (field.name) {
    case 'department_id':
      return { table: 'departments', label: 'name', value: 'id' }
    case 'course_id':
      return { table: 'courses', label: 'name', value: 'id', extraLabel: 'code' }
    case 'student_id':
      return { table: 'students', label: 'name', value: 'id', extraLabel: 'register_number' }
    default:
      return null
  }
}

export async function resolveReferenceOptions(
  config: TableConfig
): Promise<ReferenceData> {
  const result: ReferenceData = {}
  for (const field of config.fields) {
    if (field.type !== 'select') continue
    if (field.options && field.options.length > 0) continue
    const ref = referenceFor(field)
    if (!ref) continue

    const labelSql = ref.extraLabel
      ? `${ref.label} || ' (' || ${ref.extraLabel} || ')'`
      : `${ref.label}`
    try {
      const res = await query<{ value: string; label: string }>(
        `SELECT ${ref.value}::text AS value, ${labelSql} AS label
         FROM ${ref.table}
         ORDER BY ${ref.label} ASC`
      )
      result[field.name] = res.rows.map((r) => ({
        value: r.value,
        label: r.label,
      }))
    } catch (err) {
      console.error(`reference resolve failed for ${field.name}:`, err)
      result[field.name] = []
    }
  }
  return result
}

/**
 * Build the relation-aware select for a table. Mirrors the previous PostgREST
 * `select: '*, departments(*)'` pattern by joining known relations.
 */
function selectSql(config: TableConfig): { sql: string } {
  const table = config.table
  const relations: { name: string; join: string }[] = []

  // Determine which relations are referenced by the table's columns or fields.
  const hasDept = config.fields.some((f) => f.name === 'department_id')
  const hasCourse = config.fields.some((f) => f.name === 'course_id')
  const hasStudent = config.fields.some((f) => f.name === 'student_id')

  if (hasDept)
    relations.push({
      name: 'departments',
      join: `LEFT JOIN departments ON departments.id = ${table}.department_id`,
    })
  if (hasCourse)
    relations.push({
      name: 'courses',
      join: `LEFT JOIN courses ON courses.id = ${table}.course_id`,
    })
  if (hasStudent)
    relations.push({
      name: 'students',
      join: `LEFT JOIN students ON students.id = ${table}.student_id`,
    })

  const joins = relations.map((r) => r.join).join(' ')
  const selectCols = [
    `${table}.*`,
    ...relations.map((r) => `row_to_json(${r.name}.*) AS ${r.name}`),
  ].join(', ')

  return { sql: `SELECT ${selectCols} FROM ${table} ${joins}` }
}

export async function fetchRows<T extends QueryResultRow = QueryResultRow>(
  config: TableConfig,
  id?: string
): Promise<T[] | T | null> {
  const { sql } = selectSql(config)
  const orderBy = config.orderColumn || 'created_at'
  const ascending =
    config.orderColumn === 'sort_order' || config.orderColumn === 'year'

  if (id) {
    try {
      return await queryOne<T>(`${sql} WHERE ${config.table}.id = $1 LIMIT 1`, [
        id,
      ])
    } catch (err) {
      console.error('fetchRows single error:', err)
      return null
    }
  }

  try {
    const res = await query<T>(
      `${sql} ORDER BY ${config.table}.${orderBy} ${ascending ? 'ASC' : 'DESC'} NULLS LAST`
    )
    return res.rows
  } catch (err) {
    console.error('fetchRows error:', err)
    return []
  }
}

export async function fetchSingleton<T extends QueryResultRow = QueryResultRow>(
  config: TableConfig
): Promise<T | null> {
  try {
    return await queryOne<T>(`SELECT * FROM ${config.table} LIMIT 1`)
  } catch (err) {
    console.error('fetchSingleton error:', err)
    return null
  }
}
