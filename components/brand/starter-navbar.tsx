'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, ChevronDown, ShieldCheck } from 'lucide-react'
import logoImage from '@/public/icon.png'

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about', dropdown: true },
  { name: 'Programs', href: '/programs' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'Campus Life', href: '/campus-life' },
]

export function StarterNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="bg-[#8f1212] text-white">
        <div className="container-wide flex items-center gap-4 overflow-hidden py-2 text-xs font-medium tracking-wide">
          <span className="rounded-sm bg-white/10 px-2 py-0.5 font-semibold uppercase tracking-[0.18em]">
            Live Updates
          </span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="marquee-track flex w-[200%] items-center gap-10 whitespace-nowrap text-white/90">
              <span>Admissions and campus announcements highlighted here.</span>
              <span>Latest information flowing from right to left.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container-wide">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
              <Image src={logoImage} alt="National College logo" fill sizes="56px" className="object-cover" priority />
            </div>
            <div>
              <div className="font-display text-[1.05rem] font-bold uppercase tracking-[0.06em] text-academic-950">The National College</div>
              <div className="text-xs tracking-[0.12em] text-slate-500">Jayanagar, Bangalore</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-academic-900 transition-colors hover:bg-academic-50 hover:text-academic-700"
              >
                {link.name}
                {link.dropdown ? <ChevronDown className="h-4 w-4" /> : null}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/admissions" className="inline-flex items-center gap-2 rounded-full bg-academic-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-academic-900/15 transition-colors hover:bg-academic-800">
              <ShieldCheck className="h-4 w-4" />
              Apply Now
            </Link>
          </div>

          <button type="button" className="lg:hidden rounded-full border border-slate-200 p-2 text-academic-900">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}