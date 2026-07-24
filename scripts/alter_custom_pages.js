const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`
      ALTER TABLE custom_pages
      ADD COLUMN IF NOT EXISTS featured_image VARCHAR(255),
      ADD COLUMN IF NOT EXISTS excerpt TEXT,
      ADD COLUMN IF NOT EXISTS meta_description VARCHAR(255);
    `);

    console.log('custom_pages table altered successfully.');
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error altering custom_pages table:', e);
  } finally {
    client.release();
    pool.end();
  }
}

main();
