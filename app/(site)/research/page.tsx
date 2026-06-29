'use client'

import { motion } from 'framer-motion'
import { ArrowRight, FlaskConical, BookOpen, Microscope, Trophy, Users, Globe, Lightbulb } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const stats = [
  { value: '50+', label: 'Research Projects' },
  { value: '120+', label: 'Published Papers' },
  { value: '8', label: 'Research Centers' },
  { value: '₹2Cr+', label: 'Research Funding' },
]

const focusAreas = [
  { icon: Microscope, title: 'Life Sciences', desc: 'Cutting-edge research in biotechnology, microbiology, and environmental science.', color: 'bg-green-50 text-green-700' },
  { icon: FlaskConical, title: 'Applied Chemistry', desc: 'Industrial chemistry, organic synthesis, and materials science research initiatives.', color: 'bg-blue-50 text-blue-700' },
  { icon: Lightbulb, title: 'Computing & AI', desc: 'Machine learning, data analytics, and applied artificial intelligence projects.', color: 'bg-purple-50 text-purple-700' },
  { icon: BookOpen, title: 'Humanities & Social', desc: 'Historical studies, linguistics, socioeconomics, and cultural heritage research.', color: 'bg-amber-50 text-amber-700' },
  { icon: Globe, title: 'Environmental Studies', desc: 'Sustainability, climate adaptation, and resource management initiatives.', color: 'bg-emerald-50 text-emerald-700' },
  { icon: Trophy, title: 'Business Research', desc: 'Market analysis, organizational behavior, and entrepreneurship research.', color: 'bg-rose-50 text-rose-700' },
]

const projects = [
  {
    title: 'AI-Based Crop Disease Detection',
    dept: 'Department of Computer Science',
    status: 'Ongoing',
    team: '12 Students, 3 Faculty',
    desc: 'Developing a mobile app using CNN to detect crop diseases from photos, helping Karnataka farmers with early diagnosis.',
  },
  {
    title: 'Phytoremediation of Urban Soil',
    dept: 'Department of Botany & Environmental Science',
    status: 'Published',
    team: '8 Students, 2 Faculty',
    desc: 'Research on using native plant species to restore heavy-metal contaminated urban soils around Bengaluru.',
  },
  {
    title: 'Digital Financial Literacy in Rural Karnataka',
    dept: 'Department of Commerce & Management',
    status: 'Ongoing',
    team: '10 Students, 4 Faculty',
    desc: 'Field study on barriers and enablers of digital payment adoption in rural Karnataka districts.',
  },
]

export default function ResearchPage() {
  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Research Laboratory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-academic-950/92 via-academic-950/70 to-transparent" />
        </div>
        <div className="relative container-wide pt-36 pb-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Innovation & Inquiry
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Pioneering <span className="text-gold-400">Research</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              At National College, we believe curiosity is the engine of progress. Our research culture empowers students and faculty to investigate, innovate, and impact the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-academic-950 py-12 border-t border-white/10">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="font-display text-4xl md:text-5xl font-bold text-gold-400">{s.value}</div>
              <div className="text-slate-400 text-sm mt-2 uppercase tracking-wider font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Focus Areas */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Our Areas of Expertise</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Research Focus Areas</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusAreas.map((area, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${area.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <area.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-academic-950 mb-2">{area.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Labs Image */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581093196277-9f6e9b964731?auto=format&fit=crop&w=2000&q=80"
          alt="Research labs"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-academic-950/90 to-transparent flex items-center justify-end">
          <div className="container-wide text-right text-white">
            <motion.div {...fadeUp}>
              <p className="text-gold-400 text-sm font-bold uppercase tracking-[0.25em] mb-4">Our Infrastructure</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 max-w-lg ml-auto">
                State-of-the-Art Research Labs
              </h2>
              <p className="text-slate-300 max-w-md ml-auto leading-relaxed">
                Equipped with modern instruments, digital resources, and collaborative workspaces to fuel discovery.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Making an Impact</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Featured Projects</h2>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-academic-900 to-academic-950 p-8 text-white">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 ${project.status === 'Published' ? 'bg-green-500/20 text-green-300' : 'bg-gold-500/20 text-gold-300'}`}>
                    {project.status}
                  </span>
                  <h3 className="font-display text-xl font-bold leading-snug">{project.title}</h3>
                </div>
                <div className="bg-white p-6">
                  <p className="text-gold-600 font-semibold text-xs uppercase tracking-wide mb-3">{project.dept}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{project.desc}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Users className="h-4 w-4" />
                    <span>{project.team}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gold-50 border-t border-gold-200">
        <div className="container-wide text-center">
          <motion.div {...fadeUp}>
            <FlaskConical className="h-12 w-12 text-gold-600 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-950 mb-3">Want to Collaborate?</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg mb-8">
              We welcome industry collaborations, faculty exchange programs, and joint research initiatives. Let's build knowledge together.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-academic-950 text-white font-bold px-7 py-4 rounded-full hover:bg-academic-800 transition-colors">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
