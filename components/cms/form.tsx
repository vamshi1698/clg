'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle, Plus, Trash2, ChevronDown, Check, X } from 'lucide-react'
import type { TableConfig, FieldConfig } from '@/lib/cms/tables'
import { saveRow, deleteRow } from '@/lib/cms/actions'
import { ResultsMultiForm } from './results-multi-form'

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
        return match[1]
      } else {
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

  if (config.slug === 'results' && !config.singleton) {
    return <ResultsMultiForm config={config} references={references} initialData={initial} />
  }

  const [values, setValues] = useState<Record<string, unknown>>(initial || {})
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isEdit = !!rowId && !config.singleton

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)

    const payload = buildPayload(config.fields, values)
    const requiredMissing = config.fields
      .filter((f) => f.required)
      .filter((f) => payload[f.name] === undefined || payload[f.name] === '' || payload[f.name] === null)
    if (requiredMissing.length) {
      setError(`Required fields missing: ${requiredMissing.map((f) => f.label).join(', ')}`)
      return
    }

    startTransition(async () => {
      if (config.singleton) {
        const result = await saveRow(config.table, payload, String(singletonId ?? 1))
        if (result.error) {
          setError(result.error)
        } else {
          setSaved(true)
          router.refresh()
          setTimeout(() => setSaved(false), 3000)
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
    if (!confirm(`Delete this ${config.singular.toLowerCase()}? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteRow(config.table, rowId)
      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/cms/${config.slug}`)
      }
    })
  }

  // Group fields into sections (every 6 or by logical breaks)
  const allFields = config.fields
  const generalFields = allFields.filter((f) => !f.serverOnly)

  return (
    <div className="max-w-4xl mx-auto pb-24">

      {/* Page header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={config.singleton ? '/cms' : `/cms/${config.slug}`}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-0.5">
              {config.singleton ? 'Settings' : config.label}
            </div>
            <h1 className="font-display text-xl font-bold text-gray-900">
              {config.singleton
                ? config.singular
                : `${isEdit ? 'Edit' : 'New'} ${config.singular}`}
            </h1>
            {initial?.id != null && (
              <p className="text-[11px] text-gray-300 mt-0.5 font-mono">ID: {String(initial.id)}</p>
            )}
          </div>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition-all disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Main fields card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-bold text-gray-900">
              {config.singleton ? 'Configuration' : `${config.singular} Details`}
            </h2>
            <p className="text-[13px] text-gray-500 mt-1">
              {config.singleton ? 'Update site-wide settings below.' : `Fill in all required fields (marked with *) to ${isEdit ? 'update' : 'create'} this ${config.singular.toLowerCase()}.`}
            </p>
          </div>

          <div className="p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              {generalFields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={values[field.name] ?? initial?.[field.name]}
                  references={references?.[field.name]}
                  onChange={(v) => setValues((prev) => ({ ...prev, [field.name]: v }))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sticky save bar */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 lg:px-7 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <Check className="h-3 w-3" />
                  Saved successfully
                </span>
              )}
              {isPending && (
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving changes…
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={config.singleton ? '/cms' : `/cms/${config.slug}`}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-60 shadow-sm border border-gray-900"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {config.singleton ? 'Save Settings' : isEdit ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </div>
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
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {field.label}
      {field.required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )

  const inputBase =
    'w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400'

  switch (field.type) {
    case 'textarea':
      return (
        <div className={wrapperClass}>
          {label}
          <textarea
            rows={5}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || field.help || ''}
            className={`${inputBase} resize-y`}
          />
          {field.help && <p className="text-xs text-gray-400 mt-1.5">{field.help}</p>}
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
          {field.help && <p className="text-xs text-gray-400 mt-1.5">{field.help}</p>}
        </div>
      )

    case 'boolean':
      return (
        <div className="flex flex-col justify-end pb-1">
          {label}
          <label className="inline-flex items-center gap-3 cursor-pointer group">
            <span className="relative inline-block w-11 h-6 flex-shrink-0">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
                className="opacity-0 absolute w-full h-full z-10 cursor-pointer peer"
              />
              <span className="block w-full h-full bg-gray-200 rounded-full transition-colors duration-200 peer-checked:bg-blue-500" />
              <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
            </span>
            <span className="text-sm font-medium text-gray-600">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
      )

    case 'select': {
      const options = (field.options && field.options.length > 0) ? field.options : (references || [])
      return (
        <div className={wrapperClass}>
          {label}
          <div className="relative">
            <select
              value={(value as string) || ''}
              onChange={(e) => onChange(e.target.value || null)}
              className={`${inputBase} appearance-none pr-10 cursor-pointer`}
            >
              <option value="">— Select {field.label} —</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
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
            placeholder={field.placeholder || (field.type === 'image' ? 'https://example.com/image.jpg' : 'https://')}
            className={inputBase}
          />
          {field.type === 'image' && value != null && value !== '' && (
            <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
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
          {field.help && <p className="text-xs text-gray-400 mt-1.5">{field.help}</p>}
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
    <div className="space-y-2">
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
          className="flex-1 px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Add item and press Enter…"
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
          className="px-3.5 py-2.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-blue-400 hover:text-red-500 transition-colors ml-0.5"
              >
                <X className="h-3 w-3" />
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
      if (v === '' || v === undefined) v = null
    } else if (typeof v === 'string' && v.trim() === '' && f.type !== 'array') {
      v = null
    }
    payload[f.name] = v
  }
  return payload
}
