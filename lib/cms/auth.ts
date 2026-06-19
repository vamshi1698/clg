import 'server-only'
import { getSession } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'
import { pool } from '@/lib/db/pool'

export type { AuthUser as CmsSession }

export async function getCurrentUser(): Promise<AuthUser | null> {
  return getSession()
}

export { pool as adminClient }

export { getSession }
