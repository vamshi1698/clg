import { Metadata } from 'next'
import { ResultsPage } from '@/components/results/results-page'

export const metadata: Metadata = {
  title: 'Results',
  description: 'Check your examination results - Enter your register number and date of birth to view semester marks.',
}

export default function Results() {
  return <ResultsPage />
}
