const { Client } = require('pg')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL')
  process.exit(1)
}

async function run() {
  const pg = new Client({ connectionString: DATABASE_URL })
  try {
    await pg.connect()
    const res = await pg.query('SELECT * FROM results_pdfs;')
    console.log('Results PDFs in database:', res.rows)

    const res2 = await pg.query('SELECT * FROM news WHERE category = \'examination\';')
    console.log('News announcements:', res2.rows)
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await pg.end()
  }
}

run()
