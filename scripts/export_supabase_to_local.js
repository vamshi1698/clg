/*
Simple migration script: copies rows from Supabase tables to a local Postgres DB.
Usage:
  Set env vars in a .env file or export in your shell:
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    DATABASE_URL (e.g. postgres://user:pass@localhost:5432/dbname)

  Run:
    node scripts/export_supabase_to_local.js

Notes:
- This script performs basic `SELECT *` from Supabase public tables and
  inserts into local Postgres with `ON CONFLICT DO NOTHING` on `id`.
- Update `tables` array to match your schema if needed.
*/

const { createClient } = require('@supabase/supabase-js')
const { Client } = require('pg')
require('dotenv').config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const DATABASE_URL = process.env.DATABASE_URL

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}
if (!DATABASE_URL) {
  console.error('Missing local DATABASE_URL. Set DATABASE_URL to your local Postgres')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const pg = new Client({ connectionString: DATABASE_URL })

// List of tables to copy. Edit as needed to match your Supabase schema.
const tables = [
  'admin_users',
  'site_settings',
  'statistics',
  'departments',
  'courses',
  'faculty',
  'publications',
  'news',
  'events',
  'gallery_items',
  'recruiters',
  'testimonials',
  'achievements',
  'milestones',
  'accreditations',
  'leadership',
  'students',
  'results',
  'result_summaries',
  'contact_messages'
]

async function migrateTable(table) {
  console.log(`Fetching rows from Supabase table: ${table}`)
  const { data, error } = await supabase.from(table).select('*')
  if (error) {
    console.error(`Supabase error for ${table}:`, error.message)
    return
  }
  if (!data || data.length === 0) {
    console.log(`No rows in ${table}`)
    return
  }

  // Build insert queries dynamically
  for (const row of data) {
    const columns = Object.keys(row)
    const values = columns.map((c) => row[c])
    const paramPlaceholders = columns.map((_, i) => `$${i + 1}`).join(', ')
    const columnList = columns.map((c) => `"${c}"`).join(', ')

    // On conflict, do nothing (requires PK or unique constraint on id)
    const text = `INSERT INTO "${table}" (${columnList}) VALUES (${paramPlaceholders}) ON CONFLICT DO NOTHING`
    try {
      await pg.query(text, values)
    } catch (e) {
      console.error(`Failed to insert into ${table}:`, e.message)
    }
  }
  console.log(`Finished migrating ${table} (${data.length} rows)`)
}

async function main() {
  try {
    await pg.connect()
    for (const t of tables) {
      await migrateTable(t)
    }
    console.log('Migration complete')
  } catch (e) {
    console.error('Migration failed:', e.message)
  } finally {
    await pg.end()
  }
}

main()
