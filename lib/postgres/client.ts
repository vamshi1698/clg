/**
 * Local Postgres Database Client
 * Provides a Supabase-like interface for querying local Postgres
 */

import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL

const globalForPg = globalThis as unknown as {
  pgPool: Pool | undefined
}

const pool = globalForPg.pgPool ?? (DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null)

if (process.env.NODE_ENV !== 'production' && pool) {
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

  is(column: string, value: any): this {
    if (value === null) {
      this.filters.push({ column, operator: 'IS_NULL', value: null })
    } else {
      this.filters.push({ column, operator: 'IS', value })
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
    if (this.limitValue) {
      sql += ` LIMIT ${this.limitValue}`
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
}

class PostgresQueryBuilder {
  constructor(private tableName: string) {}

  select(columns: string | string[] = '*') {
    const query = new PostgresQuery(this.tableName)
    return query.select(columns) as any
  }
}

export const postgresClient = new PostgresClient()
