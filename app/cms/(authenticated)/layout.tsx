import { redirect } from 'next/navigation'
import { getSession } from '@/lib/cms/auth'
import { CmsShell } from '@/components/cms/shell'

export const metadata = {
  title: { default: 'CMS', template: '%s · CMS' },
  robots: { index: false, follow: false },
}

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/cms/login')
  return <CmsShell session={session}>{children}</CmsShell>
}
