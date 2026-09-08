import { readFile } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    if (!filename) {
      return new Response('Missing filename', { status: 400 })
    }

    // Determine the PDF file extension check
    if (!filename.toLowerCase().endsWith('.pdf')) {
      return new Response('Only PDF file requests are supported', { status: 400 })
    }

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
        const filePath = path.join(path.normalize(dir), filename)
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
        const { data: blob } = await getFileFromStorage('results-pdfs', filename)
        if (blob) {
          const arrayBuf = await blob.arrayBuffer()
          return new Response(new Uint8Array(arrayBuf), {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'inline',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        }
      } catch (cloudErr) {
        // Fallback error
      }
      return new Response('PDF file not found', { status: 404 })
    }

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error: any) {
    console.error('Error serving static PDF fallback:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
