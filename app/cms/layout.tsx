import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/cms/auth'
import { CmsShell } from '@/components/cms/shell'

export const metadata = {
  title: { default: 'CMS', template: '%s · CMS' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser()
  if (!session) redirect('/cms/login')
  return <CmsShell session={session}>{children}</CmsShell>
}
