'use client'

import Link from 'next/link'
import { useState, useTransition, Fragment, useMemo, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUpDown, Save, X, GraduationCap, Search, ChevronDown, ChevronUp, RotateCcw, TrendingUp, UploadCloud, Loader2, Info, AlertCircle, CheckCircle, GripVertical } from 'lucide-react'
import * as XLSX from 'xlsx'
import { cn } from '@/lib/utils'
import { deleteRow, toggleActive, updateSortOrder, updateSortOrdersBulk, deleteRowPermanent, restoreRow, deleteRows, deleteRowsPermanent, restoreRows } from '@/lib/cms/actions'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from 'recharts'

const DynamicResponsiveContainer = ResponsiveContainer as any
const DynamicComposedChart = ComposedChart as any
const DynamicBar = Bar as any
const DynamicLine = Line as any
const DynamicXAxis = XAxis as any
const DynamicYAxis = YAxis as any
const DynamicCartesianGrid = CartesianGrid as any
const DynamicRechartsTooltip = RechartsTooltip as any
const DynamicRechartsLegend = RechartsLegend as any
import { toast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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

import React from 'react'

const SortableRowContext = React.createContext<{ attributes: any; listeners: any } | null>(null)

function SortableTr({ id, children, isSortable }: { id: string; children: React.ReactNode; isSortable: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999, opacity: 0.9, backgroundColor: '#f9fafb', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } : {}),
  } as React.CSSProperties

  if (!isSortable) {
    return <tr className="hover:bg-gray-50 transition-colors group">{children}</tr>
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 transition-colors group ${isDragging ? 'bg-gray-50 shadow-xl ring-1 ring-gray-900/5' : ''}`}
    >
      <SortableRowContext.Provider value={{ attributes, listeners }}>
        {children}
      </SortableRowContext.Provider>
    </tr>
  )
}

function DragHandle() {
  const context = React.useContext(SortableRowContext)
  if (!context) return null
  const { attributes, listeners } = context
  return (
    <button
      {...attributes}
      {...listeners}
      className="p-1.5 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing transition-colors rounded hover:bg-gray-100 touch-none flex items-center justify-center"
      aria-label="Drag to reorder"
    >
      <GripVertical className="h-4 w-4" />
    </button>
  )
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
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])
  const [localRows, setLocalRows] = useState(rows)
  useEffect(() => { setLocalRows(rows) }, [rows])
  
  const [search, setSearch] = useState('')
  const [editingSort, setEditingSort] = useState<string | null>(null)
  const [sortValue, setSortValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [groupByCourse, setGroupByCourse] = useState(true)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [viewTrash, setViewTrash] = useState(false)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
  const [confirmBulkDeletePermanent, setConfirmBulkDeletePermanent] = useState(false)
  const [confirmDeletePermanent, setConfirmDeletePermanent] = useState<{ id: string; title: string } | null>(null)

  const [showImportModal, setShowImportModal] = useState(false)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [excelPending, setExcelPending] = useState(false)
  const [excelError, setExcelError] = useState<string | null>(null)
  const [excelResult, setExcelResult] = useState<{ importedCount: number; errors: string[] | null } | null>(null)

  const downloadStudentTemplate = () => {
    const headers = [
      'register_number',
      'name',
      'dob',
      'course_code',
      'department_code',
      'academic_year',
      'semester'
    ]

    const sampleRows = [
      {
        register_number: 'NCJ23BCA001',
        name: 'Arjun Kumar',
        dob: '2004-05-15',
        course_code: 'BCA',
        department_code: 'CS',
        academic_year: '2023-2024',
        semester: 6
      },
      {
        register_number: 'NCJ23BCA002',
        name: 'Neha Sharma',
        dob: '2004-08-22',
        course_code: 'BCA',
        department_code: 'CS',
        academic_year: '2023-2024',
        semester: 6
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(sampleRows, { header: headers })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students Template')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    const url = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = 'students_bulk_import_template.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExcelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setExcelError(null)
    setExcelResult(null)

    if (!excelFile) {
      setExcelError('Please select an Excel or CSV file to import.')
      return
    }

    const formData = new FormData()
    formData.append('file', excelFile)

    setExcelPending(true)
    try {
      const response = await fetch('/api/cms/students/upload-excel', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || data.error) {
        setExcelError(data.error || 'Failed to import students.')
      } else {
        setExcelResult(data)
        setExcelFile(null)
        toast({
          title: 'Import Complete',
          description: `Successfully imported ${data.importedCount} student(s).`,
        })
      }
    } catch (err: any) {
      setExcelError(err.message || 'An error occurred during import.')
    } finally {
      setExcelPending(false)
    }
  }

  useEffect(() => {
    setSelectedIds(new Set())
  }, [selectedDepartmentId, selectedCourseId, search, viewTrash])

  const titleField = config.titleField
  const subtitleField = config.subtitleField

  const isCourseGroupable = config.slug === 'students' || config.slug === 'results'
  const isResults = config.slug === 'results'
  const isDepartmentFilterable = config.slug === 'faculty' || config.slug === 'courses' || config.slug === 'students'

  const activeRows = useMemo(() => {
    if (config.slug !== 'students') return localRows
    return localRows.filter((r) => !r.is_deleted)
  }, [localRows, config.slug])

  const deletedRows = useMemo(() => {
    if (config.slug !== 'students') return []
    return localRows.filter((r) => !!r.is_deleted)
  }, [localRows, config.slug])

  let processedRows = config.slug === 'students' && viewTrash ? deletedRows : activeRows

  const semesterStats = useMemo(() => {
    if (config.slug !== 'result-summaries') return []
    const groups: Record<number, { sum: number; count: number; pass: number; fail: number }> = {}
    localRows.forEach((r) => {
      const sem = Number(r.semester || 0)
      if (!sem) return
      if (!groups[sem]) {
        groups[sem] = { sum: 0, count: 0, pass: 0, fail: 0 }
      }
      if (r.sgpa != null) {
        groups[sem].sum += Number(r.sgpa)
        groups[sem].count++
      }
      if (String(r.result_status || '').toUpperCase() === 'PASS') {
        groups[sem].pass++
      } else if (String(r.result_status || '').toUpperCase() === 'FAIL') {
        groups[sem].fail++
      }
    })
    return Object.keys(groups)
      .map((semKey) => {
        const sem = Number(semKey)
        const g = groups[sem]
        const avgSgpa = g.count > 0 ? Number((g.sum / g.count).toFixed(2)) : 0
        const totalStatus = g.pass + g.fail
        const passRate = totalStatus > 0 ? Number(((g.pass / totalStatus) * 100).toFixed(1)) : 0
        return {
          semester: `Sem ${sem}`,
          avgSgpa,
          passRate,
          passCount: g.pass,
          failCount: g.fail,
        }
      })
      .sort((a, b) => a.semester.localeCompare(b.semester))
  }, [rows, config.slug])
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
      examination_type: string
      is_active: boolean
    }>()

    rows.forEach((r) => {
      const key = `${r.student_id}-${r.semester}-${r.examination_type || 'SEMESTER END EXAMINATION'}`
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
          examination_type: r.examination_type,
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

  const departmentsList = useMemo(() => {
    return Array.from(
      new Map(
        processedRows
          .filter((r) => r.department_id && r.departments?.name)
          .map((r) => [r.department_id, r.departments.name])
      ).entries()
    ).map(([id, name]) => ({ id, name }))
     .sort((a, b) => a.name.localeCompare(b.name))
  }, [processedRows])

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
    const matchesDepartment = !selectedDepartmentId || r.department_id === selectedDepartmentId
    return matchesSearch && matchesCourse && matchesDepartment
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

  if (config.slug === 'navigation-links') {
    const parents = filtered.filter(r => !r.parent_id)
    const children = filtered.filter(r => r.parent_id)
    
    // Create hierarchical flat list
    const newFiltered: Row[] = []
    parents.forEach(p => {
      newFiltered.push(p)
      const myChildren = children.filter(c => c.parent_id === p.id)
      newFiltered.push(...myChildren)
    })
    
    // Append any orphaned children at the end
    const orphanChildren = children.filter(c => !parents.some(p => p.id === c.parent_id))
    newFiltered.push(...orphanChildren)
    
    // Replace filtered
    filtered.length = 0
    filtered.push(...newFiltered)
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
  }).length + (config.sortable ? 1 : 0) + (config.slug === 'students' ? 1 : 0)

  function onDelete(id: string, title: string) {
    setConfirmDelete({ id, title })
  }

  function onRestore(id: string, title: string) {
    startTransition(async () => {
      const res = await restoreRow(config.table, id)
      if (res && res.error) {
        toast({
          title: 'Error',
          description: `Failed to restore: ${res.error}`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Restored Successfully',
          description: `"${title}" has been restored.`,
        })
      }
    })
  }

  function onDeletePermanent(id: string, title: string) {
    setConfirmDeletePermanent({ id, title })
  }

  function onToggle(id: string, value: boolean) {
    startTransition(async () => {
      const res = await toggleActive(config.table, id, !value)
      if (res && res.error) {
        toast({
          title: 'Error',
          description: `Failed to update status: ${res.error}`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Record status has been toggled successfully.',
        })
      }
    })
  }

  function saveSort(id: string) {
    const val = parseInt(sortValue, 10)
    if (isNaN(val)) {
      setEditingSort(null)
      return
    }
    startTransition(async () => {
      const res = await updateSortOrder(config.table, id, val)
      if (res && res.error) {
        toast({
          title: 'Error',
          description: `Failed to update sort order: ${res.error}`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Sort order has been updated successfully.',
        })
      }
      setEditingSort(null)
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = localRows.findIndex((row) => row.id === active.id)
    const newIndex = localRows.findIndex((row) => row.id === over.id)
    
    if (oldIndex === -1 || newIndex === -1) return

    const nextRows = arrayMove(localRows, oldIndex, newIndex)
    
    const updates = nextRows.map((r, i) => ({
      id: r.id,
      sortOrder: (i + 1) * 10
    }))

    // Mutate local immediately for UI responsiveness
    nextRows.forEach((r, i) => { r.sort_order = updates[i].sortOrder })
    
    setLocalRows(nextRows)

    // Push to backend
    startTransition(async () => {
      const res = await updateSortOrdersBulk(config.table, updates)
      if (res && res.error) {
        toast({ title: 'Error', description: 'Failed to save order.', variant: 'destructive' })
      }
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
      <SortableTr key={row.id} id={row.id} isSortable={!!config.sortable}>
        {config.slug === 'students' && (
          <td className="px-5 py-4 w-10">
            <input
              type="checkbox"
              checked={selectedIds.has(row.id)}
              onChange={(e) => {
                setSelectedIds((prev) => {
                  const next = new Set(prev)
                  if (e.target.checked) {
                    next.add(row.id)
                  } else {
                    next.delete(row.id)
                  }
                  return next
                })
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
            />
          </td>
        )}
        <td className="px-5 py-4 text-gray-400 text-xs font-mono">{index + 1}</td>
        <td className={cn("px-5 py-4 flex items-center gap-2", config.slug === 'navigation-links' && row.parent_id ? 'pl-16 relative before:absolute before:left-8 before:top-1/2 before:w-6 before:h-px before:bg-gray-200 before:-translate-y-1/2 after:absolute after:left-8 after:-top-4 after:bottom-1/2 after:w-px after:bg-gray-200' : '')}>
          {config.sortable && (
            <div className="-ml-2 z-10">
              <DragHandle />
            </div>
          )}
          <div className="z-10 bg-white">
            {config.table === 'activity_logs' ? (
              <span className="font-semibold text-gray-900 text-sm">{displayTitle}</span>
            ) : (
              <Link
                href={`/cms/${config.slug}/${row.id}`}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm"
              >
                {displayTitle}
              </Link>
            )}
            {displaySubtitle && (
              <div className="text-xs text-gray-400 mt-0.5">{displaySubtitle}</div>
            )}
          </div>
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
          <td className="px-5 py-4 text-gray-400 text-xs font-mono">
            {String(row.sort_order ?? '—')}
          </td>
        )}
        <td className="px-5 py-4">
          <div className="flex items-center justify-end gap-1.5">
            {processedRows.some((r) => 'is_active' in r) && !viewTrash && (
              <button
                onClick={() => onToggle(row.id, Boolean(row.is_active))}
                disabled={isPending}
                title={row.is_active ? 'Deactivate' : 'Activate'}
                aria-label={row.is_active ? 'Deactivate this item' : 'Activate this item'}
                className={`p-1.5 rounded-lg transition-colors ${row.is_active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                {row.is_active ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
              </button>
            )}
            {!viewTrash && config.table !== 'activity_logs' ? (
              <>
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
                  aria-label={`Delete ${String(row[titleField] ?? 'this item')}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            ) : !viewTrash ? null : (
              <>
                <button
                  onClick={() => onRestore(row.id, String(row[titleField] ?? 'this'))}
                  disabled={isPending}
                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Restore"
                  aria-label={`Restore ${String(row[titleField] ?? 'this item')}`}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => onDeletePermanent(row.id, String(row[titleField] ?? 'this'))}
                  disabled={isPending}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Permanently Delete"
                  aria-label={`Permanently Delete ${String(row[titleField] ?? 'this item')}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </td>
      </SortableTr>
    )
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">{config.label}</h1>
          {config.slug !== 'result-summaries' && (
            <p className="text-sm text-gray-400 mt-0.5">
              <span className="font-semibold text-gray-600">{processedRows.length}</span>{' '}
              {isResults ? 'student' : config.singular.toLowerCase()}{processedRows.length !== 1 ? 's' : ''} total
              {filtered.length !== processedRows.length && (
                <span className="ml-1 text-blue-500 font-medium">({filtered.length} shown)</span>
              )}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {isDepartmentFilterable && (
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 bg-white text-gray-700 min-w-[160px] cursor-pointer font-medium"
            >
              <option value="">All Departments</option>
              {departmentsList.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          )}

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
          {config.slug !== 'result-summaries' && (
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
          )}

          {selectedIds.size > 0 && (
            <>
              {!viewTrash ? (
                <button
                  onClick={() => setConfirmBulkDelete(true)}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex-shrink-0 shadow-sm border border-red-600"
                >
                  <Trash2 className="h-4 w-4" /> Delete Selected ({selectedIds.size})
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      startTransition(async () => {
                        const res = await restoreRows(config.table, Array.from(selectedIds))
                        if (res && res.error) {
                          toast({
                            title: 'Error',
                            description: `Failed to restore selected: ${res.error}`,
                            variant: 'destructive',
                          })
                        } else {
                          toast({
                            title: 'Restored Successfully',
                            description: `${selectedIds.size} student(s) have been restored.`,
                          })
                          setSelectedIds(new Set())
                        }
                      })
                    }}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex-shrink-0 shadow-sm border border-emerald-600"
                  >
                    <RotateCcw className="h-4 w-4" /> Restore Selected ({selectedIds.size})
                  </button>
                  <button
                    onClick={() => setConfirmBulkDeletePermanent(true)}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-650 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex-shrink-0 shadow-sm border border-red-650"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Permanently ({selectedIds.size})
                  </button>
                </>
              )}
            </>
          )}

          {config.slug === 'students' && !viewTrash && (
            <button
              onClick={() => {
                setExcelError(null)
                setExcelResult(null)
                setExcelFile(null)
                setShowImportModal(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors flex-shrink-0 shadow-sm"
            >
              <UploadCloud className="h-4 w-4" /> Bulk Import
            </button>
          )}

          {!viewTrash && config.table !== 'activity_logs' && config.slug !== 'result-summaries' && (
            <Link
              href={`/cms/${config.slug}/new`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm border border-gray-900"
            >
              <Plus className="h-4 w-4" /> Add New
            </Link>
          )}
        </div>
      </div>

      {/* Tabs specifically for Students soft-delete tracking */}
      {config.slug === 'students' && (
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setViewTrash(false)
              setSelectedIds(new Set())
            }}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              !viewTrash
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active ({rows.filter(r => !r.is_deleted).length})
          </button>
          <button
            onClick={() => {
              setViewTrash(true)
              setSelectedIds(new Set())
            }}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              viewTrash
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trash / Recycle Bin ({rows.filter(r => r.is_deleted).length})
          </button>
        </div>
      )}

      {/* Result Summaries Analytics Dashboard */}
      {config.slug === 'result-summaries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {semesterStats.length === 0 ? (
            <div className="lg:col-span-3 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">No Analytics Available</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-sm">
                Add result summaries to see dynamic academic performance trends and metrics.
              </p>
            </div>
          ) : (
            <>
              {/* Chart column */}
              <div className="lg:col-span-2 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">Academic Performance Trends</h3>
                  <p className="text-xs text-gray-400">Comparing average SGPA and overall pass percentage across semesters.</p>
                </div>
              <div className="h-64 w-full min-w-0 overflow-x-auto">
                {isMounted && (
                  <div className="h-64 w-full min-w-0">
                    <DynamicResponsiveContainer width="100%" height="100%" minHeight={256}>
                      <DynamicComposedChart
                        data={semesterStats}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                      >
                      <DynamicCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <DynamicXAxis
                        dataKey="semester"
                        type="category"
                        padding={{ left: 50, right: 50 }}
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={{ stroke: '#f3f4f6' }}
                        tickLine={{ stroke: '#f3f4f6' }}
                      />
                      <DynamicYAxis
                        yAxisId="left"
                        domain={[0, 10]}
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={{ stroke: '#f3f4f6' }}
                        tickLine={{ stroke: '#f3f4f6' }}
                      />
                      <DynamicYAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={{ stroke: '#f3f4f6' }}
                        tickLine={{ stroke: '#f3f4f6' }}
                      />
                      <DynamicRechartsTooltip
                        content={({ active, payload }: any) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-md text-xs space-y-1.5 font-sans">
                                <p className="font-bold text-gray-800">{data.semester}</p>
                                <div className="grid grid-cols-2 gap-x-4 text-gray-600">
                                  <span>Avg SGPA:</span>
                                  <span className="font-semibold text-blue-600 text-right">{data.avgSgpa} / 10.0</span>
                                  <span>Pass Rate:</span>
                                  <span className="font-semibold text-emerald-600 text-right">{data.passRate}%</span>
                                  <span>Pass Count:</span>
                                  <span className="font-medium text-gray-800 text-right">{data.passCount}</span>
                                  <span>Fail Count:</span>
                                  <span className="font-medium text-gray-800 text-right">{data.failCount}</span>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <DynamicRechartsLegend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                      />
                      <DynamicBar
                        yAxisId="left"
                        name="Average SGPA"
                        dataKey="avgSgpa"
                        fill="#3b82f6"
                        radius={4}
                        barSize={32}
                        minPointSize={0}
                        isAnimationActive={false}
                      />
                      <DynamicLine
                        yAxisId="right"
                        type="monotone"
                        name="Pass Percentage (%)"
                        dataKey="passRate"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                        isAnimationActive={false}
                      />
                    </DynamicComposedChart>
                    </DynamicResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

              {/* Quick Metrics Cards */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-base mb-1">Quick Metrics</h3>
                <div className="grid grid-cols-1 gap-3.5">
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Overall Average SGPA</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {(semesterStats.reduce((acc, curr) => acc + curr.avgSgpa, 0) / semesterStats.length).toFixed(2)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-400 opacity-60" />
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Average Pass Rate</p>
                      <p className="text-2xl font-bold text-emerald-900 mt-1">
                        {(semesterStats.reduce((acc, curr) => acc + curr.passRate, 0) / semesterStats.length).toFixed(1)}%
                      </p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-emerald-400 opacity-60" />
                  </div>

                  <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Distribution Summary</p>
                    <div className="mt-2.5 space-y-1 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Total Semesters:</span>
                        <span className="font-semibold text-gray-900">{semesterStats.length}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Total Passed Records:</span>
                        <span className="font-semibold text-emerald-600">
                          {semesterStats.reduce((acc, curr) => acc + curr.passCount, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Total Failed Records:</span>
                        <span className="font-semibold text-red-600">
                          {semesterStats.reduce((acc, curr) => acc + curr.failCount, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Table */}
      {config.slug !== 'result-summaries' && (
      <DndContext id="cms-dnd-context" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                {config.slug === 'students' && (
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(filtered.map((r) => r.id)))
                        } else {
                          setSelectedIds(new Set())
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                  </th>
                )}
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
            <SortableContext items={filtered.map(r => r.id)} strategy={verticalListSortingStrategy}>
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
                      {!search && !viewTrash && (
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
                            aria-label={isCollapsed ? `Expand ${group.courseName}` : `Collapse ${group.courseName}`}
                            aria-expanded={!isCollapsed}
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
            </SortableContext>
          </table>
        </div>
      </div>
    </DndContext>
    )}

      {confirmDelete && (
        <AlertDialog open={!!confirmDelete} onOpenChange={(open) => { if (!open) setConfirmDelete(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {config.slug === 'students' 
                  ? `This will move the student "${confirmDelete.title}" to the Trash/Recycle Bin.`
                  : `This action cannot be undone. This will permanently delete the item "${confirmDelete.title}".`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={() => {
                  const { id, title } = confirmDelete
                  setConfirmDelete(null)
                  startTransition(async () => {
                    const res = await deleteRow(config.table, id)
                    if (res && res.error) {
                      toast({
                        title: 'Error',
                        description: `Failed to delete: ${res.error}`,
                        variant: 'destructive',
                      })
                    } else {
                      toast({
                        title: config.slug === 'students' ? 'Moved to Trash' : 'Deleted Successfully',
                        description: config.slug === 'students'
                          ? `"${title}" has been moved to Trash.`
                          : `"${title}" has been deleted.`,
                      })
                    }
                  })
                }}
              >
                {config.slug === 'students' ? 'Move to Trash' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {confirmBulkDelete && (
        <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete these students?</AlertDialogTitle>
              <AlertDialogDescription>
                This will move the {selectedIds.size} selected student(s) to the Trash/Recycle Bin. You can restore them later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-650 hover:bg-red-700 text-white font-bold"
                onClick={() => {
                  setConfirmBulkDelete(false)
                  startTransition(async () => {
                    const res = await deleteRows(config.table, Array.from(selectedIds))
                    if (res && res.error) {
                      toast({
                        title: 'Error',
                        description: `Failed to delete selected students: ${res.error}`,
                        variant: 'destructive',
                      })
                    } else {
                      toast({
                        title: 'Moved to Trash',
                        description: `${selectedIds.size} student(s) have been moved to Trash.`,
                      })
                      setSelectedIds(new Set())
                    }
                  })
                }}
              >
                Move to Trash
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {confirmBulkDeletePermanent && (
        <AlertDialog open={confirmBulkDeletePermanent} onOpenChange={setConfirmBulkDeletePermanent}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the {selectedIds.size} selected student(s) from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={() => {
                  setConfirmBulkDeletePermanent(false)
                  startTransition(async () => {
                    const res = await deleteRowsPermanent(config.table, Array.from(selectedIds))
                    if (res && res.error) {
                      toast({
                        title: 'Error',
                        description: `Failed to permanently delete selected students: ${res.error}`,
                        variant: 'destructive',
                      })
                    } else {
                      toast({
                        title: 'Permanently Deleted',
                        description: `${selectedIds.size} student(s) have been permanently deleted.`,
                      })
                      setSelectedIds(new Set())
                    }
                  })
                }}
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {confirmDeletePermanent && (
        <AlertDialog open={!!confirmDeletePermanent} onOpenChange={(open) => { if (!open) setConfirmDeletePermanent(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the student &quot;{confirmDeletePermanent.title}&quot; from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={() => {
                  const { id, title } = confirmDeletePermanent
                  setConfirmDeletePermanent(null)
                  startTransition(async () => {
                    const res = await deleteRowPermanent(config.table, id)
                    if (res && res.error) {
                      toast({
                        title: 'Error',
                        description: `Failed to delete: ${res.error}`,
                        variant: 'destructive',
                      })
                    } else {
                      toast({
                        title: 'Permanently Deleted',
                        description: `"${title}" has been permanently deleted.`,
                      })
                    }
                  })
                }}
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {showImportModal && (
        <AlertDialog open={showImportModal} onOpenChange={setShowImportModal}>
          <AlertDialogContent className="max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-academic-900 font-display">
                <UploadCloud className="h-5 w-5 text-blue-600" />
                Bulk Import Students
              </AlertDialogTitle>
              <AlertDialogDescription>
                Upload an Excel (.xlsx, .xls) or CSV spreadsheet containing student records. If a student's registration number already exists, their profile details will be updated.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form onSubmit={handleExcelSubmit} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Spreadsheet File
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-academic-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-gray-50/50">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="student-excel-selector"
                  />
                  <label htmlFor="student-excel-selector" className="cursor-pointer space-y-2 block">
                    <UploadCloud className="h-8 w-8 mx-auto text-gray-400" />
                    <div className="text-sm font-medium text-academic-900">
                      {excelFile ? excelFile.name : 'Select or drop Excel/CSV file'}
                    </div>
                    <div className="text-xs text-gray-400">Spreadsheet file matching the required template</div>
                  </label>
                </div>
              </div>

              {excelError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                  <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                  <span>{excelError}</span>
                </div>
              )}

              {excelResult && (
                <div className="border border-green-200 bg-green-50/50 rounded-lg p-4 space-y-2 text-xs">
                  <h4 className="font-semibold text-green-900 flex items-center gap-1.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Import Complete
                  </h4>
                  <div className="bg-white p-2.5 rounded border border-green-150 text-center font-bold text-lg text-academic-900">
                    {excelResult.importedCount} student(s) imported
                  </div>
                  {excelResult.errors && (
                    <div className="mt-2">
                      <p className="font-semibold text-red-700 flex items-center gap-1 mb-1">
                        Warnings ({excelResult.errors.length}):
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-red-600 max-h-32 overflow-y-auto bg-red-50/40 p-2 rounded border border-red-100 font-mono text-[10px]">
                        {excelResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-50 border border-gray-150 rounded-lg p-3 text-xs space-y-2">
                <h4 className="font-semibold flex items-center gap-1.5 text-gray-700">
                  <Info className="h-3.5 w-3.5 text-gray-500" />
                  Required Columns
                </h4>
                <p className="text-gray-500">The file must have the following header columns:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] bg-white p-2 rounded border border-gray-150">
                  <div>• register_number (Unique)</div>
                  <div>• name</div>
                  <div>• dob (YYYY-MM-DD)</div>
                  <div>• course_code</div>
                  <div>• department_code</div>
                  <div>• academic_year (Optional)</div>
                  <div>• semester (Optional)</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={downloadStudentTemplate}
                  className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  Download Template
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportModal(false)
                      if (excelResult) {
                        window.location.reload()
                      }
                    }}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium"
                  >
                    {excelResult ? 'Close & Refresh' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    disabled={excelPending}
                  >
                    {excelPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      'Upload and Import'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
