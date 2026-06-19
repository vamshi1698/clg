'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, Award, TrendingUp, AlertCircle, Download, Printer, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

interface ResultData {
  student: {
    id: string
    name: string
    register_number: string
    course_name?: string
    department_name?: string
  }
  results: Array<{
    semester: number
    academic_year: string
    subject_code: string
    subject_name: string
    internal_marks: number | null
    external_marks: number | null
    total_marks: number | null
    max_marks: number | null
    grade: string | null
    credits: number | null
    result_status: string | null
  }>
  summary: {
    semester: number
    academic_year: string
    sgpa: number | null
    cgpa: number | null
    result_status: string | null
  }
}

export function ResultsPage() {
  const [registerNumber, setRegisterNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [result, setResult] = useState<ResultData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!registerNumber.trim() || !dateOfBirth) {
      setError('Please enter both register number and date of birth')
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registerNumber: registerNumber.trim(),
            dateOfBirth,
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.student) {
          setError(data.error || 'No student found with the provided details. Please check your Register Number and Date of Birth.')
          return
        }

        const results = (data.results || []).map((r: any) => ({
          semester: r.semester,
          academic_year: r.academic_year,
          subject_code: r.subject_code,
          subject_name: r.subject_name,
          internal_marks: r.internal_marks,
          external_marks: r.external_marks,
          total_marks: r.total_marks,
          max_marks: r.max_marks,
          grade: r.grade,
          credits: r.credits,
          result_status: r.result_status,
        }))

        const summary = (data.summaries || []).map((s: any) => ({
          semester: s.semester,
          academic_year: s.academic_year,
          sgpa: s.sgpa,
          cgpa: s.cgpa,
          result_status: s.result_status,
        }))

        setResult({
          student: {
            id: data.student.id,
            name: data.student.name,
            register_number: data.student.register_number,
            course_name: data.student.course_name || undefined,
            department_name: data.student.department_name || undefined,
          },
          results,
          summary: {
            semester: 0,
            academic_year: '',
            sgpa: null,
            cgpa: null,
            result_status: null,
          },
        })
      } catch {
        setError('An error occurred while fetching results. Please try again.')
      }
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-academic-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={fadeIn}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Examination Results
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Check your semester examination results. Enter your Register Number and Date of Birth to view your marks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-padding">
        <div className="container-wide max-w-2xl">
          <Card className="border border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b px-6 py-4">
              <h2 className="font-display text-xl font-semibold text-academic-900">Check Your Results</h2>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Register Number
                  </label>
                  <Input
                    type="text"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    placeholder="Enter your register number"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full btn-primary" disabled={isPending}>
                  {isPending ? (
                    <>Searching...</>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Check Results
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          {result && (
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="mt-8 print:mt-0"
            >
              <Card className="border border-gray-200 shadow-lg print:shadow-none" id="result-card">
                <CardHeader className="bg-academic-900 text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-semibold">National College Jayanagar</h3>
                      <p className="text-gray-300 text-sm">Examination Results</p>
                    </div>
                    <div className="hidden print:flex items-center gap-2">
                      <Button onClick={handlePrint} variant="outline" size="sm" className="bg-white text-academic-900">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Student Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-semibold text-academic-900">{result.student.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Register No.</p>
                      <p className="font-semibold text-academic-900">{result.student.register_number}</p>
                    </div>
                    {result.student.course_name && (
                      <div>
                        <p className="text-xs text-gray-500">Course</p>
                        <p className="font-semibold text-academic-900">{result.student.course_name}</p>
                      </div>
                    )}
                    {result.student.department_name && (
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="font-semibold text-academic-900">{result.student.department_name}</p>
                      </div>
                    )}
                  </div>

                  {/* Results Table */}
                  {result.results.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-academic-100">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-academic-900">Subject Code</th>
                            <th className="px-4 py-3 text-left font-semibold text-academic-900">Subject Name</th>
                            <th className="px-4 py-3 text-center font-semibold text-academic-900">Internal</th>
                            <th className="px-4 py-3 text-center font-semibold text-academic-900">External</th>
                            <th className="px-4 py-3 text-center font-semibold text-academic-900">Total</th>
                            <th className="px-4 py-3 text-center font-semibold text-academic-900">Max</th>
                            <th className="px-4 py-3 text-center font-semibold text-academic-900">Grade</th>
                            <th className="px-4 py-3 text-center font-semibold text-academic-900">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {result.results.map((r, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-600">{r.subject_code}</td>
                              <td className="px-4 py-3 text-gray-900">{r.subject_name}</td>
                              <td className="px-4 py-3 text-center text-gray-600">{r.internal_marks ?? '-'}</td>
                              <td className="px-4 py-3 text-center text-gray-600">{r.external_marks ?? '-'}</td>
                              <td className="px-4 py-3 text-center font-semibold text-academic-900">{r.total_marks ?? '-'}</td>
                              <td className="px-4 py-3 text-center text-gray-600">{r.max_marks ?? '-'}</td>
                              <td className="px-4 py-3 text-center font-semibold text-gold-600">{r.grade || '-'}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  r.result_status === 'PASS' ? 'bg-green-100 text-green-700' :
                                  r.result_status === 'FAIL' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {r.result_status || '-'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No results available yet.</p>
                    </div>
                  )}

                  {/* Print Actions */}
                  <div className="mt-6 flex justify-end gap-4 print:hidden">
                    <Button onClick={handlePrint} variant="outline">
                      <Printer className="h-4 w-4 mr-2" />
                      Print Result
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Help Text */}
          <p className="mt-8 text-center text-gray-500 text-sm">
            For any issues with results, please contact the Examination Cell at <a href="mailto:exam@nationalcollege.edu.in" className="text-gold-600 hover:underline">exam@nationalcollege.edu.in</a>
          </p>
        </div>
      </section>
    </div>
  )
}
