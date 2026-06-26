// Database types for National College Jayanagar

export interface AdminUser {
  id: string
  email: string
  password_hash: string
  role: 'super_admin' | 'content_admin' | 'exam_admin'
  name: string
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: number
  college_name: string
  tagline: string | null
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  website_url: string | null
  logo_url: string | null
  hero_image_url: string | null
  hero_video_url: string | null
  principal_message: string | null
  principal_name: string | null
  principal_image_url: string | null
  principal_qualifications: string[] | null
  principal_achievements: string[] | null
  established_year: number
  facebook_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  instagram_url: string | null
  youtube_url: string | null
  created_at: string
  updated_at: string
}

export interface Statistics {
  id: number
  years_of_excellence: number
  students_count: number
  faculty_count: number
  departments_count: number
  placement_percentage: number
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  code: string
  short_name: string | null
  icon: string | null
  description: string | null
  overview: string | null
  facilities: string[] | null
  labs: string[] | null
  research_areas: string[] | null
  hod_name: string | null
  hod_message: string | null
  hod_image_url: string | null
  hod_qualifications: string[] | null
  established_year: number | null
  vision: string | null
  mission: string | null
  achievements: string[] | null
  image_url: string | null
  gallery_urls: string[] | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  department_id: string | null
  name: string
  code: string
  level: 'ug' | 'pg' | 'phd' | 'diploma' | 'certificate'
  duration: string
  duration_years: number | null
  eligibility: string | null
  eligibility_details: string | null
  seats: number | null
  overview: string | null
  curriculum_url: string | null
  career_opportunities: string[] | null
  features: string[] | null
  core_subjects: string[] | null
  image_url: string | null
  annual_fee: number | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  department?: Department
}

export interface Faculty {
  id: string
  department_id: string | null
  name: string
  designation: string
  qualification: string | null
  qualifications: string[] | null
  specialization: string | null
  specializations: string[] | null
  experience_years: number | null
  email: string | null
  phone: string | null
  image_url: string | null
  bio: string | null
  achievements: string[] | null
  publications_count: number
  research_interests: string[] | null
  is_hod: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  department?: Department
}

export interface Publication {
  id: string
  faculty_id: string | null
  title: string
  authors: string[] | null
  journal: string | null
  year: number | null
  volume: string | null
  pages: string | null
  doi: string | null
  url: string | null
  publication_type: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface News {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category: 'academic' | 'examination' | 'admission' | 'placement' | 'events' | 'general'
  image_url: string | null
  author: string | null
  is_featured: boolean
  published_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  category: string
  venue: string | null
  event_date: string
  event_time: string | null
  end_date: string | null
  end_time: string | null
  image_url: string | null
  gallery_urls: string[] | null
  is_upcoming: boolean
  is_featured: boolean
  registration_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  category: string
  image_url: string
  thumbnail_url: string | null
  is_video: boolean
  video_url: string | null
  event_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Recruiter {
  id: string
  name: string
  logo_url: string | null
  website_url: string | null
  industry: string | null
  is_featured: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  designation: string | null
  company: string | null
  batch_year: number | null
  image_url: string | null
  content: string
  rating: number | null
  is_featured: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  title: string
  description: string | null
  category: string
  icon: string | null
  year: number | null
  department_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: string
  year: number
  title: string
  description: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Accreditation {
  id: string
  name: string
  issuing_body: string
  grade: string | null
  valid_from: string | null
  valid_until: string | null
  certificate_url: string | null
  logo_url: string | null
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Leadership {
  id: string
  name: string
  designation: string
  qualification: string | null
  image_url: string | null
  bio: string | null
  email: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  register_number: string
  name: string
  date_of_birth: string
  course_id: string | null
  department_id: string | null
  academic_year: string | null
  semester: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Result {
  id: string
  student_id: string
  semester: number
  academic_year: string
  examination_type: string
  subject_code: string
  subject_name: string
  internal_marks: number | null
  external_marks: number | null
  total_marks: number | null
  max_marks: number | null
  grade: string | null
  credits: number | null
  result_status: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ResultSummary {
  id: string
  student_id: string
  semester: number
  academic_year: string
  examination_type: string
  sgpa: number | null
  cgpa: number | null
  total_credits: number | null
  earned_credits: number | null
  result_status: string | null
  published_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: 'unread' | 'read' | 'replied'
  replied_at: string | null
  created_at: string
  updated_at: string
}

export interface ResultsPdf {
  id: string
  title: string
  academic_year: string
  semester: number
  pdf_filename: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ImportantDate {
  id: string
  event: string
  date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

