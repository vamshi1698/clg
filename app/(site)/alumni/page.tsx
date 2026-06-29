'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Globe, Users, Heart, Award, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const networkStats = [
  { value: '20,000+', label: 'Global Alumni' },
  { value: '45+', label: 'Countries Represented' },
  { value: '500+', label: 'Industry Leaders' },
  { value: '60+', label: 'Years of Legacy' },
]

const featuredAlumni = [
  {
    name: 'Priya Sharma',
    batch: '2010',
    role: 'VP Engineering, Infosys',
    quote: 'National College gave me the technical foundation and the confidence to climb to the top. I owe my career to the mentors here.',
    img: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Rahul Menon',
    batch: '2005',
    role: 'Founder & CEO, TechBridge',
    quote: 'The entrepreneurship cell at NC gave me my first taste of building something. Today, that small spark has become a 200-person company.',
    img: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Kavitha Nair',
    batch: '2013',
    role: 'Research Scientist, ISRO',
    quote: 'The rigorous science curriculum and the research opportunities at NC gave me everything I needed to chase my dream of reaching the stars.',
    img: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
]

const ways = [
  { icon: Globe, title: 'Global Network', desc: 'Connect with fellow graduates across 45+ countries through our digital alumni platform and regional meetups.' },
  { icon: Heart, title: 'Mentorship Program', desc: 'Guide current students through industry insights, internship referrals, and career coaching sessions.' },
  { icon: Award, title: 'Scholarships & Giving', desc: 'Support the next generation through endowed scholarships, infrastructure donations, and talent programs.' },
  { icon: Briefcase, title: 'Career Opportunities', desc: 'List job openings, offer internships, or host campus recruitment drives through the Alumni Career Portal.' },
  { icon: Calendar, title: 'Events & Reunions', desc: 'Attend annual alumni meets, department reunions, webinars, and the iconic NC Cultural Weekend.' },
  { icon: Users, title: 'Industry Collaborations', desc: 'Partner with departments for live projects, lectures, and industry-aligned curriculum development.' },
]

const upcomingEvents = [
  { title: 'Annual Alumni Meet 2025', date: 'September 14, 2025', type: 'In-Person', location: 'NC Main Campus, Jayanagar' },
  { title: 'Commerce Alumni Networking Night', date: 'August 2, 2025', type: 'In-Person', location: 'Bangalore Club' },
  { title: 'Career Talks: Life in Tech', date: 'July 19, 2025', type: 'Virtual', location: 'Zoom Webinar' },
]

export default function AlumniPage() {
  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80"
            alt="Alumni gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-academic-950 via-academic-950/60 to-academic-950/30" />
        </div>
        <div className="relative container-wide pt-36 pb-16 text-white text-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Our Pride, Our Legacy
            </span>
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-tight mb-6">
              The <span className="text-gold-400">Alumni</span> Network
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              20,000 strong. Spread across the globe. United by one institution. Whether you graduated last year or in 1985 — you're always a part of the National College family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gold-500 py-12">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-academic-950">
          {networkStats.map((s, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="font-display text-4xl md:text-5xl font-bold">{s.value}</div>
              <div className="text-sm font-semibold mt-1 opacity-80 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Notable Alumni */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Voices from Our Network</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Notable Alumni</h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredAlumni.map((alumni, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-60">
                  <img src={alumni.img} alt={alumni.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-academic-950/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-bold text-lg">{alumni.name}</div>
                    <div className="text-gold-400 text-xs font-semibold">Batch of {alumni.batch}</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gold-600 font-semibold text-sm mb-3">{alumni.role}</p>
                  <blockquote className="text-slate-600 text-sm leading-relaxed italic">"{alumni.quote}"</blockquote>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Connect */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Stay Connected</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">How to Engage</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ways.map((way, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-14 h-14 bg-academic-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-academic-100 transition-colors">
                  <way.icon className="h-7 w-7 text-academic-700" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{way.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{way.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-academic-950 text-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">Mark Your Calendar</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">Alumni Events</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                From annual reunions to virtual webinars — stay engaged with your alma mater and reconnect with batchmates who shaped your college years.
              </p>
              <Link href="/events" className="inline-flex items-center gap-2 mt-8 bg-gold-500 text-academic-950 font-bold px-6 py-3 rounded-full hover:bg-gold-400 transition-colors">
                See All Events <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${event.type === 'Virtual' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                        {event.type}
                      </span>
                      <h3 className="font-bold text-white text-lg">{event.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{event.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-gold-400 font-bold text-sm">{event.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gold-50 border-t border-gold-200 text-center">
        <div className="container-wide">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-950 mb-3">Ready to Reconnect?</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg mb-8">
              Join the official Alumni portal, update your profile, and reconnect with your college community in just a few clicks.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-academic-950 text-white font-bold px-7 py-4 rounded-full hover:bg-academic-800 transition-colors">
              Join Alumni Portal <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
