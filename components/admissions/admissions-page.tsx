'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  CheckCircle,
  Calendar,
  GraduationCap,
  Phone,
  Mail,
  User,
  Award,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react'
import type { Course, ImportantDate } from '@/types/database'
import { submitAdmissionEnquiry } from '@/lib/actions/public-actions'

interface AdmissionsPageProps {
  courses: Course[]
  importantDates?: ImportantDate[]
}

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
}

export function AdmissionsPage({ courses, importantDates = [] }: AdmissionsPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: 'ug',
    courseId: '',
    percentage: '',
    queries: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter courses based on selected level
  const filteredCourses = courses.filter(c => c.level === formData.level)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await submitAdmissionEnquiry(formData)
      if (res.error) {
        setError(res.error)
      } else {
        setIsSubmitted(true)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: 'Online Enquiry',
      desc: 'Submit the application enquiry form with your academic details and preferences.'
    },
    {
      title: 'Document Submission',
      desc: 'Upload/submit copies of Class 10/12 marks cards, transfer certificate, and identification.'
    },
    {
      title: 'Counseling & Interview',
      desc: 'Attend the interactive counseling session and personal interview with our admission panel.'
    },
    {
      title: 'Fee Payment & Confirmation',
      desc: 'Secure your admission seat by paying the prescribed registration and tuition fee.'
    }
  ]

  const dates = importantDates.length > 0
    ? importantDates.map((d) => ({
      event: d.event,
      date: new Date(d.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    }))
    : [
      { event: 'Online Application Opens', date: 'June 1, 2026' },
      { event: 'Last Date to Submit Enquiry', date: 'July 15, 2026' },
      { event: 'First Counseling Merit List', date: 'July 20, 2026' },
      { event: 'Commencement of Classes', date: 'August 1, 2026' }
    ]

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-academic-900 py-16 lg:py-24 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.span
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/20 border border-gold-500/35 rounded-full text-gold-500 text-xs sm:text-sm font-semibold mb-6 tracking-wide"
            >
              <Award className="h-4 w-4" />
              Admissions Open 2026-27
            </motion.span>
            <motion.h1 variants={fadeIn} className="font-display text-4xl md:text-5xl font-extrabold text-white mb-6">
              Shape Your Future With Us
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Join a legacy of academic excellence, top placements, and holistic development. Explore our UG, PG, and Diploma programs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16 bg-slate-50/30">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Guidelines & Process (col-span-7) */}
            <div className="lg:col-span-7 space-y-10">

              {/* Process */}
              <div>
                <h2 className="font-display text-2xl font-bold text-academic-900 mb-6 flex items-center gap-2.5">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  Admission Process
                </h2>
                <div className="relative pl-6 space-y-8">
                  {/* vertical step line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-slate-200" />

                  {steps.map((step, index) => (
                    <div key={index} className="relative flex gap-4">
                      {/* number dot */}
                      <div className="absolute -left-[25px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 mb-1">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div>
                <h2 className="font-display text-2xl font-bold text-academic-900 mb-6 flex items-center gap-2.5">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Important Admission Dates
                </h2>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {dates.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4">
                        <span className="font-semibold text-slate-700 text-xs sm:text-sm">{item.event}</span>
                        <span className="text-blue-600 font-bold text-xs sm:text-sm bg-blue-50/50 px-3 py-1 rounded-lg border border-blue-100/30">
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Admission Form (col-span-5) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                        Admission Enquiry
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-normal">
                        Submit your details to check course eligibility. Our admissions officer will get in touch with you shortly.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="John Doe"
                              className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                            <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                            <div className="relative">
                              <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                                className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                              />
                              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                            <div className="relative">
                              <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="9876543210"
                                className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                              />
                              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        </div>

                        {/* Level & Percentage */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Program Level</label>
                            <select
                              value={formData.level}
                              onChange={(e) => setFormData({ ...formData, level: e.target.value, courseId: '' })}
                              className="w-full px-3 py-2.5 text-slate-800 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="ug">Undergraduate (UG)</option>
                              <option value="pg">Postgraduate (PG)</option>
                              <option value="diploma">Diploma</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Marks Obtained (%)</label>
                            <div className="relative">
                              <input
                                type="number"
                                required
                                min="35"
                                max="100"
                                value={formData.percentage}
                                onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                                placeholder="85"
                                className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                              />
                              <Percent className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        </div>

                        {/* Course */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Desired Program</label>
                          <select
                            required
                            value={formData.courseId}
                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                            className="w-full px-3 py-2.5 text-slate-800 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                          >
                            <option value="">Select a course...</option>
                            {filteredCourses.map(course => (
                              <option key={course.id} value={course.id}>
                                {course.name} ({course.code.toUpperCase()})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Queries */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Questions / Notes</label>
                          <textarea
                            rows={3}
                            value={formData.queries}
                            onChange={(e) => setFormData({ ...formData, queries: e.target.value })}
                            placeholder="Type any questions here..."
                            className="w-full px-3 py-2.5 text-slate-800 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                          />
                        </div>

                        {error && (
                          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
                            {error}
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-[#0F2D52] hover:bg-[#163D6C] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            'Submit Application Enquiry'
                          )}
                        </button>

                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                        Enquiry Submitted!
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                        Thank you for your interest, <strong className="text-slate-700">{formData.name}</strong>. Our admissions counseling officer will review your score (<strong className="text-slate-700">{formData.percentage}%</strong>) and get in touch with you shortly.
                      </p>

                      <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100/50 space-y-3 mb-6">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">What's Next?</h4>
                        <div className="flex gap-2.5 text-xs text-slate-600">
                          <ChevronRight className="w-4 h-4 shrink-0 text-blue-500" />
                          <span>Check your inbox for the welcome pack.</span>
                        </div>
                        <div className="flex gap-2.5 text-xs text-slate-600">
                          <ChevronRight className="w-4 h-4 shrink-0 text-blue-500" />
                          <span>Ensure your documents are ready.</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setFormData({ name: '', email: '', phone: '', level: 'ug', courseId: '', percentage: '', queries: '' })
                          setIsSubmitted(false)
                        }}
                        className="w-full py-2.5 border border-slate-200 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-xl transition-all"
                      >
                        Submit Another Enquiry
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
