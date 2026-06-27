const { Client } = require('pg');
require('dotenv').config();

async function getStudents() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query('SELECT id, name, register_number, date_of_birth, is_active FROM students');
    console.log('STUDENTS:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

getStudents();
