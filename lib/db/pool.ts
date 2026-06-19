import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

function getConnectionString(): string {
  const cs =
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_URL
  if (!cs) {
    throw new Error(
      'Missing DATABASE_URL (or SUPABASE_DB_URL / POSTGRES_URL). Set it in .env to the Postgres connection string.'
    )
  }
  return cs
}

function createPool(): Pool {
  return new Pool({
    connectionString: getConnectionString(),
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
  })
}

let _pool: Pool | null = null

export function getPool(): Pool {
  if (_pool) return _pool
  if (globalThis.__pgPool) {
    _pool = globalThis.__pgPool
    return _pool
  }
  _pool = createPool()
  _pool.on('error', (err) => {
    console.error('[pg] unexpected pool error:', err)
  })
  if (process.env.NODE_ENV !== 'production') {
    globalThis.__pgPool = _pool
  }
  return _pool
}

/**
 * Lazy pool proxy. Build-time static data collection won't touch the DB and
 * therefore won't trigger the connection-string check; the check only fires
 * the first time a query actually runs.
 */
export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const p = getPool()
    const value = (p as unknown as Record<PropertyKey, unknown>)[prop]
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(p)
      : value
  },
})

/** Run a parameterised query and return all rows. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params as unknown[])
}

/** Run a callback inside a transaction. */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

/** Return a single row (or null). */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const res = await query<T>(text, params)
  return (res.rows[0] as T) ?? null
}
