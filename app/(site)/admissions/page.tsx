'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronDown, GraduationCap, FileText, Calendar, CreditCard, Award, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const faqs = [
  { q: 'What is the minimum eligibility for UG programs?', a: 'Candidates must have passed their 10+2 (PUC) from a recognized board with at least 45% aggregate marks. SC/ST candidates have a 5% relaxation.' },
  { q: 'Is there an entrance exam?', a: 'Most UG programs offer merit-based admissions. However, specific PG programs like MBA and MCA may require entrance examinations as specified in their prospectus.' },
  { q: 'Are there scholarships available?', a: 'Yes. We offer Government Post-Matric Scholarships, Merit-based fee waivers, sports scholarships, and several privately funded scholarships. Visit the Financial Aid office for details.' },
  { q: 'Can I apply for hostel accommodation along with admission?', a: 'Yes, hostel applications are processed alongside admission. Seats are limited and allotted on a first-come-first-served basis.' },
  { q: 'What is the refund policy if I withdraw?', a: 'Fees are refundable as per the Bangalore University norms. A nominal administrative charge may be deducted. Contact the accounts office for details.' },
]

export default function AdmissionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const steps = [
    { icon: FileText, title: 'Check Eligibility', desc: 'Review program-specific requirements for your desired course — UG, PG, or Certificate.' },
    { icon: GraduationCap, title: 'Fill Application', desc: 'Complete the online application form at the campus portal with all required documents.' },
    { icon: Award, title: 'Merit Evaluation', desc: 'Our admissions team reviews your academic record, achievements, and application.' },
    { icon: CreditCard, title: 'Pay Fees & Confirm', desc: 'Once selected, pay the enrollment fees to confirm your seat before the deadline.' },
  ]

  const programs = [
    {
      level: 'Undergraduate',
      duration: '3 Years',
      color: 'from-blue-600 to-indigo-700',
      courses: ['B.A. (Humanities)', 'B.Sc. (Science)', 'B.Com (Commerce)', 'BCA (Computer Applications)', 'B.Com (Professional)'],
    },
    {
      level: 'Postgraduate',
      duration: '2 Years',
      color: 'from-academic-800 to-academic-950',
      courses: ['M.A. (History / English)', 'M.Sc. (Mathematics / Physics)', 'M.Com', 'MCA', 'MBA'],
    },
    {
      level: 'Certificate Programs',
      duration: '3-6 Months',
      color: 'from-gold-600 to-amber-700',
      courses: ['Digital Marketing', 'Financial Accounting', 'Tally ERP', 'Spoken English', 'Photography & Media'],
    },
  ]

  const dates = [
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
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Students on campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-academic-950/90 via-academic-950/70 to-transparent" />
        </div>
        <div className="relative container-wide pt-36 pb-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Admissions 2025–26 Open
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

      {/* Admission Steps */}
      <section id="process" className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Simple & Transparent</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">How to Apply</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="absolute -top-4 -left-4 w-9 h-9 bg-gold-500 text-academic-950 rounded-full flex items-center justify-center font-display font-bold text-lg shadow-md">
                  {i + 1}
                </div>
                <div className="w-14 h-14 bg-academic-50 rounded-2xl flex items-center justify-center mb-6 mt-2">
                  <step.icon className="h-7 w-7 text-academic-700" />
                </div>
                <h3 className="font-display text-xl font-bold text-academic-950 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
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
                  <Link href="/courses" className="inline-flex items-center gap-2 mt-6 text-academic-700 font-semibold text-sm hover:text-gold-600 transition-colors">
                    View all courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Dates */}
      <section className="section-padding bg-academic-950 text-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">Don't Miss Out</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">Key Dates & <br />Deadlines</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Mark your calendar for these important milestones. Applying early gives you the best chance of securing your preferred program and accommodation.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 mt-8 bg-gold-500 text-academic-950 font-bold px-6 py-3 rounded-full hover:bg-gold-400 transition-colors">
                Get Admission Help <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="space-y-3">
                {dates.map((d, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/10 border border-white/10 rounded-xl px-6 py-4 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gold-400 shrink-0" />
                      <span className="text-white font-medium">{d.event}</span>
                    </div>
                    <span className="text-gold-300 font-bold text-sm shrink-0 ml-4">{d.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>
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
                  <span className="font-semibold text-academic-950 text-base pr-4">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
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
