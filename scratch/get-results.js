const { Client } = require('pg');
require('dotenv').config();

async function getResults() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const student1 = '71a43c95-75f5-4347-b55f-e48e057f86eb'; // NCJ23BCA051
    const student2 = '2f1066af-cbfa-4b8f-92d1-a8a9001ce80a'; // NCJ23BCA091

    const r1 = await client.query('SELECT * FROM results WHERE student_id = $1', [student1]);
    console.log('Results for NCJ23BCA051:', r1.rows);

    const s1 = await client.query('SELECT * FROM result_summaries WHERE student_id = $1', [student1]);
    console.log('Summaries for NCJ23BCA051:', s1.rows);

    const r2 = await client.query('SELECT * FROM results WHERE student_id = $1', [student2]);
    console.log('Results for NCJ23BCA091:', r2.rows);

    const s2 = await client.query('SELECT * FROM result_summaries WHERE student_id = $1', [student2]);
    console.log('Summaries for NCJ23BCA091:', s2.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

getResults();
