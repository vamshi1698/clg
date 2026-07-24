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
      ALTER TABLE gallery_items
      ADD COLUMN IF NOT EXISTS additional_images TEXT[],
      ADD COLUMN IF NOT EXISTS additional_videos TEXT[];
    `);

    console.log('gallery_items table altered successfully. Added additional_images and additional_videos.');
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error altering gallery_items table:', e);
  } finally {
    client.release();
    pool.end();
  }
}

main();
