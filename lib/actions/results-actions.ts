'use server'

import { unlink } from 'fs/promises'
import path from 'path'
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
    const uploadDir = process.env.RESULTS_UPLOAD_DIR || 'c:/Users/vamsi/clg-uploads/results'
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

    revalidatePath('/results')
    return { ok: true }
  } catch (err: any) {
    console.error('Error deleting PDF:', err)
    return { error: err.message || 'Failed to delete results PDF.' }
  }
}

// Helper to create a news announcement when a result PDF is uploaded
export async function createResultNewsAnnouncement(pdfRecord: any) {
  const title = `Result Bulletin: ${pdfRecord.title}`
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const newsPayload = {
    title,
    slug,
    excerpt: `Official result PDF titled "${pdfRecord.title}" is now available.`,
    content: '', // can be extended later
    category: 'examination',
    is_featured: false,
    is_active: true,
    published_at: new Date().toISOString(),
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
