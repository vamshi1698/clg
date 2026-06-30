'use client'

import Link from 'next/link'
import { useState, useTransition, Fragment } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUpDown, Save, X, GraduationCap, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { deleteRow, toggleActive, updateSortOrder } from '@/lib/cms/actions'

interface Row {
  id: string
  [key: string]: any
}

function formatDateForList(v: unknown, isDateTime: boolean): string {
  if (v === null || v === undefined) return '—'

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
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [groupByCourse, setGroupByCourse] = useState(true)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const titleField = config.titleField
  const subtitleField = config.subtitleField

  const isCourseGroupable = config.slug === 'students' || config.slug === 'results'
  const isResults = config.slug === 'results'

  let processedRows = rows
  if (isResults) {
    const mergedMap = new Map<string, {
      id: string
      student_id: string
      semester: number
      academic_year: string
      students: any
      student_name: string
      course_id: string
      courses: any
      subjects_array: { name: string; grade: string; status: string }[]
      result_status: string
      is_active: boolean
    }>()

    rows.forEach((r) => {
      const key = `${r.student_id}-${r.semester}`
      const subjectInfo = {
        name: r.subject_name || r.subject_code || 'Unknown',
        grade: r.grade || '—',
        status: r.result_status || 'PENDING'
      }

      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key)!
        existing.subjects_array.push(subjectInfo)
        if (subjectInfo.status === 'FAIL') {
          existing.result_status = 'FAIL'
        } else if (subjectInfo.status === 'ABSENT' && existing.result_status !== 'FAIL') {
          existing.result_status = 'FAIL'
        }
        if (r.is_active) {
          existing.is_active = true
        }
      } else {
        mergedMap.set(key, {
          id: r.id,
          student_id: r.student_id,
          semester: r.semester,
          academic_year: r.academic_year,
          students: r.students,
          student_name: r.student_name || '',
          course_id: r.course_id,
          courses: r.courses,
          subjects_array: [subjectInfo],
          result_status: r.result_status || 'PENDING',
          is_active: !!r.is_active
        })
      }
    })

    processedRows = Array.from(mergedMap.values())
  }

  const coursesList = Array.from(
    new Map(
      processedRows
        .filter((r) => r.course_id && r.courses?.name)
        .map((r) => [r.course_id, r.courses.name])
    ).entries()
  ).map(([id, name]) => ({ id, name }))
   .sort((a, b) => a.name.localeCompare(b.name))

  const filtered = processedRows.filter((r) => {
    const matchesSearch = !search || (() => {
      const s = search.toLowerCase()
      const inStandardFields = config.listFields.some((f) => String(r[f] ?? '').toLowerCase().includes(s))
      if (inStandardFields) return true
      if (r.students?.name && r.students.name.toLowerCase().includes(s)) return true
      if (r.courses?.name && r.courses.name.toLowerCase().includes(s)) return true
      if (r.departments?.name && r.departments.name.toLowerCase().includes(s)) return true
      if (r.subjects_array && r.subjects_array.some((sub: any) => sub.name.toLowerCase().includes(s))) return true
      return false
    })()

    const matchesCourse = !selectedCourseId || r.course_id === selectedCourseId
    return matchesSearch && matchesCourse
  })

  if (isCourseGroupable) {
    filtered.sort((a, b) => {
      const nameA = String(a.student_name || a.name || a.students?.name || '').toLowerCase()
      const nameB = String(b.student_name || b.name || b.students?.name || '').toLowerCase()
      if (nameA === nameB && isResults) {
        return (a.semester || 0) - (b.semester || 0)
      }
      return nameA.localeCompare(nameB)
    })
  }

  interface GroupedCourse {
    courseId: string
    courseName: string
    rows: Row[]
  }

  const groupedCourses: GroupedCourse[] = []

  if (isCourseGroupable && groupByCourse) {
    const groupsMap = new Map<string, Row[]>()
    const unassignedRows: Row[] = []

    filtered.forEach((r) => {
      if (r.course_id) {
        if (!groupsMap.has(r.course_id)) {
          groupsMap.set(r.course_id, [])
        }
        groupsMap.get(r.course_id)!.push(r)
      } else {
        unassignedRows.push(r)
      }
    })

    groupsMap.forEach((groupRows, courseId) => {
      const courseName = groupRows[0]?.courses?.name || 'Unknown Course'
      groupedCourses.push({
        courseId,
        courseName,
        rows: groupRows,
      })
    })
    groupedCourses.sort((a, b) => a.courseName.localeCompare(b.courseName))

    if (unassignedRows.length > 0) {
      groupedCourses.push({
        courseId: 'unassigned',
        courseName: 'Unassigned / Other',
        rows: unassignedRows,
      })
    }
  }

  function formatCell(field: string, row: Row): React.ReactNode {
    if (field === 'subjects') {
      const list = row.subjects_array as { name: string; grade: string; status: string }[]
      if (!list || list.length === 0) return <span className="text-gray-300">—</span>
      return (
        <div className="flex flex-wrap gap-1.5 max-w-xl">
          {list.map((sub, idx) => {
            const isPass = sub.status === 'PASS'
            const isFail = sub.status === 'FAIL'
            return (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  isFail
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : isPass
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-gray-50 text-gray-500 border-gray-100'
                }`}
                title={`${sub.name} - Grade: ${sub.grade || 'N/A'}`}
              >
                <span className="font-bold">{sub.name}</span>
                <span className="opacity-70">({sub.grade || '—'})</span>
              </span>
            )
          })}
        </div>
      )
    }

    const v = row[field]
    if (v === null || v === undefined) return <span className="text-gray-300">—</span>
    if (typeof v === 'boolean') {
      return (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            v ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {v ? 'Yes' : 'No'}
        </span>
      )
    }
    if (field.endsWith('_at') || field.endsWith('_date') || field === 'date_of_birth' || field === 'date') {
      return <span className="text-gray-500">{formatDateForList(v, field.endsWith('_at'))}</span>
    }
    if (typeof v === 'object') {
      const nested = v as Record<string, unknown>
      return String(nested.name || nested.title || (Object.values(nested)[0] ?? '—'))
    }
    const str = String(v)
    return str.length > 60 ? str.slice(0, 60) + '…' : str
  }

  const colSpanCount = 2 + config.listFields.filter((f) => {
    if (isResults) return f !== 'students' && f !== 'semester'
    return f !== config.titleField && f !== subtitleField && f !== 'id'
  }).length + (config.sortable ? 1 : 0)

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

  function toggleGroupCollapse(courseId: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }

  function renderRow(row: Row, index: number) {
    const displayTitle = isResults ? (row.students?.name || 'Untitled') : String(row[titleField] ?? 'Untitled')
    const displaySubtitle = isResults ? `Semester ${row.semester}` : (subtitleField && row[subtitleField] ? formatCell(subtitleField, row) : null)

    return (
      <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
        <td className="px-5 py-4 text-gray-400 text-xs font-mono">{index + 1}</td>
        <td className="px-5 py-4">
          <Link
            href={`/cms/${config.slug}/${row.id}`}
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm"
          >
            {displayTitle}
          </Link>
          {displaySubtitle && (
            <div className="text-xs text-gray-400 mt-0.5">{displaySubtitle}</div>
          )}
        </td>
        {config.listFields
          .filter((f) => {
            if (isResults) return f !== 'students' && f !== 'semester'
            return f !== config.titleField && f !== subtitleField && f !== 'id'
          })
          .map((f) => (
            <td key={f} className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">
              {formatCell(f, row)}
            </td>
          ))}
        {config.sortable && (
          <td className="px-5 py-4">
            {editingSort === row.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                  className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                  autoFocus
                />
                <button onClick={() => saveSort(row.id)} className="p-1 text-emerald-500 hover:text-emerald-600">
                  <Save className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setEditingSort(null)} className="p-1 text-gray-300 hover:text-gray-500">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingSort(row.id)
                  setSortValue(String(row.sort_order ?? 0))
                }}
                className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-xs font-mono"
              >
                <ArrowUpDown className="h-3 w-3" />
                {String(row.sort_order ?? '—')}
              </button>
            )}
          </td>
        )}
        <td className="px-5 py-4">
          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {processedRows.some((r) => 'is_active' in r) && (
              <button
                onClick={() => onToggle(row.id, Boolean(row.is_active))}
                disabled={isPending}
                title={row.is_active ? 'Deactivate' : 'Activate'}
                className={`p-1.5 rounded-lg transition-colors ${row.is_active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                {row.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            )}
            <Link
              href={`/cms/${config.slug}/${row.id}`}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => onDelete(row.id, String(row[titleField] ?? 'this'))}
              disabled={isPending}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">{config.label}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="font-semibold text-gray-600">{processedRows.length}</span>{' '}
            {isResults ? 'student' : config.singular.toLowerCase()}{processedRows.length !== 1 ? 's' : ''} total
            {filtered.length !== processedRows.length && (
              <span className="ml-1 text-blue-500 font-medium">({filtered.length} shown)</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {isCourseGroupable && (
            <>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 bg-white text-gray-700 min-w-[160px]"
              >
                <option value="">All Courses</option>
                {coursesList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors select-none">
                <input
                  type="checkbox"
                  checked={groupByCourse}
                  onChange={(e) => setGroupByCourse(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400 border-gray-300 h-4 w-4 cursor-pointer"
                />
                <span className="font-medium whitespace-nowrap">Group by Course</span>
              </label>
            </>
          )}

          {/* Search */}
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 w-full sm:w-64 transition-all shadow-sm"
            />
          </div>

          <Link
            href={`/cms/${config.slug}/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm border border-gray-900"
          >
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">
                  {isResults ? 'Student' : config.titleField.replace(/_/g, ' ')}
                </th>
                {config.listFields
                  .filter((f) => {
                    if (isResults) return f !== 'students' && f !== 'semester'
                    return f !== config.titleField && f !== subtitleField && f !== 'id'
                  })
                  .map((f) => (
                    <th key={f} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {f.replace(/_/g, ' ')}
                    </th>
                  ))}
                {config.sortable && (
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider w-28">Order</th>
                )}
                <th className="px-5 py-3.5 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={20} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                        <Search className="h-6 w-6 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-400">
                          {search ? `No results for "${search}"` : `No ${config.label.toLowerCase()} found`}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {search ? 'Try a different search term.' : `Add your first ${config.singular.toLowerCase()} to get started.`}
                        </p>
                      </div>
                      {!search && (
                        <Link
                          href={`/cms/${config.slug}/new`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0e1726] text-white text-xs font-semibold rounded-xl hover:bg-[#1a2d47] transition-colors mt-1"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add {config.singular}
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : isCourseGroupable && groupByCourse ? (
                groupedCourses.map((group) => {
                  const isCollapsed = collapsedGroups.has(group.courseId)
                  return (
                    <Fragment key={group.courseId}>
                      {/* Group header row */}
                      <tr className="bg-gray-50 border-y border-gray-100">
                        <td colSpan={colSpanCount} className="px-4 py-2.5">
                          <button
                            onClick={() => toggleGroupCollapse(group.courseId)}
                            className="flex items-center gap-2.5 w-full text-left hover:opacity-70 transition-opacity"
                          >
                            <GraduationCap className="h-4 w-4 text-[#0e1726] flex-shrink-0" />
                            <span className="text-sm font-bold text-[#0e1726]">{group.courseName}</span>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                              {group.rows.length}
                            </span>
                            <span className="ml-auto">
                              {isCollapsed
                                ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                                : <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                              }
                            </span>
                          </button>
                        </td>
                      </tr>
                      {!isCollapsed && group.rows.map((row, i) => renderRow(row, i))}
                    </Fragment>
                  )
                })
              ) : (
                filtered.map((row, i) => renderRow(row, i))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
