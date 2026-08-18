'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import type { TableConfig } from '@/lib/cms/tables'
import { saveMultipleResults } from '@/lib/cms/actions'

interface SubjectRow {
  subject_code: string
  subject_name: string
  internal_marks: string
  external_marks: string
  max_marks: string
  credits: string
  grade: string
  result_status: '' | 'PASS' | 'FAIL' | 'ABSENT' | 'PENDING'
  is_active: boolean
}

export interface ResultsMultiFormProps {
  config: TableConfig
  references?: Record<string, { value: string; label: string }[]>
  initialData?: any
  onCancel?: () => void
}

export function ResultsMultiForm({ config, references, initialData }: ResultsMultiFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [studentId, setStudentId] = useState(initialData?.student_id || '')
  const [semester, setSemester] = useState(initialData?.semester !== undefined ? String(initialData.semester) : '')
  const [academicYear, setAcademicYear] = useState(initialData?.academic_year || '')
  const [examinationType, setExaminationType] = useState(initialData?.examination_type || 'SEMESTER END EXAMINATION')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // State for dynamic subject list
  const [subjects, setSubjects] = useState<SubjectRow[]>(
    initialData?.subjects || [
      {
        subject_code: '',
        subject_name: '',
        internal_marks: '',
        external_marks: '',
        max_marks: '100',
        credits: '3',
        grade: '',
        result_status: '',
        is_active: true,
      },
    ]
  )

  const studentOptions = references?.student_id || []

  function addSubjectRow() {
    setSubjects((prev) => [
      ...prev,
      {
        subject_code: '',
        subject_name: '',
        internal_marks: '',
        external_marks: '',
        max_marks: '100',
        credits: '3',
        grade: '',
        result_status: '',
        is_active: true,
      },
    ])
  }

  function removeSubjectRow(index: number) {
    if (subjects.length === 1) {
      setError('You must add at least one subject.')
      return
    }
    setSubjects((prev) => prev.filter((_, i) => i !== index))
  }

  function updateSubjectField(index: number, field: keyof SubjectRow, value: any) {
    setSubjects((prev) =>
      prev.map((sub, i) => {
        if (i !== index) return sub
        const updated = { ...sub, [field]: value }
        return updated
      })
    )
  }

  function markSubjectAbsent(index: number, isAbsent: boolean) {
    setSubjects((prev) =>
      prev.map((s, i) => {
        if (i === index) {
          if (isAbsent) {
            return {
              ...s,
              internal_marks: '0',
              external_marks: '0',
              grade: 'AB',
              result_status: 'ABSENT'
            }
          } else {
            return {
              ...s,
              internal_marks: '',
              external_marks: '',
              grade: '',
              result_status: ''
            }
          }
        }
        return s
      })
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!studentId) {
      setError('Please select a student.')
      return
    }
    if (!semester) {
      setError('Please enter a semester.')
      return
    }
    if (!academicYear.trim()) {
      setError('Please enter academic year.')
      return
    }
    if (!examinationType.trim()) {
      setError('Please enter examination type.')
      return
    }

    // Validate subject lines
    for (let i = 0; i < subjects.length; i++) {
      const s = subjects[i]
      if (!s.subject_code.trim()) {
        setError(`Subject #${i + 1} is missing a Subject Code.`)
        return
      }
      if (!s.subject_name.trim()) {
        setError(`Subject #${i + 1} is missing a Subject Name.`)
        return
      }
      if (s.credits === '' || isNaN(Number(s.credits))) {
        setError(`Subject #${i + 1} must have numeric Credits.`)
        return
      }
    }

    // Map rows to server payload format
    const payloadSubjects = subjects.map((s) => {
      const internal = s.internal_marks === '' ? null : Number(s.internal_marks)
      const external = s.external_marks === '' ? null : Number(s.external_marks)
      const max = s.max_marks === '' ? 100 : Number(s.max_marks)
      const total = (internal ?? 0) + (external ?? 0)

      // Calculate result status if not selected
      let status = s.result_status
      if (!status) {
        status = total >= max * 0.4 ? 'PASS' : 'FAIL'
      }

      return {
        subject_code: s.subject_code.trim().toUpperCase(),
        subject_name: s.subject_name.trim(),
        internal_marks: internal,
        external_marks: external,
        max_marks: max,
        credits: Number(s.credits),
        grade: s.grade.trim().toUpperCase() || null,
        result_status: status,
        is_active: s.is_active,
      }
    })

    startTransition(async () => {
      const result = await saveMultipleResults(
        studentId,
        Number(semester),
        academicYear.trim(),
        examinationType.trim(),
        payloadSubjects
      )

      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
        router.push(`/cms/${config.slug}`)
      }
    })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/cms/${config.slug}`}
            className="p-2 text-gray-400 hover:text-academic-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-academic-900">
              {isEdit ? 'Edit Results Entry' : 'Bulk Add Results Entry'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEdit ? 'Correct and manage grades and marks for this semester.' : 'Select student and add as many subjects as needed at once.'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student & Semester Details Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-academic-900 mb-4 border-b border-gray-100 pb-2">
            1. Student & Semester Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Student <span className="text-red-500">*</span>
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-450"
                required
                disabled={isEdit}
              >
                <option value="">— Select Student —</option>
                {studentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Semester <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. 6"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-455"
                required
                disabled={isEdit}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2025-2026"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Exam Type <span className="text-red-500">*</span>
              </label>
              <select
                value={examinationType}
                onChange={(e) => setExaminationType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
                required
              >
                <option value="SEMESTER END EXAMINATION">Semester End Examination</option>
                <option value="SUPPLEMENTARY EXAMINATION">Supplementary Examination</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subjects Marks Form Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <h2 className="text-base font-semibold text-academic-900">
              2. Subject Marks & Grades
            </h2>
            <button
              type="button"
              onClick={addSubjectRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-academic-900 text-white text-xs font-semibold rounded-lg hover:bg-academic-800 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add Subject
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-2 pr-3 w-[15%]">Subject Code *</th>
                  <th className="py-2 px-3 w-[25%]">Subject Name *</th>
                  <th className="py-2 px-3 w-[10%]">Internals</th>
                  <th className="py-2 px-3 w-[10%]">Externals</th>
                  <th className="py-2 px-3 w-[10%]">Max Marks</th>
                  <th className="py-2 px-3 w-[8%]">Credits *</th>
                  <th className="py-2 px-3 w-[8%]">Grade</th>
                  <th className="py-2 px-3 w-[12%]">Status</th>
                  <th className="py-2 pl-3 w-[5%] text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.map((sub, index) => {
                  const total = (parseFloat(sub.internal_marks) || 0) + (parseFloat(sub.external_marks) || 0)
                  const max = parseFloat(sub.max_marks) || 100
                  const autoStatus = total >= max * 0.4 ? 'PASS' : 'FAIL'

                  return (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-2">
                        <input
                          type="text"
                          value={sub.subject_code}
                          onChange={(e) => updateSubjectField(index, 'subject_code', e.target.value)}
                          placeholder="e.g. CS601"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-academic-500 uppercase font-mono"
                          required
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={sub.subject_name}
                          onChange={(e) => updateSubjectField(index, 'subject_name', e.target.value)}
                          placeholder="e.g. Web Technology"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-academic-500"
                          required
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={sub.internal_marks}
                          onChange={(e) => updateSubjectField(index, 'internal_marks', e.target.value)}
                          placeholder="e.g. 20"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-academic-500 text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={sub.external_marks}
                          onChange={(e) => updateSubjectField(index, 'external_marks', e.target.value)}
                          placeholder="e.g. 60"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-academic-500 text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={sub.max_marks}
                          onChange={(e) => updateSubjectField(index, 'max_marks', e.target.value)}
                          placeholder="100"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-academic-500 text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={sub.credits}
                          onChange={(e) => updateSubjectField(index, 'credits', e.target.value)}
                          placeholder="3"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-academic-500 text-center"
                          required
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={sub.grade}
                          onChange={(e) => updateSubjectField(index, 'grade', e.target.value)}
                          placeholder="A+"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-academic-500 text-center uppercase"
                        />
                      </td>
                      <td className="py-3 px-2 flex flex-col items-center justify-center gap-1.5">
                        <select
                          value={sub.result_status}
                          onChange={(e) => updateSubjectField(index, 'result_status', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-academic-500"
                        >
                          <option value="">{`Auto (${autoStatus})`}</option>
                          <option value="PASS">PASS</option>
                          <option value="FAIL">FAIL</option>
                          <option value="ABSENT">ABSENT</option>
                          <option value="PENDING">PENDING</option>
                        </select>
                        <label className="text-[10px] flex items-center gap-1.5 text-gray-600 cursor-pointer font-medium hover:text-academic-700 w-full justify-center bg-gray-50/80 py-1 rounded border border-gray-200">
                          <input
                            type="checkbox"
                            checked={sub.result_status === 'ABSENT'}
                            onChange={(e) => markSubjectAbsent(index, e.target.checked)}
                            className="rounded text-academic-600 focus:ring-academic-500 cursor-pointer w-3 h-3"
                          />
                          Mark Absent
                        </label>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeSubjectRow(index)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove subject"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden space-y-4">
            {subjects.map((sub, index) => {
              const total = (parseFloat(sub.internal_marks) || 0) + (parseFloat(sub.external_marks) || 0)
              const max = parseFloat(sub.max_marks) || 100
              const autoStatus = total >= max * 0.4 ? 'PASS' : 'FAIL'

              return (
                <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3 relative bg-gray-50/30">
                  <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                    <span className="text-xs font-bold text-academic-900 uppercase">Subject #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSubjectRow(index)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Remove subject"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject Code *</label>
                      <input
                        type="text"
                        value={sub.subject_code}
                        onChange={(e) => updateSubjectField(index, 'subject_code', e.target.value)}
                        placeholder="e.g. CS601"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm uppercase font-mono"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject Name *</label>
                      <input
                        type="text"
                        value={sub.subject_name}
                        onChange={(e) => updateSubjectField(index, 'subject_name', e.target.value)}
                        placeholder="e.g. Web Technology"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Internals</label>
                      <input
                        type="number"
                        value={sub.internal_marks}
                        onChange={(e) => updateSubjectField(index, 'internal_marks', e.target.value)}
                        placeholder="20"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Externals</label>
                      <input
                        type="number"
                        value={sub.external_marks}
                        onChange={(e) => updateSubjectField(index, 'external_marks', e.target.value)}
                        placeholder="60"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Marks</label>
                      <input
                        type="number"
                        value={sub.max_marks}
                        onChange={(e) => updateSubjectField(index, 'max_marks', e.target.value)}
                        placeholder="100"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Credits *</label>
                      <input
                        type="number"
                        value={sub.credits}
                        onChange={(e) => updateSubjectField(index, 'credits', e.target.value)}
                        placeholder="3"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Grade</label>
                      <input
                        type="text"
                        value={sub.grade}
                        onChange={(e) => updateSubjectField(index, 'grade', e.target.value)}
                        placeholder="A+"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                      <select
                        value={sub.result_status}
                        onChange={(e) => updateSubjectField(index, 'result_status', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">{`Auto (${autoStatus})`}</option>
                        <option value="PASS">PASS</option>
                        <option value="FAIL">FAIL</option>
                        <option value="ABSENT">ABSENT</option>
                        <option value="PENDING">PENDING</option>
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-150 flex justify-start">
            <button
              type="button"
              onClick={addSubjectRow}
              className="inline-flex items-center gap-1.5 text-academic-900 hover:text-academic-800 text-sm font-semibold transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Another Subject
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
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
                <Save className="h-4 w-4" /> Create Results
              </>
            )}
          </button>
          <Link
            href={`/cms/${config.slug}`}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-academic-900 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
