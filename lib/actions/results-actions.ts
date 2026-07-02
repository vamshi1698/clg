'use server'

import { unlink } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'
import { revalidatePath } from 'next/cache'

export async function getResultsPdfs() {
  try {
    const { data, error } = await postgresClient
      .from('results_pdfs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }
    return { data: data || [] }
  } catch (err: any) {
    console.error('Error fetching results PDFs:', err)
    return { error: err.message || 'Failed to fetch results PDFs.' }
  }
}

export async function deleteResultsPdf(id: string) {
  try {
    const { getSession } = await import('@/lib/cms/auth')
    const { canAccessTable } = await import('@/lib/cms/roles')
    const session = await getSession()
    if (!session || !canAccessTable(session.role, 'results_pdfs')) {
      return { error: 'Unauthorized' }
    }

    // 1. Get filename from DB
    const { data: record, error: fetchErr } = await postgresClient
      .from('results_pdfs')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchErr || !record) {
      throw new Error('PDF record not found')
    }

    const filename = (record as any).pdf_filename
    const uploadDir = process.env.RESULTS_UPLOAD_DIR
    if (!uploadDir) {
      throw new Error('RESULTS_UPLOAD_DIR is not configured in environment variables')
    }
    const filePath = path.join(uploadDir, filename)

    // 2. Delete file from file system
    try {
      await unlink(filePath)
    } catch (fsErr: any) {
      console.warn('File deletion warning (could be already missing):', fsErr.message)
    }

    // 3. Delete from DB
    const { error: deleteErr } = await postgresClient.delete('results_pdfs', id)
    if (deleteErr) {
      throw deleteErr
    }

    try {
      const { logCmsActivity } = await import('@/lib/cms/actions')
      await logCmsActivity('DELETE_PDF', 'results_pdfs', `Deleted results PDF ID: ${id} (Title: ${record.title})`)
    } catch (logErr) {
      console.error('Audit logging error:', logErr)
    }

    revalidatePath('/results')
    return { ok: true }
  } catch (err: any) {
    console.error('Error deleting PDF:', err)
    return { error: err.message || 'Failed to delete results PDF.' }
  }
}

// Helper to create a news announcement when a result PDF is uploaded
export async function createResultNewsAnnouncement(pdfRecord: any) {
  const title = `Result Announcement: ${pdfRecord.title}`
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const newsPayload = {
    title,
    slug,
    id: crypto.randomUUID(),
    excerpt: `Official result PDF titled "${pdfRecord.title}" is now available.`,
    content: '', // can be extended later
    attachment_url: `/api/results/pdf/${pdfRecord.id}`,
    category: 'examination',
    is_featured: false,
    is_active: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: null,
  }
  const { error } = await postgresClient.insert('news', newsPayload)
  if (error) {
    console.error('Failed to create news announcement for result PDF:', error)
  }
  // Revalidate paths so news appears immediately
  revalidatePath('/news')
  revalidatePath('/')
}

export async function createExcelResultNewsAnnouncement({ academicYear, semester, examType }: { academicYear: string, semester: number, examType: string }) {
  const title = `Results Declared: Semester ${semester} ${examType} (${academicYear})`
  const slug = `results-declared-sem-${semester}-${academicYear.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
  const newsPayload = {
    title,
    slug,
    id: crypto.randomUUID(),
    excerpt: `Detailed marks and grades for Semester ${semester} ${examType} (${academicYear}) have been published and are now available for viewing.`,
    content: '',
    category: 'examination',
    is_featured: true,
    is_active: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: null,
  }
  const { error } = await postgresClient.insert('news', newsPayload)
  if (error) {
    console.error('Failed to create news announcement for excel results:', error)
  }
  revalidatePath('/news')
  revalidatePath('/')
  revalidatePath('/results')
}

export async function getImportedExcelDatasets() {
  try {
    const { data, error } = await postgresClient.query(`
      SELECT DISTINCT academic_year, semester, examination_type
      FROM results
      ORDER BY academic_year DESC, semester DESC
    `)
    if (error) {
      throw error
    }
    return { data: data || [] }
  } catch (err: any) {
    console.error('Error fetching imported datasets:', err)
    return { error: err.message || 'Failed to fetch imported datasets.' }
  }
}

export async function deleteImportedExcelDataset(academicYear: string, semester: number, examType: string) {
  try {
    const { getSession } = await import('@/lib/cms/auth')
    const { canAccessTable } = await import('@/lib/cms/roles')
    const session = await getSession()
    if (!session || !canAccessTable(session.role, 'results')) {
      return { error: 'Unauthorized' }
    }

    // 1. Delete results
    await postgresClient.query(
      'DELETE FROM results WHERE academic_year = $1 AND semester = $2 AND examination_type = $3',
      [academicYear, semester, examType]
    )

    // 2. Delete result summaries
    await postgresClient.query(
      'DELETE FROM result_summaries WHERE academic_year = $1 AND semester = $2 AND examination_type = $3',
      [academicYear, semester, examType]
    )

    // 3. Delete matching news announcements
    const title = `Results Declared: Semester ${semester} ${examType} (${academicYear})`
    await postgresClient.query(
      'DELETE FROM news WHERE title = $1',
      [title]
    )

    try {
      const { logCmsActivity } = await import('@/lib/cms/actions')
      await logCmsActivity('DELETE_EXCEL_DATASET', 'results', `Deleted Excel dataset for Sem ${semester} ${examType} (${academicYear})`)
    } catch (logErr) {
      console.error('Audit logging error:', logErr)
    }

    revalidatePath('/results')
    revalidatePath('/news')
    revalidatePath('/')
    return { ok: true }
  } catch (err: any) {
    console.error('Error deleting excel dataset:', err)
    return { error: err.message || 'Failed to delete results dataset.' }
  }
}

export async function checkUploadAccess() {
  const { getSession } = await import('@/lib/cms/auth')
  const { canAccess } = await import('@/lib/cms/roles')
  const session = await getSession()
  if (!session || !canAccess(session.role, 'results-upload')) {
    return { allowed: false }
  }
  return { allowed: true }
}
