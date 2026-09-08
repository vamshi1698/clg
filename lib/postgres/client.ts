import { Pool, PoolConfig } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL

function getPoolConfig(): PoolConfig | null {
  if (!DATABASE_URL) return null

  const isLocalhost = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1')
  const requiresSsl =
    !isLocalhost &&
    (process.env.NODE_ENV === 'production' ||
      DATABASE_URL.includes('sslmode=require') ||
      DATABASE_URL.includes('supabase') ||
      DATABASE_URL.includes('neon.tech') ||
      DATABASE_URL.includes('render.com') ||
      DATABASE_URL.includes('aivencloud.com') ||
      DATABASE_URL.includes('vercel-storage.com'))

  const config: PoolConfig = {
    // Strip sslmode from URI so custom ssl object takes precedence without conflicting
    connectionString: requiresSsl ? DATABASE_URL.replace(/[?&]sslmode=[^&]+/, '') : DATABASE_URL,
    // Optimal connection pool configuration for pooled Supabase / Postgres
    max: process.env.PG_MAX_CONNECTIONS ? parseInt(process.env.PG_MAX_CONNECTIONS, 10) : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    allowExitOnIdle: true,
  }

  if (requiresSsl) {
    config.ssl = { rejectUnauthorized: false }
  }

  return config
}

const globalForPg = globalThis as unknown as {
  pgPool: Pool | undefined
}

const poolConfig = getPoolConfig()
const pool = globalForPg.pgPool ?? (poolConfig ? new Pool(poolConfig) : null)

// Cache pool in globalThis to reuse across warm serverless container invocations
if (pool) {
  globalForPg.pgPool = pool as Pool
}

type QueryResult = Record<string, any>

function escapeIdentifier(str: string): string {
  return str.replace(/"/g, '""')
}

class PostgresQuery {
  private tableName: string
  private selectColumns: string[] = ['*']
  private filters: Array<{ column: string; operator: string; value: any }> = []
  private orderByColumn: string | null = null
  private orderAscending = true
  private limitValue: number | null = null
  private offsetValue: number | null = null
  private singleRow = false

  constructor(table: string) {
    this.tableName = table
  }

  select(columns: string | string[]): this {
    if (typeof columns === 'string') {
      // Strip Supabase-style relation joins e.g. "students(name, register_number)"
      // before splitting by comma, so inner commas don't leak out
      const stripped = columns.replace(/\w+\([^)]*\)/g, '')
      const baseColumns = stripped
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
      this.selectColumns = baseColumns.length > 0 ? baseColumns : ['*']
    } else {
      this.selectColumns = columns
    }
    return this
  }

  eq(column: string, value: any): this {
    this.filters.push({ column, operator: '=', value })
    return this
  }

  neq(column: string, value: any): this {
    this.filters.push({ column, operator: '!=', value })
    return this
  }

  gt(column: string, value: any): this {
    this.filters.push({ column, operator: '>', value })
    return this
  }

  gte(column: string, value: any): this {
    this.filters.push({ column, operator: '>=', value })
    return this
  }

  lt(column: string, value: any): this {
    this.filters.push({ column, operator: '<', value })
    return this
  }

  lte(column: string, value: any): this {
    this.filters.push({ column, operator: '<=', value })
    return this
  }

  like(column: string, pattern: string): this {
    this.filters.push({ column, operator: 'LIKE', value: pattern })
    return this
  }

  ilike(column: string, pattern: string): this {
    this.filters.push({ column, operator: 'ILIKE', value: pattern })
    return this
  }

  in(column: string, values: any[]): this {
    this.filters.push({ column, operator: 'IN', value: values })
    return this
  }

  is(column: string, value: any): this {
    if (value === null) {
      this.filters.push({ column, operator: 'IS_NULL', value: null })
    } else {
      this.filters.push({ column, operator: 'IS', value })
    }
    return this
  }

  not(column: string, operator: string, value: any): this {
    if (operator === 'is' && value === null) {
      this.filters.push({ column, operator: 'IS_NOT_NULL', value: null })
    } else if (operator === 'eq' || operator === '=') {
      this.filters.push({ column, operator: '!=', value })
    } else if (operator === 'in') {
      this.filters.push({ column, operator: 'NOT IN', value })
    } else {
      this.filters.push({ column, operator: `NOT_${operator.toUpperCase()}`, value })
    }
    return this
  }

  order(column: string, options?: { ascending?: boolean }): this {
    this.orderByColumn = column
    this.orderAscending = options?.ascending !== false
    return this
  }

  limit(count: number): this {
    this.limitValue = count
    return this
  }

  offset(count: number): this {
    this.offsetValue = count
    return this
  }

  range(from: number, to: number): this {
    this.offsetValue = from
    this.limitValue = to - from + 1
    return this
  }

  single(): this {
    this.singleRow = true
    this.limitValue = 1
    return this
  }

  private buildQuery(): { sql: string; values: any[] } {
    // Handle wildcard * properly (don't quote it)
    const columnList = this.selectColumns
      .map((c) => (c === '*' ? '*' : `"${escapeIdentifier(c)}"`))
      .join(', ')
    let sql = `SELECT ${columnList} FROM "${escapeIdentifier(this.tableName)}"`
    const values: any[] = []
    let paramIndex = 1

    // Add WHERE clauses
    if (this.filters.length > 0) {
      const whereClauses = this.filters.map((f) => {
        if (f.operator === 'IS_NULL') {
          return `"${escapeIdentifier(f.column)}" IS NULL`
        }
        if (f.operator === 'IS_NOT_NULL') {
          return `"${escapeIdentifier(f.column)}" IS NOT NULL`
        }
        if (f.operator === 'IN' || f.operator === 'NOT IN') {
          if (Array.isArray(f.value) && f.value.length === 0) {
            return f.operator === 'IN' ? '1=0' : '1=1'
          }
          values.push(f.value)
          return `"${escapeIdentifier(f.column)}" ${f.operator === 'IN' ? '= ANY' : '!= ALL'}($${paramIndex++})`
        }
        values.push(f.value)
        return `"${escapeIdentifier(f.column)}" ${f.operator} $${paramIndex++}`
      })
      sql += ` WHERE ${whereClauses.join(' AND ')}`
    }

    // Add ORDER BY
    if (this.orderByColumn) {
      sql += ` ORDER BY "${escapeIdentifier(this.orderByColumn)}" ${this.orderAscending ? 'ASC' : 'DESC'}`
    }

    // Add LIMIT
    if (this.limitValue !== null && this.limitValue !== undefined) {
      sql += ` LIMIT ${this.limitValue}`
    }

    // Add OFFSET
    if (this.offsetValue !== null && this.offsetValue !== undefined) {
      sql += ` OFFSET ${this.offsetValue}`
    }

    return { sql, values }
  }

  async execute(): Promise<{ data: QueryResult[] | QueryResult | null; error: any }> {
    try {
      if (!pool) {
        return {
          data: null,
          error: {
            message: 'Missing DATABASE_URL environment variable',
            code: 'NO_DATABASE_URL'
          }
        }
      }

      const { sql, values } = this.buildQuery()
      const result = await pool.query(sql, values)

      if (this.singleRow) {
        return {
          data: result.rows[0] || null,
          error: null
        }
      }
      return {
        data: result.rows,
        error: null
      }
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
          detail: error.detail,
          constraint: error.constraint,
          table: error.table,
          column: error.column
        }
      }
    }
  }

  then(onFulfilled?: any, onRejected?: any) {
    return this.execute().then(onFulfilled, onRejected)
  }
}

export class PostgresClient {
  from(table: string) {
    return new PostgresQueryBuilder(table)
  }

  async insert(table: string, values: Record<string, any>) {
    try {
      if (!pool) {
        return { data: null, error: { message: 'Missing DATABASE_URL environment variable', code: 'NO_DATABASE_URL' } }
      }

      const columns = Object.keys(values)
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
      const sql = `INSERT INTO "${escapeIdentifier(table)}" (${columns.map((c) => `"${escapeIdentifier(c)}"`).join(', ')}) VALUES (${placeholders}) RETURNING *;`
      const result = await pool.query(sql, Object.values(values))
      return { data: result.rows[0], error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async update(table: string, id: string, values: Record<string, any>) {
    try {
      if (!pool) {
        return { data: null, error: { message: 'Missing DATABASE_URL environment variable', code: 'NO_DATABASE_URL' } }
      }

      const columns = Object.keys(values)
      const setClauses = columns.map((col, i) => `"${escapeIdentifier(col)}" = $${i + 1}`).join(', ')
      const sql = `UPDATE "${escapeIdentifier(table)}" SET ${setClauses} WHERE id = $${columns.length + 1} RETURNING *;`
      const result = await pool.query(sql, [...Object.values(values), id])
      return { data: result.rows[0], error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async delete(table: string, id: string) {
    try {
      if (!pool) {
        return { error: { message: 'Missing DATABASE_URL environment variable', code: 'NO_DATABASE_URL' } }
      }

      const sql = `DELETE FROM "${escapeIdentifier(table)}" WHERE id = $1;`
      await pool.query(sql, [id])
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  async query(sql: string, params?: any[]) {
    try {
      if (!pool) {
        return { data: null, error: { message: 'Missing DATABASE_URL environment variable', code: 'NO_DATABASE_URL' } }
      }

      const result = await pool.query(sql, params)
      return { data: result.rows, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async getClient() {
    if (!pool) return null
    return await pool.connect()
  }

  async withTransaction<T>(
    callback: (client: import('pg').PoolClient) => Promise<T>
  ): Promise<{ data: T | null; error: any }> {
    if (!pool) {
      return {
        data: null,
        error: { message: 'Missing DATABASE_URL environment variable', code: 'NO_DATABASE_URL' }
      }
    }
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const result = await callback(client)
      await client.query('COMMIT')
      return { data: result, error: null }
    } catch (error: any) {
      try {
        await client.query('ROLLBACK')
      } catch (rbErr) {
        console.error('Failed to rollback PostgreSQL transaction:', rbErr)
      }
      return { data: null, error }
    } finally {
      client.release()
    }
  }
}

class PostgresQueryBuilder {
  constructor(private tableName: string) { }

  select(columns: string | string[] = '*') {
    const query = new PostgresQuery(this.tableName)
    return query.select(columns) as any
  }
}

export { pool as pgPool }
export const postgresClient = new PostgresClient()
