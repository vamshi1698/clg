'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Bell, Calendar, FileText, Newspaper, ExternalLink, ChevronRight } from 'lucide-react'

interface NoticeBoardProps {
  news: any[]
  events: any[]
  resultPdfs: any[]
}

const typeConfig = {
  news: {
    label: 'News',
    badge: 'bg-sky-500/10 text-sky-600 border-sky-200',
    dot: 'bg-sky-500',
    icon: Newspaper,
    placeholder: 'from-sky-600 to-blue-700',
    initial: 'N',
  },
  event: {
    label: 'Event',
    badge: 'bg-violet-500/10 text-violet-600 border-violet-200',
    dot: 'bg-violet-500',
    icon: Calendar,
    placeholder: 'from-violet-600 to-purple-700',
    initial: 'E',
  },
  result: {
    label: 'Result',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: FileText,
    placeholder: 'from-emerald-600 to-teal-700',
    initial: 'R',
  },
}

export function NoticeBoard({ news, events, resultPdfs }: NoticeBoardProps) {
  const tabs = ['All', 'News', 'Events', 'Results'] as const
  const [active, setActive] = useState<typeof tabs[number]>('All')

  const allItems = [
    ...news.map((n) => ({
      id: n.id,
      type: 'news' as const,
      title: n.title,
      excerpt: n.excerpt || '',
      image_url: n.image_url || null,
      date: new Date(n.published_at || n.created_at),
      href: n.slug ? `/news/${n.slug}` : '#',
      isExternal: false,
    })),
    ...events.map((e) => ({
      id: e.id,
      type: 'event' as const,
      title: e.title,
      excerpt: e.description || e.venue || '',
      image_url: e.image_url || null,
      date: new Date(e.event_date),
      href: `/events`,
      isExternal: false,
    })),
    ...resultPdfs.map((r) => ({
      id: r.id,
      type: 'result' as const,
      title: r.title,
      excerpt: r.description || 'Click to view / download the result PDF.',
      image_url: null,
      date: new Date(r.created_at),
      href: `/api/results/pdf/${r.id}`,
      isExternal: true,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const filtered = allItems.filter((item) => {
    if (active === 'All') return true
    if (active === 'News') return item.type === 'news'
    if (active === 'Events') return item.type === 'event'
    if (active === 'Results') return item.type === 'result'
    return true
  }).slice(0, 6)

  // Featured item (first in list)
  const featured = filtered[0] ?? null
  const restItems = filtered.slice(1)

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="container-wide">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#03152c] rounded-xl flex items-center justify-center shadow-sm">
              <Bell className="h-4 w-4 text-gold-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-academic-950">Notice Board</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest updates from the college</p>
            </div>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-academic-700 hover:text-gold-600 transition-colors"
          >
            View all notices <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8" role="tablist" aria-label="Notice categories">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              onClick={() => setActive(tab)}
              aria-selected={active === tab}
              aria-label={`Filter notices: ${tab}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                active === tab
                  ? 'bg-[#03152c] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                No items in this category yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Featured card (left, large) */}
                {featured && (
                  <Link
                    href={featured.href}
                    target={featured.isExternal ? '_blank' : '_self'}
                    className="lg:col-span-5 group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0">
                      {featured.image_url ? (
                        <img
                          src={featured.image_url}
                          alt={featured.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${typeConfig[featured.type].placeholder} flex items-center justify-center`}>
                          <div className="text-white/20 font-display font-bold text-8xl select-none">
                            {typeConfig[featured.type].initial}
                          </div>
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 shadow-sm border ${typeConfig[featured.type].badge}`}>
                          {typeConfig[featured.type].label}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-lg font-bold text-academic-950 leading-snug mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {featured.title}
                        </h3>
                        {featured.excerpt && (
                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{featured.excerpt}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 tabular-nums">
                          {featured.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 group-hover:text-gold-700">
                          {featured.isExternal ? 'Download' : 'Read more'}
                          {featured.isExternal
                            ? <ExternalLink className="h-3.5 w-3.5" />
                            : <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          }
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Rest: stacked card list (right column) */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  {restItems.map((item) => {
                    const cfg = typeConfig[item.type]
                    const Icon = cfg.icon
                    return (
                      <Link
                        key={`${item.type}-${item.id}`}
                        href={item.href}
                        target={item.isExternal ? '_blank' : '_self'}
                        className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 transition-all duration-200"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${cfg.placeholder} flex items-center justify-center`}>
                              <Icon className="h-7 w-7 text-white/70" />
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                            <span className="text-[11px] text-slate-400 tabular-nums">
                              {item.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-academic-950 line-clamp-2 leading-snug group-hover:text-gold-600 transition-colors">
                            {item.title}
                          </h4>
                          {item.excerpt && (
                            <p className="text-xs text-slate-400 line-clamp-1 mt-1 leading-relaxed">{item.excerpt}</p>
                          )}
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0 self-center">
                          {item.isExternal
                            ? <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-gold-500 transition-colors" />
                            : <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all" />
                          }
                        </div>
                      </Link>
                    )
                  })}

                  {/* Sidebar quick links + Results CTA */}
                  <div className="mt-2 p-5 bg-gradient-to-r from-[#03152c] to-[#0A2540] rounded-2xl shadow-md text-white relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 pointer-events-none">
                      <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M50 10 L50 90 M10 50 L90 50" stroke="white" strokeWidth="1" />
                        <polygon points="50,30 55,45 70,50 55,55 50,70 45,55 30,50 45,45" fill="white" />
                      </svg>
                    </div>
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">RESULTS</span>
                        <h3 className="font-display text-lg font-bold text-white mt-0.5">Check Your Results</h3>
                        <p className="text-slate-300 text-xs mt-1">Enter your register number to view semester results.</p>
                      </div>
                      <Link
                        href="/results"
                        className="flex-shrink-0 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors shadow-sm whitespace-nowrap"
                      >
                        Results <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
