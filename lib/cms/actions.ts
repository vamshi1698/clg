'use server'

import { revalidatePath } from 'next/cache'
import { pool } from '@/lib/db/pool'
import type { TableConfig } from './tables'

/**
 * Build an INSERT/UPDATE from a flat payload object.
 * Arrays are stored as JSON-encoded text[] via ${field}::text[]; booleans/
 * numbers are cast via parameter binding.
 */
function isPgArrayField(value: unknown): boolean {
  return Array.isArray(value)
}

export async function saveRow(
  table: string,
  data: Record<string, unknown>,
  id?: string
): Promise<{ error?: string; ok?: boolean }> {
  const fields = Object.keys(data)
  if (fields.length === 0) return { ok: true }
  const client = await pool.connect()
  try {
    const cols: string[] = []
    const values: unknown[] = []
    const casts: string[] = []
    fields.forEach((name, idx) => {
      const v = data[name]
      cols.push(`"${name}"`)
      values.push(isPgArrayField(v) ? JSON.stringify(v) : v)
      casts.push(
        isPgArrayField(v) ? `$${idx + 1}::text[]` : `$${idx + 1}`
      )
    })

    if (id) {
      const setClause = cols
        .map((c, idx) => `${c} = ${casts[idx]}`)
        .join(', ')
      await client.query(
        `UPDATE "${table}" SET ${setClause} WHERE id = $${fields.length + 1}`,
        [...values, id]
      )
    } else {
      const placeholders = casts.join(', ')
      await client.query(
        `INSERT INTO "${table}" (${cols.join(', ')}) VALUES (${placeholders})`,
        values
      )
    }
    revalidateAdmin(table)
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { error: message }
  } finally {
    client.release()
  }
}

const ALLOWABLE_TABLES = new Set<string>([
  'site_settings',
  'statistics',
  'departments',
  'courses',
  'faculty',
  'news',
  'events',
  'gallery',
  'testimonials',
  'achievements',
  'recruiters',
  'milestones',
  'accreditations',
  'leadership',
  'students',
  'results',
  'result_summaries',
  'contact_messages',
])

function assertValidTable(table: string) {
  if (!ALLOWABLE_TABLES.has(table)) {
    throw new Error(`Table '${table}' is not editable via CMS actions`)
  }
}

export async function deleteRow(
  table: string,
  id: string
): Promise<{ error?: string; ok?: boolean }> {
  assertValidTable(table)
  try {
    await pool.query(`DELETE FROM "${table}" WHERE id = $1`, [id])
    revalidateAdmin(table)
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

export async function toggleActive(
  table: string,
  id: string,
  value: boolean
): Promise<{ error?: string; ok?: boolean }> {
  assertValidTable(table)
  try {
    await pool.query(
      `UPDATE "${table}" SET is_active = $1 WHERE id = $2`,
      [value, id]
    )
    revalidateAdmin(table)
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

export async function updateSortOrder(
  table: string,
  id: string,
  sortOrder: number
): Promise<{ error?: string; ok?: boolean }> {
  assertValidTable(table)
  try {
    await pool.query(
      `UPDATE "${table}" SET sort_order = $1 WHERE id = $2`,
      [sortOrder, id]
    )
    revalidateAdmin(table)
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

function revalidateAdmin(table: string) {
  try {
    revalidatePath('/cms')
    revalidatePath(`/cms/${table}`)
    revalidatePath('/', 'layout')
  } catch {
    /* no-op */
  }
}

export async function updateMessageStatus(
  id: string,
  status: 'unread' | 'read' | 'replied'
): Promise<{ error?: string; ok?: boolean }> {
  try {
    const update: { status: string; read_at?: string; replied_at?: string } = {
      status,
    }
    if (status === 'read') update.read_at = new Date().toISOString()
    if (status === 'replied') update.replied_at = new Date().toISOString()

    const sets = Object.keys(update)
      .map((k, i) => `"${k}" = $${i + 1}`)
      .join(', ')
    const values = Object.values(update)
    values.push(id)
    await pool.query(
      `UPDATE contact_messages SET ${sets} WHERE id = $${values.length}`,
      values
    )
    revalidatePath('/cms/messages')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

export async function deleteMessage(
  id: string
): Promise<{ error?: string; ok?: boolean }> {
  try {
    await pool.query(`DELETE FROM contact_messages WHERE id = $1`, [id])
    revalidatePath('/cms/messages')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

export type { TableConfig }
