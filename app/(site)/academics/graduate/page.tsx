'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, BookOpen, Clock, Users, Award, Microscope } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const programs = [
  {
    name: 'Master of Commerce (M.Com)',
    duration: '2 Years', seats: 60,
    streams: ['Advanced Accounting & Taxation', 'Business Finance', 'International Trade & Commerce'],
    color: 'from-blue-800 to-indigo-800',
  },
  {
    name: 'Master of Computer Applications (MCA)',
    duration: '2 Years', seats: 60,
    streams: ['Full-Stack Software Development', 'Data Science & Machine Learning', 'Cybersecurity & Networks'],
    color: 'from-slate-800 to-gray-900',
  },
  {
    name: 'Master of Business Administration (MBA)',
    duration: '2 Years', seats: 60,
    streams: ['Finance & Investment Banking', 'Human Resource Management', 'Marketing & Brand Management'],
    color: 'from-gold-700 to-amber-800',
  },
  {
    name: 'Master of Science (M.Sc.)',
    duration: '2 Years', seats: 40,
    streams: ['M.Sc. Mathematics', 'M.Sc. Physics', 'M.Sc. Chemistry'],
    color: 'from-emerald-800 to-teal-800',
  },
  {
    name: 'Master of Arts (M.A.)',
    duration: '2 Years', seats: 40,
    streams: ['M.A. English Literature', 'M.A. History', 'M.A. Political Science'],
    color: 'from-purple-800 to-violet-900',
  },
]

const features = [
  { icon: Microscope, title: 'Research-Oriented', desc: 'Mandatory research project with publication opportunities and conference presentations.' },
  { icon: Award, title: 'Industry Mentors', desc: 'PG students are paired with industry mentors from partnering companies for real-world insight.' },
  { icon: Users, title: 'Small Batch Sizes', desc: 'Intimate class sizes ensure personal attention and deep faculty-student interaction.' },
  { icon: BookOpen, title: 'NEP 2020 Aligned', desc: 'Curriculum designed in full compliance with National Education Policy 2020 guidelines.' },
]

export default function GraduatePage() {
  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=2000&q=80"
            alt="Graduate students"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-academic-950/90 via-academic-950/70 to-transparent" />
        </div>
        <div className="relative container-wide pt-36 pb-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Postgraduate Programs
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Elevate Your <span className="text-gold-400">Graduate</span> Career
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Deepen your expertise with our specialized 2-year postgraduate programs across business, technology, sciences, and humanities.
            </p>
            <Link href="/admissions" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-7 py-4 rounded-full hover:bg-gold-400 transition-colors">
              Apply Now <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PG Programs */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Postgraduate Degrees</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">PG Programs</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">All PG programs are recognized by Bangalore University, UGC, and AICTE (for MBA & MCA). Small cohorts ensure focused learning.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-7">
            {programs.map((prog, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${prog.color} p-7 text-white`}>
                  <BookOpen className="h-9 w-9 mb-4 opacity-80" />
                  <h3 className="font-display text-xl font-bold leading-snug">{prog.name}</h3>
                  <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{prog.duration}</span>
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{prog.seats} Seats</span>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Specializations</p>
                  <ul className="space-y-2">
                    {prog.streams.map((s, j) => (
                      <li key={j} className="flex items-start gap-2 text-slate-700 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link href="/courses" className="inline-flex items-center gap-1 mt-5 text-academic-700 font-semibold text-sm hover:text-gold-600 transition-colors">
                    Course Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Thesis */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=2000&q=80"
            alt="Research"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-academic-950/85" />
        </div>
        <div className="relative container-wide text-center text-white">
          <motion.div {...fadeUp}>
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-3 block">Research First</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Every PG Student Contributes to Research</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8">
              Our PG curriculum mandates a major research project or dissertation in the final year. Top projects receive funding support and are presented at national conferences.
            </p>
            <Link href="/research" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-6 py-3 rounded-full hover:bg-gold-400 transition-colors">
              Explore Our Research <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Why Choose PG at NC?</span>
            <h2 className="font-display text-4xl font-bold text-academic-950 mt-3">What Makes Us Different</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 bg-academic-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-academic-100 transition-colors">
                  <f.icon className="h-6 w-6 text-academic-700" />
                </div>
                <h3 className="font-bold text-academic-950 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-academic-950 text-white text-center">
        <div className="container-wide">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl font-bold mb-3">Take Your Career to the Next Level</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">PG admissions for 2025–26 are open. Apply early to secure your preferred specialization.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admissions" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-7 py-4 rounded-full hover:bg-gold-400 transition-colors">
                Apply for PG <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-4 rounded-full hover:bg-white hover:text-academic-950 transition-all">
                Contact Admissions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
