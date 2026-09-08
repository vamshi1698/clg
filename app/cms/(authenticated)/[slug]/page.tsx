import { notFound } from 'next/navigation'
import { getTableConfig, type TableConfig } from '@/lib/cms/tables'
import { fetchRows } from '@/lib/cms/fetch'
import { CmsListView } from '@/components/cms/list-view'
import { CmsForm } from '@/components/cms/form'
import { resolveReferenceOptions, fetchSingleton } from '@/lib/cms/fetch'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  const config = getTableConfig(slug)
  if (!config) return { title: 'Not Found' }
  return { title: config.label }
}

import { getSession } from '@/lib/cms/auth'
import { canAccess } from '@/lib/cms/roles'

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  const session = await getSession()
  if (!session || !canAccess(session.role, slug)) {
    notFound()
  }

  const config = getTableConfig(slug)
  if (!config) notFound()

  if (config.singleton) {
    return <SingletonPage config={config} />
  }

  return <ListPage config={config} />
}

async function ListPage({ config }: { config: TableConfig }) {
  if (config.slug === 'students' || config.slug === 'results') {
    const { fetchPaginatedRows, resolveReferenceOptions } = await import('@/lib/cms/fetch')
    const [paginated, references] = await Promise.all([
      fetchPaginatedRows(config, { page: 1, pageSize: 25 }),
      resolveReferenceOptions(config),
    ])
    return (
      <CmsListView
        config={config}
        rows={paginated.rows as any[]}
        initialTotal={paginated.total}
        initialPage={paginated.page}
        initialPageSize={paginated.pageSize}
        initialTotalPages={paginated.totalPages}
        serverReferences={references}
      />
    )
  }
  const rows = await fetchRows(config)
  return <CmsListView config={config} rows={rows as any[]} />
}

async function SingletonPage({ config }: { config: TableConfig }) {
  const existing = await fetchSingleton(config)
  const references = await resolveReferenceOptions(config)
  return (
    <CmsForm
      config={config}
      references={references}
      initial={existing || {}}
      singletonId={existing?.id ?? 1}
    />
  )
}
