import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
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

    // Read upload directory from environment variables
    const uploadDir = process.env.RESULTS_UPLOAD_DIR
    if (!uploadDir) {
      return NextResponse.json({ error: 'RESULTS_UPLOAD_DIR is not configured in environment variables' }, { status: 500 })
    }

    // Ensure the external upload folder exists
    await mkdir(uploadDir, { recursive: true })

    // Generate unique file name to avoid overwrite issues
    const fileId = crypto.randomUUID()
    const extension = path.extname(file.name) || '.pdf'
    const pdfFilename = `${fileId}${extension}`
    const filePath = path.join(uploadDir, pdfFilename)

    // Convert file buffer to write it to disk
    const bytes = await file.arrayBuffer()
    // Convert ArrayBuffer to Uint8Array, which satisfies writeFile's expected type
    const buffer = new Uint8Array(bytes)
    await writeFile(filePath, buffer)

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
