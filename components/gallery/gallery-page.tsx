'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Play, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import type { GalleryItem } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
}

interface GalleryPageProps {
  items: GalleryItem[]
}

export function GalleryPage({ items }: GalleryPageProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState('all')

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category)))]
  const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter)
  const photos = filteredItems.filter(i => !i.is_video)
  const videos = filteredItems.filter(i => i.is_video)

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
              Campus Gallery
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-400 text-lg max-w-3xl mx-auto">
              Explore our vibrant campus life, state-of-the-art facilities, and memorable events.
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
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filter === cat
                    ? 'bg-academic-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {/* Videos Section */}
          {videos.length > 0 && (
            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold text-academic-900 mb-6">Videos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group cursor-pointer aspect-video bg-gray-100 rounded-xl overflow-hidden relative"
                  >
                    {item.thumbnail_url || item.image_url ? (
                      <Image
                        src={item.thumbnail_url || item.image_url || ''}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-academic-100">
                        <Play className="h-12 w-12 text-academic-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-academic-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-academic-900" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos Section */}
          {photos.length > 0 && (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {photos.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeIn}
                  onClick={() => setSelectedItem(item)}
                  className={`group cursor-pointer relative overflow-hidden rounded-lg ${
                    index % 6 === 0 ? 'col-span-2 row-span-2' : 'aspect-video'
                  }`}
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes={index % 6 === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-academic-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white font-display font-semibold text-sm">{item.title}</p>
                    {item.description && (
                      <p className="text-gray-300 text-xs mt-1">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No gallery items found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedItem.is_video && selectedItem.video_url ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  src={selectedItem.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full max-h-[80vh] object-contain rounded-xl"
                />
              </div>
            )}
            <div className="mt-4 text-white text-center">
              <h3 className="font-display text-xl font-semibold">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-gray-400 text-sm mt-2">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
