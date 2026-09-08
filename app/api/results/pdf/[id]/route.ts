import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { postgresClient } from '@/lib/postgres/client'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return new Response('Missing PDF ID', { status: 400 })
    }

    // Lookup in database to get the unique filename
    const { data, error } = await postgresClient
      .from('results_pdfs')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return new Response('PDF Record not found in database', { status: 404 })
    }

    const pdfRecord = data as any
    const os = await import('os')
    const candidateDirs = [
      process.env.RESULTS_UPLOAD_DIR,
      path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads', 'results'),
      path.join(os.tmpdir(), 'results'),
      path.join(/*turbopackIgnore: true*/ process.cwd(), 'uploads', 'results'),
    ].filter(Boolean) as string[]

    let fileBuffer: Buffer | null = null
    for (const dir of candidateDirs) {
      try {
        const filePath = path.join(path.normalize(dir), pdfRecord.pdf_filename)
        fileBuffer = await readFile(filePath)
        if (fileBuffer) break
      } catch (e) {
        // continue
      }
    }

    if (!fileBuffer) {
      // Fallback: Check Supabase Storage
      try {
        const { getFileFromStorage } = await import('@/lib/storage/supabase-storage')
        const { data: blob } = await getFileFromStorage('results-pdfs', pdfRecord.pdf_filename)
        if (blob) {
          const arrayBuf = await blob.arrayBuffer()
          return new Response(new Uint8Array(arrayBuf), {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `inline; filename="${(pdfRecord.title || 'result').replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        }
      } catch (cloudErr) {
        // Fallback error
      }
      return new Response('PDF file not found on disk or storage', { status: 404 })
    }

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${pdfRecord.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Error serving PDF:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
