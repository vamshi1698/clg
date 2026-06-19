import { CmsMessageList } from '@/components/cms/messages'
import { query } from '@/lib/db/pool'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Messages' }

interface MessageRow {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  created_at: string
  status: string
}

export default async function MessagesPage() {
  let messages: MessageRow[] = []
  try {
    const res = await query(
      `SELECT id, name, email, phone, subject, created_at, status
       FROM contact_messages
       ORDER BY created_at DESC`
    )
    messages = res.rows as MessageRow[]
  } catch (err) {
    console.error('Error fetching messages:', err)
  }

  const unread = messages.filter((m) => m.status === 'unread').length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-academic-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">
          {messages.length} total · {unread} unread
        </p>
      </div>
      <CmsMessageList messages={messages} />
    </div>
  )
}
