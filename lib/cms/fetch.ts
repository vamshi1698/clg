import { adminClient } from './auth'
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

    const supabase = adminClient()
    let query = supabase.from(ref.table).select(`${ref.value}, ${ref.label}`)
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
    result[field.name] = data.map((row: any) => ({
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
  const supabase = adminClient()
  const select = config.select || '*'
  const orderBy = config.orderColumn || 'created_at'
  const ascending = config.orderColumn === 'sort_order' || config.orderColumn === 'year'

  if (id) {
    const { data, error } = await supabase
      .from(config.table)
      .select(select)
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }

  const { data, error } = await supabase
    .from(config.table)
    .select(select)
    .order(orderBy, { ascending })
  if (error) return []
  return (data || []) as any[]
}

export async function fetchSingleton(config: TableConfig): Promise<any | null> {
  const supabase = adminClient()
  const { data, error } = await supabase
    .from(config.table)
    .select('*')
    .limit(1)
    .order('id', { ascending: true })
  if (error || !data || data.length === 0) return null
  return data[0]
}
