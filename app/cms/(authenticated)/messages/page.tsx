import Link from 'next/link'
import { postgresClient } from '@/lib/postgres/client'
import { CmsMessageList } from '@/components/cms/messages'
import { getSession } from '@/lib/cms/auth'
import { canAccess } from '@/lib/cms/roles'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Messages' }

interface MessageRow {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  created_at: string
  status: string
}

export default async function MessagesPage() {
  const session = await getSession()
  if (!session || !canAccess(session.role, 'messages')) {
    notFound()
  }

  const { data } = await postgresClient
    .from('contact_messages')
    .select('id, name, email, phone, subject, message, created_at, status')
    .order('created_at', { ascending: false })

  const messages = ((data || []) as MessageRow[])
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

