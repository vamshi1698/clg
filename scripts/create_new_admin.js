const { Client } = require('pg')
const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env')
  process.exit(1)
}

const email = 'vamshia332@gmail.com'
const password = 'Vamsi@1698'
const name = 'Vamsi'
const role = 'super_admin'

async function hashPassword(passwd) {
  return crypto.createHash('sha256').update(passwd).digest('hex')
}

async function run() {
  const hash = await hashPassword(password)
  const id = crypto.randomUUID()

  console.log(`Email: ${email}`)
  console.log(`Password Hash (SHA-256): ${hash}`)

  // 1. Insert into local Postgres
  console.log('Inserting into local Postgres...')
  const pg = new Client({ connectionString: DATABASE_URL })
  try {
    await pg.connect()
    const query = `
      INSERT INTO admin_users (id, email, password_hash, role, name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET password_hash = $3, name = $5, role = $4, updated_at = NOW()
      RETURNING *;
    `
    const res = await pg.query(query, [id, email, hash, role, name])
    console.log('Success in local Postgres:', res.rows[0])
  } catch (err) {
    console.error('Failed to insert into local Postgres:', err.message)
  } finally {
    await pg.end()
  }

  // 2. Insert into Supabase (if credentials exist)
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    console.log('Inserting into Supabase...')
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      const { data, error } = await supabase
        .from('admin_users')
        .upsert({
          id,
          email,
          password_hash: hash,
          role,
          name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' })
        .select()

      if (error) {
        throw error
      }
      console.log('Success in Supabase:', data)
    } catch (err) {
      console.error('Failed to insert into Supabase:', err.message)
    }
  } else {
    console.log('Skipping Supabase insertion due to missing credentials.')
  }
}

run()
