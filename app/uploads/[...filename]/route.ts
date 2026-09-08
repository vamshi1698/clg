import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import os from 'os';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ filename: string[] }> }
) {
  try {
    const params = await props.params;
    const filenamePath = params.filename.join('/');
    
    // Prevent directory traversal
    const safePath = path.normalize(filenamePath).replace(/^(\.\.(\/|\\|$))+/, '');
    
    const candidateDirs = [
      process.env.UPLOAD_DIR,
      path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads'),
      path.join(os.tmpdir(), 'uploads'),
      path.join(/*turbopackIgnore: true*/ process.cwd(), 'uploads'),
    ].filter(Boolean) as string[];

    let fileBuffer: Buffer | null = null;
    let foundPath: string | null = null;

    for (const dir of candidateDirs) {
      try {
        const testPath = path.join(path.normalize(dir), safePath);
        fileBuffer = await readFile(testPath);
        if (fileBuffer) {
          foundPath = testPath;
          break;
        }
      } catch (e) {
        // Continue searching other directories
      }
    }

    if (!fileBuffer || !foundPath) {
      // Fallback: Check Supabase Storage
      try {
        const { getFileFromStorage } = await import('@/lib/storage/supabase-storage')
        const { data: blob } = await getFileFromStorage('uploads', safePath)
        if (blob) {
          const arrayBuf = await blob.arrayBuffer()
          const mimeType = blob.type || 'application/octet-stream'
          return new NextResponse(new Uint8Array(arrayBuf), {
            headers: {
              'Content-Type': mimeType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        }
      } catch (cloudErr) {
        // Fallback error
      }
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Guess MIME type based on extension
    const ext = path.extname(foundPath).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.svg') mimeType = 'image/svg+xml';
    else if (ext === '.pdf') mimeType = 'application/pdf';
    else if (ext === '.mp4') mimeType = 'video/mp4';

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

