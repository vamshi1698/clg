import { notFound } from 'next/navigation'
import { getTableConfig } from '@/lib/cms/tables'
import { fetchRows, resolveReferenceOptions } from '@/lib/cms/fetch'
import { CmsForm } from '@/components/cms/form'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { slug: string; id: string }
}

export async function generateMetadata({ params }: PageProps) {
  const config = getTableConfig(params.slug)
  return { title: config ? `${params.id === 'new' ? `New ${config.singular}` : `Edit ${config.singular}`}` : 'Not Found' }
}

export default async function CmsEditPage({ params }: PageProps) {
  const config = getTableConfig(params.slug)
  if (!config || config.singleton) notFound()

  const isNew = params.id === 'new'
  let initial: Record<string, unknown> | undefined
  let rowId: string | undefined

  if (!isNew) {
    const row = await fetchRows(config, params.id) as any
    if (!row) notFound()
    initial = row
    rowId = params.id
  }

  const references = await resolveReferenceOptions(config)

  return (
    <CmsForm
      config={config}
      references={references}
      initial={initial}
      rowId={rowId}
    />
  )
}
