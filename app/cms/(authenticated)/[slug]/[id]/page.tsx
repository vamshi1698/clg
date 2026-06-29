import { notFound } from 'next/navigation'
import { getTableConfig } from '@/lib/cms/tables'
import { fetchRows, resolveReferenceOptions } from '@/lib/cms/fetch'
import { CmsForm } from '@/components/cms/form'
import { postgresClient } from '@/lib/postgres/client'

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

    if (slug === 'results') {
      const { data: allRows } = await postgresClient
        .from('results')
        .select('*')
        .eq('student_id', row.student_id)
        .eq('semester', row.semester)
        .order('subject_code', { ascending: true })

      initial = {
        student_id: row.student_id,
        semester: row.semester,
        academic_year: row.academic_year,
        examination_type: row.examination_type,
        subjects: (allRows || []).map((r: any) => ({
          subject_code: r.subject_code,
          subject_name: r.subject_name,
          internal_marks: r.internal_marks !== null && r.internal_marks !== undefined ? String(r.internal_marks) : '',
          external_marks: r.external_marks !== null && r.external_marks !== undefined ? String(r.external_marks) : '',
          max_marks: String(r.max_marks ?? 100),
          credits: String(r.credits ?? 3),
          grade: r.grade || '',
          result_status: r.result_status || '',
          is_active: !!r.is_active,
        }))
      }
    } else {
      initial = row
    }
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
