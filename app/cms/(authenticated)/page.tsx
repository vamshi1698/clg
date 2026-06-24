import Link from 'next/link'
import { postgresClient } from '@/lib/postgres/client'
import { TABLE_CONFIGS } from '@/lib/cms/tables'
import { CmsDashboard } from '@/components/cms/dashboard'

export const metadata = { title: 'Dashboard' }

export const dynamic = 'force-dynamic'

export default async function CmsDashboardPage() {
  const [countsRes, messagesRes] = await Promise.all([
    Promise.all(
      TABLE_CONFIGS.filter((t) => !t.singleton).map(async (t) => {
        const { data } = await postgresClient
          .from(t.table)
          .select('id')
        const count = data ? (data as any[]).length : 0
        return { slug: t.slug, label: t.label, icon: t.icon, count }
      })
    ),
    postgresClient
      .from('contact_messages')
      .select('id, name, email, subject, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const recentMessages = (messagesRes.data as any[]) ?? []
  const unread = recentMessages.filter((m) => m.status === 'unread').length

  return (
    <CmsDashboard
      counts={countsRes}
      messages={recentMessages}
      unreadCount={unread}
    />
  )
}

