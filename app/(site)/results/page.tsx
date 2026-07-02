import type { Metadata } from 'next'
import { ResultsPage as ResultsComponent } from '@/components/results/results-page'

import { getActiveResultsPdfs } from '@/lib/actions/public-actions'

export const metadata: Metadata = {
  title: 'Exam Results | National College Jayanagar',
  description: 'View and download semester exam results for National College Jayanagar students. Access UG and PG result PDFs and result summaries for all academic years.',
  keywords: ['National College results', 'exam results Jayanagar', 'semester results National College', 'UG results Bangalore', 'PG results National College', 'result PDF download'],
  alternates: { canonical: '/results' },
  openGraph: {
    title: 'Exam Results | National College Jayanagar',
    description: 'Access UG and PG semester exam result PDFs and summaries for all academic years at National College Jayanagar, Bangalore.',
    url: 'https://nationalcollege.edu.in/results',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'National College Exam Results' }],
  },
  robots: { index: false, follow: false },
}

export default async function ResultsPage() {
  const res = await getActiveResultsPdfs()
  const initialPdfs = res.data || []
  return <ResultsComponent initialPdfs={initialPdfs as any} />
}
