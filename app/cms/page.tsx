import { getCurrentUser, adminClient } from '@/lib/cms/auth'
import { TABLE_CONFIGS } from '@/lib/cms/tables'
import { CmsDashboard } from '@/components/cms/dashboard'
import { query } from '@/lib/db/pool'

export const metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default async function CmsDashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    // Layout-level redirect handles this, but keep a safety net.
    return null
  }
  void adminClient // referenced for type-compat; queries below use the pool directly

  const [countResults, messagesRes] = await Promise.all([
    Promise.all(
      TABLE_CONFIGS.filter((t) => !t.singleton).map(async (t) => {
        try {
          const r = await query(`SELECT count(*)::int AS count FROM ${t.table}`)
          return { slug: t.slug, label: t.label, icon: t.icon, count: r.rows[0]?.count ?? 0 }
        } catch {
          return { slug: t.slug, label: t.label, icon: t.icon, count: 0 }
        }
      })
    ),
    query(
      `SELECT id, name, email, subject, created_at, status
       FROM contact_messages
       ORDER BY created_at DESC
       LIMIT 5`
    ),
  ])

  const recentMessages = messagesRes.rows as any[]
  const unread = recentMessages.filter((m: any) => m.status === 'unread').length

  return (
    <CmsDashboard
      counts={countResults}
      messages={recentMessages}
      unreadCount={unread}
    />
  )
}
