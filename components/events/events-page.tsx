'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Event } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

interface EventsPageProps {
  events: Event[]
}

export function EventsPage({ events }: EventsPageProps) {
  const upcomingEvents = events.filter(e => e.is_upcoming)
  const pastEvents = events.filter(e => !e.is_upcoming)

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-academic-900 pt-44 md:pt-52 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.h1 variants={fadeIn} className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Events & Activities
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-400 text-lg max-w-3xl mx-auto">
              Discover upcoming events, workshops, seminars, and cultural programs at National College.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <h2 className="font-display text-3xl font-bold text-academic-900 mb-8">Upcoming Events</h2>
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {upcomingEvents.map((event) => (
                <motion.div key={event.id} variants={fadeIn}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-wide">
            <h2 className="font-display text-3xl font-bold text-academic-900 mb-8">Past Events</h2>
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {pastEvents.map((event) => (
                <motion.div key={event.id} variants={fadeIn}>
                  <EventCard event={event} isPast />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {events.length === 0 && (
        <section className="section-padding">
          <div className="container-wide text-center">
            <p className="text-gray-500">No events found.</p>
          </div>
        </section>
      )}
    </div>
  )
}

interface EventCardProps {
  event: Event
  isPast?: boolean
}

function EventCard({ event, isPast = false }: EventCardProps) {
  const eventDate = new Date(event.event_date)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleDateString('en-IN', { month: 'short' })
  const year = eventDate.getFullYear()

  return (
    <Link 
      href={`/events/${event.slug}`}
      className={`group flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isPast ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      {/* Image Header */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-academic-800 to-academic-950 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Floating Date Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-lg border border-white/20">
          <div className="text-academic-600 text-[10px] font-bold uppercase tracking-wider leading-none mb-1">{month}</div>
          <div className="text-academic-950 text-xl font-display font-bold leading-none">{day}</div>
        </div>

        {/* Categories / Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {event.is_featured && (
            <span className="px-2.5 py-1 bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              Featured
            </span>
          )}
          {event.category && (
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              {event.category}
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-xl font-bold text-academic-900 mb-3 group-hover:text-academic-700 transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        {event.description && (
          <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
            {event.description}
          </p>
        )}

        <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
          {event.event_time && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Clock className="h-3.5 w-3.5 text-academic-500" />
              {event.event_time}
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-academic-500" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
        </div>

        {/* View Details / Register Footer */}
        <div className="mt-6 flex items-center justify-between text-sm font-bold">
          <span className="text-academic-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <ArrowRight className="w-4 h-4" />
          </span>
          {event.registration_url && !isPast && (
            <object>
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-academic-900 hover:bg-academic-800 text-white text-[11px] uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Register <ExternalLink className="h-3 w-3" />
              </a>
            </object>
          )}
        </div>
      </div>
    </Link>
  )
}
