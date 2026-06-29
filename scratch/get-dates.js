const { Client } = require('pg');
require('dotenv').config();

async function getDates() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query('SELECT * FROM important_dates;');
    console.log('Important Dates in DB:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

getDates();
