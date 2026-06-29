'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, BookOpen, Calendar, Phone, Mail, Bell, Shield, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const portals = [
  { icon: BarChart3, title: 'Academic Progress Portal', desc: 'View your child\'s attendance, grades, internal assessment marks, and semester results in real-time.', color: 'bg-blue-50 text-blue-700' },
  { icon: Bell, title: 'Notice & Alerts', desc: 'Receive SMS and email alerts about fee dues, exam schedules, results, and important college announcements.', color: 'bg-amber-50 text-amber-700' },
  { icon: Calendar, title: 'Academic Calendar', desc: 'Stay informed on exam dates, holiday schedules, fee deadlines, and key college events throughout the year.', color: 'bg-emerald-50 text-emerald-700' },
  { icon: Shield, title: 'Safety & Welfare', desc: 'We maintain 24/7 campus security, student welfare officers, and a dedicated anti-ragging cell for every student\'s safety.', color: 'bg-rose-50 text-rose-700' },
]

const faqs = [
  { q: 'How do I check my child\'s attendance?', a: 'Log in to the Parent Access Portal at portal.nationalcollege.edu.in using the credentials shared at the time of admission. Attendance is updated daily.' },
  { q: 'Who do I contact if I have an urgent concern?', a: 'The Student Welfare Officer is available during college hours. For urgent matters outside office hours, contact the 24x7 helpline at 080-99988877.' },
  { q: 'When are fees due, and how can I pay?', a: 'Fees are due at the beginning of each semester as per the academic calendar. Payment can be made online through the fee portal or via demand draft at the accounts office.' },
  { q: 'How are exam results communicated?', a: 'Results are published on the official college portal and Bangalore University website. SMS alerts are also sent to registered parent mobile numbers.' },
  { q: 'Is there a parent-teacher meeting every semester?', a: 'Yes, formal Parent-Teacher meetings are conducted once per semester. You will receive a prior notice via SMS and email with the date and schedule.' },
]

export default function ParentsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=2000&q=80"
            alt="Parents and family"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-academic-950/90 via-academic-950/60 to-transparent" />
        </div>
        <div className="relative container-wide pt-36 pb-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              For Parents & Families
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Partners in Your <span className="text-gold-400">Child's Journey</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We believe parents are essential partners in a student's success. Find all the tools, information, and support you need to stay involved and informed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Message */}
      <section className="py-16 bg-gold-50 border-b border-gold-200">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <Users className="h-12 w-12 text-gold-600 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-academic-950 mb-4">You're Part of Our Community</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              At National College, we maintain transparent communication with parents throughout the academic year. From real-time grade access to direct faculty contact — we make it easy for you to be involved.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portals & Resources */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Stay Informed</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Resources for Parents</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {portals.map((p, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className={`w-16 h-16 ${p.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <p.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-academic-950 mb-3">{p.title}</h3>
                <p className="text-slate-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Contacts */}
      <section className="section-padding bg-academic-950 text-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">We're Here to Help</span>
            <h2 className="font-display text-4xl font-bold mt-3">Contact Us Directly</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { dept: 'Principal\'s Office', phone: '080-12345670', email: 'principal@nationalcollege.edu.in' },
              { dept: 'Student Welfare Officer', phone: '080-12345681', email: 'welfare@nationalcollege.edu.in' },
              { dept: 'Accounts & Fee Office', phone: '080-12345682', email: 'fees@nationalcollege.edu.in' },
              { dept: 'Examination Cell', phone: '080-12345679', email: 'examcell@nationalcollege.edu.in' },
              { dept: 'Hostel Warden', phone: '080-12345683', email: 'hostel@nationalcollege.edu.in' },
              { dept: '24x7 Campus Helpline', phone: '080-99988877', email: 'helpline@nationalcollege.edu.in' },
            ].map((c, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white/10 border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors"
              >
                <h4 className="font-bold text-white mb-3">{c.dept}</h4>
                <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors text-sm mb-2">
                  <Phone className="h-4 w-4 text-gold-400 shrink-0" /> {c.phone}
                </a>
                <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors text-sm">
                  <Mail className="h-4 w-4 text-gold-400 shrink-0" /> {c.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Common Questions</span>
            <h2 className="font-display text-4xl font-bold text-academic-950 mt-3">FAQ for Parents</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
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
