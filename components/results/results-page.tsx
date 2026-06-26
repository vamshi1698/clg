'use client'

import { useState, useTransition, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, Award, TrendingUp, AlertCircle, Download, Printer, X, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { lookupResults, getActiveResultsPdfs } from '@/lib/actions/public-actions'

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
    total_credits: number | null
    earned_credits: number | null
    result_status: string | null
  } | null
}

interface PdfRecord {
  id: string
  title: string
  academic_year: string
  semester: number
  pdf_filename: string
  created_at: string
}

export function ResultsPage() {
  const [registerNumber, setRegisterNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [result, setResult] = useState<ResultData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [pdfAnnouncements, setPdfAnnouncements] = useState<PdfRecord[]>([])

  // Fetch active result PDFs on mount
  useEffect(() => {
    async function loadPdfs() {
      const res = await getActiveResultsPdfs()
      if (res.data) {
        setPdfAnnouncements(res.data as PdfRecord[])
      }
    }
    loadPdfs()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!registerNumber.trim() || !dateOfBirth) {
      setError('Please enter both register number and date of birth')
      return
    }

    startTransition(async () => {
      const res = await lookupResults(registerNumber.trim(), dateOfBirth)
      if (res.error) {
        setError(res.error)
        return
      }
      setResult(res as any)
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-academic-900 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={fadeIn}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Examination Results
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Check your semester marks online or download the official announced results notifications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="section-padding py-12 lg:py-16">
        <div className="container-wide max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left/Main Column: Search and Result Viewer */}
            <div className="lg:col-span-2 space-y-8">
              
              <Card className="border border-gray-200 shadow-md">
                <CardHeader className="bg-gray-50/70 border-b px-6 py-4">
                  <h2 className="font-display text-xl font-semibold text-academic-900">Check Individual Results</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Register Number
                        </label>
                        <Input
                          type="text"
                          value={registerNumber}
                          onChange={(e) => setRegisterNumber(e.target.value)}
                          placeholder="Enter your register number"
                          className="w-full border-gray-200"
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
                          className="w-full border-gray-200"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-academic-900 text-white hover:bg-academic-800" disabled={isPending}>
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

              {/* Individual Student Results Card */}
              {result && (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={fadeIn}
                  className="print:mt-0"
                >
                  <Card className="border border-gray-200 shadow-lg print:shadow-none" id="result-card">
                    <CardHeader className="bg-academic-900 text-white px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-lg font-semibold">National College Jayanagar</h3>
                          <p className="text-gray-300 text-xs">Semester Examination Results</p>
                        </div>
                        <div className="print:hidden flex items-center gap-2">
                          <Button onClick={handlePrint} variant="outline" size="sm" className="bg-white text-academic-900 hover:bg-gray-100 border-none">
                            <Printer className="h-4 w-4 mr-1.5" />
                            Print
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                      {/* Student Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Name</p>
                          <p className="font-semibold text-sm text-academic-900">{result.student.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Register No.</p>
                          <p className="font-semibold text-sm text-academic-900">{result.student.register_number}</p>
                        </div>
                        {result.student.course_name && (
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Course</p>
                            <p className="font-semibold text-sm text-academic-900">{result.student.course_name}</p>
                          </div>
                        )}
                        {result.student.department_name && (
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Department</p>
                            <p className="font-semibold text-sm text-academic-900">{result.student.department_name}</p>
                          </div>
                        )}
                      </div>

                      {/* GPA Metrics Summary */}
                      {result.summary && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-4 bg-academic-50/50 border border-academic-100/60 rounded-lg text-center">
                            <p className="text-xs font-semibold text-academic-700 uppercase tracking-wider">SGPA</p>
                            <p className="text-2xl font-bold text-academic-900 mt-1">
                              {result.summary.sgpa != null ? result.summary.sgpa.toFixed(2) : '-'}
                            </p>
                          </div>
                          <div className="p-4 bg-academic-50/50 border border-academic-100/60 rounded-lg text-center">
                            <p className="text-xs font-semibold text-academic-700 uppercase tracking-wider">CGPA</p>
                            <p className="text-2xl font-bold text-academic-900 mt-1">
                              {result.summary.cgpa != null ? result.summary.cgpa.toFixed(2) : '-'}
                            </p>
                          </div>
                          <div className="p-4 bg-academic-50/50 border border-academic-100/60 rounded-lg text-center">
                            <p className="text-xs font-semibold text-academic-700 uppercase tracking-wider">Earned Credits</p>
                            <p className="text-2xl font-bold text-academic-900 mt-1">
                              {result.summary.earned_credits != null ? result.summary.earned_credits : '-'}
                            </p>
                          </div>
                          <div className="p-4 bg-academic-50/50 border border-academic-100/60 rounded-lg text-center flex flex-col justify-center items-center">
                            <p className="text-[10px] font-semibold text-academic-700 uppercase tracking-wider mb-1">Result Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              result.summary.result_status === 'PASS' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {result.summary.result_status || '-'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Results Table */}
                      {result.results.length > 0 ? (
                        <div className="overflow-x-auto border border-gray-150 rounded-lg">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
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
                                <tr key={i} className="hover:bg-gray-50/50">
                                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.subject_code}</td>
                                  <td className="px-4 py-3 text-gray-900 font-medium">{r.subject_name}</td>
                                  <td className="px-4 py-3 text-center text-gray-600">{r.internal_marks ?? '-'}</td>
                                  <td className="px-4 py-3 text-center text-gray-600">{r.external_marks ?? '-'}</td>
                                  <td className="px-4 py-3 text-center font-semibold text-academic-900">{r.total_marks ?? '-'}</td>
                                  <td className="px-4 py-3 text-center text-gray-600">{r.max_marks ?? '-'}</td>
                                  <td className="px-4 py-3 text-center font-bold text-gold-600">{r.grade || '-'}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                      r.result_status === 'PASS' ? 'bg-green-50 text-green-700 border border-green-100' :
                                      r.result_status === 'FAIL' ? 'bg-red-50 text-red-700 border border-red-100' :
                                      'bg-gray-50 text-gray-600'
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
                          <p>No results details available yet.</p>
                        </div>
                      )}

                      {/* Print Actions */}
                      <div className="flex justify-end gap-4 print:hidden">
                        <Button onClick={handlePrint} className="bg-academic-900 text-white hover:bg-academic-800">
                          <Printer className="h-4 w-4 mr-2" />
                          Print Result Sheet
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

            </div>

            {/* Right Column: Downloadable Bulletins */}
            <div className="space-y-6">
              <Card className="border border-gray-200 shadow-md">
                <CardHeader className="bg-academic-900 text-white px-6 py-4">
                  <CardTitle className="font-display text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold-500" />
                    Official Bulletins
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {pdfAnnouncements.length > 0 ? (
                    <div className="space-y-3">
                      {pdfAnnouncements.map((pdf) => (
                        <a
                          key={pdf.id}
                          href={`/results/${pdf.id}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={pdf.title.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf'}
                          className="flex items-start gap-3 p-3 rounded-lg border border-gray-150 hover:border-gold-500 hover:bg-academic-50/20 transition-all group"
                        >
                          <FileText className="h-8 w-8 text-academic-700 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-academic-900 leading-snug group-hover:text-gold-600 transition-colors">
                              {pdf.title}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              Semester {pdf.semester} · {pdf.academic_year}
                            </p>
                          </div>
                          <Download className="h-4 w-4 text-gray-400 group-hover:text-gold-600 self-center" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 space-y-2">
                      <ShieldAlert className="h-8 w-8 mx-auto text-gray-300" />
                      <p className="text-xs">No official bulletins posted at this time.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Help & Contact */}
              <p className="text-center text-gray-500 text-xs">
                For any issues with results, please contact the Examination Cell at <a href="mailto:exam@nationalcollege.edu.in" className="text-gold-600 hover:underline">exam@nationalcollege.edu.in</a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
