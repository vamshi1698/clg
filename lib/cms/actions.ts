'use server'

import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { postgresClient } from '@/lib/postgres/client'
import { TABLE_CONFIGS } from '@/lib/cms/tables'

const ALLOWED_TABLES = new Set(TABLE_CONFIGS.map((t) => t.table))

function isValidTable(table: string): boolean {
  return ALLOWED_TABLES.has(table)
}

export async function deleteRow(table: string, id: string): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const { error } = await postgresClient.delete(table, id)
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function toggleActive(table: string, id: string, value: boolean): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const { error } = await postgresClient.update(table, id, { is_active: value })
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function updateSortOrder(table: string, id: string, sortOrder: number): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  const { error } = await postgresClient.update(table, id, { sort_order: sortOrder })
  if (error) return { error: error.message }
  revalidateAdmin(table)
  return { ok: true }
}

export async function saveRow(table: string, data: Record<string, unknown>, id?: string): Promise<{ error?: string } & { ok?: boolean }> {
  if (!isValidTable(table)) {
    return { error: 'Invalid table name' }
  }
  if (id) {
    const { error } = await postgresClient.update(table, id, data as Record<string, any>)
    if (error) return { error: error.message }
  } else {
    // Generate UUID if table needs UUID for primary key
    const payload = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data
    }
    const { error } = await postgresClient.insert(table, payload)
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
  const update: Record<string, unknown> = { status }
  if (status === 'read') update.read_at = new Date().toISOString()
  if (status === 'replied') update.replied_at = new Date().toISOString()
  const { error } = await postgresClient.update('contact_messages', id, update)
  if (error) return { error: error.message }
  revalidatePath('/cms/messages')
  return { ok: true }
}

export async function deleteMessage(id: string) {
  const { error } = await postgresClient.delete('contact_messages', id)
  if (error) return { error: error.message }
  revalidatePath('/cms/messages')
  return { ok: true }
}

