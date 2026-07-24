const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing if any (to avoid duplicates if run multiple times)
    await client.query('DELETE FROM navigation_links');

    const topLevelLinks = [
      { name: 'Admissions', href: '/admissions', sort_order: 10 },
      { name: 'Academics', href: '/academics', sort_order: 20 },
      { name: 'Research', href: '/research', sort_order: 30 },
      { name: 'Campus Life', href: '/campus-life', sort_order: 40 },
      { name: 'About', href: '/about', sort_order: 50 },
    ];

    const insertedParents = {};
    for (const link of topLevelLinks) {
      const res = await client.query(
        'INSERT INTO navigation_links (name, href, sort_order) VALUES ($1, $2, $3) RETURNING id, name',
        [link.name, link.href, link.sort_order]
      );
      insertedParents[link.name] = res.rows[0].id;
    }

    const subLinks = [
      { name: 'Departments', href: '/departments', parent: 'Academics', sort_order: 10 },
      { name: 'Undergraduate Programs', href: '/academics/undergraduate', parent: 'Academics', sort_order: 20 },
      { name: 'Graduate Programs', href: '/academics/graduate', parent: 'Academics', sort_order: 30 },
    ];

    for (const link of subLinks) {
      await client.query(
        'INSERT INTO navigation_links (name, href, parent_id, sort_order) VALUES ($1, $2, $3, $4)',
        [link.name, link.href, insertedParents[link.parent], link.sort_order]
      );
    }

    console.log('Successfully seeded navigation links.');
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error seeding navigation links:', e);
  } finally {
    client.release();
    pool.end();
  }
}

main();
