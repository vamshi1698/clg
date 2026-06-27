const { Client } = require('pg');
require('dotenv').config();

async function getLatestOtp() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query('SELECT * FROM otp_verifications ORDER BY created_at DESC LIMIT 1');
    console.log('LATEST_OTP:', res.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

getLatestOtp();
