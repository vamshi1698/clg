'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ChevronLeft, ChevronRight, Camera, Film, Grid3X3, Images } from 'lucide-react'
import Image from 'next/image'
import type { GalleryItem } from '@/types/database'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } }
}

const fadeInItem = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const isEmbedVideo = (url: string) => {
  if (!url) return false
  const lower = url.toLowerCase()
  return (
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com')
  )
}

interface GalleryPageProps {
  items: GalleryItem[]
}

export function GalleryPage({ items: rawItems }: GalleryPageProps) {
  // Flatten additional_images and additional_videos into separate items for display
  const items = rawItems.flatMap((item) => {
    const results = [item]
    
    // If this item is a video but has a distinct primary image_url and thumbnail_url,
    // the user likely wants the primary image to also appear as a photo in the gallery.
    if (item.is_video && item.thumbnail_url && item.thumbnail_url !== item.image_url) {
      results.push({
        ...item,
        id: `${item.id}-primary-img`,
        is_video: false,
        video_url: null,
      })
    }
    if (item.additional_images && item.additional_images.length > 0) {
      item.additional_images.forEach((url, idx) => {
        results.push({
          ...item,
          id: `${item.id}-img-${idx}`,
          image_url: url,
          is_video: false,
          video_url: null,
          additional_images: null,
          additional_videos: null,
        })
      })
    }
    if (item.additional_videos && item.additional_videos.length > 0) {
      item.additional_videos.forEach((url, idx) => {
        results.push({
          ...item,
          id: `${item.id}-vid-${idx}`,
          is_video: true,
          video_url: url,
          image_url: item.thumbnail_url || item.image_url, // fallback
          additional_images: null,
          additional_videos: null,
        })
      })
    }
    return results
  })

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState('all')

  const categories = ['all', ...Array.from(new Set(items.map(i => (i.category || '').trim().toLowerCase())))]
  const filteredItems = filter === 'all' ? items : items.filter(i => (i.category || '').trim().toLowerCase() === filter)
  const photos = filteredItems.filter(i => !i.is_video)
  const videos = filteredItems.filter(i => i.is_video)

  // Lightbox navigation
  const allViewable = [...photos, ...videos]
  const currentIndex = selectedItem ? allViewable.findIndex(i => i.id === selectedItem.id) : -1

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (currentIndex < 0) return
    const nextIdx = direction === 'next'
      ? (currentIndex + 1) % allViewable.length
      : (currentIndex - 1 + allViewable.length) % allViewable.length
    setSelectedItem(allViewable[nextIdx])
  }, [currentIndex, allViewable])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedItem) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null)
      if (e.key === 'ArrowRight') navigateLightbox('next')
      if (e.key === 'ArrowLeft') navigateLightbox('prev')
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [selectedItem, navigateLightbox])

  const totalPhotos = items.filter(i => !i.is_video).length
  const totalVideos = items.filter(i => i.is_video).length

  return (
    <div className="bg-white text-academic-950">
      {/* Hero Section — image‑based with gradient overlay, matching site theme */}
      <section className="relative pt-44 md:pt-52 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Gallery campus"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-academic-950 via-academic-950/60 to-academic-950/30" />
        </div>

        <div className="relative container-wide text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
              <span className="inline-block text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">Visual Archive</span>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-none mb-6">
                Campus <span className="text-gold-400">Gallery</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
                Explore our vibrant campus life, state-of-the-art facilities, and memorable events through photos and videos.
              </p>
            </motion.div>

            {/* Quick stats cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: Camera, value: String(totalPhotos), label: 'Photos' },
                { icon: Film, value: String(totalVideos), label: 'Videos' },
                { icon: Grid3X3, value: String(categories.length - 1), label: 'Categories' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
                  <s.icon className="h-5 w-5 text-gold-400 mx-auto mb-2" />
                  <div className="font-display text-3xl font-bold text-gold-400">{s.value}</div>
                  <div className="text-slate-300 text-xs mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="container-wide py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <Images className="h-5 w-5 text-academic-700 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  filter === cat
                    ? 'bg-academic-950 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-academic-900'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="section-padding bg-slate-950">
          <div className="container-wide">
            <motion.div {...fadeUp} className="mb-10">
              <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">Featured</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">Videos</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((item, i) => (
                <motion.div
                  key={item.id}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer aspect-video bg-academic-900 rounded-2xl overflow-hidden relative shadow-lg hover:shadow-2xl transition-shadow"
                >
                  {item.thumbnail_url || item.image_url ? (
                    <img
                      src={item.thumbnail_url || item.image_url || ''}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-academic-900">
                      <Play className="h-12 w-12 text-academic-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="h-7 w-7 text-academic-950 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-display font-bold text-sm">{item.title}</p>
                    {item.description && (
                      <p className="text-slate-300 text-xs mt-1 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos Gallery Grid */}
      {photos.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-wide">
            <motion.div {...fadeUp} className="mb-10">
              <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.25em]">Photo Gallery</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-950 mt-2">Moments Captured</h2>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]"
            >
              {photos.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeInItem}
                  onClick={() => setSelectedItem(item)}
                  className={`group cursor-pointer relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-100 ${
                    index % 7 === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes={index % 7 === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-academic-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white font-display font-bold text-sm">{item.title}</p>
                    {item.description && (
                      <p className="text-slate-300 text-xs mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  {/* Category badge */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-academic-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.category}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <section className="section-padding">
          <div className="container-wide text-center py-20">
            <Camera className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-academic-950 mb-2">No Gallery Items Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Photos and videos from campus events, facilities, and activities will appear here once uploaded.
            </p>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 z-10 w-11 h-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Previous button */}
            {allViewable.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev') }}
                className="absolute left-4 md:left-8 z-10 w-11 h-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next button */}
            {allViewable.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next') }}
                className="absolute right-4 md:right-8 z-10 w-11 h-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Content */}
            <div className="max-w-5xl w-full px-4 md:px-16" onClick={(e) => e.stopPropagation()}>
              {selectedItem.is_video && selectedItem.video_url ? (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                >
                  {isEmbedVideo(selectedItem.video_url) ? (
                    <iframe
                      src={selectedItem.video_url}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={selectedItem.video_url}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      playsInline
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="w-full max-h-[80vh] object-contain rounded-2xl"
                  />
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="mt-5 text-center"
              >
                <h3 className="font-display text-xl font-bold text-white">{selectedItem.title}</h3>
                {selectedItem.description && (
                  <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">{selectedItem.description}</p>
                )}
                <p className="text-slate-500 text-xs mt-3">
                  {currentIndex + 1} / {allViewable.length} · Press ← → to navigate · Esc to close
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
