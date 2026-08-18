import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ filename: string[] }> }
) {
  try {
    const params = await props.params;
    const filenamePath = params.filename.join('/');
    const rawUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
    // Normalize path to handle Windows backslashes vs forward slashes
    const uploadDir = path.normalize(rawUploadDir);
    
    // Prevent directory traversal
    const safePath = path.normalize(filenamePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = path.join(uploadDir, safePath);

    // Ensure the resolved path is within the upload directory
    if (!filePath.startsWith(uploadDir)) {
       return new NextResponse('Forbidden', { status: 403 });
    }

    const fileBuffer = await readFile(filePath);
    
    // Guess MIME type based on extension
    const ext = path.extname(filePath).toLowerCase();
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
