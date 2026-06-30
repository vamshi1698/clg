const { Client } = require('pg');
require('dotenv').config();

async function listTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('Tables:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

listTables();
