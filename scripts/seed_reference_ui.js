const { Client } = require('pg')
const crypto = require('crypto')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env file')
  process.exit(1)
}

const pg = new Client({ connectionString: DATABASE_URL })

const eventsToSeed = [
  {
    title: 'National Science Fest - "Anveshana"',
    slug: 'national-science-fest-anveshana',
    description: 'A grand congregation of young scientific minds demonstrating cutting-edge projects, interactive exhibits, and model displays. Features guest...',
    content: 'Anveshana is the premier annual science exhibition at National College. Featuring innovative projects from departments, interactive displays, and guest lectures from eminent scientists.',
    category: 'academic',
    venue: 'Main Auditorium',
    event_date: '2026-06-25',
    event_time: '10:00:00',
    end_date: '2026-06-26',
    end_time: '17:00:00',
    image_url: null,
    is_upcoming: true,
    is_featured: true,
    registration_url: '#',
    is_active: true
  },
  {
    title: 'NCJ Hackathon 2026',
    slug: 'ncj-hackathon-2026',
    description: '24-hour continuous hackathon bringing students from all departments together to build smart solutions for urban sustainability. Cash prizes an...',
    content: 'Join the annual college Hackathon. Build creative, smart solutions to solve urban problems, collaborate with peers, and win exciting cash rewards.',
    category: 'technical',
    venue: 'Computer Science Lab',
    event_date: '2026-07-02',
    event_time: '09:00:00',
    end_date: '2026-07-03',
    end_time: '09:00:00',
    image_url: null,
    is_upcoming: true,
    is_featured: true,
    registration_url: '#',
    is_active: true
  },
  {
    title: 'Sambhrama Cultural Fest',
    slug: 'sambhrama-cultural-fest',
    description: 'The annual cultural extravaganza celebrating classical music, modern choreography, theatre, fine arts, and collaborative street plays. An...',
    content: 'Celebrate college life at Sambhrama. Showcase your talent in dance, music, theater, and arts. A three-day festival packed with energy and creativity.',
    category: 'cultural',
    venue: 'College Play Ground',
    event_date: '2026-07-15',
    event_time: '16:00:00',
    end_date: '2026-07-17',
    end_time: '22:00:00',
    image_url: null,
    is_upcoming: true,
    is_featured: true,
    registration_url: '#',
    is_active: true
  }
]

const newsToSeed = [
  {
    title: 'BCA VI Semester Final Mock Exam Results - June 2026',
    slug: 'bca-vi-sem-mock-exam-results-june-2026',
    excerpt: 'Detailed results of the BCA VI Semester mock examination are now published.',
    content: 'The BCA VI Semester Final Mock Examinations conducted in June 2026 results are announced. Students can verify their internal scores and mock performance grading from their respective department offices or download the summary report.',
    category: 'examination',
    image_url: null,
    author: 'Exam Controller',
    is_featured: true,
    published_at: '2026-06-20T10:00:00.000Z',
    is_active: true
  },
  {
    title: 'Admissions open for BCA, BSc, and BCom for Academic Year 2026-27',
    slug: 'admissions-open-bca-bsc-bcom-2026-27',
    excerpt: 'Applications are invited for admissions to undergraduate courses starting in 2026.',
    content: 'National College is open for admissions to BCA, BSc, and BCom courses for the 2026-27 session. Candidates can submit their applications online through the college admission portal.',
    category: 'admission',
    image_url: null,
    author: 'Admission Cell',
    is_featured: true,
    published_at: '2026-06-18T10:00:00.000Z',
    is_active: true
  },
  {
    title: 'Orientation Day schedule for incoming PG candidates',
    slug: 'orientation-day-schedule-pg-candidates',
    excerpt: 'Schedule details for the welcoming orientation of incoming PG students.',
    content: 'All postgraduate candidates joining National College for the current academic session are required to attend the orientation session as per the published schedule.',
    category: 'general',
    image_url: null,
    author: 'Administration',
    is_featured: true,
    published_at: '2026-06-15T10:00:00.000Z',
    is_active: true
  }
]

async function seed() {
  try {
    await pg.connect()
    console.log('Connected to database.')

    // 1. Seed Events
    for (const ev of eventsToSeed) {
      console.log(`Seeding event: ${ev.title}`)
      await pg.query('DELETE FROM events WHERE slug = $1', [ev.slug])
      const id = crypto.randomUUID()
      const query = `
        INSERT INTO events (
          id, title, slug, description, content, category, venue, 
          event_date, event_time, end_date, end_time, image_url, 
          is_upcoming, is_featured, registration_url, is_active, 
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
        )
      `
      await pg.query(query, [
        id, ev.title, ev.slug, ev.description, ev.content, ev.category, ev.venue,
        ev.event_date, ev.event_time, ev.end_date, ev.end_time, ev.image_url,
        ev.is_upcoming, ev.is_featured, ev.registration_url, ev.is_active
      ])
    }

    // 2. Seed News/Notices
    for (const nw of newsToSeed) {
      console.log(`Seeding news: ${nw.title}`)
      await pg.query('DELETE FROM news WHERE slug = $1', [nw.slug])
      const id = crypto.randomUUID()
      const query = `
        INSERT INTO news (
          id, title, slug, excerpt, content, category, image_url,
          author, is_featured, published_at, is_active, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
        )
      `
      await pg.query(query, [
        id, nw.title, nw.slug, nw.excerpt, nw.content, nw.category, nw.image_url,
        nw.author, nw.is_featured, nw.published_at, nw.is_active
      ])
    }

    // 3. Seed Course (BCA)
    console.log('Seeding course: Bachelor of Computer Applications (BCA)')
    const deptResult = await pg.query("SELECT id FROM departments WHERE code = 'CS'")
    const csDeptId = deptResult.rows[0]?.id
    if (csDeptId) {
      await pg.query("DELETE FROM courses WHERE code = 'BCA'")
      const courseId = crypto.randomUUID()
      const courseQuery = `
        INSERT INTO courses (
          id, department_id, name, code, level, duration, duration_years,
          eligibility, eligibility_details, seats, overview, annual_fee,
          is_active, sort_order, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
        )
      `
      await pg.query(courseQuery, [
        courseId,
        csDeptId,
        'Bachelor of Computer Applications',
        'BCA',
        'ug',
        '3 Years (6 Semesters)',
        3,
        '10+2 / PUC with Mathematics/Computer Science or equivalent',
        'Candidates must have passed 10+2/PUC or equivalent examination with Mathematics or Computer Science as one of the subjects.',
        90,
        'Designed to bridge the gap between IT industry standards. Features state-of-the-art labs, industry-led foundation courses, and corporate mentorship.',
        50000,
        true,
        0
      ])
      console.log('BCA Course seeded.')
    } else {
      console.warn('CS Department not found, skipping BCA course seeding.')
    }

    console.log('Seeding reference UI data completed successfully.')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await pg.end()
  }
}

seed()
