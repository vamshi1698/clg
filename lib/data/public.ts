import { postgresClient } from '../postgres/client'
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

// Get site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await postgresClient
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
  return data
}

// Get statistics
export async function getStatistics(): Promise<Statistics | null> {
  const { data, error } = await postgresClient
    .from('statistics')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    console.error('Error fetching statistics:', error)
    return null
  }
  return data
}

// Get all departments
export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await postgresClient
    .from('departments')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching departments:', error)
    return []
  }
  return data || []
}

// Get single department by code
export async function getDepartmentByCode(code: string): Promise<Department | null> {
  const { data, error } = await postgresClient
    .from('departments')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching department:', error)
    return null
  }
  return data
}

// Get all courses with department info
export async function getCourses(options?: { level?: string; departmentId?: string }): Promise<Course[]> {
  let query = postgresClient
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (options?.level) {
    query = query.eq('level', options.level)
  }
  if (options?.departmentId) {
    query = query.eq('department_id', options.departmentId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }
  return data || []
}

// Get course by code
export async function getCourseByCode(code: string): Promise<Course | null> {
  const { data, error } = await postgresClient
    .from('courses')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }
  return data
}

// Get faculty with optional filters
export async function getFaculty(options?: { departmentId?: string }): Promise<Faculty[]> {
  let query = postgresClient
    .from('faculty')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (options?.departmentId) {
    query = query.eq('department_id', options.departmentId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching faculty:', error)
    return []
  }
  return data || []
}

// Get news with optional filters
export async function getNews(options?: { limit?: number; category?: string; featured?: boolean }): Promise<News[]> {
  let query = postgresClient
    .from('news')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.featured !== undefined) {
    query = query.eq('is_featured', options.featured)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }
  return data || []
}

// Get news by slug
export async function getNewsBySlug(slug: string): Promise<News | null> {
  const { data, error } = await postgresClient
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching news:', error)
    return null
  }
  return data
}

// Get events with optional filters
export async function getEvents(options?: { limit?: number; upcoming?: boolean }): Promise<Event[]> {
  let query = postgresClient
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: true })

  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.upcoming !== undefined) {
    query = query.eq('is_upcoming', options.upcoming)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  return data || []
}

// Get event by slug
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const { data, error } = await postgresClient
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return null
  }
  return data
}

// Get gallery items
export async function getGallery(options?: { category?: string; limit?: number }): Promise<GalleryItem[]> {
  let query = postgresClient
    .from('gallery_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching gallery:', error)
    return []
  }
  return data || []
}

// Get recruiters
export async function getRecruiters(options?: { featured?: boolean }): Promise<Recruiter[]> {
  let query = postgresClient
    .from('recruiters')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (options?.featured !== undefined) {
    query = query.eq('is_featured', options.featured)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching recruiters:', error)
    return []
  }
  return data || []
}

// Get testimonials
export async function getTestimonials(options?: { featured?: boolean }): Promise<Testimonial[]> {
  let query = postgresClient
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (options?.featured !== undefined) {
    query = query.eq('is_featured', options.featured)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
  return data || []
}

// Get achievements
export async function getAchievements(): Promise<Achievement[]> {
  const { data, error } = await postgresClient
    .from('achievements')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching achievements:', error)
    return []
  }
  return data || []
}

// Get milestones
export async function getMilestones(): Promise<Milestone[]> {
  const { data, error } = await postgresClient
    .from('milestones')
    .select('*')
    .eq('is_active', true)
    .order('year', { ascending: true })

  if (error) {
    console.error('Error fetching milestones:', error)
    return []
  }
  return data || []
}

// Get accreditations
export async function getAccreditations(): Promise<Accreditation[]> {
  const { data, error } = await postgresClient
    .from('accreditations')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching accreditations:', error)
    return []
  }
  return data || []
}

// Get leadership
export async function getLeadership(): Promise<Leadership[]> {
  const { data, error } = await postgresClient
    .from('leadership')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching leadership:', error)
    return []
  }
  return data || []
}

// Get student by register number and DOB (for results lookup)
export async function getStudentByCredentials(
  registerNumber: string,
  dateOfBirth: string
): Promise<Student | null> {
  const { data, error } = await postgresClient
    .from('students')
    .select('*')
    .eq('register_number', registerNumber)
    .eq('date_of_birth', dateOfBirth)
    .eq('is_active', true)
    .single()

  if (error) {
    return null
  }
  return data
}

// Get results for a student
export async function getStudentResults(studentId: string): Promise<Result[]> {
  const { data, error } = await postgresClient
    .from('results')
    .select('*')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .order('semester', { ascending: true })

  if (error) {
    console.error('Error fetching results:', error)
    return []
  }
  return data || []
}

// Get result summaries for a student
export async function getStudentResultSummaries(studentId: string): Promise<ResultSummary[]> {
  const { data, error } = await postgresClient
    .from('result_summaries')
    .select('*')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .order('semester', { ascending: true })

  if (error) {
    console.error('Error fetching result summaries:', error)
    return []
  }
  return data || []
}
