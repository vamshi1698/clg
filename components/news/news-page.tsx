'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Tag, ArrowRight } from 'lucide-react'
import type { News } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const categories = ['all', 'academic', 'examination', 'admission', 'placement', 'events', 'general']

interface NewsPageProps {
  news: News[]
}

export function NewsPage({ news }: NewsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(n => n.category === selectedCategory)

  const featuredNews = news.filter(n => n.is_featured)
  const recentNews = filteredNews.filter(n => !n.is_featured)

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-academic-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.h1 variants={fadeIn} className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              News & Announcements
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-400 text-lg max-w-3xl mx-auto">
              Stay updated with the latest happenings, achievements, and announcements at National College.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-wide">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-academic-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat === 'all' ? 'All News' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && selectedCategory === 'all' && (
        <section className="section-padding bg-gray-50">
          <div className="container-wide">
            <h2 className="font-display text-2xl font-bold text-academic-900 mb-8">Featured News</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredNews.slice(0, 2).map((item, i) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="group">
                  <article className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${i === 0 ? 'lg:aspect-video flex' : ''}`}>
                    <div className={`${i === 0 ? 'w-1/2' : 'h-48'} bg-gray-100 relative`}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-academic-100">
                          <span className="text-academic-300 font-display font-bold text-4xl">NC</span>
                        </div>
                      )}
                    </div>
                    <div className={`${i === 0 ? 'w-1/2 p-6 flex flex-col justify-center' : 'p-4'}`}>
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gold-100 text-gold-700 rounded capitalize">{item.category}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.published_at ? new Date(item.published_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Recent'}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-academic-900 group-hover:text-gold-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.excerpt}</p>
                      )}
                      <span className="inline-flex items-center text-gold-600 text-sm mt-3 group-hover:translate-x-1 transition-transform">
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      <section className="section-padding">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-bold text-academic-900 mb-8">
            {selectedCategory === 'all' ? 'All News' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News`}
          </h2>

          {filteredNews.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No news found.</p>
          ) : (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredNews.map((item) => (
                <motion.div key={item.id} variants={fadeIn}>
                  <Link href={`/news/${item.slug}`} className="group block h-full">
                    <article className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all h-full">
                      <div className="aspect-video bg-gray-100">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-academic-100">
                            <span className="text-academic-300 font-display font-bold text-4xl">NC</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-academic-50 text-academic-900 rounded capitalize">{item.category}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.published_at ? new Date(item.published_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            }) : 'Recent'}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-academic-900 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.excerpt}</p>
                        )}
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
