import { notFound } from 'next/navigation'
import { getTableConfig } from '@/lib/cms/tables'
import { fetchRows, resolveReferenceOptions } from '@/lib/cms/fetch'
import { CmsForm } from '@/components/cms/form'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { slug: string; id: string }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, id } = await params

  const config = getTableConfig(slug)
  return { title: config ? `${id === 'new' ? `New ${config.singular}` : `Edit ${config.singular}`}` : 'Not Found' }
}

export default async function CmsEditPage({ params }: PageProps) {
  const { slug, id } = await params

  const config = getTableConfig(slug)
  if (!config || config.singleton) notFound()

  const isNew = id === 'new'
  let initial: Record<string, unknown> | undefined
  let rowId: string | undefined

  if (!isNew) {
    const row = await fetchRows(config, id)
    if (!row) notFound()
    initial = row
    rowId = id
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
