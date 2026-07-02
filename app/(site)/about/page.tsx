import { getLeadership, getMilestones, getStatistics } from '@/lib/data/public'
import { AboutPage } from '@/components/about/about-page'

export default async function AboutRoute() {
  const [leadership, milestones, statistics] = await Promise.all([
    getLeadership(),
    getMilestones(),
    getStatistics()
  ])
  return <AboutPage leadership={leadership} milestones={milestones} statistics={statistics} />
}
