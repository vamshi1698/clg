import Link from 'next/link'
import { adminClient } from '@/lib/cms/auth'
import { TABLE_CONFIGS } from '@/lib/cms/tables'
import { CmsDashboard } from '@/components/cms/dashboard'

export const metadata = { title: 'Dashboard' }

export const dynamic = 'force-dynamic'

export default async function CmsDashboardPage() {
  const supabase = adminClient()

  const [countsRes, messagesRes] = await Promise.all([
    Promise.all(
      TABLE_CONFIGS.filter((t) => !t.singleton).map(async (t) => {
        const { count } = await supabase
          .from(t.table)
          .select('*', { count: 'exact', head: true })
        return { slug: t.slug, label: t.label, icon: t.icon, count: count ?? 0 }
      })
    ),
    supabase
      .from('contact_messages')
      .select('id, name, email, subject, created_at, status', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const recentMessages = messagesRes.data ?? []
  const unread = recentMessages.filter((m) => m.status === 'unread').length

  return (
    <CmsDashboard
      counts={countsRes}
      messages={recentMessages}
      unreadCount={unread}
    />
  )
}
