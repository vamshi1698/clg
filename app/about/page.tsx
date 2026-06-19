import { Metadata } from 'next'
import { getSiteSettings, getMilestones, getAccreditations, getLeadership } from '@/lib/data/public'
import { AboutPage } from '@/components/about/about-page'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about National College Jayanagar\'s history, vision, mission, leadership, and achievements over 60 years of excellence in education.',
}

export default async function About() {
  const [settings, milestones, accreditations, leadership] = await Promise.all([
    getSiteSettings(),
    getMilestones(),
    getAccreditations(),
    getLeadership(),
  ])

  return <AboutPage settings={settings} milestones={milestones} accreditations={accreditations} leadership={leadership} />
}
