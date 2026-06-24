#!/usr/bin/env node
/**
 * Generate and apply schema to local Postgres based on types/database.ts
 *
 * Usage:
 *   node scripts/create_schema.js
 */

const { Client } = require('pg')
require('dotenv').config()

const LOCAL_DB_URL = process.env.DATABASE_URL
if (!LOCAL_DB_URL) {
  console.error('Missing DATABASE_URL in .env')
  process.exit(1)
}

const pg = new Client({ connectionString: LOCAL_DB_URL })

// Schema definitions based on types/database.ts
const createTableStatements = [
  `CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website_url VARCHAR(255),
    logo_url VARCHAR(255),
    hero_image_url VARCHAR(255),
    hero_video_url VARCHAR(255),
    principal_message TEXT,
    principal_name VARCHAR(255),
    principal_image_url VARCHAR(255),
    principal_qualifications TEXT[],
    principal_achievements TEXT[],
    established_year INTEGER,
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    instagram_url VARCHAR(255),
    youtube_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS statistics (
    id SERIAL PRIMARY KEY,
    years_of_excellence INTEGER NOT NULL,
    students_count INTEGER NOT NULL,
    faculty_count INTEGER NOT NULL,
    departments_count INTEGER NOT NULL,
    placement_percentage NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    short_name VARCHAR(100),
    icon VARCHAR(255),
    description TEXT,
    overview TEXT,
    facilities TEXT[],
    labs TEXT[],
    research_areas TEXT[],
    hod_name VARCHAR(255),
    hod_message TEXT,
    hod_image_url VARCHAR(255),
    hod_qualifications TEXT[],
    established_year INTEGER,
    vision TEXT,
    mission TEXT,
    achievements TEXT[],
    image_url VARCHAR(255),
    gallery_urls TEXT[],
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY,
    department_id UUID REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    duration_years INTEGER,
    eligibility TEXT,
    eligibility_details TEXT,
    seats INTEGER,
    overview TEXT,
    curriculum_url VARCHAR(255),
    career_opportunities TEXT[],
    features TEXT[],
    image_url VARCHAR(255),
    annual_fee NUMERIC(12,2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY,
    department_id UUID REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    qualifications TEXT[],
    specialization VARCHAR(255),
    specializations TEXT[],
    experience_years INTEGER,
    email VARCHAR(255),
    phone VARCHAR(20),
    image_url VARCHAR(255),
    bio TEXT,
    achievements TEXT[],
    publications_count INTEGER NOT NULL DEFAULT 0,
    research_interests TEXT[],
    is_hod BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY,
    faculty_id UUID REFERENCES faculty(id),
    title VARCHAR(255) NOT NULL,
    authors TEXT[],
    journal VARCHAR(255),
    year INTEGER,
    volume VARCHAR(50),
    pages VARCHAR(50),
    doi VARCHAR(100),
    url VARCHAR(255),
    publication_type VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    author VARCHAR(255),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    category VARCHAR(255) NOT NULL,
    venue VARCHAR(255),
    event_date DATE NOT NULL,
    event_time TIME,
    end_date DATE,
    end_time TIME,
    image_url VARCHAR(255),
    gallery_urls TEXT[],
    is_upcoming BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    registration_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    is_video BOOLEAN NOT NULL DEFAULT false,
    video_url VARCHAR(255),
    event_id UUID,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS recruiters (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    industry VARCHAR(255),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    company VARCHAR(255),
    batch_year INTEGER,
    image_url VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    year INTEGER,
    department_id UUID REFERENCES departments(id),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY,
    year INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS accreditations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    issuing_body VARCHAR(255) NOT NULL,
    grade VARCHAR(50),
    valid_from DATE,
    valid_until DATE,
    certificate_url VARCHAR(255),
    logo_url VARCHAR(255),
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS leadership (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    image_url VARCHAR(255),
    bio TEXT,
    email VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY,
    register_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    course_id UUID REFERENCES courses(id),
    department_id UUID REFERENCES departments(id),
    academic_year VARCHAR(50),
    semester INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id),
    semester INTEGER NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    examination_type VARCHAR(100) NOT NULL,
    subject_code VARCHAR(50) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    internal_marks NUMERIC(5,2),
    external_marks NUMERIC(5,2),
    total_marks NUMERIC(5,2),
    max_marks NUMERIC(5,2),
    grade VARCHAR(5),
    credits NUMERIC(5,2),
    result_status VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS result_summaries (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id),
    semester INTEGER NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    examination_type VARCHAR(100) NOT NULL,
    sgpa NUMERIC(5,2),
    cgpa NUMERIC(5,2),
    total_credits NUMERIC(5,2),
    earned_credits NUMERIC(5,2),
    result_status VARCHAR(50),
    published_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'unread',
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`
]

async function createSchema() {
  try {
    await pg.connect()
    console.log('Creating tables in local Postgres...\n')

    for (const stmt of createTableStatements) {
      const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1]
      try {
        await pg.query(stmt)
        console.log(`✓ Created table: ${tableName}`)
      } catch (e) {
        console.error(`✗ Failed to create ${tableName}:`, e.message)
      }
    }

    console.log('\n✓ Schema creation complete')
    console.log('\nNext: Migrate data from Supabase')
    console.log('  node scripts/export_supabase_to_local.js')

  } catch (e) {
    console.error('Error:', e.message)
    process.exit(1)
  } finally {
    await pg.end()
  }
}

createSchema()
