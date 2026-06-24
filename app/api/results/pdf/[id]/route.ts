import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { postgresClient } from '@/lib/postgres/client'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
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
    const uploadDir = process.env.RESULTS_UPLOAD_DIR || 'c:/Users/vamsi/clg-uploads/results'
    const filePath = path.join(uploadDir, pdfRecord.pdf_filename)

    try {
      const fileBuffer = await readFile(filePath)
      return new Response(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${pdfRecord.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
        },
      })
    } catch (fsError) {
      console.error('File system read error:', fsError)
      return new Response('PDF file not found on disk', { status: 404 })
    }
  } catch (error: any) {
    console.error('Error serving PDF:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
