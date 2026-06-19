import 'server-only'
import { query, queryOne } from '@/lib/db/pool'
import type {
  SiteSettings,
  Statistics,
  Department,
  Course,
  Faculty,
  News,
  Event,
  GalleryItem,
  Recruiter,
  Testimonial,
  Achievement,
  Milestone,
  Accreditation,
  Leadership,
  Student,
  Result,
  ResultSummary,
} from '@/types/database'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await queryOne<SiteSettings>(
      `SELECT * FROM site_settings WHERE id = 1 LIMIT 1`
    )
  } catch (err) {
    console.error('Error fetching site settings:', err)
    return null
  }
}

export async function getStatistics(): Promise<Statistics | null> {
  try {
    return await queryOne<Statistics>(
      `SELECT * FROM statistics WHERE id = 1 LIMIT 1`
    )
  } catch (err) {
    console.error('Error fetching statistics:', err)
    return null
  }
}

export async function getDepartments(): Promise<Department[]> {
  try {
    const res = await query<Department>(
      `SELECT * FROM departments WHERE is_active = true ORDER BY sort_order ASC`
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching departments:', err)
    return []
  }
}

export async function getDepartmentByCode(code: string): Promise<Department | null> {
  try {
    return await queryOne<Department>(
      `SELECT * FROM departments WHERE code = $1 AND is_active = true LIMIT 1`,
      [code]
    )
  } catch (err) {
    console.error('Error fetching department:', err)
    return null
  }
}

export async function getCourses(
  options?: { level?: string; departmentId?: string }
): Promise<Course[]> {
  try {
    let sql = `SELECT c.*, row_to_json(d) AS departments
               FROM courses c
               LEFT JOIN departments d ON d.id = c.department_id
               WHERE c.is_active = true`
    const params: unknown[] = []
    if (options?.level) {
      params.push(options.level)
      sql += ` AND c.level = $${params.length}`
    }
    if (options?.departmentId) {
      params.push(options.departmentId)
      sql += ` AND c.department_id = $${params.length}`
    }
    sql += ` ORDER BY c.sort_order ASC`
    const res = await query<Course>(sql, params)
    return res.rows
  } catch (err) {
    console.error('Error fetching courses:', err)
    return []
  }
}

export async function getCourseByCode(code: string): Promise<Course | null> {
  try {
    return await queryOne<Course>(
      `SELECT c.*, row_to_json(d) AS departments
       FROM courses c
       LEFT JOIN departments d ON d.id = c.department_id
       WHERE c.code = $1 AND c.is_active = true
       LIMIT 1`,
      [code]
    )
  } catch (err) {
    console.error('Error fetching course:', err)
    return null
  }
}

export async function getFaculty(
  options?: { departmentId?: string }
): Promise<Faculty[]> {
  try {
    let sql = `SELECT f.*, row_to_json(d) AS departments
               FROM faculty f
               LEFT JOIN departments d ON d.id = f.department_id
               WHERE f.is_active = true`
    const params: unknown[] = []
    if (options?.departmentId) {
      params.push(options.departmentId)
      sql += ` AND f.department_id = $${params.length}`
    }
    sql += ` ORDER BY f.sort_order ASC`
    const res = await query<Faculty>(sql, params)
    return res.rows
  } catch (err) {
    console.error('Error fetching faculty:', err)
    return []
  }
}

export async function getNews(
  options?: { limit?: number; category?: string; featured?: boolean }
): Promise<News[]> {
  try {
    let sql = `SELECT * FROM news WHERE is_active = true`
    const params: unknown[] = []
    if (options?.category) {
      params.push(options.category)
      sql += ` AND category = $${params.length}`
    }
    if (options?.featured !== undefined) {
      params.push(options.featured)
      sql += ` AND is_featured = $${params.length}`
    }
    sql += ` ORDER BY published_at DESC`
    if (options?.limit) {
      params.push(options.limit)
      sql += ` LIMIT $${params.length}`
    }
    const res = await query<News>(sql, params)
    return res.rows
  } catch (err) {
    console.error('Error fetching news:', err)
    return []
  }
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    return await queryOne<News>(
      `SELECT * FROM news WHERE slug = $1 AND is_active = true LIMIT 1`,
      [slug]
    )
  } catch (err) {
    console.error('Error fetching news:', err)
    return null
  }
}

export async function getEvents(
  options?: { limit?: number; upcoming?: boolean }
): Promise<Event[]> {
  try {
    let sql = `SELECT * FROM events WHERE is_active = true`
    const params: unknown[] = []
    if (options?.upcoming !== undefined) {
      params.push(options.upcoming)
      sql += ` AND is_upcoming = $${params.length}`
    }
    sql += ` ORDER BY event_date ASC`
    if (options?.limit) {
      params.push(options.limit)
      sql += ` LIMIT $${params.length}`
    }
    const res = await query<Event>(sql, params)
    return res.rows
  } catch (err) {
    console.error('Error fetching events:', err)
    return []
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    return await queryOne<Event>(
      `SELECT * FROM events WHERE slug = $1 AND is_active = true LIMIT 1`,
      [slug]
    )
  } catch (err) {
    console.error('Error fetching event:', err)
    return null
  }
}

export async function getGallery(
  options?: { category?: string; limit?: number }
): Promise<GalleryItem[]> {
  try {
    let sql = `SELECT * FROM gallery WHERE is_active = true`
    const params: unknown[] = []
    if (options?.category) {
      params.push(options.category)
      sql += ` AND category = $${params.length}`
    }
    sql += ` ORDER BY sort_order ASC`
    if (options?.limit) {
      params.push(options.limit)
      sql += ` LIMIT $${params.length}`
    }
    const res = await query<GalleryItem>(sql, params)
    return res.rows
  } catch (err) {
    console.error('Error fetching gallery:', err)
    return []
  }
}

export async function getRecruiters(
  options?: { featured?: boolean }
): Promise<Recruiter[]> {
  try {
    let sql = `SELECT * FROM recruiters WHERE is_active = true`
    const params: unknown[] = []
    if (options?.featured !== undefined) {
      params.push(options.featured)
      sql += ` AND is_featured = $${params.length}`
    }
    sql += ` ORDER BY sort_order ASC`
    const res = await query<Recruiter>(sql, params)
    return res.rows
  } catch (err) {
    console.error('Error fetching recruiters:', err)
    return []
  }
}

export async function getTestimonials(
  options?: { featured?: boolean }
): Promise<Testimonial[]> {
  try {
    let sql = `SELECT * FROM testimonials WHERE is_active = true`
    const params: unknown[] = []
    if (options?.featured !== undefined) {
      params.push(options.featured)
      sql += ` AND is_featured = $${params.length}`
    }
    sql += ` ORDER BY sort_order ASC`
    const res = await query<Testimonial>(sql, params)
    return res.rows
  } catch (err) {
    console.error('Error fetching testimonials:', err)
    return []
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const res = await query<Achievement>(
      `SELECT * FROM achievements WHERE is_active = true ORDER BY sort_order ASC`
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching achievements:', err)
    return []
  }
}

export async function getMilestones(): Promise<Milestone[]> {
  try {
    const res = await query<Milestone>(
      `SELECT * FROM milestones WHERE is_active = true ORDER BY year ASC`
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching milestones:', err)
    return []
  }
}

export async function getAccreditations(): Promise<Accreditation[]> {
  try {
    const res = await query<Accreditation>(
      `SELECT * FROM accreditations WHERE is_active = true ORDER BY sort_order ASC`
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching accreditations:', err)
    return []
  }
}

export async function getLeadership(): Promise<Leadership[]> {
  try {
    const res = await query<Leadership>(
      `SELECT * FROM leadership WHERE is_active = true ORDER BY sort_order ASC`
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching leadership:', err)
    return []
  }
}

export async function getStudentByCredentials(
  registerNumber: string,
  dateOfBirth: string
): Promise<(Student & { course_name?: string; department_name?: string }) | null> {
  try {
    return await queryOne(
      `SELECT s.*, c.name AS course_name, d.name AS department_name
       FROM students s
       LEFT JOIN courses c ON c.id = s.course_id
       LEFT JOIN departments d ON d.id = s.department_id
       WHERE s.register_number = $1
         AND s.date_of_birth = $2::date
         AND s.is_active = true
       LIMIT 1`,
      [registerNumber, dateOfBirth]
    )
  } catch {
    return null
  }
}

export async function getStudentResults(studentId: string): Promise<Result[]> {
  try {
    const res = await query<Result>(
      `SELECT * FROM results
       WHERE student_id = $1 AND is_active = true
       ORDER BY semester ASC`,
      [studentId]
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching results:', err)
    return []
  }
}

export async function getStudentResultSummaries(
  studentId: string
): Promise<ResultSummary[]> {
  try {
    const res = await query<ResultSummary>(
      `SELECT * FROM result_summaries
       WHERE student_id = $1 AND is_active = true
       ORDER BY semester ASC`,
      [studentId]
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching result summaries:', err)
    return []
  }
}
