'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react'
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
    <article className={`bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all ${isPast ? 'opacity-75' : ''}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 text-center bg-academic-900 rounded-lg py-3">
            <div className="text-gold-500 text-xs font-medium uppercase">{month}</div>
            <div className="text-white text-2xl font-display font-bold">{day}</div>
            <div className="text-gray-400 text-xs">{year}</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {event.is_featured && (
                <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs font-semibold rounded">Featured</span>
              )}
              {event.category && (
                <span className="px-2 py-1 bg-academic-100 text-academic-900 text-xs rounded capitalize">{event.category}</span>
              )}
            </div>
            <h3 className="font-display text-lg font-semibold text-academic-900 mb-2">{event.title}</h3>
            {event.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              {event.event_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {event.event_time}
                </div>
              )}
              {event.venue && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.venue}
                </div>
              )}
            </div>
            {event.registration_url && !isPast && (
              <a
                href={event.registration_url}
                className="inline-flex items-center gap-1 mt-4 text-gold-600 text-sm font-medium hover:text-gold-700"
              >
                Register Now <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
