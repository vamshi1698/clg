'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Globe, Users, Heart, Award, Briefcase, Calendar, Star, LucideProps } from 'lucide-react'
import Link from 'next/link'
import type { AlumniStat, AlumniWay, Testimonial, Event } from '@/types/database'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

// Map icon string names to Lucide components
type IconComponent = React.FC<LucideProps>
const lucideIconMap: Record<string, IconComponent> = {
  Globe, Users, Heart, Award, Briefcase, Calendar, Star,
  ArrowRight,
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = lucideIconMap[name] || Users
  return <Icon className={className} />
}

interface AlumniPageProps {
  alumniStats: AlumniStat[]
  alumniWays: AlumniWay[]
  testimonials: Testimonial[]
  upcomingEvents: Event[]
}

// Fallback data if CMS has no entries yet
const fallbackStats = [
  { id: '1', value: '20,000+', label: 'Global Alumni', sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: '2', value: '45+', label: 'Countries Represented', sort_order: 2, is_active: true, created_at: '', updated_at: '' },
  { id: '3', value: '500+', label: 'Industry Leaders', sort_order: 3, is_active: true, created_at: '', updated_at: '' },
  { id: '4', value: '60+', label: 'Years of Legacy', sort_order: 4, is_active: true, created_at: '', updated_at: '' },
]

const fallbackWays = [
  { id: '1', icon: 'Globe', title: 'Global Network', description: 'Connect with fellow graduates across 45+ countries through our digital alumni platform and regional meetups.', sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: '2', icon: 'Heart', title: 'Mentorship Program', description: 'Guide current students through industry insights, internship referrals, and career coaching sessions.', sort_order: 2, is_active: true, created_at: '', updated_at: '' },
  { id: '3', icon: 'Award', title: 'Scholarships & Giving', description: 'Support the next generation through endowed scholarships, infrastructure donations, and talent programs.', sort_order: 3, is_active: true, created_at: '', updated_at: '' },
  { id: '4', icon: 'Briefcase', title: 'Career Opportunities', description: 'List job openings, offer internships, or host campus recruitment drives through the Alumni Career Portal.', sort_order: 4, is_active: true, created_at: '', updated_at: '' },
  { id: '5', icon: 'Calendar', title: 'Events & Reunions', description: 'Attend annual alumni meets, department reunions, webinars, and the iconic NC Cultural Weekend.', sort_order: 5, is_active: true, created_at: '', updated_at: '' },
  { id: '6', icon: 'Users', title: 'Industry Collaborations', description: 'Partner with departments for live projects, lectures, and industry-aligned curriculum development.', sort_order: 6, is_active: true, created_at: '', updated_at: '' },
]

export function AlumniPage({ alumniStats, alumniWays, testimonials, upcomingEvents }: AlumniPageProps) {
  const stats = alumniStats.length > 0 ? alumniStats : fallbackStats
  const ways = alumniWays.length > 0 ? alumniWays : fallbackWays
  const featuredTestimonials = testimonials.slice(0, 3)

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
              {stats[0]?.value || '20,000'} strong. Spread across the globe. United by one institution. Whether you graduated last year or in 1985 — you're always a part of the National College family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gold-500 py-12">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-academic-950">
          {stats.map((s, i) => (
            <motion.div key={s.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="font-display text-4xl md:text-5xl font-bold">{s.value}</div>
              <div className="text-sm font-semibold mt-1 opacity-80 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Notable Alumni (from CMS Testimonials) */}
      {featuredTestimonials.length > 0 && (
        <section className="section-padding bg-slate-50">
          <div className="container-wide">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Voices from Our Network</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Notable Alumni</h2>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {featuredTestimonials.map((alumni, i) => (
                <motion.div
                  key={alumni.id}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-60">
                    {alumni.image_url ? (
                      <img src={alumni.image_url} alt={alumni.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-academic-700 to-academic-950 flex items-center justify-center">
                        <span className="text-white/20 font-display font-bold text-7xl select-none">
                          {alumni.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-academic-950/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="font-bold text-lg">{alumni.name}</div>
                      {alumni.batch_year && (
                        <div className="text-gold-400 text-xs font-semibold">Batch of {alumni.batch_year}</div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    {(alumni.designation || alumni.company) && (
                      <p className="text-gold-600 font-semibold text-sm mb-3">
                        {[alumni.designation, alumni.company].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <blockquote className="text-slate-600 text-sm leading-relaxed italic">"{alumni.content}"</blockquote>
                    {alumni.rating && (
                      <div className="flex gap-1 mt-3">
                        {Array.from({ length: alumni.rating }).map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 text-gold-400 fill-gold-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                key={way.id}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-14 h-14 bg-academic-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-academic-100 transition-colors">
                  <DynamicIcon name={way.icon} className="h-7 w-7 text-academic-700" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{way.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{way.description}</p>
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
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white/10 border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {event.category && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${
                          event.category === 'virtual' || event.venue?.toLowerCase().includes('zoom')
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {event.venue?.toLowerCase().includes('zoom') ? 'Virtual' : 'In-Person'}
                        </span>
                      )}
                      <h3 className="font-bold text-white text-lg">{event.title}</h3>
                      {event.venue && <p className="text-slate-400 text-sm mt-1">{event.venue}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-gold-400 font-bold text-sm">
                        {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="bg-white/10 border border-white/10 rounded-2xl p-6 text-center text-slate-400 text-sm">
                  No upcoming events scheduled yet. Check back soon!
                </div>
              )}
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
