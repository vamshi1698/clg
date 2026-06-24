/**
 * Local Postgres Database Client
 * Provides a Supabase-like interface for querying local Postgres
 */

import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable')
}

const pool = new Pool({ connectionString: DATABASE_URL })

type QueryResult = Record<string, any>

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
      .map((c) => (c === '*' ? '*' : `"${c}"`))
      .join(', ')
    let sql = `SELECT ${columnList} FROM "${this.tableName}"`
    const values: any[] = []
    let paramIndex = 1

    // Add WHERE clauses
    if (this.filters.length > 0) {
      const whereClauses = this.filters.map((f) => {
        values.push(f.value)
        return `"${f.column}" ${f.operator} $${paramIndex++}`
      })
      sql += ` WHERE ${whereClauses.join(' AND ')}`
    }

    // Add ORDER BY
    if (this.orderByColumn) {
      sql += ` ORDER BY "${this.orderByColumn}" ${this.orderAscending ? 'ASC' : 'DESC'}`
    }

    // Add LIMIT
    if (this.limitValue) {
      sql += ` LIMIT ${this.limitValue}`
    }

    return { sql, values }
  }

  async execute(): Promise<{ data: QueryResult[] | QueryResult | null; error: any }> {
    try {
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
          code: error.code
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
      const columns = Object.keys(values)
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
      const sql = `INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${placeholders}) RETURNING *;`
      const result = await pool.query(sql, Object.values(values))
      return { data: result.rows[0], error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async update(table: string, id: string, values: Record<string, any>) {
    try {
      const columns = Object.keys(values)
      const setClauses = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ')
      const sql = `UPDATE "${table}" SET ${setClauses} WHERE id = $${columns.length + 1} RETURNING *;`
      const result = await pool.query(sql, [...Object.values(values), id])
      return { data: result.rows[0], error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async delete(table: string, id: string) {
    try {
      const sql = `DELETE FROM "${table}" WHERE id = $1;`
      await pool.query(sql, [id])
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  async query(sql: string, params?: any[]) {
    try {
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
