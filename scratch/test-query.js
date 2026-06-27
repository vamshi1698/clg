const { Client } = require('pg');
require('dotenv').config();

async function testQuery() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    // Let's test with NCJ23BCA051
    // The date_of_birth in database when printed as Date is: 2003-10-03T18:30:00.000Z
    // What happens if we query by '2003-10-04'?
    const res1 = await client.query(
      'SELECT id, name, register_number, date_of_birth FROM students WHERE register_number = $1 AND date_of_birth = $2',
      ['NCJ23BCA051', '2003-10-04']
    );
    console.log('Query with 2003-10-04 result:', res1.rows);

    const res2 = await client.query(
      'SELECT id, name, register_number, date_of_birth FROM students WHERE register_number = $1 AND date_of_birth = $2',
      ['NCJ23BCA051', '2003-10-03']
    );
    console.log('Query with 2003-10-03 result:', res2.rows);

    // Let's print the actual date_of_birth type and raw value from pg without date parsing if possible
    const resRaw = await client.query('SELECT date_of_birth::text FROM students WHERE register_number = $1', ['NCJ23BCA051']);
    console.log('Raw text value in DB:', resRaw.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

testQuery();
