import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink } from 'lucide-react'
import { getEventBySlug } from '@/lib/data/public'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Event Not Found | National College' }

  const description = event.description || `Join us for ${event.title} at National College Jayanagar.`
  const imageUrl = event.image_url || '/og-image.jpg'

  return {
    title: `${event.title} | Events | National College`,
    description,
    alternates: { canonical: `/events/${slug}` },
    openGraph: {
      title: event.title,
      description,
      url: `https://nationalcollege.edu.in/events/${slug}`,
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params

  const event = await getEventBySlug(slug)
  if (!event) notFound()

  return (
    <div className="bg-slate-50/30 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-academic-900 pt-36 md:pt-44 pb-16 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide z-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-bold mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-[10px] font-bold uppercase tracking-wider text-white">
              {event.category || 'General'}
            </span>
            {event.is_upcoming ? (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                Upcoming
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-500/20 text-slate-300 border border-slate-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                Past Event
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {event.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-8 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Date</p>
                <p className="text-sm font-semibold">
                  {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {event.end_date && event.end_date !== event.event_date && ` - ${new Date(event.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                </p>
              </div>
            </div>

            {(event.event_time) && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Time</p>
                  <p className="text-sm font-semibold">
                    {event.event_time}
                    {event.end_time && ` - ${event.end_time}`}
                  </p>
                </div>
              </div>
            )}

            {event.venue && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Venue</p>
                  <p className="text-sm font-semibold">{event.venue}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 max-w-4xl bg-white border border-slate-100 rounded-3xl p-6 md:p-12 shadow-sm">
              {event.image_url && (
                <div className="mb-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={event.image_url} alt={event.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}

              {event.description && (
                <div className="mb-8">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium">
                    {event.description}
                  </p>
                </div>
              )}

              {event.content && event.content.trim() !== '' ? (
                <div
                  className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              ) : (
                <div className="prose prose-slate prose-lg max-w-none">
                  <p>Check back later for full event details and agenda.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-lg text-academic-900 mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category</span>
                    <p className="text-sm font-semibold text-slate-800">{event.category || 'General'}</p>
                  </div>
                  <div className="h-px w-full bg-slate-100" />
                  
                  {event.registration_url && (
                    <div className="pt-2">
                      <a 
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-academic-900 hover:bg-academic-800 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        Register Now <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
