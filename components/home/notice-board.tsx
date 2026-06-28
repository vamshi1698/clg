'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Bell, Calendar, FileText, Newspaper } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

interface NoticeBoardProps {
  news: any[]
  events: any[]
  resultPdfs: any[]
}

export function NoticeBoard({ news, events, resultPdfs }: NoticeBoardProps) {
  // Combine all items into a single timeline, sorted by date
  const allItems = [
    ...news.map(n => ({
      ...n,
      type: 'news',
      date: new Date(n.published_at || n.created_at),
      icon: Newspaper,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: `/news/${n.slug}`,
      badge: 'News'
    })),
    ...events.map(e => ({
      ...e,
      type: 'event',
      date: new Date(e.event_date),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: `/events`,
      badge: 'Event'
    })),
    ...resultPdfs.map(r => ({
      ...r,
      type: 'result',
      date: new Date(r.created_at),
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: `/api/results/pdf/${r.id}`,
      badge: 'Result',
      title: r.title,
      excerpt: `Semester ${r.semester} - ${r.academic_year}`
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8)

  return (
    <section className="section-padding bg-slate-50 border-t border-slate-200">
      <div className="container-wide">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* Main Feed */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-academic-950 flex items-center gap-3">
                <Bell className="h-6 w-6 text-gold-500" />
                Notice Board
              </h2>
            </div>
            
            <div className="grid gap-4">
              {allItems.map((item, i) => (
                <motion.div key={`${item.type}-${item.id || i}`} variants={fadeIn}>
                  <Link href={item.href} target={item.type === 'result' ? '_blank' : '_self'} className="block group">
                    <Card className="border border-slate-200 shadow-sm hover:shadow-md hover:border-gold-300 transition-all">
                      <CardContent className="p-4 sm:p-5 flex items-start gap-4 sm:gap-6">
                        <div className={`shrink-0 p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform`}>
                          <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${item.bgColor} ${item.color}`}>
                              {item.badge}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                              {item.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-academic-950 group-hover:text-gold-600 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          {item.excerpt && (
                            <p className="text-sm text-slate-600 mt-1 line-clamp-1">{item.excerpt}</p>
                          )}
                        </div>
                        <div className="shrink-0 self-center hidden sm:flex">
                          <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-gold-500 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
              {allItems.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
                  <Bell className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                  <p>No recent announcements found.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeIn} className="bg-academic-950 rounded-3xl p-6 md:p-8 text-white shadow-xl">
              <h3 className="font-display text-xl font-bold mb-4">Check Results</h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Students can check their individual semester results by entering their Register Number and Date of Birth on the results portal.
              </p>
              <Link href="/results" className="inline-flex w-full items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-academic-950 font-bold py-3 px-6 rounded-xl transition-colors">
                <FileText className="h-5 w-5" />
                View Results Portal
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h3 className="font-display text-lg font-bold text-academic-950 mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/news" className="text-slate-600 hover:text-gold-600 flex items-center gap-2"><ArrowRight className="h-4 w-4" /> All News</Link></li>
                <li><Link href="/events" className="text-slate-600 hover:text-gold-600 flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Event Calendar</Link></li>
                <li><Link href="/admissions" className="text-slate-600 hover:text-gold-600 flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Admissions</Link></li>
              </ul>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
