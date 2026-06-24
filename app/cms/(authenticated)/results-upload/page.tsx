'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Loader2, 
  Info, 
  ArrowRight,
  Database,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getResultsPdfs, deleteResultsPdf } from '@/lib/actions/results-actions'

interface PdfRecord {
  id: string
  title: string
  academic_year: string
  semester: number
  pdf_filename: string
  created_at: string
}

export default function ResultsUploadPage() {
  const [pdfs, setPdfs] = useState<PdfRecord[]>([])
  const [pdfPending, startPdfTransition] = useTransition()
  const [excelPending, startExcelTransition] = useTransition()

  // PDF Form state
  const [pdfTitle, setPdfTitle] = useState('')
  const [pdfAcadYear, setPdfAcadYear] = useState('')
  const [pdfSemester, setPdfSemester] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfMessage, setPdfMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  // Excel Form state
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [excelResult, setExcelResult] = useState<{
    studentsImported: number
    marksImported: number
    errors: string[] | null
  } | null>(null)
  const [excelError, setExcelError] = useState<string | null>(null)
  const excelInputRef = useRef<HTMLInputElement>(null)

  // Fetch PDFs on mount
  useEffect(() => {
    loadPdfs()
  }, [])

  async function loadPdfs() {
    const res = await getResultsPdfs()
    if (res.data) {
      setPdfs(res.data as PdfRecord[])
    }
  }

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPdfMessage(null)

    if (!pdfFile || !pdfTitle || !pdfAcadYear || !pdfSemester) {
      setPdfMessage({ type: 'error', text: 'Please fill in all PDF fields and select a file.' })
      return
    }

    const formData = new FormData()
    formData.append('file', pdfFile)
    formData.append('title', pdfTitle)
    formData.append('academic_year', pdfAcadYear)
    formData.append('semester', pdfSemester)

    startPdfTransition(async () => {
      try {
        const response = await fetch('/api/cms/results/upload-pdf', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()

        if (!response.ok || data.error) {
          setPdfMessage({ type: 'error', text: data.error || 'Failed to upload PDF.' })
        } else {
          setPdfMessage({ type: 'success', text: 'Results PDF uploaded successfully!' })
          setPdfTitle('')
          setPdfAcadYear('')
          setPdfSemester('')
          setPdfFile(null)
          if (pdfInputRef.current) pdfInputRef.current.value = ''
          loadPdfs()
        }
      } catch (err: any) {
        setPdfMessage({ type: 'error', text: err.message || 'An error occurred during upload.' })
      }
    })
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

    startExcelTransition(async () => {
      try {
        const response = await fetch('/api/cms/results/upload-excel', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()

        if (!response.ok || data.error) {
          setExcelError(data.error || 'Failed to import student marks.')
        } else {
          setExcelResult(data)
          setExcelFile(null)
          if (excelInputRef.current) excelInputRef.current.value = ''
        }
      } catch (err: any) {
        setExcelError(err.message || 'An error occurred during import.')
      }
    })
  }

  const handleDeletePdf = async (id: string) => {
    if (!confirm('Are you sure you want to delete this results PDF announcement? This will remove the file from the server.')) return
    
    startPdfTransition(async () => {
      const res = await deleteResultsPdf(id)
      if (res.error) {
        setPdfMessage({ type: 'error', text: res.error })
      } else {
        setPdfMessage({ type: 'success', text: 'PDF announcement deleted successfully.' })
        loadPdfs()
      }
    })
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-academic-900 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-gold-500" />
          Upload Examination Results
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Announce official results PDFs or bulk-import detailed student marks from Excel spreadsheets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: PDF Results Announcements */}
        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50/70 border-b border-gray-200/60">
              <CardTitle className="font-display text-lg text-academic-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-academic-700" />
                PDF Results Announcer
              </CardTitle>
              <CardDescription>
                Upload official results bulletins (saved outside the codebase securely).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePdfSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Announcement Title
                  </label>
                  <Input
                    type="text"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    placeholder="e.g. B.Sc VI Sem End Exam Results June 2026"
                    className="w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Academic Year
                    </label>
                    <Input
                      type="text"
                      value={pdfAcadYear}
                      onChange={(e) => setPdfAcadYear(e.target.value)}
                      placeholder="e.g. 2025-2026"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" /> Semester
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={pdfSemester}
                      onChange={(e) => setPdfSemester(e.target.value)}
                      placeholder="e.g. 6"
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Results PDF Document
                  </label>
                  <div className="border-2 border-dashed border-gray-200 hover:border-academic-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-gray-50/50">
                    <input
                      type="file"
                      accept=".pdf"
                      ref={pdfInputRef}
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="pdf-file-selector"
                    />
                    <label htmlFor="pdf-file-selector" className="cursor-pointer space-y-2 block">
                      <UploadCloud className="h-10 w-10 mx-auto text-gray-400" />
                      <div className="text-sm font-medium text-academic-900">
                        {pdfFile ? pdfFile.name : 'Select or drop PDF file'}
                      </div>
                      <div className="text-xs text-gray-400">PDF files up to 10MB</div>
                    </label>
                  </div>
                </div>

                {pdfMessage && (
                  <div className={`flex items-start gap-2 p-3 rounded-lg text-sm border ${
                    pdfMessage.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {pdfMessage.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{pdfMessage.text}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-academic-900 text-white hover:bg-academic-800" 
                  disabled={pdfPending}
                >
                  {pdfPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading File...
                    </>
                  ) : (
                    'Upload Results PDF'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List of active PDFs */}
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50/70 border-b border-gray-200/60 py-4">
              <CardTitle className="font-display text-base text-academic-900">
                Uploaded Bulletins ({pdfs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {pdfs.length > 0 ? (
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {pdfs.map((pdf) => (
                    <div key={pdf.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="min-w-0 pr-4">
                        <p className="font-medium text-sm text-academic-900 truncate">{pdf.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Sem {pdf.semester} · {pdf.academic_year} · Uploaded: {new Date(pdf.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                        onClick={() => handleDeletePdf(pdf.id)}
                        disabled={pdfPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No official results PDFs uploaded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Card 2: Excel Marks Importer */}
        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-md h-full flex flex-col">
            <CardHeader className="bg-gray-50/70 border-b border-gray-200/60">
              <CardTitle className="font-display text-lg text-academic-900 flex items-center gap-2">
                <Database className="h-5 w-5 text-gold-600" />
                Excel / CSV Marks Importer
              </CardTitle>
              <CardDescription>
                Bulk import detailed student subject marks, grades, and calculate SGPA/CGPA.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
              
              <form onSubmit={handleExcelSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Excel Spreadsheet (.xlsx, .xls) or CSV
                  </label>
                  <div className="border-2 border-dashed border-gray-200 hover:border-academic-500 rounded-lg p-8 text-center cursor-pointer transition-colors bg-gray-50/50">
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      ref={excelInputRef}
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="excel-file-selector"
                    />
                    <label htmlFor="excel-file-selector" className="cursor-pointer space-y-2 block">
                      <UploadCloud className="h-10 w-10 mx-auto text-gray-400" />
                      <div className="text-sm font-medium text-academic-900">
                        {excelFile ? excelFile.name : 'Select or drop Excel/CSV sheet'}
                      </div>
                      <div className="text-xs text-gray-400">Spreadsheet file with subject marks</div>
                    </label>
                  </div>
                </div>

                {excelError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{excelError}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-academic-900 text-white hover:bg-academic-800" 
                  disabled={excelPending}
                >
                  {excelPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing Spreadsheet...
                    </>
                  ) : (
                    'Import Student Marks'
                  )}
                </Button>
              </form>

              {/* SpreadSheet Formatting Instructions */}
              <div className="bg-academic-50 border border-academic-100 rounded-lg p-4 text-xs text-academic-950 space-y-2">
                <h4 className="font-semibold flex items-center gap-1.5 text-academic-900">
                  <Info className="h-4 w-4 text-academic-650" />
                  Excel File Formatting Instructions
                </h4>
                <p>To successfully import, the sheet MUST contain the following column headers:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] bg-white p-2.5 rounded border border-academic-100/60 max-h-40 overflow-y-auto">
                  <div>• register_number</div>
                  <div>• semester</div>
                  <div>• academic_year</div>
                  <div>• subject_code</div>
                  <div>• subject_name</div>
                  <div>• name (Student Name)</div>
                  <div>• dob (Date of Birth)</div>
                  <div>• internal_marks</div>
                  <div>• external_marks</div>
                  <div>• credits</div>
                  <div>• grade</div>
                  <div>• status (PASS / FAIL)</div>
                  <div>• course_code (Optional)</div>
                  <div>• dept_code (Optional)</div>
                </div>
                <p className="text-[10px] text-gray-500">
                  * SGPA, CGPA, and pass status are calculated automatically if not provided. Multiple rows per student are grouped under their registration number.
                </p>
              </div>

              {/* Import Result Feedback */}
              {excelResult && (
                <div className="border border-green-200 bg-green-50/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-green-900 flex items-center gap-1.5 text-sm">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Spreadsheet Import Complete
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-2.5 rounded border border-green-150 text-center">
                      <p className="text-gray-500">Students Created/Updated</p>
                      <p className="text-xl font-bold text-academic-900">{excelResult.studentsImported}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-green-150 text-center">
                      <p className="text-gray-500">Marks Inserted</p>
                      <p className="text-xl font-bold text-academic-900">{excelResult.marksImported}</p>
                    </div>
                  </div>
                  {excelResult.errors && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold text-red-700 flex items-center gap-1 mb-1">
                        <AlertCircle className="h-3.5 w-3.5" /> Warnings / Non-critical Errors ({excelResult.errors.length}):
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-red-600 max-h-32 overflow-y-auto bg-red-50/40 p-2 rounded border border-red-100">
                        {excelResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
