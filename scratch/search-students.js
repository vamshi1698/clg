const { Client } = require('pg');
require('dotenv').config();

async function search() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query('SELECT id, name, register_number, date_of_birth FROM students WHERE date_of_birth = $1', ['2003-03-22']);
    console.log('Students with DOB 2003-03-22:', res.rows);

    const res2 = await client.query('SELECT id, name, register_number, date_of_birth FROM students WHERE date_of_birth = $1', ['2003-03-21']);
    console.log('Students with DOB 2003-03-21:', res2.rows);

    const res3 = await client.query('SELECT id, name, register_number, date_of_birth FROM students WHERE register_number = $1', ['NCJ23BCA051']);
    console.log('Student NCJ23BCA051:', res3.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

search();
