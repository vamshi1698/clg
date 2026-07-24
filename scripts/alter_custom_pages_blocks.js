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
      ADD COLUMN IF NOT EXISTS page_blocks JSONB DEFAULT '[]'::jsonb;
    `);

    console.log('custom_pages table altered successfully with page_blocks.');
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
