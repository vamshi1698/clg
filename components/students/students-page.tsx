'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, BookOpen, Calendar, Library, Users, Heart, Briefcase, 
  Laptop, Phone, Mail, Bell, Shield
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { ImportantDate } from '@/types/database'

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
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
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
        <div className="relative container-wide pt-36 pb-16 text-white">
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
