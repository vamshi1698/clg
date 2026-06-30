const { Client } = require('pg');
require('dotenv').config();

async function testDelete() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query("DELETE FROM departments WHERE id = 'c95bc982-99e8-499e-85ee-fcd567847586'");
    console.log('Result:', res.rowCount);
  } catch (err) {
    console.error('Delete error message:', err.message);
  } finally {
    await client.end();
  }
}

testDelete();
