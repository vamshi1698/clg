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
    if (ref.table === 'navigation_links') {
      query = query.is('parent_id', null)
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
    case 'parent_id':
      return { table: 'navigation_links', label: 'name', value: 'id' }
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
    let query = postgres.from(config.table).select(select)
    if (config.baseFilter) {
      if (config.baseFilter.operator === 'is') {
        query = query.is(config.baseFilter.column, config.baseFilter.value)
      } else if (config.baseFilter.operator === 'not') {
        query = query.not(config.baseFilter.column, 'is', config.baseFilter.value)
      }
    }
    const { data, error } = await query.order(orderBy, { ascending })
    if (!error) resultData = data || []
  }

  if (!resultData) return id ? null : []

  const rows = Array.isArray(resultData) ? resultData : [resultData]

  const hasCourseId = config.fields.some(f => f.name === 'course_id') || config.table === 'results'
  const hasDeptId = config.fields.some(f => f.name === 'department_id')
  const hasStudentId = config.fields.some(f => f.name === 'student_id')

  const studentIds = hasStudentId
    ? Array.from(new Set(rows.map((r: any) => r.student_id).filter(Boolean)))
    : []
  const courseIds = hasCourseId
    ? Array.from(new Set(rows.map((r: any) => r.course_id).filter(Boolean)))
    : []
  const deptIds = hasDeptId
    ? Array.from(new Set(rows.map((r: any) => r.department_id).filter(Boolean)))
    : []

  const [coursesRes, deptsRes, studentsRes] = await Promise.all([
    courseIds.length > 0
      ? postgresClient.from('courses').select('id, name, code').in('id', courseIds)
      : hasCourseId && !id
      ? postgresClient.from('courses').select('id, name, code')
      : null,
    deptIds.length > 0
      ? postgresClient.from('departments').select('id, name, code').in('id', deptIds)
      : hasDeptId && !id
      ? postgresClient.from('departments').select('id, name, code')
      : null,
    studentIds.length > 0
      ? postgresClient.from('students').select('id, name, register_number, course_id').in('id', studentIds)
      : null,
  ])

  const courses = coursesRes?.data as any[] | null
  const depts = deptsRes?.data as any[] | null
  const students = studentsRes?.data as any[] | null

  for (const row of rows) {
    if (hasStudentId && row.student_id) {
      const match = students?.find(s => s.id === row.student_id)
      if (match) {
        row.students = { name: `${match.name} (${match.register_number})` }
        row.student_name = match.name
        if (config.table === 'results') {
          row.course_id = match.course_id
        }
      }
    }
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
    if (config.table === 'navigation_links' && row.parent_id) {
      const parent = rows.find(r => r.id === row.parent_id)
      if (parent) {
        row.parent_name = parent.name
      } else {
        // If parent not in current page/fetch, this is a fallback
        // but since we fetch all navigation_links, it should be in rows
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

export interface FetchPaginatedOptions {
  page?: number
  pageSize?: number | 'all'
  search?: string
  courseId?: string
  departmentId?: string
  viewTrash?: boolean
}

export interface PaginatedResult<T = any> {
  rows: T[]
  total: number
  page: number
  pageSize: number | 'all'
  totalPages: number
}

export async function fetchPaginatedRows(
  config: TableConfig,
  options: FetchPaginatedOptions = {}
): Promise<PaginatedResult> {
  const page = Math.max(1, options.page || 1)
  const pageSize = options.pageSize || 25
  const limit = pageSize === 'all' ? null : Number(pageSize)
  const offset = limit ? (page - 1) * limit : 0

  if (config.slug === 'students') {
    const isTrash = !!options.viewTrash
    let whereClauses = ['s.is_deleted = ' + (isTrash ? 'TRUE' : 'FALSE')]
    let params: any[] = []
    let paramIdx = 1

    if (options.departmentId) {
      whereClauses.push(`s.department_id = $${paramIdx++}`)
      params.push(options.departmentId)
    }
    if (options.courseId) {
      whereClauses.push(`s.course_id = $${paramIdx++}`)
      params.push(options.courseId)
    }
    if (options.search && options.search.trim()) {
      const term = `%${options.search.trim()}%`
      whereClauses.push(`(s.name ILIKE $${paramIdx} OR s.register_number ILIKE $${paramIdx})`)
      paramIdx++
      params.push(term)
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''
    const countSql = `SELECT COUNT(*)::int as total FROM students s ${whereSql}`
    const countRes = await postgresClient.query(countSql, params)
    const total = countRes.data?.[0]?.total || 0

    let dataSql = `SELECT s.* FROM students s ${whereSql} ORDER BY s.register_number ASC`
    let queryParams = [...params]
    if (limit) {
      dataSql += ` LIMIT $${paramIdx++} OFFSET $${paramIdx++}`
      queryParams.push(limit, offset)
    }

    const dataRes = await postgresClient.query(dataSql, queryParams)
    const rows = dataRes.data || []

    const courseIds = Array.from(new Set(rows.map((r: any) => r.course_id).filter(Boolean)))
    const deptIds = Array.from(new Set(rows.map((r: any) => r.department_id).filter(Boolean)))

    const [coursesRes, deptsRes] = await Promise.all([
      courseIds.length > 0 ? postgresClient.from('courses').select('id, name, code').in('id', courseIds) : null,
      deptIds.length > 0 ? postgresClient.from('departments').select('id, name, code').in('id', deptIds) : null,
    ])
    const courses = coursesRes?.data as any[] | null
    const depts = deptsRes?.data as any[] | null

    for (const row of rows) {
      if (row.course_id) {
        const match = courses?.find((c) => c.id === row.course_id)
        if (match) row.courses = { name: `${match.name} (${match.code.toUpperCase()})` }
      }
      if (row.department_id) {
        const match = depts?.find((d) => d.id === row.department_id)
        if (match) row.departments = { name: `${match.name} (${match.code.toUpperCase()})` }
      }
    }

    const totalPages = limit ? Math.max(1, Math.ceil(total / limit)) : 1
    return { rows, total, page, pageSize, totalPages }
  }

  if (config.slug === 'results') {
    let whereClauses: string[] = []
    let params: any[] = []
    let paramIdx = 1

    if (options.courseId) {
      whereClauses.push(`s.course_id = $${paramIdx++}`)
      params.push(options.courseId)
    }
    if (options.departmentId) {
      whereClauses.push(`s.department_id = $${paramIdx++}`)
      params.push(options.departmentId)
    }
    if (options.search && options.search.trim()) {
      const term = `%${options.search.trim()}%`
      whereClauses.push(`(s.name ILIKE $${paramIdx} OR s.register_number ILIKE $${paramIdx} OR r.subject_name ILIKE $${paramIdx} OR r.subject_code ILIKE $${paramIdx})`)
      paramIdx++
      params.push(term)
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''
    const countSql = `
      SELECT COUNT(DISTINCT (r.student_id, r.semester, COALESCE(r.examination_type, 'SEMESTER END EXAMINATION')))::int as total
      FROM results r
      LEFT JOIN students s ON r.student_id = s.id
      ${whereSql}
    `
    const countRes = await postgresClient.query(countSql, params)
    const total = countRes.data?.[0]?.total || 0

    let dataSql: string
    let queryParams = [...params]
    if (limit) {
      const limitIdx = paramIdx++
      const offsetIdx = paramIdx++
      queryParams.push(limit, offset)
      dataSql = `
        WITH paged_groups AS (
          SELECT r.student_id, r.semester, COALESCE(r.examination_type, 'SEMESTER END EXAMINATION') as exam_type, r.academic_year
          FROM results r
          LEFT JOIN students s ON r.student_id = s.id
          ${whereSql}
          GROUP BY r.student_id, r.semester, COALESCE(r.examination_type, 'SEMESTER END EXAMINATION'), r.academic_year
          ORDER BY r.semester DESC, r.student_id ASC
          LIMIT $${limitIdx} OFFSET $${offsetIdx}
        )
        SELECT r.*, s.name as student_name, s.register_number as student_register_number, s.course_id as student_course_id, c.name as course_name, c.code as course_code
        FROM results r
        INNER JOIN paged_groups pg ON r.student_id = pg.student_id AND r.semester = pg.semester AND COALESCE(r.examination_type, 'SEMESTER END EXAMINATION') = pg.exam_type
        LEFT JOIN students s ON r.student_id = s.id
        LEFT JOIN courses c ON s.course_id = c.id
        ORDER BY r.semester DESC, s.name ASC, r.id ASC;
      `
    } else {
      dataSql = `
        SELECT r.*, s.name as student_name, s.register_number as student_register_number, s.course_id as student_course_id, c.name as course_name, c.code as course_code
        FROM results r
        LEFT JOIN students s ON r.student_id = s.id
        LEFT JOIN courses c ON s.course_id = c.id
        ${whereSql}
        ORDER BY r.semester DESC, s.name ASC, r.id ASC;
      `
    }

    const dataRes = await postgresClient.query(dataSql, queryParams)
    const rows = (dataRes.data || []).map((row: any) => ({
      ...row,
      students: {
        name: `${row.student_name || 'Student'} (${row.student_register_number || '—'})`,
        register_number: row.student_register_number,
      },
      courses: row.course_name ? { name: `${row.course_name} (${(row.course_code || '').toUpperCase()})` } : null,
      course_id: row.student_course_id || row.course_id,
    }))

    const totalPages = limit ? Math.max(1, Math.ceil(total / limit)) : 1
    return { rows, total, page, pageSize, totalPages }
  }

  // Generic table fallback
  const allRows = await fetchRows(config)
  const rowsList = Array.isArray(allRows) ? allRows : []
  const total = rowsList.length
  const paginated = limit ? rowsList.slice(offset, offset + limit) : rowsList
  const totalPages = limit ? Math.max(1, Math.ceil(total / limit)) : 1
  return { rows: paginated, total, page, pageSize, totalPages }
}

