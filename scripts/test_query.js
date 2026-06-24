const { postgresClient } = require('../lib/postgres/client')
require('dotenv').config()

async function run() {
  const id = '42ab2f7a-3dc4-499f-8a05-be4dd46f6549'
  try {
    const { data, error } = await postgresClient
      .from('results_pdfs')
      .select('*')
      .eq('id', id)
      .single()

    console.log('Query result:', { data, error })
  } catch (err) {
    console.error('Crash error:', err.message)
  }
}

run()
