'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUpDown, Save, X } from 'lucide-react'
import { deleteRow, toggleActive, updateSortOrder } from '@/lib/cms/actions'

interface Row {
  id: string
  [key: string]: any
}

function formatDateForList(v: unknown, isDateTime: boolean): string {
  if (v === null || v === undefined) return '—'

  // If it's a string matching YYYY-MM-DD
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [year, month, day] = v.split('-').map(Number)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${day} ${months[month - 1]} ${year}`
  }

  const d = new Date(String(v))
  if (isNaN(d.getTime())) return '—'

  if (isDateTime) {
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Date-only
  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDate()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${day} ${months[month]} ${year}`
}

export function CmsListView({
  config,
  rows,
}: {
  config: import('@/lib/cms/tables').TableConfig
  rows: Row[]
}) {
  if (config.singleton) return null
  return <ListViewInner config={config} rows={rows} />
}

function ListViewInner({ config, rows }: { config: import('@/lib/cms/tables').TableConfig; rows: Row[] }) {
  const [search, setSearch] = useState('')
  const [editingSort, setEditingSort] = useState<string | null>(null)
  const [sortValue, setSortValue] = useState('')
  const [isPending, startTransition] = useTransition()

  const titleField = config.titleField
  const subtitleField = config.subtitleField

  const filtered = rows.filter((r) => {
    if (!search) return true
    const s = search.toLowerCase()
    return config.listFields.some((f) => String(r[f] ?? '').toLowerCase().includes(s))
  })

  function formatCell(field: string, row: Row): React.ReactNode {
    const v = row[field]
    if (v === null || v === undefined) return <span className="text-gray-300">—</span>
    if (typeof v === 'boolean') {
      return (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {v ? 'Yes' : 'No'}
        </span>
      )
    }
    if (field.endsWith('_at') || field.endsWith('_date') || field === 'date_of_birth' || field === 'date') {
      return formatDateForList(v, field.endsWith('_at'))
    }
    // Nested relation fields (e.g., departments.name)
    if (typeof v === 'object') {
      const nested = v as Record<string, unknown>
      return String(nested.name || nested.title || (Object.values(nested)[0] ?? '—'))
    }
    const str = String(v)
    return str.length > 60 ? str.slice(0, 60) + '…' : str
  }

  function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteRow(config.table, id)
    })
  }

  function onToggle(id: string, value: boolean) {
    startTransition(async () => {
      await toggleActive(config.table, id, !value)
    })
  }

  function saveSort(id: string) {
    const val = parseInt(sortValue, 10)
    if (isNaN(val)) {
      setEditingSort(null)
      return
    }
    startTransition(async () => {
      await updateSortOrder(config.table, id, val)
      setEditingSort(null)
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-academic-900">{config.label}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {rows.length} {config.singular.toLowerCase()}{rows.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-3 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-500 w-full sm:w-56"
            />
          </div>
          <Link
            href={`/cms/${config.slug}/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-academic-900 text-white text-sm font-medium rounded-lg hover:bg-academic-800 transition-colors flex-shrink-0"
          >
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-12">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 min-w-[200px]">
                  {config.titleField.replace(/_/g, ' ')}
                </th>
                {config.listFields
                  .filter((f) => f !== config.titleField && f !== subtitleField && f !== 'id')
                  .map((f) => (
                    <th key={f} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                      {f.replace(/_/g, ' ')}
                    </th>
                  ))}
                {config.sortable && (
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 w-28">Order</th>
                )}
                <th className="px-4 py-3 text-right font-semibold text-gray-600 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={20} className="px-4 py-12 text-center text-gray-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/cms/${config.slug}/${row.id}`}
                        className="font-medium text-academic-900 hover:text-gold-600 transition-colors"
                      >
                        {String(row[titleField] ?? 'Untitled')}
                      </Link>
                      {subtitleField && row[subtitleField] && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {formatCell(subtitleField, row)}
                        </div>
                      )}
                    </td>
                    {config.listFields
                      .filter((f) => f !== config.titleField && f !== subtitleField && f !== 'id')
                      .map((f) => (
                        <td key={f} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {formatCell(f, row)}
                        </td>
                      ))}
                    {config.sortable && (
                      <td className="px-4 py-3">
                        {editingSort === row.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={sortValue}
                              onChange={(e) => setSortValue(e.target.value)}
                              className="w-16 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-academic-500"
                              autoFocus
                            />
                            <button
                              onClick={() => saveSort(row.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Save className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingSort(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingSort(row.id)
                              setSortValue(String(row.sort_order ?? 0))
                            }}
                            className="flex items-center gap-1 text-gray-500 hover:text-academic-900"
                          >
                            <ArrowUpDown className="h-3 w-3" />
                            {String(row.sort_order ?? '-')}
                          </button>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {rows.some((r) => 'is_active' in r) && (
                          <button
                            onClick={() => onToggle(row.id, Boolean(row.is_active))}
                            disabled={isPending}
                            title={row.is_active ? 'Deactivate' : 'Activate'}
                            className="p-1.5 text-gray-400 hover:text-gold-600 transition-colors"
                          >
                            {row.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                        )}
                        <Link
                          href={`/cms/${config.slug}/${row.id}`}
                          className="p-1.5 text-gray-400 hover:text-academic-900 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => onDelete(row.id, String(row[titleField] ?? 'this'))}
                          disabled={isPending}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
