#!/usr/bin/env node
/**
 * Extract table schema from Supabase information_schema and create tables in local Postgres
 * Uses only the Anon Key (no database password needed)
 *
 * Usage:
 *   node scripts/export_schema.js
 *
 * Requires:
 *   - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env
 *   - DATABASE_URL for local Postgres in .env
 */

const { createClient } = require('@supabase/supabase-js')
const { Client } = require('pg')
require('dotenv').config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const LOCAL_DB_URL = process.env.DATABASE_URL

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}
if (!LOCAL_DB_URL) {
  console.error('Missing DATABASE_URL in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const pg = new Client({ connectionString: LOCAL_DB_URL })

/**
 * Fetch table schema from Supabase information_schema
 * This queries the information_schema.columns table which is readable
 */
async function fetchTableSchema(tableName) {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable, column_default')
    .eq('table_schema', 'public')
    .eq('table_name', tableName)
    .order('ordinal_position')

  if (error) {
    console.warn(`⚠️  Could not fetch schema for ${tableName}:`, error.message)
    return null
  }
  return data
}

/**
 * Generate CREATE TABLE statement from column info
 */
function generateCreateTableSQL(tableName, columns) {
  if (!columns || columns.length === 0) {
    console.warn(`⚠️  No columns found for ${tableName}`)
    return null
  }

  const columnDefs = columns.map((col) => {
    let def = `"${col.column_name}" ${col.data_type}`
    if (col.column_default) {
      def += ` DEFAULT ${col.column_default}`
    }
    if (col.is_nullable === false) {
      def += ' NOT NULL'
    }
    return def
  })

  return `CREATE TABLE IF NOT EXISTS "${tableName}" (\n  ${columnDefs.join(',\n  ')}\n);`
}

async function createTablesLocally(tables) {
  await pg.connect()

  for (const tableName of tables) {
    console.log(`\nFetching schema for: ${tableName}`)
    const columns = await fetchTableSchema(tableName)

    if (!columns) continue

    const createSQL = generateCreateTableSQL(tableName, columns)
    if (!createSQL) continue

    console.log(`Creating table: ${tableName}`)
    try {
      await pg.query(createSQL)
      console.log(`✓ Created table: ${tableName}`)
    } catch (e) {
      console.error(`✗ Failed to create ${tableName}:`, e.message)
    }
  }

  await pg.end()
}

// List of tables from your schema
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

async function main() {
  try {
    console.log('Exporting schema from Supabase...\n')
    await createTablesLocally(tables)
    console.log('\n✓ Schema export complete')
    console.log('\nNext: Run data migration')
    console.log('  node scripts/export_supabase_to_local.js')
  } catch (e) {
    console.error('Error:', e.message)
    process.exit(1)
  }
}

main()
