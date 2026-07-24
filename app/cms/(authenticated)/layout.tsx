import { redirect } from 'next/navigation'
import { getSession } from '@/lib/cms/auth'
import { CmsShell } from '@/components/cms/shell'
import { postgresClient } from '@/lib/postgres/client'

export const metadata = {
  title: { default: 'CMS', template: '%s · CMS' },
  robots: { index: false, follow: false },
}

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/cms/login')

  const [messagesRes, enquiriesRes] = await Promise.all([
    postgresClient.from('contact_messages').select('id').eq('status', 'unread'),
    postgresClient.from('admission_enquiries').select('id').eq('status', 'pending')
  ])

  const counts = {
    messages: messagesRes.data?.length || 0,
    admissionEnquiries: enquiriesRes.data?.length || 0
  }

  return <CmsShell session={session} unreadCounts={counts}>{children}</CmsShell>
}
