'use client'

import { motion } from 'framer-motion'
import { Award, BookOpen, Users, Globe, Star, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Leadership, Milestone, Statistics } from '@/types/database'

interface AboutPageProps {
  leadership: Leadership[]
  milestones: Milestone[]
  statistics: Statistics | null
}

export function AboutPage({ leadership, milestones, statistics }: AboutPageProps) {
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7 }
  }

  const values = [
    { icon: BookOpen, title: 'Academic Excellence', desc: 'Rigorous, contemporary curricula that blend theory with real-world application.' },
    { icon: Users, title: 'Inclusive Community', desc: 'A campus that celebrates diversity and ensures every student feels at home.' },
    { icon: Globe, title: 'Global Outlook', desc: 'International partnerships, exchange programs, and industry-aligned learning outcomes.' },
    { icon: Star, title: 'Holistic Growth', desc: 'Beyond academics — sports, arts, leadership, and community engagement.' },
    { icon: Award, title: 'Innovation Culture', desc: 'Encouraging research, critical thinking, and entrepreneurial spirit at every level.' },
    { icon: CheckCircle2, title: 'Ethical Leadership', desc: 'Instilling values, integrity, and a sense of social responsibility in every graduate.' },
  ]

  const accreditations = [
    'NAAC A++ Accredited', 'Bangalore University Affiliated', 'Autonomous Institution',
    'UGC Recognized', 'ISO 9001:2015 Certified', 'NIRF Ranked'
  ]

  const stats = statistics ? [
    { value: `${statistics.years_of_excellence}+`, label: 'Years of Excellence' },
    { value: `${statistics.students_count.toLocaleString()}+`, label: 'Alumni Worldwide' },
    { value: `${statistics.faculty_count}+`, label: 'Faculty Members' },
    { value: `${Math.round(Number(statistics.placement_percentage))}%`, label: 'Placement Rate' },
  ] : [
    { value: '60+', label: 'Years of Excellence' },
    { value: '20,000+', label: 'Alumni Worldwide' },
    { value: '180+', label: 'Faculty Members' },
    { value: '95%', label: 'Placement Rate' },
  ]

  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative pt-44 md:pt-52 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="National College Campus"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-academic-950/85 via-academic-950/70 to-academic-950" />
        </div>
        <div className="relative container-wide text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block border border-gold-500/50 text-gold-400 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Est. 1965 · Bangalore, Karnataka
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Shaping Futures for <span className="text-gold-400">Six Decades</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              From a modest beginning to a landmark institution — National College has been at the forefront of holistic,
              values-driven education that transforms lives and communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-gold-500 py-10">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-academic-950">
          {stats.map((stat, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="font-display text-4xl md:text-5xl font-bold">{stat.value}</div>
              <div className="text-sm font-semibold mt-1 opacity-80 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Details Section (Replaces Vision & Mission) */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Administration</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">College Leadership</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
              Meet the visionary educators and administrators guiding our institution towards academic excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {leadership.map((member, i) => (
              <motion.div
                key={member.id}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center shadow-sm group"
              >
                {/* Image / Avatar Container */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-slate-50 shadow-inner flex items-center justify-center bg-gradient-to-br from-academic-900 via-academic-800 to-academic-950 text-white font-display text-3xl font-bold group-hover:scale-105 transition-transform duration-300">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {member.name
                        .split(' ')
                        .filter(n => !n.includes('.'))
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase() || 'NC'}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-academic-950 mb-1">{member.name}</h3>
                <p className="text-gold-600 font-semibold text-sm mb-3">{member.designation}</p>
                {member.qualification && (
                  <span className="px-3.5 py-1 bg-slate-100 border border-slate-200/50 rounded-full text-slate-600 text-xs font-semibold">
                    {member.qualification}
                  </span>
                )}
                {member.bio && (
                  <p className="text-slate-500 text-sm mt-4 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="text-academic-700 hover:text-gold-600 text-xs font-medium mt-4 transition-colors">
                    {member.email}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Our Journey</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">History & Heritage</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
              Six decades of growth, achievement, and unwavering commitment to education.
            </p>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

            <div className="space-y-12">
              {milestones.map((item, i) => (
                <motion.div
                  key={item.id}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row gap-6 md:gap-0 items-center md:items-start ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className={`md:w-[46%] ${i % 2 === 0 ? 'md:text-right md:pr-10' : 'md:pl-10'}`}>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gold-600 font-bold text-sm">{item.year}</span>
                      <h3 className="font-display text-xl font-bold text-academic-950 mt-1 mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex md:w-[8%] justify-center relative">
                    <div className="w-5 h-5 rounded-full bg-gold-500 border-4 border-white shadow-md ring-2 ring-gold-200 z-10" />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block md:w-[46%]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">What We Stand For</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Our Core Values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-academic-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-academic-100 transition-colors">
                  <val.icon className="h-7 w-7 text-academic-700" />
                </div>
                <h3 className="font-display text-xl font-bold text-academic-950 mb-2">{val.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Photo */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Campus life"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-academic-950/90 to-transparent flex items-center">
          <div className="container-wide text-white">
            <motion.div {...fadeUp}>
              <p className="text-gold-400 text-sm font-bold uppercase tracking-[0.25em] mb-4">Our Campus</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 max-w-lg">A Place Where Potential Comes Alive</h2>
              <p className="text-slate-300 max-w-md leading-relaxed mb-8">
                Spread across acres of verdant land, our campus is designed to inspire learning, collaboration and discovery every single day.
              </p>
              <Link href="/campus-life" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-6 py-3 rounded-full hover:bg-gold-400 transition-colors">
                Explore Campus <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="section-padding bg-academic-950 text-white">
        <div className="container-wide text-center">
          <motion.div {...fadeUp}>
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">Recognition & Accreditation</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-10">Recognized for Excellence</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {accreditations.map((item, i) => (
                <motion.span
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
