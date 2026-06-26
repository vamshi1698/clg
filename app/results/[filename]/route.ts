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

    const uploadDir = process.env.RESULTS_UPLOAD_DIR
    if (!uploadDir) {
      return new Response('RESULTS_UPLOAD_DIR is not configured in environment variables', { status: 500 })
    }
    const filePath = path.join(uploadDir, filename)

    try {
      const fileBuffer = await readFile(filePath)
      return new Response(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline',
        },
      })
    } catch (fsError) {
      console.error('File system read error for static fallback:', fsError)
      return new Response('PDF file not found', { status: 404 })
    }
  } catch (error: any) {
    console.error('Error serving static PDF fallback:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
