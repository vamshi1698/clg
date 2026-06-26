'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle, Plus } from 'lucide-react'
import type { TableConfig, FieldConfig } from '@/lib/cms/tables'
import { saveRow, deleteRow } from '@/lib/cms/actions'

export interface FormProps {
  config: TableConfig
  /** Reference options for select fields (id/label pairs) */
  references?: Record<string, { value: string; label: string }[]>
  /** Existing row values, if editing */
  initial?: Record<string, unknown>
  /** Row ID, if editing */
  rowId?: string
  /** Singleton: id of the single row, will update */
  singletonId?: string | number
}

function formatDateForInput(value: unknown, type: 'date' | 'datetime'): string {
  if (value === null || value === undefined || value === '') return ''

  // If it's a string that already matches YYYY-MM-DD
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/)
    if (match) {
      if (type === 'date') {
        return match[1] // Return 'YYYY-MM-DD' directly!
      } else {
        // For datetime, we need YYYY-MM-DDTHH:MM.
        const d = new Date(value)
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          const hours = String(d.getHours()).padStart(2, '0')
          const minutes = String(d.getMinutes()).padStart(2, '0')
          return `${year}-${month}-${day}T${hours}:${minutes}`
        }
      }
    }
  }

  // Fallback for Date objects or other formats
  const d = new Date(String(value))
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  if (type === 'date') {
    return `${year}-${month}-${day}`
  } else {
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
}

export function CmsForm({ config, references, initial, rowId, singletonId }: FormProps) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, unknown>>(initial || {})
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const isEdit = !!rowId && !config.singleton

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const payload = buildPayload(config.fields, values)
    const requiredMissing = config.fields
      .filter((f) => f.required)
      .filter((f) => payload[f.name] === undefined || payload[f.name] === '' || payload[f.name] === null)
    if (requiredMissing.length) {
      setError(`Required: ${requiredMissing.map((f) => f.label).join(', ')}`)
      return
    }

    startTransition(async () => {
      if (config.singleton) {
        const result = await saveRow(config.table, payload, String(singletonId ?? 1))
        if (result.error) {
          setError(result.error)
        } else {
          router.refresh()
        }
      } else {
        const result = rowId
          ? await saveRow(config.table, payload, rowId)
          : await saveRow(config.table, payload)
        if (result.error) {
          setError(result.error)
        } else {
          router.refresh()
          router.push(`/cms/${config.slug}`)
        }
      }
    })
  }

  function handleDelete() {
    if (!rowId) return
    if (!confirm(`Delete this ${config.singular.toLowerCase()}?`)) return
    startTransition(async () => {
      const result = await deleteRow(config.table, rowId)
      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/cms/${config.slug}`)
      }
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={config.singleton ? '/cms' : `/cms/${config.slug}`}
            className="p-2 text-gray-400 hover:text-academic-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-academic-900">
              {config.singleton
                ? config.singular
                : `${isEdit ? 'Edit' : 'New'} ${config.singular}`}
            </h1>
            {initial?.id != null && (
              <p className="text-xs text-gray-400 mt-0.5">ID: {String(initial.id)}</p>
            )}
          </div>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {config.fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={values[field.name] ?? initial?.[field.name]}
              references={references?.[field.name]}
              onChange={(v) => setValues((prev) => ({ ...prev, [field.name]: v }))}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-academic-900 text-white text-sm font-medium rounded-lg hover:bg-academic-800 transition-colors disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {config.singleton ? 'Save Settings' : isEdit ? 'Update' : 'Create'}
              </>
            )}
          </button>
          <Link
            href={config.singleton ? '/cms' : `/cms/${config.slug}`}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-academic-900 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

interface FieldRendererProps {
  field: FieldConfig
  value: unknown
  references?: { value: string; label: string }[]
  onChange: (v: unknown) => void
}

function FieldRenderer({ field, value, references, onChange }: FieldRendererProps) {
  const wrapperClass = field.full ? 'sm:col-span-2' : ''
  const label = (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {field.label}
      {field.required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )

  const inputBase =
    'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent disabled:bg-gray-50'

  switch (field.type) {
    case 'textarea':
      return (
        <div className={wrapperClass}>
          {label}
          <textarea
            rows={4}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || field.help || ''}
            className={`${inputBase} resize-y`}
          />
          {field.help && <p className="text-xs text-gray-400 mt-1">{field.help}</p>}
        </div>
      )

    case 'array':
      return (
        <div className={wrapperClass}>
          {label}
          <ArrayField
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={onChange}
          />
          {field.help && <p className="text-xs text-gray-400 mt-1">{field.help}</p>}
        </div>
      )

    case 'boolean':
      return (
        <div className="flex flex-col justify-end pb-1">
          {label}
          <label className="inline-flex items-center cursor-pointer">
            <span className="relative inline-block w-10 h-5">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
                className="opacity-0 absolute w-full h-full z-10 cursor-pointer peer"
              />
              <span className="block w-full h-full bg-gray-200 rounded-full transition-colors peer-checked:bg-academic-900" />
              <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </span>
            <span className="ml-2 text-sm text-gray-600">
              {value ? 'Yes' : 'No'}
            </span>
          </label>
        </div>
      )

    case 'select': {
      const options = (field.options && field.options.length > 0) ? field.options : (references || [])
      return (
        <div className={wrapperClass}>
          {label}
          <select
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value || null)}
            className={inputBase}
          >
            <option value="">— Select —</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    case 'number':
      return (
        <div className={wrapperClass}>
          {label}
          <input
            type="number"
            value={value === null || value === undefined ? '' : String(value)}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            placeholder={field.placeholder || ''}
            className={inputBase}
          />
        </div>
      )

    case 'date':
    case 'datetime': {
      const v = formatDateForInput(value, field.type)
      return (
        <div className={wrapperClass}>
          {label}
          <input
            type={field.type === 'datetime' ? 'datetime-local' : 'date'}
            value={v}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
            className={inputBase}
          />
        </div>
      )
    }

    case 'url':
    case 'image':
      return (
        <div className={wrapperClass}>
          {label}
          <input
            type="url"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || (field.type === 'image' ? 'https://...' : '')}
            className={inputBase}
          />
          {field.type === 'image' && value != null && value !== '' && (
            <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img src={String(value)} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )

    default:
      return (
        <div className={wrapperClass}>
          {label}
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || ''}
            className={inputBase}
          />
          {field.help && <p className="text-xs text-gray-400 mt-1">{field.help}</p>}
        </div>
      )
  }
}

function ArrayField({
  value,
  onChange,
}: {
  value: string[]
  onChange: (v: string[]) => void
}) {
  const [input, setInput] = useState('')
  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const v = input.trim()
              if (v) {
                onChange([...value, v])
                setInput('')
              }
            }
          }}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-500"
          placeholder="Add item and press Enter"
        />
        <button
          type="button"
          onClick={() => {
            const v = input.trim()
            if (v) {
              onChange([...value, v])
              setInput('')
            }
          }}
          className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-gray-400 hover:text-red-600 ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function buildPayload(fields: FieldConfig[], values: Record<string, unknown>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const f of fields) {
    if (f.serverOnly) continue
    let v = values[f.name]
    if (f.type === 'number') {
      if (v === '' || v === undefined || v === null) v = null
      else v = Number(v)
    } else if (f.type === 'boolean') {
      v = Boolean(v)
    } else if (f.type === 'select' && (v === '' || v === undefined)) {
      v = null
    } else if (f.type === 'date' || f.type === 'datetime') {
      // keep as ISO or null
      if (v === '' || v === undefined) v = null
    } else if (typeof v === 'string' && v.trim() === '' && f.type !== 'array') {
      v = null
    }
    payload[f.name] = v
  }
  return payload
}
