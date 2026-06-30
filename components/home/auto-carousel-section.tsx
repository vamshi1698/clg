'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    title: 'A Legacy of Excellence',
    description: 'Our iconic campus has been nurturing brilliant minds and shaping futures for over five decades.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Modern Learning Spaces',
    description: 'State-of-the-art libraries and laboratories designed to foster deep research and collaboration.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Vibrant Student Community',
    description: 'Experience a campus full of life, diversity, and endless opportunities to grow together.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80',
  },
]

export function AutoCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [])

  const activeSlide = slides[activeIndex]

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm">
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image src={activeSlide.image} alt={activeSlide.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-r from-academic-950/70 via-academic-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white bg-gradient-to-t from-academic-950/90 to-transparent">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-gold-500">Campus Highlight</p>
                    <h2 className="mt-2 sm:mt-3 max-w-xl font-display text-2xl font-bold sm:text-3xl md:text-5xl leading-tight">{activeSlide.title}</h2>
                    <p className="mt-2 sm:mt-4 max-w-xl text-xs sm:text-sm leading-relaxed text-white/90 md:text-base">{activeSlide.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-academic-600">Latest information</p>
              <h3 className="font-display mt-3 text-2xl font-bold text-academic-950 md:text-3xl">A constantly changing visual preview</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                This section cycles through campus imagery automatically, giving the homepage movement and a stronger editorial feel.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors ${
                    index === activeIndex
                      ? 'border-academic-700 bg-academic-900 text-white shadow-lg shadow-academic-900/15'
                      : 'border-slate-200 bg-white text-academic-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-medium">{slide.title}</span>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] opacity-80">
                    {index === activeIndex ? 'Active' : 'Preview'}
                    {index === activeIndex ? <ChevronLeft className="h-4 w-4 rotate-180" /> : <ChevronRight className="h-4 w-4" />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}