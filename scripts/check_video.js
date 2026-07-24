require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("SELECT video_url FROM gallery_items WHERE id = '824f411e-fba3-4de9-b910-13ac556996f9'")
  .then(res => { console.log(res.rows); pool.end(); })
  .catch(err => console.log(err));
