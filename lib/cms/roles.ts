export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['site', 'content', 'academics', 'examination', 'monitor'],
  content_admin: ['site', 'content', 'academics'],
  exam_admin: ['academics', 'examination'],
}

// Maps table/page slugs in the CMS to permission sections
export const SLUG_SECTIONS: Record<string, string> = {
  'settings': 'site',
  'statistics': 'site',
  'messages': 'site',
  'admission-enquiries': 'site',
  
  'departments': 'academics',
  'courses': 'academics',
  'faculty': 'academics',
  'leadership': 'academics',
  
  'news': 'content',
  'events': 'content',
  'gallery': 'content',
  'testimonials': 'content',
  'achievements': 'content',
  'recruiters': 'content',
  'milestones': 'content',
  'accreditations': 'content',
  'faqs': 'content',
  'alumni-stats': 'content',
  'alumni-ways': 'content',
  
  'students': 'examination',
  'results': 'examination',
  'result-summaries': 'examination',
  'results-upload': 'examination',
  
  'activity-logs': 'monitor',
}

export const TABLE_SLUGS: Record<string, string> = {
  'site_settings': 'settings',
  'statistics': 'statistics',
  'contact_messages': 'messages',
  'admission_enquiries': 'admission-enquiries',
  
  'departments': 'departments',
  'courses': 'courses',
  'faculty': 'faculty',
  'leadership': 'leadership',
  
  'news': 'news',
  'events': 'events',
  'gallery_items': 'gallery',
  'testimonials': 'testimonials',
  'achievements': 'achievements',
  'recruiters': 'recruiters',
  'milestones': 'milestones',
  'accreditations': 'accreditations',
  'faqs': 'faqs',
  'alumni_stats': 'alumni-stats',
  'alumni_ways': 'alumni-ways',
  
  'students': 'students',
  'results': 'results',
  'result_summaries': 'result-summaries',
  'results_pdfs': 'results-upload',
  
  'activity_logs': 'activity-logs',
}

export function canAccess(role: string, slug: string): boolean {
  const userRole = role || 'guest'
  const allowedSections = ROLE_PERMISSIONS[userRole] || []
  const section = SLUG_SECTIONS[slug]
  
  if (!section) return false
  return allowedSections.includes(section)
}

export function canAccessTable(role: string, table: string): boolean {
  const slug = TABLE_SLUGS[table]
  if (!slug) return false
  return canAccess(role, slug)
}
