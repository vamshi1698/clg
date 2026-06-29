'use client'

import { motion } from 'framer-motion'
import { Award, GraduationCap, Globe, Zap, ShieldCheck, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7 }
}

const reasons = [
  { icon: Award, title: 'NAAC A++ Accredited', desc: 'Among the top-rated autonomous institutions in Karnataka, recognized for academic quality and governance.' },
  { icon: GraduationCap, title: '95% Placement Rate', desc: 'An industry-leading placement record built on strong recruiter relationships and a dedicated career cell.' },
  { icon: Globe, title: 'Global Alumni Network', desc: 'Over 20,000 alumni across 45+ countries — a community that opens doors wherever you go.' },
  { icon: Zap, title: 'Industry-Ready Curriculum', desc: 'Our autonomous status lets us update curricula every 2 years to stay ahead of industry demands.' },
  { icon: ShieldCheck, title: 'Safe, Inclusive Campus', desc: '24/7 security, anti-ragging cell, gender sensitization programs, and a robust student welfare system.' },
  { icon: TrendingUp, title: '60 Years of Excellence', desc: 'A six-decade legacy of producing leaders in business, science, government, technology, and the arts.' },
]

const campusHighlights = [
  { label: 'Main Campus', img: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80' },
  { label: 'Science Labs', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Library', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sports Ground', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80' },
]

export function WhyChooseUs() {
  return (
    <>
      {/* Why Choose Section */}
      <section className="section-padding bg-academic-950 text-white overflow-hidden">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-3 block">
                Why Students Choose Us
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
                More Than a College. <br /> <span className="text-gold-400">A Launchpad.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                For over six decades, National College has been where ambitious students transform into accomplished professionals. 
                Here's what sets us apart.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-6 py-3 rounded-full hover:bg-gold-400 transition-colors"
              >
                Learn More About Us
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {reasons.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center mb-3">
                    <r.icon className="h-5 w-5 text-gold-400" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{r.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{r.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Campus Photo Strip */}
      <section className="bg-slate-950 py-12 overflow-hidden">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-8">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">Our Campus</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">Explore Our World-Class Facilities</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {campusHighlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl overflow-hidden group aspect-square"
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-white font-bold text-sm">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
