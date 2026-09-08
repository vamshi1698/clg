import * as XLSX from 'xlsx'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'

export const BATCH_SIZE = 200

export interface BatchProcessingOptions {
  batchSize?: number
  defaultDob?: string
}

export interface BatchProcessingResult {
  ok: boolean
  totalRows: number
  validRows: number
  importedCount: number
  insertedCount: number
  updatedCount: number
  batchCount: number
  batchesSucceeded: number
  batchesFailed: number
  executionTimeMs: number
  errors: string[] | null
  warnings: string[] | null
}

interface NormalizedStudentRow {
  rowNumber: number
  registerNumber: string
  name: string
  dateOfBirth: string
  departmentId: string | null
  courseId: string | null
  academicYear: string | null
  semester: number | null
  isActive: boolean
}

// Resilient header synonyms for inconsistent legacy spreadsheet formats
const HEADER_SYNONYMS: Record<string, string[]> = {
  register_number: [
    'register_number', 'reg_no', 'regno', 'reg_num', 'registerno',
    'registration_number', 'registration_no', 'reg_number', 'roll_no',
    'rollno', 'roll_number', 'usn', 'student_id', 'admission_no',
    'adm_no', 'hall_ticket_no', 'htno', 'enrollment_no', 'reg_code'
  ],
  name: [
    'name', 'student_name', 'studentname', 'full_name', 'fullname',
    'candidate_name', 'student_full_name', 'name_of_the_student',
    'name_of_candidate', 'candidate', 'student'
  ],
  date_of_birth: [
    'date_of_birth', 'dob', 'd.o.b', 'birth_date', 'birthdate',
    'dateofbirth', 'd_o_b', 'b_date', 'bdate', 'date_birth'
  ],
  department: [
    'department_code', 'dept_code', 'dept', 'department', 'branch',
    'branch_code', 'dept_name', 'department_name', 'deptcode'
  ],
  course: [
    'course_code', 'course', 'degree', 'program', 'programme',
    'course_name', 'prog_code', 'coursecode', 'stream'
  ],
  academic_year: [
    'academic_year', 'academic_yr', 'acad_year', 'year', 'batch',
    'admission_year', 'ay', 'academic_session', 'academic_batch', 'acad_yr'
  ],
  semester: [
    'semester', 'sem', 'current_semester', 'current_sem', 'term',
    'sem_no', 'semester_no', 'current_term'
  ],
  is_active: [
    'is_active', 'status', 'active', 'current_status', 'state'
  ]
}

function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function findMatchedHeader(headers: string[], fieldKey: string): string | undefined {
  const synonyms = HEADER_SYNONYMS[fieldKey] || [fieldKey]
  const cleanedSynonyms = synonyms.map(normalizeKey)

  return headers.find((h) => {
    const cleaned = normalizeKey(h)
    return cleanedSynonyms.includes(cleaned)
  })
}

/**
 * Multi-format resilient Date Parser
 * Handles Excel dates, ISO strings, Indian/UK DD/MM/YYYY, US MM/DD/YYYY, and separators (- . /)
 */
export function parseSpreadsheetDate(val: any, defaultDate = '2000-01-01'): { date: string; warning?: string } {
  if (val === null || val === undefined || val === '') {
    return { date: defaultDate, warning: `Date missing, defaulted to ${defaultDate}` }
  }

  if (val instanceof Date) {
    if (!isNaN(val.getTime())) {
      return { date: val.toISOString().split('T')[0] }
    }
  }

  if (typeof val === 'number') {
    // Excel serial number conversion (days since 1899-12-30)
    const date = new Date(Math.round((val - 25569) * 86400 * 1000))
    if (!isNaN(date.getTime())) {
      return { date: date.toISOString().split('T')[0] }
    }
  }

  if (typeof val === 'string') {
    const cleaned = val.trim()
    if (!cleaned) {
      return { date: defaultDate, warning: `Date empty, defaulted to ${defaultDate}` }
    }

    // Match YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
    const isoMatch = cleaned.match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})$/)
    if (isoMatch) {
      const year = isoMatch[1]
      const month = isoMatch[2].padStart(2, '0')
      const day = isoMatch[3].padStart(2, '0')
      return { date: `${year}-${month}-${day}` }
    }

    // Match DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
    const dmyMatch = cleaned.match(/^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})$/)
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, '0')
      const month = dmyMatch[2].padStart(2, '0')
      const year = dmyMatch[3]
      // Validate logical month vs day
      const mNum = parseInt(month, 10)
      const dNum = parseInt(day, 10)
      if (mNum <= 12 && dNum <= 31) {
        return { date: `${year}-${month}-${day}` }
      }
    }

    // Try standard JS Date parsing
    const parsed = new Date(cleaned)
    if (!isNaN(parsed.getTime())) {
      return { date: parsed.toISOString().split('T')[0] }
    }
  }

  return { date: defaultDate, warning: `Unrecognized date format "${val}", defaulted to ${defaultDate}` }
}

/**
 * Normalizes semester values from numbers ("1", 1) or Roman numerals ("I", "II", "IV", etc.)
 */
function parseSemester(val: any): number | null {
  if (val === null || val === undefined || val === '') return null
  if (typeof val === 'number') {
    return val >= 1 && val <= 12 ? Math.floor(val) : null
  }
  const str = String(val).trim().toUpperCase()
  const romanMap: Record<string, number> = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
    'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
  }
  if (romanMap[str]) return romanMap[str]
  const num = parseInt(str, 10)
  return !isNaN(num) && num >= 1 && num <= 12 ? num : null
}

/**
 * Standardize academic year strings, e.g. "2024-25" -> "2024-2025"
 */
function normalizeAcademicYear(val: any): string | null {
  if (!val) return null
  const str = String(val).trim()
  const shortRangeMatch = str.match(/^(\d{4})\s*[-/]\s*(\d{2})$/)
  if (shortRangeMatch) {
    const startYear = parseInt(shortRangeMatch[1], 10)
    const endPrefix = shortRangeMatch[1].substring(0, 2)
    return `${startYear}-${endPrefix}${shortRangeMatch[2]}`
  }
  return str.replace(/\s+/g, '')
}

/**
 * Chunk an array into sub-arrays of size N to avoid high memory overhead
 */
export function chunkArray<T>(items: T[], size = BATCH_SIZE): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

/**
 * Streamed / Chunked Batch Processor for Student Excel Files
 * Features:
 * - 200 records per batch transaction
 * - Rollback triggers on batch failure (no dirty half-inserted data)
 * - Ultra-low latency direct local PostgreSQL queries
 * - Inconsistent spreadsheet format validation pipeline
 */
export async function processStudentExcelBuffer(
  fileBuffer: ArrayBuffer | Uint8Array,
  options: BatchProcessingOptions = {}
): Promise<BatchProcessingResult> {
  const startTime = Date.now()
  const batchSize = options.batchSize || BATCH_SIZE
  const defaultDob = options.defaultDob || '2000-01-01'

  const errors: string[] = []
  const warnings: string[] = []

  // 1. Read Excel workbook
  const workbook = XLSX.read(new Uint8Array(fileBuffer), {
    type: 'array',
    cellDates: true,
    dense: true
  })

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    return {
      ok: false,
      totalRows: 0,
      validRows: 0,
      importedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      batchCount: 0,
      batchesSucceeded: 0,
      batchesFailed: 0,
      executionTimeMs: Date.now() - startTime,
      errors: ['The uploaded workbook contains no sheets.'],
      warnings: null
    }
  }

  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' })

  if (rawRows.length === 0) {
    return {
      ok: false,
      totalRows: 0,
      validRows: 0,
      importedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      batchCount: 0,
      batchesSucceeded: 0,
      batchesFailed: 0,
      executionTimeMs: Date.now() - startTime,
      errors: ['Spreadsheet is empty or contains no data rows.'],
      warnings: null
    }
  }

  // 2. Identify Headers from Header Synonym Pipeline
  const headers = Object.keys(rawRows[0] || {})
  const regNoCol = findMatchedHeader(headers, 'register_number')
  const nameCol = findMatchedHeader(headers, 'name')
  const dobCol = findMatchedHeader(headers, 'date_of_birth')
  const deptCol = findMatchedHeader(headers, 'department')
  const courseCol = findMatchedHeader(headers, 'course')
  const acadYearCol = findMatchedHeader(headers, 'academic_year')
  const semCol = findMatchedHeader(headers, 'semester')
  const activeCol = findMatchedHeader(headers, 'is_active')

  if (!regNoCol || !nameCol) {
    return {
      ok: false,
      totalRows: rawRows.length,
      validRows: 0,
      importedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      batchCount: 0,
      batchesSucceeded: 0,
      batchesFailed: 0,
      executionTimeMs: Date.now() - startTime,
      errors: [
        `Required column headers missing. File must contain "Register Number" and "Name". Found columns: ${headers.join(', ')}`
      ],
      warnings: null
    }
  }

  // 3. Preload reference mappings (Departments & Courses) from local Postgres
  const { data: depts } = await postgresClient.from('departments').select('id, code, name')
  const { data: courses } = await postgresClient.from('courses').select('id, code, name')

  const deptMap = new Map<string, string>()
  ;(depts || []).forEach((d: any) => {
    if (d.code) {
      deptMap.set(d.code.toLowerCase().trim(), d.id)
      deptMap.set(normalizeKey(d.code), d.id)
    }
    if (d.name) {
      deptMap.set(d.name.toLowerCase().trim(), d.id)
      deptMap.set(normalizeKey(d.name), d.id)
    }
  })

  const courseMap = new Map<string, string>()
  ;(courses || []).forEach((c: any) => {
    if (c.code) {
      courseMap.set(c.code.toLowerCase().trim(), c.id)
      courseMap.set(normalizeKey(c.code), c.id)
    }
    if (c.name) {
      courseMap.set(c.name.toLowerCase().trim(), c.id)
      courseMap.set(normalizeKey(c.name), c.id)
    }
  })

  // 4. Validation & Normalization Pipeline on each row
  const validRows: NormalizedStudentRow[] = []
  const seenRegNumbersInFile = new Set<string>()

  for (let idx = 0; idx < rawRows.length; idx++) {
    const row = rawRows[idx]
    const rowNum = idx + 2 // Excel row number (1-indexed + header)

    const rawRegNo = String(row[regNoCol] || '').trim()
    const rawName = String(row[nameCol] || '').trim()

    if (!rawRegNo && !rawName) {
      // Entirely blank row, skip quietly
      continue
    }

    if (!rawRegNo) {
      errors.push(`Row ${rowNum}: Skipped due to missing Register Number.`)
      continue
    }

    if (!rawName) {
      errors.push(`Row ${rowNum} (${rawRegNo}): Skipped due to missing Name.`)
      continue
    }

    const regNo = rawRegNo.toUpperCase()
    if (seenRegNumbersInFile.has(regNo)) {
      warnings.push(`Row ${rowNum}: Duplicate Register Number "${regNo}" in file. Later row will overwrite earlier data.`)
    }
    seenRegNumbersInFile.add(regNo)

    // Parse Date of Birth
    const rawDob = dobCol ? row[dobCol] : null
    const { date: parsedDob, warning: dobWarn } = parseSpreadsheetDate(rawDob, defaultDob)
    if (dobWarn && rawDob) {
      warnings.push(`Row ${rowNum} (${regNo}): ${dobWarn}`)
    }

    // Department code/name lookup
    let departmentId: string | null = null
    if (deptCol && row[deptCol]) {
      const deptRaw = String(row[deptCol]).trim()
      departmentId = deptMap.get(deptRaw.toLowerCase()) || deptMap.get(normalizeKey(deptRaw)) || null
      if (!departmentId) {
        warnings.push(`Row ${rowNum} (${regNo}): Department "${deptRaw}" not found in system database.`)
      }
    }

    // Course code/name lookup
    let courseId: string | null = null
    if (courseCol && row[courseCol]) {
      const courseRaw = String(row[courseCol]).trim()
      courseId = courseMap.get(courseRaw.toLowerCase()) || courseMap.get(normalizeKey(courseRaw)) || null
      if (!courseId) {
        warnings.push(`Row ${rowNum} (${regNo}): Course "${courseRaw}" not found in system database.`)
      }
    }

    // Semester and Academic Year
    const semester = semCol ? parseSemester(row[semCol]) : null
    const academicYear = acadYearCol ? normalizeAcademicYear(row[acadYearCol]) : null

    // Status
    let isActive = true
    if (activeCol && row[activeCol] !== undefined && row[activeCol] !== '') {
      const actStr = String(row[activeCol]).trim().toLowerCase()
      if (['false', '0', 'no', 'inactive', 'dropped'].includes(actStr)) {
        isActive = false
      }
    }

    validRows.push({
      rowNumber: rowNum,
      registerNumber: regNo,
      name: rawName,
      dateOfBirth: parsedDob,
      departmentId,
      courseId,
      academicYear,
      semester,
      isActive
    })
  }

  if (validRows.length === 0) {
    return {
      ok: false,
      totalRows: rawRows.length,
      validRows: 0,
      importedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      batchCount: 0,
      batchesSucceeded: 0,
      batchesFailed: 0,
      executionTimeMs: Date.now() - startTime,
      errors: errors.length > 0 ? errors : ['No valid student records found to import.'],
      warnings: warnings.length > 0 ? warnings : null
    }
  }

  // 5. Chunk into 200 records per transaction with rollback triggers against local PostgreSQL
  const chunks = chunkArray(validRows, batchSize)
  let totalInserted = 0
  let totalUpdated = 0
  let batchesSucceeded = 0
  let batchesFailed = 0

  for (let batchIndex = 0; batchIndex < chunks.length; batchIndex++) {
    const chunk = chunks[batchIndex]
    const batchLabel = `Batch ${batchIndex + 1}/${chunks.length} (${chunk.length} records)`

    const batchResult = await postgresClient.withTransaction(async (client) => {
      let batchInserted = 0
      let batchUpdated = 0

      const regNos = chunk.map((r) => r.registerNumber)

      // Query existing students in this chunk
      const existingRes = await client.query(
        `SELECT id, register_number FROM students WHERE register_number = ANY($1) AND (is_deleted = false OR is_deleted IS NULL)`,
        [regNos]
      )
      const existingMap = new Map<string, string>(
        (existingRes.rows || []).map((r: any) => [r.register_number.toUpperCase(), r.id])
      )

      const now = new Date().toISOString()

      const toInsert: any[] = []
      const toUpdate: any[] = []

      for (const record of chunk) {
        const existingId = existingMap.get(record.registerNumber)
        if (existingId) {
          toUpdate.push({ ...record, id: existingId })
        } else {
          const newId = crypto.randomUUID()
          toInsert.push({ ...record, id: newId })
          existingMap.set(record.registerNumber, newId)
        }
      }

      // Execute bulk multi-row insert if any
      if (toInsert.length > 0) {
        const values: any[] = []
        const valuePlaceholders: string[] = []
        let pIdx = 1

        for (const item of toInsert) {
          valuePlaceholders.push(
            `($${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, false, $${pIdx++}, $${pIdx++})`
          )
          values.push(
            item.id,
            item.registerNumber,
            item.name,
            item.dateOfBirth,
            item.departmentId,
            item.courseId,
            item.academicYear,
            item.semester,
            item.isActive,
            now,
            now
          )
        }

        await client.query(
          `INSERT INTO students (
             id, register_number, name, date_of_birth,
             department_id, course_id, academic_year, semester,
             is_active, is_deleted, created_at, updated_at
           ) VALUES ${valuePlaceholders.join(', ')}`,
          values
        )
        batchInserted = toInsert.length
      }

      // Execute updates
      if (toUpdate.length > 0) {
        for (const record of toUpdate) {
          await client.query(
            `UPDATE students
             SET name = $1,
                 date_of_birth = $2,
                 department_id = COALESCE($3, department_id),
                 course_id = COALESCE($4, course_id),
                 academic_year = COALESCE($5, academic_year),
                 semester = COALESCE($6, semester),
                 is_active = $7,
                 is_deleted = false,
                 updated_at = $8
             WHERE id = $9`,
            [
              record.name,
              record.dateOfBirth,
              record.departmentId,
              record.courseId,
              record.academicYear,
              record.semester,
              record.isActive,
              now,
              record.id
            ]
          )
        }
        batchUpdated = toUpdate.length
      }

      return { batchInserted, batchUpdated }
    })

    if (batchResult.error) {
      // Transaction rolled back automatically by withTransaction!
      batchesFailed++
      const sampleRegs = chunk.slice(0, 3).map((c) => c.registerNumber).join(', ')
      errors.push(
        `${batchLabel} failed and was rolled back. Error: ${batchResult.error.message || 'Database error'} (Sample Reg Nos: ${sampleRegs}...)`
      )
    } else if (batchResult.data) {
      batchesSucceeded++
      totalInserted += batchResult.data.batchInserted
      totalUpdated += batchResult.data.batchUpdated
    }
  }

  const executionTimeMs = Date.now() - startTime

  return {
    ok: batchesSucceeded > 0,
    totalRows: rawRows.length,
    validRows: validRows.length,
    importedCount: totalInserted + totalUpdated,
    insertedCount: totalInserted,
    updatedCount: totalUpdated,
    batchCount: chunks.length,
    batchesSucceeded,
    batchesFailed,
    executionTimeMs,
    errors: errors.length > 0 ? errors : null,
    warnings: warnings.length > 0 ? warnings : null
  }
}
