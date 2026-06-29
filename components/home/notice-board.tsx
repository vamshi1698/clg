'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Bell, Calendar, FileText, Newspaper, ExternalLink } from 'lucide-react'

interface NoticeBoardProps {
  news: any[]
  events: any[]
  resultPdfs: any[]
}

const typeConfig = {
  news:   { label: 'News',   color: 'bg-sky-100 text-sky-700',    dot: 'bg-sky-500',    icon: Newspaper },
  event:  { label: 'Event',  color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500', icon: Calendar  },
  result: { label: 'Result', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: FileText },
}

export function NoticeBoard({ news, events, resultPdfs }: NoticeBoardProps) {
  const tabs = ['All', 'News', 'Events', 'Results'] as const
  const [active, setActive] = useState<typeof tabs[number]>('All')

  const allItems = [
    ...news.map(n => ({
      id: n.id, type: 'news' as const,
      title: n.title,
      date: new Date(n.published_at || n.created_at),
      href: `/news/${n.slug}`,
      isExternal: false,
    })),
    ...events.map(e => ({
      id: e.id, type: 'event' as const,
      title: e.title,
      date: new Date(e.event_date),
      href: `/events`,
      isExternal: false,
    })),
    ...resultPdfs.map(r => ({
      id: r.id, type: 'result' as const,
      title: r.title,
      date: new Date(r.created_at),
      href: `/api/results/pdf/${r.id}`,
      isExternal: true,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 12)

  const filtered = allItems.filter(item => {
    if (active === 'All') return true
    if (active === 'News') return item.type === 'news'
    if (active === 'Events') return item.type === 'event'
    if (active === 'Results') return item.type === 'result'
    return true
  })

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="container-wide">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center shadow-sm">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-academic-950">Notice Board</h2>
          </div>

          {/* Tab pills */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  active === tab
                    ? 'bg-academic-950 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-6">

          {/* Feed */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="divide-y divide-slate-100"
              >
                {filtered.length === 0 && (
                  <div className="py-16 text-center text-slate-400 text-sm">
                    No items in this category yet.
                  </div>
                )}
                {filtered.map((item) => {
                  const cfg = typeConfig[item.type]
                  const Icon = cfg.icon
                  return (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={item.href}
                      target={item.isExternal ? '_blank' : '_self'}
                      className="flex items-center gap-4 py-3.5 group"
                    >
                      {/* Dot */}
                      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

                      {/* Badge */}
                      <span className={`hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${cfg.color}`}>
                        {cfg.label}
                      </span>

                      {/* Title */}
                      <span className="flex-1 text-sm font-medium text-academic-950 group-hover:text-gold-600 transition-colors line-clamp-1">
                        {item.title}
                      </span>

                      {/* Date */}
                      <span className="hidden md:block text-xs text-slate-400 shrink-0 tabular-nums">
                        {item.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>

                      {/* Arrow */}
                      {item.isExternal
                        ? <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-gold-500 shrink-0 transition-colors" />
                        : <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-gold-500 shrink-0 transition-colors" />
                      }
                    </Link>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-academic-700 hover:text-gold-600 transition-colors"
            >
              View all notices <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Results CTA */}
            <div className="bg-academic-950 rounded-2xl p-6 text-white">
              <FileText className="h-7 w-7 text-gold-400 mb-3" />
              <h3 className="font-display text-lg font-bold mb-1">Check Results</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Enter your register number to view semester results.
              </p>
              <Link
                href="/results"
                className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-academic-950 font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
              >
                Results Portal
              </Link>
            </div>

            {/* Quick links */}
            <div className="border border-slate-200 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Links</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'All News', href: '/news' },
                  { label: 'Event Calendar', href: '/events' },
                  { label: 'Admissions', href: '/admissions' },
                  { label: 'Academic Results', href: '/results' },
                ].map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between text-sm text-slate-600 hover:text-gold-600 font-medium transition-colors group"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-gold-500 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
