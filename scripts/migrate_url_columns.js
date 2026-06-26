const { Client } = require('pg')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env')
  process.exit(1)
}

async function runMigration() {
  const pg = new Client({ connectionString: DATABASE_URL })
  try {
    await pg.connect()
    console.log('Successfully connected to local PostgreSQL database.')

    // Query to find all character varying columns matching URL/image patterns
    const query = `
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND data_type = 'character varying' 
        AND (
          column_name LIKE '%_url' 
          OR column_name = 'url' 
          OR column_name LIKE '%_uri' 
          OR column_name = 'website_url' 
          OR column_name = 'logo_url' 
          OR column_name = 'hero_image_url' 
          OR column_name = 'hero_video_url' 
          OR column_name = 'principal_image_url' 
          OR column_name = 'curriculum_url' 
          OR column_name = 'registration_url' 
          OR column_name = 'certificate_url' 
          OR column_name = 'hod_image_url' 
          OR column_name = 'image_url' 
          OR column_name = 'thumbnail_url' 
          OR column_name = 'video_url'
        );
    `

    const { rows } = await pg.query(query)
    console.log(`Found ${rows.length} columns to migrate from VARCHAR(255) to TEXT:\n`)

    for (const row of rows) {
      const table = row.table_name
      const column = row.column_name
      try {
        console.log(`Migrating column "${column}" in table "${table}"...`)
        const alterQuery = `ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE TEXT;`
        await pg.query(alterQuery)
        console.log(`✓ Column "${column}" in table "${table}" successfully changed to TYPE TEXT.\n`)
      } catch (err) {
        console.error(`✗ Failed to migrate column "${column}" in table "${table}":`, err.message)
      }
    }

    console.log('✓ Migration completed!')
  } catch (err) {
    console.error('✗ Migration process failed:', err.message)
    process.exit(1)
  } finally {
    await pg.end()
  }
}

runMigration()
