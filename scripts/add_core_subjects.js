const { Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set in environment.');
  process.exit(1);
}

async function run() {
  const pg = new Client({ connectionString: DATABASE_URL });
  await pg.connect();
  try {
    console.log('Running ALTER TABLE command on courses...');
    await pg.query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS core_subjects TEXT[];');
    console.log('✓ Successfully altered courses table to add core_subjects.');
  } catch (err) {
    console.error('Failed to alter table:', err.message);
  } finally {
    await pg.end();
  }
}

run();
