'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, Award, TrendingUp, AlertCircle, Download, Printer, X, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { lookupResults } from '@/lib/actions/public-actions'
import Image from 'next/image'
import logoImage from '@/public/icon.png'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export interface ResultData {
  student: {
    id: string
    name: string
    register_number: string
    course_name?: string
    department_name?: string
    date_of_birth?: string | Date
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
    theory_max_marks: number | null
    theory_min_marks: number | null
    ia_max_marks: number | null
    ia_min_marks: number | null
    total_min_marks: number | null
    grade_points: number | null
    credit_points: number | null
    grade: string | null
    credits: number | null
    result_status: string | null
  }>
  summary: {
    semester: number
    academic_year: string
    examination_type?: string
    sgpa: number | null
    cgpa: number | null
    total_credits: number | null
    earned_credits: number | null
    total_max_marks: number | null
    total_marks_obtained: number | null
    percentage: number | null
    overall_result: string | null
    class_obtained: string | null
    programme_total_max_marks: number | null
    programme_total_marks_obtained: number | null
    programme_total_credits_obtained: number | null
    programme_cgpa: number | null
    programme_grade: string | null
    total_marks_words: string | null
    programme_total_marks_words: string | null
    result_status: string | null
  } | null
}

export interface PdfRecord {
  id: string
  title: string
  academic_year: string
  semester: number
  pdf_filename: string
  created_at: string
}

interface ResultsPageProps {
  initialPdfs?: PdfRecord[]
}

export function ResultsPage({ initialPdfs = [] }: ResultsPageProps) {
  const [registerNumber, setRegisterNumber] = useState('')
  const [dobDay, setDobDay] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobYear, setDobYear] = useState('')
  const [semester, setSemester] = useState('')
  const [examType, setExamType] = useState('SEMESTER END EXAMINATION')
  const [result, setResult] = useState<ResultData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [pdfAnnouncements, setPdfAnnouncements] = useState<PdfRecord[]>(initialPdfs)

  // Grading Helper
  const getGradeFromMarks = (marksScored: number, maxMarks: number) => {
    if (!maxMarks || maxMarks === 0) return 'F';
    const pct = (marksScored / maxMarks) * 100;
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B+';
    if (pct >= 55) return 'B';
    if (pct >= 50) return 'C';
    if (pct >= 40) return 'P';
    return 'F';
  };

  const getPointsFromGrade = (grade: string) => {
    switch (grade?.toUpperCase().trim()) {
      case 'O': return 10;
      case 'A+': return 9;
      case 'A': return 8;
      case 'B+': return 7;
      case 'B': return 6;
      case 'C': return 5;
      case 'P': return 4;
      default: return 0;
    }
  };

  // Enhance individual results with calculated grades/points if missing
  const enhancedResults = result?.results?.map(r => {
    const marksScored = Number(r.total_marks) || 0;
    const maxMarks = Number(r.max_marks) || 100;

    // Auto-calculate grade if missing
    const computedGrade = r.grade && r.grade !== '-' ? r.grade : getGradeFromMarks(marksScored, maxMarks);

    // Auto-calculate grade points if missing
    const computedGradePoints = r.grade_points != null ? Number(r.grade_points) : getPointsFromGrade(computedGrade);

    // Auto-calculate credit points if missing
    const credits = Number(r.credits) || 0;
    const computedCreditPoints = r.credit_points != null ? Number(r.credit_points) : (computedGradePoints * credits);

    return {
      ...r,
      display_grade: computedGrade,
      display_grade_points: computedGradePoints,
      display_credit_points: computedCreditPoints
    };
  }) || [];

  // Calculated fallback fields (fixed string concatenation)
  const calculatedTotalMarks = enhancedResults.reduce((acc, curr) => acc + (Number(curr.total_marks) || 0), 0) || 0;
  const calculatedEarnedCredits = enhancedResults.reduce((acc, curr) => acc + ((curr.result_status?.toUpperCase() === 'PASS' || curr.display_grade !== 'F') ? (Number(curr.credits) || 0) : 0), 0) || 0;
  const calculatedTotalMax = enhancedResults.reduce((acc, curr) => acc + (Number(curr.max_marks) || 100), 0) || 0;
  const calculatedPercentage = calculatedTotalMax > 0 ? ((calculatedTotalMarks / calculatedTotalMax) * 100).toFixed(2) : '-';
  const calculatedOverallResult = enhancedResults.some(r => 
    r.result_status?.toUpperCase() === 'FAIL' || 
    r.result_status?.toUpperCase() === 'ABSENT' || 
    r.display_grade === 'F' || 
    r.display_grade === 'AB'
  ) ? 'FAIL' : 'PASS';

  const totalCreditPoints = enhancedResults.reduce((acc, curr) => acc + curr.display_credit_points, 0) || 0;
  const totalCreditsAtt = enhancedResults.reduce((acc, curr) => acc + (Number(curr.credits) || 0), 0) || 1;
  const calculatedSgpa = calculatedEarnedCredits > 0 ? (totalCreditPoints / totalCreditsAtt).toFixed(2) : '-';

  // Additional Helpers
  const getGradeFromSgpa = (sgpa: number) => {
    const s = Number(sgpa);
    if (isNaN(s)) return '-';
    if (s >= 9.0) return 'O';
    if (s >= 8.0) return 'A+';
    if (s >= 7.0) return 'A';
    if (s >= 6.0) return 'B+';
    if (s >= 5.5) return 'B';
    if (s >= 5.0) return 'C';
    if (s >= 4.0) return 'P';
    return 'F';
  };

  const getClassFromPercentage = (pct: number) => {
    const p = Number(pct);
    if (isNaN(p)) return '-';
    if (p >= 70) return 'FIRST CLASS WITH DISTINCTION';
    if (p >= 60) return 'FIRST CLASS';
    if (p >= 50) return 'SECOND CLASS';
    if (p >= 40) return 'PASS CLASS';
    return 'FAIL';
  };

  const numberToWords = (num: number): string => {
    if (num === 0) return 'ZERO';
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' HUNDRED' + (num % 100 !== 0 ? ' AND ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' THOUSAND' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
    return num.toString();
  };

  // Choose the best values (DB first, fallback second)
  const displayTotalMarks = result?.summary?.total_marks_obtained ?? calculatedTotalMarks;
  const displayEarnedCredits = result?.summary?.earned_credits ?? result?.results?.reduce((acc, curr) => acc + (curr.credits || 0), 0) ?? '-';
  const displayPercentage = result?.summary?.percentage != null ? Number(result.summary.percentage).toFixed(2) : calculatedPercentage;
  const displaySgpa = calculatedSgpa !== '-' ? calculatedSgpa : (result?.summary?.sgpa != null ? Number(result.summary.sgpa).toFixed(2) : '-');
  const displayOverallResult = result?.summary?.result_status ?? calculatedOverallResult;

  // New fallbacks for missing fields
  const displayProgrammeGrade = result?.summary?.programme_grade || (displayOverallResult === 'FAIL' ? 'F' : getGradeFromSgpa(Number(displaySgpa)));
  const displayClassObtained = result?.summary?.class_obtained || (displayOverallResult === 'FAIL' ? 'FAIL' : getClassFromPercentage(Number(displayPercentage)));
  const displayMarksInWords = result?.summary?.total_marks_words || numberToWords(Number(displayTotalMarks));
  const displayProgMarksInWords = result?.summary?.programme_total_marks_words || displayMarksInWords; // Fallback to current sem marks if prog is missing


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!registerNumber.trim() || !dobDay || !dobMonth || !dobYear) {
      setError('Please enter your register number and select your complete date of birth')
      return
    }

    const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`

    startTransition(async () => {
      const res = await lookupResults(registerNumber.trim(), dateOfBirth, semester, examType)
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
    <div className="bg-slate-50/50 min-h-screen">

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-marks-sheet {
            width: 190mm;
            height: 277mm; /* A4 size (297mm) minus 2x10mm margins */
            position: relative;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
          }
          .print-footer-bottom {
            margin-top: auto;
          }
        }
      `}} />

      {/* Hero Section */}
      <section className="relative pt-44 md:pt-52 pb-16 overflow-hidden print:hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Library studying"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-academic-950/75 to-transparent" />
        </div>
        <div className="relative container-wide text-white">
          <motion.div initial="initial" animate="animate" variants={fadeIn} className="max-w-2xl">
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Online Portal
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Examination <span className="text-gold-400">Results</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Check your semester-wise grades and academic statements online, or download official results PDF announcements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="section-padding py-12 lg:py-16 print:py-0 print:my-0">
        <div className="container-wide max-w-6xl print:max-w-none print:p-0 print:m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start print:block">

            {/* Left/Main Column: Search and Result Viewer */}
            <div className="lg:col-span-2 min-w-0 print:w-full space-y-8 print:space-y-0">

              <Card className="border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white print:border-none print:shadow-none print:m-0 print:p-0">
                <CardHeader className="bg-slate-50/70 border-b border-slate-200/60 px-6 py-4 rounded-t-2xl print:hidden">
                  <h2 className="font-display text-lg font-bold text-academic-950">Check Individual Results</h2>
                </CardHeader>
                <CardContent className="p-6 space-y-6 print:p-0">
                  <form onSubmit={handleSearch} className="space-y-6 print:hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Register Number
                        </label>
                        <Input
                          type="text"
                          value={registerNumber}
                          onChange={(e) => setRegisterNumber(e.target.value)}
                          placeholder="Enter your register number"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-academic-650 transition-shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Date of Birth
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {/* Day selector */}
                          <select
                            value={dobDay}
                            onChange={(e) => setDobDay(e.target.value)}
                            className="flex h-11 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-academic-650 text-gray-700 shadow-sm cursor-pointer"
                          >
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>

                          {/* Month selector */}
                          <select
                            value={dobMonth}
                            onChange={(e) => setDobMonth(e.target.value)}
                            className="flex h-11 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-academic-650 text-gray-700 shadow-sm cursor-pointer"
                          >
                            <option value="">Month</option>
                            {[
                              { val: '01', name: 'Jan' },
                              { val: '02', name: 'Feb' },
                              { val: '03', name: 'Mar' },
                              { val: '04', name: 'Apr' },
                              { val: '05', name: 'May' },
                              { val: '06', name: 'Jun' },
                              { val: '07', name: 'Jul' },
                              { val: '08', name: 'Aug' },
                              { val: '09', name: 'Sep' },
                              { val: '10', name: 'Oct' },
                              { val: '11', name: 'Nov' },
                              { val: '12', name: 'Dec' },
                            ].map((m) => (
                              <option key={m.val} value={m.val}>{m.name}</option>
                            ))}
                          </select>

                          {/* Year selector */}
                          <select
                            value={dobYear}
                            onChange={(e) => setDobYear(e.target.value)}
                            className="flex h-11 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-academic-650 text-gray-700 shadow-sm cursor-pointer"
                          >
                            <option value="">Year</option>
                            {Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - 10 - i)).map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Semester
                        </label>
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="flex h-11 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-academic-650 text-gray-700 shadow-sm cursor-pointer"
                        >
                          <option value="">Latest / All</option>
                          {[1, 2, 3, 4, 5, 6].map((s) => (
                            <option key={s} value={s}>Semester {s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Exam Type
                        </label>
                        <select
                          value={examType}
                          onChange={(e) => setExamType(e.target.value)}
                          className="flex h-11 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-academic-650 text-gray-700 shadow-sm cursor-pointer"
                        >
                          <option value="SEMESTER END EXAMINATION">Semester End Examination</option>
                          <option value="SUPPLEMENTARY EXAMINATION">Supplementary Examination</option>
                        </select>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2.5 p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full py-3 bg-academic-950 text-white font-semibold rounded-xl hover:bg-academic-800 transition-colors shadow-sm disabled:opacity-50" disabled={isPending}>
                      {isPending ? (
                        <>Searching...</>
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2 inline-block" />
                          View Results
                        </>
                      )}
                    </Button>
                  </form>

                  {result && (
                    <div className="mt-8 pt-8 border-t border-slate-200/60 print:mt-0 print:pt-0 print:border-none print-marks-sheet">
                      {/* Print-Only Header */}
                      <div className="hidden print:flex flex-col items-center justify-center text-center mb-6 pb-2">
                        <div className="w-full text-center mb-1">
                          <p className="text-[10px] text-gray-600 font-medium">The National Education Society of Karnataka (R.)</p>
                          <div className="flex items-center justify-center w-full mt-2 mb-2">
                            <div className="w-16 h-16 flex-shrink-0 mr-4 flex items-center justify-center">
                              <Image src={logoImage} alt="Logo" width={64} height={64} className="object-contain" priority />
                            </div>
                            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-academic-900 leading-none">
                              THE NATIONAL COLLEGE JAYANAGAR
                            </h1>
                            <div className="w-16 ml-4"></div> {/* Dummy spacer for perfect centering */}
                          </div>
                          <p className="text-[11px] font-semibold tracking-widest">AUTONOMOUS</p>
                          <p className="text-[10px] text-gray-700 font-medium uppercase mt-0.5">NAAC ACCREDITED - 'A' GRADE</p>
                          <p className="text-[10px] text-gray-700">Affiliated to Bangalore University</p>
                          <p className="text-[9px] text-gray-500">36th B Cross, 7th Block, Jayanagar, Bengaluru - 560 070</p>
                        </div>

                        <div className="w-full border-b border-gray-400 my-2"></div>
                        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-academic-900 mt-1 underline">
                          STATEMENT OF MARKS
                        </h2>
                        <h3 className="text-[11px] font-semibold mt-1 uppercase">
                          {result?.summary?.semester === 1 ? 'I' : result?.summary?.semester === 2 ? 'II' : result?.summary?.semester === 3 ? 'III' : result?.summary?.semester === 4 ? 'IV' : result?.summary?.semester === 5 ? 'V' : result?.summary?.semester === 6 ? 'VI' : (result?.summary?.semester || '')} SEMESTER - {result?.summary?.examination_type || 'SEMESTER END EXAMINATION'}
                        </h3>
                      </div>

                      {/* Student Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 md:gap-y-1 p-4 bg-gray-50 print:bg-white rounded-lg print:rounded-none border border-gray-100 print:border-none print:py-1 print:my-1 text-xs md:text-sm print:text-[11px]">
                        <div className="flex flex-col sm:flex-row"><span className="w-full sm:w-32 font-semibold text-gray-500 sm:text-gray-900">Academic Year</span><span className="hidden sm:inline">: </span><span className="sm:ml-1">{result?.summary?.academic_year || '-'}</span></div>
                        <div className="flex flex-col sm:flex-row"><span className="w-full sm:w-32 font-semibold text-gray-500 sm:text-gray-900">Programme Name</span><span className="hidden sm:inline">: </span><span className="uppercase font-bold sm:ml-1">{result?.student?.course_name || '-'}</span></div>
                        <div className="flex flex-col sm:flex-row"><span className="w-full sm:w-32 font-semibold text-gray-500 sm:text-gray-900">Register No.</span><span className="hidden sm:inline">: </span><span className="uppercase font-bold sm:ml-1">{result?.student?.register_number}</span></div>
                        <div className="flex flex-col sm:flex-row"><span className="w-full sm:w-32 font-semibold text-gray-500 sm:text-gray-900">Student Name</span><span className="hidden sm:inline">: </span><span className="uppercase font-bold sm:ml-1">{result?.student?.name}</span></div>
                        <div className="flex flex-col sm:flex-row"><span className="w-full sm:w-32 font-semibold text-gray-500 sm:text-gray-900">Date of Birth</span><span className="hidden sm:inline">: </span><span className="uppercase font-bold sm:ml-1">{result?.student?.date_of_birth ? new Date(result.student.date_of_birth).toLocaleDateString('en-GB').replace(/\//g, '-') : '-'}</span></div>
                        <div className="flex flex-col sm:flex-row"><span className="w-full sm:w-32 font-semibold text-gray-500 sm:text-gray-900">Exam Type</span><span className="hidden sm:inline">: </span><span className="uppercase font-bold sm:ml-1">{result?.summary?.examination_type || 'SEMESTER END EXAMINATION'}</span></div>
                      </div>

                      {/* Results Table */}
                      {result?.results && result.results.length > 0 ? (
                        <div className="overflow-x-auto border border-gray-300 rounded-lg print:border-gray-400 print:rounded-none print:my-2">
                          <table className="w-full text-[9px] md:text-xs lg:text-sm print:text-[9px] border-collapse">
                            <thead className="bg-gray-50 print:bg-gray-100 border-b print:border-gray-400 text-academic-900">
                              <tr>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-6">Sl.<br />No</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-2 py-1 text-left font-bold w-20">Subject/Code</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-2 py-1 text-left font-bold">Subject/Paper</th>
                                <th colSpan={3} className="border-r border-b print:border-gray-400 px-1 py-1 text-center font-bold">Theory / Practical</th>
                                <th colSpan={3} className="border-r border-b print:border-gray-400 px-1 py-1 text-center font-bold">IA/Viva</th>
                                <th colSpan={3} className="border-r border-b print:border-gray-400 px-1 py-1 text-center font-bold">Total</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-6">Cr.</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-8">Gr.<br />Pts.</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-8">Cr. Pts.</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-10">Letter<br />Grade</th>
                                <th rowSpan={2} className="px-2 py-1 text-center font-bold w-12">Remarks</th>
                              </tr>
                              <tr>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Max.<br />Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Min.<br />Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Marks<br />Scored</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Max.<br />Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Min.<br />Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Marks<br />Scored</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Max.<br />Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Min.<br />Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Marks<br />Scored</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y print:divide-gray-400 font-medium">
                              {enhancedResults.map((r, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{i + 1}</td>
                                  <td className="border-r print:border-gray-400 px-2 py-1 uppercase">{r.subject_code}</td>
                                  <td className="border-r print:border-gray-400 px-2 py-1 uppercase">{r.subject_name}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.theory_max_marks ?? 60}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.theory_min_marks ?? 21}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.external_marks ?? '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.ia_max_marks ?? 40}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.ia_min_marks ?? 14}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.internal_marks ?? '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.max_marks ?? 100}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.total_min_marks ?? 35}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.total_marks ?? '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.credits ?? '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.display_grade_points.toFixed(2)}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.display_credit_points.toFixed(2)}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.display_grade || '-'}</td>
                                  <td className="px-2 py-1 text-center uppercase">{r.result_status || '-'}</td>
                                </tr>
                              ))}
                              {/* Grand Total Row */}
                              <tr className="bg-gray-50 print:bg-gray-100 font-bold border-t-2 print:border-gray-400">
                                <td colSpan={11} className="border-r print:border-gray-400 px-2 py-1 text-left">Grand Total</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{displayTotalMarks}</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{displayEarnedCredits}</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center bg-gray-200 print:bg-gray-200"></td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{totalCreditPoints.toFixed(2)}</td>
                                <td colSpan={2} className="px-2 py-1 text-center bg-gray-200 print:bg-gray-200"></td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 border-t print:border-gray-400 bg-gray-50 print:bg-gray-100 px-2 py-2 md:py-1 text-[10px] md:text-xs lg:text-sm print:text-[10px] font-bold">
                            <div>Total Marks Secured in Words: <span className="font-normal block sm:inline">{displayMarksInWords}</span></div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full md:w-auto mt-2 md:mt-0">
                              <div>Percentage: <span className="font-normal">{displayPercentage}</span></div>
                              <div>SGPA: <span className="font-normal">{displaySgpa}</span></div>
                              <div>Grade: <span className="font-normal">{displayProgrammeGrade}</span></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No results details available yet.</p>
                        </div>
                      )}

                      {/* Final Footer Row */}
                      <div className="border border-gray-400 p-2 md:p-1 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] md:text-xs lg:text-sm print:text-[10px] font-bold mt-2 gap-2 md:gap-0">
                        <div>Marks Secured in Words : <span className="font-normal block sm:inline">{displayProgMarksInWords}</span></div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full md:w-auto mt-2 md:mt-0">
                          <div className="border-none md:border-l border-gray-400 md:pl-2">Overall Percentage : <span className="font-normal">{displayPercentage}</span></div>
                          <div className="border-none md:border-l border-gray-400 md:pl-2">Overall Result : <span className="font-normal uppercase">{displayOverallResult}</span></div>
                          <div className="border-none md:border-l border-gray-400 md:pl-2">Class : <span className="font-normal uppercase">{displayClassObtained}</span></div>
                        </div>
                      </div>

                      {/* Print-Only Signature & Verification Block */}
                      <div className="hidden print:grid grid-cols-3 gap-4 pt-12 mt-2 text-[11px] justify-items-center w-full print-footer-bottom">
                        <div className="flex flex-col items-center justify-end h-16 w-32 relative">
                          {/* We can place the college seal image here if available, currently using a placeholder */}
                          <div className="absolute -top-4 w-20 h-20 border-2 border-academic-900 rounded-full flex items-center justify-center opacity-30 pointer-events-none transform -rotate-12">
                            <span className="text-center text-[7px] leading-tight font-bold text-academic-900">THE NATIONAL COLLEGE<br />AUTONOMOUS</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-end h-16">
                          <div className="border-t border-gray-800 w-32 text-center pt-1 font-bold text-academic-900">
                            Principal
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-end h-16">
                          <div className="border-t border-gray-800 w-40 text-center pt-1 font-bold text-academic-900">
                            Controller of Examinations
                          </div>
                        </div>

                        <div className="col-span-3 text-left w-full text-[9px] font-bold text-gray-700 mt-2">
                          M.C.No : -<br />
                          Printed Date : {new Date().toLocaleDateString('en-GB')}
                        </div>
                      </div>

                      {/* Print Actions */}
                      <div className="flex justify-end gap-4 print:hidden">
                        <Button onClick={handlePrint} className="bg-academic-950 text-white hover:bg-academic-900 font-semibold rounded-xl">
                          <Printer className="h-4 w-4 mr-2" />
                          Print Result Sheet
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Right Column: Downloadable Announcements */}
            <div className="space-y-6 min-w-0 print:hidden">
              <Card className="border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardHeader className="bg-slate-50/70 border-b border-slate-200/60 px-6 py-4 rounded-t-2xl">
                  <CardTitle className="font-display text-base font-bold text-academic-950 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold-500" />
                    Official Announcements
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
                          className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-gold-500 hover:bg-slate-50 bg-white transition-all group shadow-sm hover:shadow"
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
                      <p className="text-xs">No official announcements posted at this time.</p>
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
