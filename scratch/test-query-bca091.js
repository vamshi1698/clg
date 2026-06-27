const { Client } = require('pg');
require('dotenv').config();

async function test() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query(
      'SELECT id, name, register_number, date_of_birth FROM students WHERE register_number = $1 AND date_of_birth = $2',
      ['NCJ23BCA091', '2004-03-22']
    );
    console.log('Query for NCJ23BCA091 with 2004-03-22:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

test();
