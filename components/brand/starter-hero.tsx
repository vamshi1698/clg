import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StarterHero() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image / Pattern */}
      <div className="absolute inset-0 bg-academic-950">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-academic-950 via-academic-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-academic-950/80 via-academic-900/40 to-transparent" />
      </div>

      <div className="relative container-wide w-full pt-32 pb-16">
        <div className="max-w-4xl">
          <div className="mb-6 flex items-center gap-3 fade-in-up">
            <span className="inline-flex items-center gap-2 border-l-4 border-gold-500 pl-4 py-1 text-sm font-bold uppercase tracking-[0.2em] text-gold-300">
              Est. 1965
            </span>
          </div>

          <h1 className="font-display mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white text-balance md:text-7xl lg:text-8xl fade-in-up" style={{ animationDelay: '0.1s' }}>
            Excellence in <br />
            <span className="text-gold-400">Education.</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-2xl font-light fade-in-up" style={{ animationDelay: '0.2s' }}>
            A premier autonomous institution committed to holistic development, academic rigor, and preparing students for the challenges of tomorrow.
          </p>

          <div className="flex flex-wrap gap-4 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="bg-gold-500 text-lg h-14 px-8 text-academic-950 shadow-lg hover:bg-gold-400 transition-all">
              <Link href="/admissions">
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 backdrop-blur-md text-lg h-14 px-8 text-white hover:bg-white hover:text-academic-900 transition-all">
              <Link href="/programs">
                Explore Programs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}