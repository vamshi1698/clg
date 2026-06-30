'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronDown, GraduationCap, FileText, Calendar, CreditCard, Award, Users, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import type { ImportantDate, Course, Faq } from '@/types/database'
import { submitAdmissionEnquiry } from '@/lib/actions/public-actions'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}



interface AdmissionsPageProps {
  importantDates: ImportantDate[]
  courses: Course[]
  faqs: Faq[]
}

export function AdmissionsPage({ importantDates, courses, faqs }: AdmissionsPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: 'ug',
    courseId: '',
    percentage: '',
    queries: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null)

  const filteredCourses = useMemo(() => {
    if (!courses) return []
    return courses.filter(c => c.level === formData.level)
  }, [courses, formData.level])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    try {
      const res = await submitAdmissionEnquiry(formData)
      if (res?.error) {
        setSubmitStatus({ success: false, message: res.error })
      } else {
        setSubmitStatus({ success: true, message: 'Enquiry submitted successfully! We will get in touch shortly.' })
        setFormData({
          name: '',
          email: '',
          phone: '',
          level: 'ug',
          courseId: '',
          percentage: '',
          queries: ''
        })
      }
    } catch (err: any) {
      setSubmitStatus({ success: false, message: err.message || 'An error occurred while submitting.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { icon: FileText, title: 'Check Eligibility', desc: 'Review program-specific requirements for your desired course — UG, PG, or Certificate.' },
    { icon: GraduationCap, title: 'Fill Application', desc: 'Complete the online application form at the campus portal with all required documents.' },
    { icon: Award, title: 'Merit Evaluation', desc: 'Our admissions team reviews your academic record, achievements, and application.' },
    { icon: CreditCard, title: 'Pay Fees & Confirm', desc: 'Once selected, pay the enrollment fees to confirm your seat before the deadline.' },
  ]

  const programs = useMemo(() => {
    if (!courses) return []
    const ugFromDb = courses.filter(c => c.level === 'ug')
    const pgFromDb = courses.filter(c => c.level === 'pg')
    const diplomaFromDb = courses.filter(c => c.level === 'diploma')
    const certFromDb = courses.filter(c => c.level === 'certificate')

    return [
      {
        level: 'Undergraduate',
        duration: ugFromDb.length > 0 && ugFromDb[0].duration ? ugFromDb[0].duration : '3 Years',
        color: 'from-blue-600 to-indigo-700',
        courses: ugFromDb.length > 0 
          ? ugFromDb.map(c => c.name) 
          : ['B.A. (Humanities)', 'B.Sc. (Science)', 'B.Com (Commerce)', 'BCA (Computer Applications)', 'B.Com (Professional)'],
        href: '/academics/undergraduate',
      },
      {
        level: 'Postgraduate',
        duration: pgFromDb.length > 0 && pgFromDb[0].duration ? pgFromDb[0].duration : '2 Years',
        color: 'from-academic-800 to-academic-950',
        courses: pgFromDb.length > 0 
          ? pgFromDb.map(c => c.name) 
          : ['M.A. (History / English)', 'M.Sc. (Mathematics / Physics)', 'M.Com', 'MCA', 'MBA'],
        href: '/courses',
      },
      {
        level: 'Certificate Programs',
        duration: '3-6 Months',
        color: 'from-gold-600 to-amber-700',
        courses: (diplomaFromDb.length + certFromDb.length) > 0 
          ? [...diplomaFromDb, ...certFromDb].map(c => c.name) 
          : ['Digital Marketing', 'Financial Accounting', 'Tally ERP', 'Spoken English', 'Photography & Media'],
        href: '/academics/undergraduate',
      },
    ]
  }, [courses])

  const displayDates = importantDates && importantDates.length > 0 ? importantDates.map(d => ({
    event: d.event,
    date: new Date(d.date).toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  })) : [
    { event: 'Application Opens', date: 'March 1, 2025' },
    { event: 'Last Date for UG Applications', date: 'June 30, 2025' },
    { event: 'Last Date for PG Applications', date: 'July 15, 2025' },
    { event: 'Merit List Publication', date: 'July 20, 2025' },
    { event: 'Fee Payment Window', date: 'July 21–31, 2025' },
    { event: 'Orientation & Commencement', date: 'August 5, 2025' },
  ]

  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Students on campus"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-academic-950/90 via-academic-950/70 to-transparent" />
        </div>
        <div className="relative container-wide pt-36 pb-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Admissions Open
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Begin Your <span className="text-gold-400">Journey</span> Here
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Take the first step toward a transformative academic career. Discover our programs, process, and everything you need to become part of the National College family.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#programs" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-7 py-4 rounded-full hover:bg-gold-400 transition-colors text-lg">
                View Programs <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#process" className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur text-white font-semibold px-7 py-4 rounded-full hover:bg-white hover:text-academic-950 transition-all text-lg">
                How to Apply
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process & Enquiry Split Section */}
      <section id="process" className="section-padding bg-slate-50 border-b border-slate-100">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Timeline & Dates */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em] block mb-2">Admission Process</span>
                <h2 className="font-display text-4xl font-bold text-academic-950">How to Apply</h2>
              </div>

              {/* Timeline */}
              <div className="relative pl-6 border-l-2 border-blue-100 space-y-8 ml-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Indicator */}
                    <div className="absolute -left-[36px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center z-10 shadow-sm" />
                    <div className="pl-2">
                      <h4 className="font-display text-lg font-bold text-academic-950 flex items-center gap-2">
                        {idx + 1}. {step.title}
                      </h4>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Admission Dates */}
              <div className="pt-8 border-t border-slate-200/60">
                <h3 className="font-display text-2xl font-bold text-academic-950 flex items-center gap-2.5 mb-6">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Important Admission Dates
                </h3>
                <div className="space-y-3">
                  {displayDates.map((d, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border border-slate-200/60 rounded-xl px-5 py-4 shadow-sm hover:shadow transition-shadow">
                      <span className="text-slate-700 font-semibold text-sm">{d.event}</span>
                      <span className="text-blue-600 font-bold text-sm shrink-0 ml-4">{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Admission Enquiry Form Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="font-display text-2xl font-bold text-academic-950">Admission Enquiry</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed mb-6">
                  Submit your details to check course eligibility. Our admissions officer will get in touch with you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* FULL NAME */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* EMAIL & PHONE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LEVEL & PERCENTAGE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Program Level</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value, courseId: '' }))}
                        className="w-full px-3 py-2.5 text-slate-800 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer font-medium"
                      >
                        <option value="ug">Undergraduate (UG)</option>
                        <option value="pg">Postgraduate (PG)</option>
                        <option value="diploma">Diploma</option>
                        <option value="certificate">Certificate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Marks Obtained (%)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">%</span>
                        <input
                          type="number"
                          required
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="85"
                          value={formData.percentage}
                          onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                          className="w-full pl-8 pr-4 py-2.5 text-slate-800 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DESIRED PROGRAM */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Desired Program</label>
                    <select
                      required
                      value={formData.courseId}
                      onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                      className="w-full px-3 py-2.5 text-slate-800 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer font-medium"
                    >
                      <option value="">Select a course...</option>
                      {filteredCourses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.code.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* QUESTIONS / NOTES */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Questions / Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Type any questions here..."
                      value={formData.queries}
                      onChange={(e) => setFormData(prev => ({ ...prev, queries: e.target.value }))}
                      className="w-full px-3 py-2.5 text-slate-800 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Submitting Status Alerts */}
                  {submitStatus && (
                    <div className={`p-3 rounded-xl text-xs font-semibold ${submitStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' : 'bg-red-50 text-red-800 border border-red-250'}`}>
                      {submitStatus.message}
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-academic-900 text-white font-bold rounded-xl hover:bg-gold-600 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting Enquiry...' : 'Submit Application Enquiry'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="section-padding bg-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Choose Your Path</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Programs We Offer</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((prog, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${prog.color} p-8 text-white`}>
                  <GraduationCap className="h-10 w-10 mb-4 opacity-80" />
                  <h3 className="font-display text-2xl font-bold">{prog.level}</h3>
                  <p className="text-white/70 text-sm mt-1">{prog.duration} Program</p>
                </div>
                <div className="bg-white p-6">
                  <ul className="space-y-3">
                    {prog.courses.map((c, j) => (
                      <li key={j} className="flex items-center gap-3 text-slate-700 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-gold-500 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Link href={prog.href} className="inline-flex items-center gap-2 mt-6 text-academic-700 font-semibold text-sm hover:text-gold-600 transition-colors">
                    View all courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Aid Strip */}
      <section className="py-16 bg-gold-50 border-y border-gold-200">
        <div className="container-wide text-center">
          <motion.div {...fadeUp}>
            <Users className="h-12 w-12 text-gold-600 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-academic-950 mb-3">Financial Aid & Scholarships</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-6">
              We believe financial constraints should never stop a deserving student. Explore Government scholarships, merit-based waivers, and specially funded grants.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-7 py-3 rounded-full hover:bg-gold-400 transition-colors">
              Learn About Aid Options <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-wide max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Got Questions?</span>
            <h2 className="font-display text-4xl font-bold text-academic-950 mt-3">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border border-slate-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left p-6 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-academic-950 text-base pr-4">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
