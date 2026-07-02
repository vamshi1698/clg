'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, BookOpen, Clock, Users, Award, Info } from 'lucide-react'
import Link from 'next/link'
import { getCourseGradient } from '@/components/courses/courses-page'
import type { Course } from '@/types/database'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const features = [
  { icon: BookOpen, title: 'Choice-Based Credit System (CBCS)', desc: 'Flexible curriculum allowing elective subjects across departments.' },
  { icon: Award, title: 'Autonomous Curriculum', desc: 'Updated every 2 years in alignment with industry needs and NEP 2020.' },
  { icon: Users, title: 'Mentorship Program', desc: 'Every student is assigned a faculty mentor for academic and personal guidance.' },
  { icon: Clock, title: 'Skill-Enhancement Courses', desc: 'Mandatory skill courses in digital literacy, communication, and soft skills.' },
]

export function UndergraduatePageClient({ courses }: { courses: Course[] }) {
  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative pt-44 md:pt-52 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=2000&q=80"
            alt="Undergraduate students"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-academic-950/90 via-academic-950/70 to-transparent" />
        </div>
        <div className="relative container-wide text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Undergraduate Programs
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Your <span className="text-gold-400">Undergraduate</span> Journey Starts Here
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Choose from a wide range of 3-year degree programs across Arts, Science, Commerce, and Technology — all designed to launch successful careers.
            </p>
            <Link href="/admissions" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-7 py-4 rounded-full hover:bg-gold-400 transition-colors">
              Apply Now <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Our Programs</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Undergraduate Degrees</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">All programs are affiliated to Bangalore University and approved by UGC under the autonomous institution framework.</p>
          </motion.div>

          {courses.length > 0 ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-7">
              {courses.map((course, i) => {
                const color = getCourseGradient(course.code)
                const hasStreams = course.core_subjects && course.core_subjects.length > 0
                return (
                  <motion.div
                    key={course.id}
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className={`bg-gradient-to-br ${color} p-7 text-white`}>
                      <BookOpen className="h-9 w-9 mb-4 opacity-80" />
                      <h3 className="font-display text-xl font-bold leading-snug min-h-[3rem] flex items-center">{course.name}</h3>
                      <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{course.duration}</span>
                        {course.seats && (
                          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{course.seats} Seats</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {hasStreams ? (
                          <>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Available Streams</p>
                            <ul className="space-y-2">
                              {course.core_subjects!.slice(0, 5).map((s, j) => (
                                <li key={j} className="flex items-start gap-2 text-slate-700 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{s}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Program Overview</p>
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-5 min-h-[7.5rem]">
                              {course.overview || 'A comprehensive program designed to prepare students for successful careers.'}
                            </p>
                          </>
                        )}
                      </div>
                      <Link href={course?.code ? `/courses/${course.code.toLowerCase()}` : '#'} className="inline-flex items-center gap-1 mt-5 text-academic-700 font-semibold text-sm hover:text-gold-600 transition-colors">
                        Course Details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl max-w-md mx-auto">
              <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h4 className="font-bold text-slate-800 text-sm mb-1">No Programs Found</h4>
              <p className="text-slate-400 text-xs">Undergraduate programs will be listed here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-academic-950 text-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">What Sets Us Apart</span>
            <h2 className="font-display text-4xl font-bold mt-3">Learning at National College</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white/10 border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gold-50 border-t border-gold-200 text-center">
        <div className="container-wide">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl font-bold text-academic-950 mb-3">Ready to Apply?</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg mb-8">Admissions for 2025–26 are open. Secure your seat in your preferred program before the deadline.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admissions" className="inline-flex items-center gap-2 bg-academic-950 text-white font-bold px-7 py-4 rounded-full hover:bg-academic-800 transition-colors">
                Start Application <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-academic-950 text-academic-950 font-bold px-7 py-4 rounded-full hover:bg-academic-950 hover:text-white transition-all">
                Talk to Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
