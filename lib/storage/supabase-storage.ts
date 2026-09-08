import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY

let supabaseClient: SupabaseClient | null = null

export function getSupabaseStorageClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    })
    return supabaseClient
  }
  return null
}

export async function uploadToStorage(
  bucket: string,
  filePath: string,
  buffer: Uint8Array | Buffer,
  contentType?: string
): Promise<{ url: string | null; error: any }> {
  try {
    const supabase = getSupabaseStorageClient()
    if (!supabase) {
      return { url: null, error: new Error('Supabase storage not configured') }
    }

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
      upsert: true,
      contentType: contentType || 'application/octet-stream',
    })

    if (error) {
      return { url: null, error }
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return { url: publicUrlData.publicUrl, error: null }
  } catch (err: any) {
    return { url: null, error: err }
  }
}

export async function getFileFromStorage(
  bucket: string,
  filePath: string
): Promise<{ data: Blob | null; error: any }> {
  try {
    const supabase = getSupabaseStorageClient()
    if (!supabase) {
      return { data: null, error: new Error('Supabase storage not configured') }
    }

    const { data, error } = await supabase.storage.from(bucket).download(filePath)
    return { data, error }
  } catch (err: any) {
    return { data: null, error: err }
  }
}

export async function deleteFromStorage(
  bucket: string,
  filePaths: string[]
): Promise<{ error: any }> {
  try {
    const supabase = getSupabaseStorageClient()
    if (!supabase) {
      return { error: new Error('Supabase storage not configured') }
    }

    const { error } = await supabase.storage.from(bucket).remove(filePaths)
    return { error }
  } catch (err: any) {
    return { error: err }
  }
}
