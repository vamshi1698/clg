export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'select'
  | 'date'
  | 'datetime'
  | 'url'
  | 'array'
  | 'image'

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: { label: string; value: string }[]
  placeholder?: string
  help?: string
  full?: boolean
  serverOnly?: boolean
}

export interface TableConfig {
  table: string
  slug: string
  label: string
  singular: string
  icon: string
  titleField: string
  subtitleField?: string
  listFields: string[]
  fields: FieldConfig[]
  sortable?: boolean
  select?: string
  orderColumn?: string
  singleton?: boolean
}

const activeField: FieldConfig = {
  name: 'is_active',
  label: 'Active',
  type: 'boolean',
  full: false,
}

const sortOrderField: FieldConfig = {
  name: 'sort_order',
  label: 'Sort Order',
  type: 'number',
  full: false,
  help: 'Lower numbers appear first',
}

export const TABLE_CONFIGS: TableConfig[] = [
  {
    table: 'site_settings',
    slug: 'settings',
    label: 'Site Settings',
    singular: 'Site Settings',
    icon: 'Settings',
    titleField: 'college_name',
    listFields: ['college_name', 'email', 'established_year'],
    fields: [
      { name: 'college_name', label: 'College Name', type: 'text', required: true, full: true },
      { name: 'tagline', label: 'Tagline', type: 'text', full: true },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'address', label: 'Address', type: 'textarea', full: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'website_url', label: 'Website URL', type: 'url', full: true },
      { name: 'logo_url', label: 'Logo URL', type: 'image', full: true },
      { name: 'hero_image_url', label: 'Hero Image URL', type: 'image', full: true },
      { name: 'hero_video_url', label: 'Hero Video URL', type: 'url', full: true },
      { name: 'established_year', label: 'Established Year', type: 'number' },
      { name: 'principal_name', label: 'Principal Name', type: 'text' },
      { name: 'principal_message', label: 'Principal Message', type: 'textarea', full: true },
      { name: 'principal_image_url', label: 'Principal Image URL', type: 'image', full: true },
      { name: 'facebook_url', label: 'Facebook URL', type: 'url' },
      { name: 'twitter_url', label: 'Twitter URL', type: 'url' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
      { name: 'instagram_url', label: 'Instagram URL', type: 'url' },
      { name: 'youtube_url', label: 'YouTube URL', type: 'url' },
    ],
    singleton: true,
  },
  {
    table: 'statistics',
    slug: 'statistics',
    label: 'Statistics',
    singular: 'Statistics',
    icon: 'BarChart3',
    titleField: 'id',
    listFields: ['years_of_excellence', 'students_count', 'faculty_count', 'placement_percentage'],
    fields: [
      { name: 'years_of_excellence', label: 'Years of Excellence', type: 'number', required: true },
      { name: 'students_count', label: 'Students Count', type: 'number', required: true },
      { name: 'faculty_count', label: 'Faculty Count', type: 'number', required: true },
      { name: 'departments_count', label: 'Departments Count', type: 'number', required: true },
      { name: 'placement_percentage', label: 'Placement %', type: 'number', required: true },
    ],
    singleton: true,
  },
  {
    table: 'departments',
    slug: 'departments',
    label: 'Departments',
    singular: 'Department',
    icon: 'Building2',
    titleField: 'name',
    subtitleField: 'code',
    listFields: ['name', 'code', 'established_year', 'sort_order', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, full: true },
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'short_name', label: 'Short Name', type: 'text' },
      { name: 'icon', label: 'Icon (lucide name)', type: 'text', help: 'e.g. Monitor, Cpu, Wrench' },
      { name: 'established_year', label: 'Established Year', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'overview', label: 'Overview', type: 'textarea', full: true },
      { name: 'vision', label: 'Vision', type: 'textarea', full: true },
      { name: 'mission', label: 'Mission', type: 'textarea', full: true },
      { name: 'hod_name', label: 'HOD Name', type: 'text' },
      { name: 'hod_message', label: 'HOD Message', type: 'textarea', full: true },
      { name: 'hod_image_url', label: 'HOD Image URL', type: 'image', full: true },
      { name: 'facilities', label: 'Facilities', type: 'array', full: true, help: 'One per line' },
      { name: 'research_areas', label: 'Research Areas', type: 'array', full: true, help: 'One per line' },
      { name: 'image_url', label: 'Image URL', type: 'image', full: true },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'courses',
    slug: 'courses',
    label: 'Courses',
    singular: 'Course',
    icon: 'BookOpen',
    titleField: 'name',
    subtitleField: 'code',
    listFields: ['name', 'code', 'level', 'duration', 'seats', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*, departments(*)',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, full: true },
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'department_id', label: 'Department', type: 'select', full: true, options: [] },
      {
        name: 'level',
        label: 'Level',
        type: 'select',
        required: true,
        options: [
          { label: 'UG', value: 'ug' },
          { label: 'PG', value: 'pg' },
          { label: 'PhD', value: 'phd' },
          { label: 'Diploma', value: 'diploma' },
          { label: 'Certificate', value: 'certificate' },
        ],
      },
      { name: 'duration', label: 'Duration', type: 'text', required: true },
      { name: 'duration_years', label: 'Duration (years)', type: 'number' },
      { name: 'seats', label: 'Seats / Intake', type: 'number' },
      { name: 'annual_fee', label: 'Annual Fee (INR)', type: 'number' },
      { name: 'eligibility', label: 'Eligibility', type: 'text', full: true },
      { name: 'eligibility_details', label: 'Eligibility Details', type: 'textarea', full: true },
      { name: 'overview', label: 'Overview', type: 'textarea', full: true },
      { name: 'curriculum_url', label: 'Curriculum URL', type: 'url', full: true },
      { name: 'image_url', label: 'Image URL', type: 'image', full: true },
      { name: 'career_opportunities', label: 'Career Opportunities', type: 'array', full: true, help: 'One per line' },
      { name: 'features', label: 'Features', type: 'array', full: true, help: 'One per line' },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'faculty',
    slug: 'faculty',
    label: 'Faculty',
    singular: 'Faculty Member',
    icon: 'Users',
    titleField: 'name',
    subtitleField: 'designation',
    listFields: ['name', 'designation', 'specialization', 'is_hod', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*, departments(*)',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, full: true },
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'department_id', label: 'Department', type: 'select', full: true, options: [] },
      { name: 'qualification', label: 'Qualification', type: 'text', full: true },
      { name: 'specialization', label: 'Specialization', type: 'text', full: true },
      { name: 'experience_years', label: 'Experience (years)', type: 'number' },
      { name: 'email', label: 'Email', type: 'text', full: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'image_url', label: 'Image URL', type: 'image', full: true },
      { name: 'bio', label: 'Bio', type: 'textarea', full: true },
      { name: 'publications_count', label: 'Publications Count', type: 'number' },
      { name: 'research_interests', label: 'Research Interests', type: 'array', full: true, help: 'One per line' },
      { name: 'qualifications', label: 'Qualifications (list)', type: 'array', full: true, help: 'One per line' },
      { name: 'achievements', label: 'Achievements', type: 'array', full: true, help: 'One per line' },
      { name: 'is_hod', label: 'Is HOD', type: 'boolean' },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'news',
    slug: 'news',
    label: 'News',
    singular: 'News Article',
    icon: 'Newspaper',
    titleField: 'title',
    subtitleField: 'category',
    listFields: ['title', 'category', 'published_at', 'is_featured', 'is_active'],
    orderColumn: 'published_at',
    sortable: true,
    select: '*',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, full: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, help: 'URL-friendly identifier' },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          { label: 'Academic', value: 'academic' },
          { label: 'Examination', value: 'examination' },
          { label: 'Admission', value: 'admission' },
          { label: 'Placement', value: 'placement' },
          { label: 'Events', value: 'events' },
          { label: 'General', value: 'general' },
        ],
      },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', full: true },
      { name: 'content', label: 'Content', type: 'textarea', full: true, help: 'HTML allowed' },
      { name: 'image_url', label: 'Image URL', type: 'image', full: true },
      { name: 'published_at', label: 'Published At', type: 'datetime', full: true },
      { name: 'is_featured', label: 'Featured', type: 'boolean' },
      activeField,
    ],
  },
  {
    table: 'events',
    slug: 'events',
    label: 'Events',
    singular: 'Event',
    icon: 'CalendarCheck',
    titleField: 'title',
    subtitleField: 'event_date',
    listFields: ['title', 'category', 'event_date', 'is_upcoming', 'is_active'],
    orderColumn: 'event_date',
    sortable: true,
    select: '*',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, full: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'venue', label: 'Venue', type: 'text', full: true },
      { name: 'event_date', label: 'Event Date', type: 'date', required: true },
      { name: 'event_time', label: 'Event Time', type: 'text', help: 'e.g. 10:00 AM' },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'end_time', label: 'End Time', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'content', label: 'Content', type: 'textarea', full: true, help: 'HTML allowed' },
      { name: 'image_url', label: 'Image URL', type: 'image', full: true },
      { name: 'registration_url', label: 'Registration URL', type: 'url', full: true },
      { name: 'is_upcoming', label: 'Upcoming', type: 'boolean' },
      { name: 'is_featured', label: 'Featured', type: 'boolean' },
      activeField,
    ],
  },
  {
    table: 'gallery',
    slug: 'gallery',
    label: 'Gallery',
    singular: 'Gallery Item',
    icon: 'Image',
    titleField: 'title',
    subtitleField: 'category',
    listFields: ['title', 'category', 'is_video', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, full: true },
      { name: 'category', label: 'Category', type: 'text', required: true, help: 'e.g. Campus, Events, Sports' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'image_url', label: 'Image URL', type: 'image', required: true, full: true },
      { name: 'thumbnail_url', label: 'Thumbnail URL', type: 'image', full: true },
      { name: 'is_video', label: 'Is Video', type: 'boolean' },
      { name: 'video_url', label: 'Video URL', type: 'url', full: true, help: 'YouTube/Vimeo embed URL' },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'testimonials',
    slug: 'testimonials',
    label: 'Testimonials',
    singular: 'Testimonial',
    icon: 'Quote',
    titleField: 'name',
    subtitleField: 'company',
    listFields: ['name', 'designation', 'company', 'batch_year', 'is_featured', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, full: true },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'batch_year', label: 'Batch Year', type: 'number' },
      { name: 'image_url', label: 'Image URL', type: 'image', full: true },
      { name: 'content', label: 'Content', type: 'textarea', required: true, full: true },
      { name: 'rating', label: 'Rating (1-5)', type: 'number' },
      { name: 'is_featured', label: 'Featured', type: 'boolean' },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'achievements',
    slug: 'achievements',
    label: 'Achievements',
    singular: 'Achievement',
    icon: 'Award',
    titleField: 'title',
    subtitleField: 'category',
    listFields: ['title', 'category', 'year', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, full: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'icon', label: 'Icon (lucide name)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'recruiters',
    slug: 'recruiters',
    label: 'Recruiters',
    singular: 'Recruiter',
    icon: 'Briefcase',
    titleField: 'name',
    subtitleField: 'industry',
    listFields: ['name', 'industry', 'is_featured', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, full: true },
      { name: 'industry', label: 'Industry', type: 'text' },
      { name: 'website_url', label: 'Website URL', type: 'url', full: true },
      { name: 'logo_url', label: 'Logo URL', type: 'image', full: true },
      { name: 'is_featured', label: 'Featured', type: 'boolean' },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'accreditations',
    slug: 'accreditations',
    label: 'Accreditations',
    singular: 'Accreditation',
    icon: 'Medal',
    titleField: 'name',
    subtitleField: 'issuing_body',
    listFields: ['name', 'issuing_body', 'grade', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, full: true },
      { name: 'issuing_body', label: 'Issuing Body', type: 'text', required: true, full: true },
      { name: 'grade', label: 'Grade', type: 'text' },
      { name: 'valid_from', label: 'Valid From', type: 'date' },
      { name: 'valid_until', label: 'Valid Until', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'certificate_url', label: 'Certificate URL', type: 'url', full: true },
      { name: 'logo_url', label: 'Logo URL', type: 'image', full: true },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'leadership',
    slug: 'leadership',
    label: 'Leadership',
    singular: 'Leadership Member',
    icon: 'UserCog',
    titleField: 'name',
    subtitleField: 'designation',
    listFields: ['name', 'designation', 'is_active'],
    orderColumn: 'sort_order',
    sortable: true,
    select: '*',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, full: true },
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'qualification', label: 'Qualification', type: 'text', full: true },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'image_url', label: 'Image URL', type: 'image', full: true },
      { name: 'bio', label: 'Bio', type: 'textarea', full: true },
      sortOrderField,
      activeField,
    ],
  },
  {
    table: 'students',
    slug: 'students',
    label: 'Students',
    singular: 'Student',
    icon: 'GraduationCap',
    titleField: 'name',
    subtitleField: 'register_number',
    listFields: ['name', 'register_number', 'academic_year', 'semester', 'is_active'],
    orderColumn: 'register_number',
    sortable: true,
    select: '*, courses(name), departments(name)',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, full: true },
      { name: 'register_number', label: 'Register Number', type: 'text', required: true },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
      { name: 'department_id', label: 'Department', type: 'select', full: true, options: [] },
      { name: 'course_id', label: 'Course', type: 'select', full: true, options: [] },
      { name: 'academic_year', label: 'Academic Year', type: 'text', help: 'e.g. 2024-2025' },
      { name: 'semester', label: 'Semester', type: 'number' },
      activeField,
    ],
  },
  {
    table: 'results',
    slug: 'results',
    label: 'Results',
    singular: 'Result Entry',
    icon: 'FileText',
    titleField: 'subject_name',
    subtitleField: 'subject_code',
    listFields: ['subject_code', 'subject_name', 'semester', 'grade', 'result_status', 'is_active'],
    orderColumn: 'semester',
    sortable: true,
    select: '*, students(name, register_number)',
    fields: [
      { name: 'student_id', label: 'Student', type: 'select', required: true, full: true, options: [] },
      { name: 'semester', label: 'Semester', type: 'number', required: true },
      { name: 'academic_year', label: 'Academic Year', type: 'text', required: true },
      { name: 'examination_type', label: 'Exam Type', type: 'text', required: true },
      { name: 'subject_code', label: 'Subject Code', type: 'text', required: true },
      { name: 'subject_name', label: 'Subject Name', type: 'text', required: true, full: true },
      { name: 'internal_marks', label: 'Internal Marks', type: 'number' },
      { name: 'external_marks', label: 'External Marks', type: 'number' },
      { name: 'total_marks', label: 'Total Marks', type: 'number' },
      { name: 'max_marks', label: 'Max Marks', type: 'number' },
      { name: 'grade', label: 'Grade', type: 'text' },
      { name: 'credits', label: 'Credits', type: 'number' },
      {
        name: 'result_status',
        label: 'Result Status',
        type: 'select',
        options: [
          { label: 'Pass', value: 'PASS' },
          { label: 'Fail', value: 'FAIL' },
          { label: 'Absent', value: 'ABSENT' },
          { label: 'Pending', value: 'PENDING' },
        ],
      },
      activeField,
    ],
  },
  {
    table: 'result_summaries',
    slug: 'result-summaries',
    label: 'Result Summaries',
    singular: 'Result Summary',
    icon: 'TrendingUp',
    titleField: 'semester',
    subtitleField: 'academic_year',
    listFields: ['semester', 'academic_year', 'sgpa', 'cgpa', 'result_status', 'is_active'],
    orderColumn: 'semester',
    sortable: true,
    select: '*, students(name, register_number)',
    fields: [
      { name: 'student_id', label: 'Student', type: 'select', required: true, full: true, options: [] },
      { name: 'semester', label: 'Semester', type: 'number', required: true },
      { name: 'academic_year', label: 'Academic Year', type: 'text', required: true },
      { name: 'examination_type', label: 'Exam Type', type: 'text', required: true },
      { name: 'sgpa', label: 'SGPA', type: 'number' },
      { name: 'cgpa', label: 'CGPA', type: 'number' },
      { name: 'total_credits', label: 'Total Credits', type: 'number' },
      { name: 'earned_credits', label: 'Earned Credits', type: 'number' },
      {
        name: 'result_status',
        label: 'Result Status',
        type: 'select',
        options: [
          { label: 'Pass', value: 'PASS' },
          { label: 'Fail', value: 'FAIL' },
          { label: 'Pending', value: 'PENDING' },
        ],
      },
      { name: 'published_at', label: 'Published At', type: 'datetime' },
      activeField,
    ],
  },
  {
    table: 'important_dates',
    slug: 'important-dates',
    label: 'Important Dates',
    singular: 'Important Date',
    icon: 'CalendarDays',
    titleField: 'event',
    listFields: ['event', 'date', 'is_active'],
    orderColumn: 'date',
    sortable: false,
    select: '*',
    fields: [
      { name: 'event', label: 'Event Name', type: 'text', required: true, full: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      activeField,
    ],
  },
]

export function getTableConfig(slug: string): TableConfig | undefined {
  return TABLE_CONFIGS.find((t) => t.slug === slug)
}

export function getReferenceOptions(config: TableConfig) {
  const relational: Record<string, { table: string; label: string; value: string }> = {}
  for (const f of config.fields) {
    if (f.type === 'select' && (!f.options || f.options.length === 0)) {
      if (f.name === 'department_id') {
        relational[f.name] = { table: 'departments', label: 'name', value: 'id' }
      } else if (f.name === 'course_id') {
        relational[f.name] = { table: 'courses', label: 'name', value: 'id' }
      } else if (f.name === 'student_id') {
        relational[f.name] = { table: 'students', label: 'name', value: 'id' }
      }
    }
  }
  return relational
}
