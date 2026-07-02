'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, BookOpen, Calendar, Library, Users, Heart, Briefcase, 
  Laptop, Phone, Mail, Bell, Shield, AlertCircle, CheckCircle, Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { ImportantDate } from '@/types/database'
import { submitContactMessage } from '@/lib/actions/public-actions'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const resources = [
  { icon: Calendar, title: 'Academic Calendar', desc: 'Semester dates, exam schedules, holidays, and important academic milestones.', href: '#', color: 'from-blue-600 to-indigo-600' },
  { icon: Library, title: 'Library Access', desc: 'Search the physical catalog, access e-journals, and download digital resources.', href: '#', color: 'from-emerald-600 to-teal-600' },
  { icon: Laptop, title: 'Student Portal', desc: 'View grades, attendance, fee status, and download hall tickets.', href: '#', color: 'from-purple-600 to-violet-600' },
  { icon: Users, title: 'Clubs & Societies', desc: 'Join 15+ clubs — from tech and business to arts, sports, and community service.', href: '#', color: 'from-rose-600 to-pink-600' },
  { icon: Briefcase, title: 'Career Guidance', desc: 'Connect with the placement cell, access job boards, and book career counseling sessions.', href: '#', color: 'from-amber-600 to-orange-600' },
  { icon: Heart, title: 'Health & Wellness', desc: 'On-campus medical clinic, mental health counseling, and fitness center access.', href: '#', color: 'from-red-600 to-rose-600' },
  { icon: BookOpen, title: 'Course Materials', desc: 'Download syllabi, lecture notes, and reference books through the academic portal.', href: '#', color: 'from-cyan-600 to-sky-600' },
  { icon: Shield, title: 'Student Rights', desc: 'Know your rights, access grievance redressal, and connect with student representatives.', href: '#', color: 'from-slate-600 to-gray-700' },
]

const importantContacts = [
  { dept: 'Admissions Office', phone: '080-12345678', email: 'admissions@nationalcollege.edu.in' },
  { dept: 'Examination Cell', phone: '080-12345679', email: 'examcell@nationalcollege.edu.in' },
  { dept: 'Placement Cell', phone: '080-12345680', email: 'placements@nationalcollege.edu.in' },
  { dept: 'Student Welfare Officer', phone: '080-12345681', email: 'welfare@nationalcollege.edu.in' },
]

interface StudentsPageProps {
  importantDates: ImportantDate[]
}

export function StudentsPage({ importantDates }: StudentsPageProps) {
  const [reportCategory, setReportCategory] = useState('Ragging / Bullying')
  const [reportSubject, setReportSubject] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus(null)

    if (!reportSubject.trim() || !reportMessage.trim()) {
      setSubmitStatus({ type: 'error', text: 'Please fill out all report fields.' })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitContactMessage({
        name: 'Anonymous Student',
        email: 'anonymous@student.hub',
        phone: '',
        subject: `[Anonymous Report - ${reportCategory}] ${reportSubject.trim()}`,
        message: reportMessage.trim()
      })

      if (res.error) {
        setSubmitStatus({ type: 'error', text: res.error })
      } else {
        setSubmitStatus({ type: 'success', text: 'Your anonymous report has been securely submitted to college administration.' })
        setReportSubject('')
        setReportMessage('')
      }
    } catch (err: any) {
      setSubmitStatus({ type: 'error', text: err.message || 'An unexpected error occurred.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  const displayDates = importantDates && importantDates.length > 0 ? importantDates.map(d => ({
    event: d.event,
    date: new Date(d.date).toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  })) : [
    { event: 'Internal Assessment Tests', date: 'July 15–20, 2025' },
    { event: 'Semester End Exams', date: 'November 3–20, 2025' },
    { event: 'Practical Exams', date: 'October 25–30, 2025' },
    { event: 'Cultural Fest: Udaya 2025', date: 'September 12–14, 2025' },
    { event: 'Sports Week', date: 'August 18–23, 2025' },
  ]

  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative pt-44 md:pt-52 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Students studying"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-academic-950/90 via-academic-950/70 to-transparent" />
        </div>
        <div className="relative container-wide text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Your Campus Hub
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Student <span className="text-gold-400">Resources</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Everything you need to navigate academic life — from portals and calendars to clubs, career support, and wellness services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Quick Access</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">All Your Resources</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {resources.map((res, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  href={res.href}
                  className="block rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg"
                >
                  <div className={`bg-gradient-to-br ${res.color} p-6 text-white`}>
                    <res.icon className="h-8 w-8 mb-3 opacity-90" />
                    <h3 className="font-display text-lg font-bold">{res.title}</h3>
                  </div>
                  <div className="bg-white border border-slate-200 border-t-0 p-5">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{res.desc}</p>
                    <span className="inline-flex items-center gap-1 text-academic-700 font-semibold text-xs group-hover:text-gold-600 transition-colors">
                      Access <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Calendar & Upcoming Dates */}
      <section className="section-padding bg-academic-950 text-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">Stay on Track</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">Key Academic Dates</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Never miss an important deadline. Here are the major academic and co-curricular dates for the academic year.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-3">
              {displayDates.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gold-400 shrink-0" />
                    <span className="text-white font-medium text-sm">{d.event}</span>
                  </div>
                  <span className="text-gold-300 font-bold text-xs shrink-0 ml-4">{d.date}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Anonymous Reporting Portal */}
      <section className="section-padding bg-slate-50 border-t border-slate-200">
        <div className="container-wide max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Safe & Secure</span>
            <h2 className="font-display text-4xl font-bold text-academic-950 mt-3">Anonymous Grievance Portal</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
              Report harassment, infrastructure issues, academic malpractice, bullying, or request wellness/counseling support completely anonymously.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Report Category
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-academic-600 transition-shadow appearance-none cursor-pointer"
                  >
                    <option value="Ragging / Bullying">Ragging / Bullying</option>
                    <option value="Academic Grievance">Academic Grievance</option>
                    <option value="Infrastructure Issue">Infrastructure Issue</option>
                    <option value="Malpractice">Examination / Lab Malpractice</option>
                    <option value="Mental Support Request">Mental Health / Counseling Request</option>
                    <option value="Other">Other Issues</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Brief Subject
                  </label>
                  <input
                    type="text"
                    value={reportSubject}
                    onChange={(e) => setReportSubject(e.target.value)}
                    placeholder="e.g. Issue with lab equipment in Block B"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-academic-600 transition-shadow"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows={5}
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  placeholder="Provide all relevant details here. Remember not to include your name or registration details if you wish to remain anonymous."
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-academic-600 transition-shadow"
                  required
                />
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-xs text-blue-800">
                <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Privacy Protection Guarantee:</span> This portal is designed to protect your privacy. No personal identifier (such as your name, registration ID, email, IP address, or session state) is stored or transmitted. The recipient will see "Anonymous Student" as the sender.
                </div>
              </div>

              {submitStatus && (
                <div className={`flex items-start gap-2.5 p-4 rounded-xl text-sm border ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{submitStatus.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-academic-950 text-white font-semibold rounded-xl hover:bg-academic-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Anonymously...
                  </>
                ) : (
                  'Submit Report Anonymously'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Important Contacts */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Need Help?</span>
            <h2 className="font-display text-4xl font-bold text-academic-950 mt-3">Important Contacts</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {importantContacts.map((contact, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-display text-lg font-bold text-academic-950 mb-4">{contact.dept}</h3>
                <div className="space-y-2">
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-academic-700 transition-colors text-sm">
                    <Phone className="h-4 w-4 text-gold-500 shrink-0" />
                    {contact.phone}
                  </a>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-slate-600 hover:text-academic-700 transition-colors text-sm">
                    <Mail className="h-4 w-4 text-gold-500 shrink-0" />
                    {contact.email}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
