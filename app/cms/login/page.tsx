import { CmsLoginPage } from '@/components/cms/login-page'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return <CmsLoginPage from={from ?? '/cms'} />
}