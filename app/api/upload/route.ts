import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'
import { getSession } from '@/lib/cms/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ROLE_PERMISSIONS } = await import('@/lib/cms/roles')
    const allowedSections = ROLE_PERMISSIONS[session.role] || []
    const canUpload = allowedSections.some((s) => ['site', 'content', 'academics'].includes(s))

    if (!canUpload) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to upload files' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    // Sanitize filename and create unique name
    const originalName = file.name || 'uploaded_file'
    const ext = path.extname(originalName)
    const baseName = path.basename(originalName, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const uniqueFilename = `${baseName}_${crypto.randomBytes(4).toString('hex')}${ext}`
    const mimeType = file.type || 'application/octet-stream'

    // Upload to Supabase Storage (if configured)
    const { uploadToStorage } = await import('@/lib/storage/supabase-storage')
    await uploadToStorage('uploads', uniqueFilename, buffer, mimeType).catch((err) => {
      console.warn('Supabase storage upload warning (falling back to disk):', err)
    })

    // Also cache/write locally for local disk access
    let uploadDir = process.env.UPLOAD_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, uniqueFilename), buffer)
    } catch (e) {
      try {
        const os = await import('os')
        uploadDir = path.join(os.tmpdir(), 'uploads')
        await mkdir(uploadDir, { recursive: true }).catch(() => {})
        await writeFile(path.join(uploadDir, uniqueFilename), buffer)
      } catch (diskErr) {
        // Disk write failed on serverless (safe to ignore if Supabase storage succeeded)
      }
    }

    const fileUrl = `/uploads/${uniqueFilename}`
    
    let classification = 'document'
    if (mimeType.startsWith('image/')) classification = 'image'
    else if (mimeType.startsWith('video/')) classification = 'video'
    else if (mimeType.startsWith('audio/')) classification = 'audio'

    const id = crypto.randomUUID()
    const { error } = await postgresClient.insert('media_library', {
      id,
      file_name: originalName,
      file_path: fileUrl,
      mime_type: mimeType,
      file_size: file.size,
      classification,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    if (error) {
      console.error('DB Error inserting media:', error)
      return NextResponse.json({ error: 'Failed to save media record' }, { status: 500 })
    }

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
