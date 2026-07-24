const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function run() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    console.log('Altering results table...')
    await client.query(`
      ALTER TABLE results
      ADD COLUMN IF NOT EXISTS theory_max_marks INTEGER DEFAULT 60,
      ADD COLUMN IF NOT EXISTS theory_min_marks INTEGER DEFAULT 21,
      ADD COLUMN IF NOT EXISTS ia_max_marks INTEGER DEFAULT 40,
      ADD COLUMN IF NOT EXISTS ia_min_marks INTEGER DEFAULT 14,
      ADD COLUMN IF NOT EXISTS total_min_marks INTEGER DEFAULT 35,
      ADD COLUMN IF NOT EXISTS grade_points NUMERIC,
      ADD COLUMN IF NOT EXISTS credit_points NUMERIC;
    `)

    console.log('Altering result_summaries table...')
    await client.query(`
      ALTER TABLE result_summaries
      ADD COLUMN IF NOT EXISTS total_max_marks INTEGER,
      ADD COLUMN IF NOT EXISTS total_marks_obtained INTEGER,
      ADD COLUMN IF NOT EXISTS percentage NUMERIC,
      ADD COLUMN IF NOT EXISTS overall_result VARCHAR(255),
      ADD COLUMN IF NOT EXISTS class_obtained VARCHAR(255),
      ADD COLUMN IF NOT EXISTS programme_total_max_marks INTEGER,
      ADD COLUMN IF NOT EXISTS programme_total_marks_obtained INTEGER,
      ADD COLUMN IF NOT EXISTS programme_total_credits_obtained INTEGER,
      ADD COLUMN IF NOT EXISTS programme_cgpa NUMERIC,
      ADD COLUMN IF NOT EXISTS programme_grade VARCHAR(50),
      ADD COLUMN IF NOT EXISTS total_marks_words TEXT,
      ADD COLUMN IF NOT EXISTS programme_total_marks_words TEXT;
    `)

    await client.query('COMMIT')
    console.log('Migration successful!')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('Migration failed:', e)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
