'use server'

import { revalidatePath } from 'next/cache'
import { adminClient } from './auth'

export async function deleteRow(table: string, id: string): Promise<{ error?: string } & { ok?: boolean }> {
  const supabase = adminClient()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function toggleActive(table: string, id: string, value: boolean): Promise<{ error?: string } & { ok?: boolean }> {
  const supabase = adminClient()
  const { error } = await supabase.from(table).update({ is_active: value }).eq('id', id)
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function updateSortOrder(table: string, id: string, sortOrder: number): Promise<{ error?: string } & { ok?: boolean }> {
  const supabase = adminClient()
  const { error } = await supabase.from(table).update({ sort_order: sortOrder }).eq('id', id)
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function saveRow(table: string, data: Record<string, unknown>, id?: string): Promise<{ error?: string } & { ok?: boolean }> {
  const supabase = adminClient()
  if (id) {
    const { error } = await supabase.from(table).update(data).eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from(table).insert(data)
    if (error) return { error: error.message }
  }
  revalidateAdmin(table)
  return { ok: true }
}

function revalidateAdmin(table: string) {
  try {
    revalidatePath('/cms')
    revalidatePath(`/cms/${table}`)
    revalidatePath('/', 'layout')
  } catch {}
}

// Contact message status
export async function updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied') {
  const supabase = adminClient()
  const update: Record<string, unknown> = { status }
  if (status === 'read') update.read_at = new Date().toISOString()
  if (status === 'replied') update.replied_at = new Date().toISOString()
  const { error } = await supabase.from('contact_messages').update(update).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/cms/messages')
  return { ok: true }
}

export async function deleteMessage(id: string) {
  const supabase = adminClient()
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/cms/messages')
  return { ok: true }
}
