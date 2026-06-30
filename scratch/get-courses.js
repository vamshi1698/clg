const { Client } = require('pg');
require('dotenv').config();

async function getCourses() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query('SELECT id, name, code, level FROM courses ORDER BY sort_order');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

getCourses();
