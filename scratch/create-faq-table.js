const { Client } = require('pg');
require('dotenv').config();

async function createFaqTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    // 1. Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id UUID PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "faqs" created successfully.');

    // 2. Insert initial FAQs from admissions-page.tsx
    const initialFaqs = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        question: 'What is the minimum eligibility for UG programs?',
        answer: 'Candidates must have passed their 10+2 (PUC) from a recognized board with at least 45% aggregate marks. SC/ST candidates have a 5% relaxation.',
        sort_order: 10
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        question: 'Is there an entrance exam?',
        answer: 'Most UG programs offer merit-based admissions. However, specific PG programs like MBA and MCA may require entrance examinations as specified in their prospectus.',
        sort_order: 20
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        question: 'Are there scholarships available?',
        answer: 'Yes. We offer Government Post-Matric Scholarships, Merit-based fee waivers, sports scholarships, and several privately funded scholarships. Visit the Financial Aid office for details.',
        sort_order: 30
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        question: 'Can I apply for hostel accommodation along with admission?',
        answer: 'Yes, hostel applications are processed alongside admission. Seats are limited and allotted on a first-come-first-served basis.',
        sort_order: 40
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        question: 'What is the refund policy if I withdraw?',
        answer: 'Fees are refundable as per the Bangalore University norms. A nominal administrative charge may be deducted. Contact the accounts office for details.',
        sort_order: 50
      }
    ];

    for (const faq of initialFaqs) {
      await client.query(`
        INSERT INTO faqs (id, question, answer, sort_order, is_active)
        VALUES ($1, $2, $3, $4, true)
        ON CONFLICT (id) DO NOTHING;
      `, [faq.id, faq.question, faq.answer, faq.sort_order]);
    }
    console.log('Initial FAQs inserted.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

createFaqTable();
