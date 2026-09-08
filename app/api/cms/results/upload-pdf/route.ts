import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'
import { getSession } from '@/lib/cms/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // Authentication guard — require valid CMS admin session
    const session = await getSession()
    const { canAccess } = await import('@/lib/cms/roles')
    if (!session || !canAccess(session.role, 'results-upload')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const academicYear = formData.get('academic_year') as string | null
    const semesterStr = formData.get('semester') as string | null

    if (!file || !title || !academicYear || !semesterStr) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const semester = parseInt(semesterStr, 10)
    if (isNaN(semester)) {
      return NextResponse.json({ error: 'Invalid semester value' }, { status: 400 })
    }

    // Generate unique file name to avoid overwrite issues
    const fileId = crypto.randomUUID()
    const extension = path.extname(file.name) || '.pdf'
    const pdfFilename = `${fileId}${extension}`

    // Convert file buffer
    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    // Upload to Supabase Storage (if configured)
    const { uploadToStorage } = await import('@/lib/storage/supabase-storage')
    await uploadToStorage('results-pdfs', pdfFilename, buffer, 'application/pdf').catch((err) => {
      console.warn('Supabase storage PDF upload warning (falling back to disk):', err)
    })

    // Also write to local disk/tmp cache
    let uploadDir = process.env.RESULTS_UPLOAD_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads', 'results')
    try {
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, pdfFilename), buffer)
    } catch (e) {
      try {
        const os = await import('os')
        uploadDir = path.join(os.tmpdir(), 'results')
        await mkdir(uploadDir, { recursive: true }).catch(() => {})
        await writeFile(path.join(uploadDir, pdfFilename), buffer)
      } catch (diskErr) {
        // Disk write failed on serverless (safe to ignore if Supabase storage succeeded)
      }
    }

    // Insert record in Postgres database
    const payload = {
      id: fileId,
      title,
      academic_year: academicYear,
      semester,
      pdf_filename: pdfFilename,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error } = await postgresClient.insert('results_pdfs', payload)
    if (error) {
      return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 })
    }
    try {
      const { logCmsActivity } = await import('@/lib/cms/actions')
      await logCmsActivity('UPLOAD_PDF', 'results_pdfs', `Uploaded results PDF "${title}" for Semester ${semester} (${academicYear})`)
    } catch (logErr) {
      console.error('Audit logging error:', logErr)
    }
    // Create news announcement for the newly uploaded result PDF
    try {
      const { createResultNewsAnnouncement } = await import('@/lib/actions/results-actions')
      await createResultNewsAnnouncement(payload)
    } catch (newsErr) {
      console.error('News announcement error:', newsErr)
    }

    return NextResponse.json({ ok: true, id: fileId })
  } catch (error: any) {
    console.error('PDF Upload Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred during upload.' }, { status: 500 })
  }
}
