const { Client } = require('pg')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env')
  process.exit(1)
}

async function run() {
  const pg = new Client({ connectionString: DATABASE_URL })
  try {
    await pg.connect()
    console.log('Connecting to local PostgreSQL...')

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS results_pdfs (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        academic_year VARCHAR(50) NOT NULL,
        semester INTEGER NOT NULL,
        pdf_filename VARCHAR(255) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `
    await pg.query(createTableQuery)
    console.log('✓ Successfully created or verified results_pdfs table.')
  } catch (err) {
    console.error('✗ Failed to create table:', err.message)
    process.exit(1)
  } finally {
    await pg.end()
  }
}

run()
