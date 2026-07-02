'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Tag, ArrowRight, Download, Search, Info, Phone, FileText, CheckCircle, Mail } from 'lucide-react'
import type { News } from '@/types/database'

interface NewsPageProps {
  news: News[]
}

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
}

export function NewsPage({ news }: NewsPageProps) {
  const [selectedNoticeTab, setSelectedNoticeTab] = useState<'all' | 'results' | 'circulars' | 'general'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const getNoticeInfo = (item: News) => {
    const category = item.category
    if (category === 'examination') {
      return {
        badge: 'EXAM RESULT',
        badgeClass: 'bg-rose-50 text-rose-600 border border-rose-100',
        tab: 'results'
      }
    }
    if (category === 'academic' || category === 'admission') {
      return {
        badge: 'OFFICIAL CIRCULAR',
        badgeClass: 'bg-blue-50 text-blue-600 border border-blue-100',
        tab: 'circulars'
      }
    }
    return {
      badge: 'GENERAL',
      badgeClass: 'bg-slate-50 text-slate-600 border border-slate-100',
      tab: 'general'
    }
  }

  // Filter and search news
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      // 1. Filter by category tab
      if (selectedNoticeTab !== 'all') {
        const { tab } = getNoticeInfo(item)
        if (tab !== selectedNoticeTab) return false
      }
      
      // 2. Filter by search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchTitle = item.title.toLowerCase().includes(query)
        const matchExcerpt = item.excerpt?.toLowerCase().includes(query) || false
        const matchContent = item.content?.toLowerCase().includes(query) || false
        if (!matchTitle && !matchExcerpt && !matchContent) return false
      }

      return true
    })
  }, [news, selectedNoticeTab, searchQuery])

  // Get featured news for the sidebar
  const featuredNews = useMemo(() => {
    return news.filter(item => item.is_featured).slice(0, 3)
  }, [news])

  return (
    <div className="bg-slate-50/30 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-academic-900 pt-36 md:pt-44 pb-16 lg:pb-20 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.h1 variants={fadeIn} className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
              News & Announcements
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Stay updated with the latest academic circulars, examination schedules, placement drives, and campus highlights.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Notice Board Portal Body */}
      <section className="py-12">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Notices List (col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Filter Controls (Tabs + Search) */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
                
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {(['all', 'results', 'circulars', 'general'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedNoticeTab(tab)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                        selectedNoticeTab === tab
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {tab === 'all' && 'All Notices'}
                      {tab === 'results' && 'Results'}
                      {tab === 'circulars' && 'Circulars'}
                      {tab === 'general' && 'General'}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search notices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-slate-800 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

              </div>

              {/* Notices List */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {filteredNews.length > 0 ? (
                    <motion.div
                      key="list"
                      initial="initial"
                      animate="animate"
                      variants={staggerContainer}
                      className="space-y-4"
                    >
                      {filteredNews.map((item) => {
                        const { badge, badgeClass } = getNoticeInfo(item)
                        return (
                          <motion.div key={item.id} variants={fadeIn}>
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2.5">
                                  <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-md tracking-wider uppercase ${badgeClass}`}>
                                    {badge}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    }) : 'Recent'}
                                  </span>
                                </div>
                                <h3 className="font-display font-extrabold text-slate-900 text-base sm:text-lg leading-snug hover:text-blue-600 transition-colors">
                                  <Link href={item?.slug ? `/news/${item.slug}` : '#'}>{item.title}</Link>
                                </h3>
                                {item.excerpt && (
                                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                    {item.excerpt}
                                  </p>
                                )}
                                <div className="pt-2">
                                  <Link 
                                    href={item?.slug ? `/news/${item.slug}` : '#'} 
                                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                  >
                                    Read details <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>

                              <div className="flex-shrink-0 flex items-center justify-end sm:pl-4">
                                <Link
                                  href={item?.slug ? `/news/${item.slug}` : '#'}
                                  className="flex items-center justify-center p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 rounded-2xl transition-all shadow-sm group"
                                  title="Download announcement Document"
                                >
                                  <Download className="w-5 h-5 group-hover:scale-105 transition-transform" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 bg-white border border-slate-100 rounded-3xl"
                    >
                      <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="font-bold text-slate-800 text-sm mb-1">No Notices Found</h4>
                      <p className="text-slate-400 text-xs">
                        Try adjusting your filters or search keywords.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Right Column: Sidebar (col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Featured Card */}
              {featuredNews.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-display text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-50 flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-blue-500" />
                    Important Updates
                  </h3>
                  <div className="space-y-4">
                    {featuredNews.map(item => (
                      <div key={item.id} className="group">
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">
                          {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          }) : 'Recent'}
                        </span>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                           <Link href={item?.slug ? `/news/${item.slug}` : '#'}>{item.title}</Link>
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Support Card */}
              <div className="bg-gradient-to-r from-[#03152c] to-[#0A2540] rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
                <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase mb-2 block">SUPPORT & HELPDESK</span>
                <h3 className="font-display text-base font-extrabold mb-3">Admission Queries?</h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  For quick support regarding admissions, dates, or eligibility, get in touch with our helpdesk.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <Phone className="w-4 h-4 text-amber-500" />
                    <span>+91 80 2654 9876</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <Mail className="w-4 h-4 text-amber-500" />
                    <span>admissions@nationalcollege.edu.in</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Contact Desk
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
