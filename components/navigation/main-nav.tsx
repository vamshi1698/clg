'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChevronDown, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import logoImage from '../brand/channels4_profile.jpg'

const globalNavigation = [
  { name: 'Students', href: '/students' },
  { name: 'Faculty/Staff', href: '/faculty-staff' },
  { name: 'Alumni', href: '/alumni' },
  { name: 'Parents', href: '/parents' },
  { name: 'Visitors', href: '/visitors' },
]

const mainNavigation = [
  { name: 'Admissions', href: '/admissions', hasDropdown: true, items: [
    { name: 'Undergraduate', href: '/admissions/undergraduate' },
    { name: 'Graduate', href: '/admissions/graduate' },
    { name: 'Financial Aid', href: '/admissions/financial-aid' },
  ]},
  { name: 'Academics', href: '/academics', hasDropdown: true, items: [
    { name: 'Departments', href: '/departments' },
    { name: 'Undergraduate Programs', href: '/academics/undergraduate' },
    { name: 'Graduate Programs', href: '/academics/graduate' },
  ]},
  { name: 'Research', href: '/research' },
  { name: 'Campus Life', href: '/campus-life' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-md' : 'bg-white border-b border-slate-200'
    )}>
      {/* Top Global Bar */}
      <div className="hidden bg-academic-900 text-white md:block">
        <div className="container-wide flex items-center justify-end gap-6 py-2 text-xs font-semibold tracking-wide">
          <nav className="flex items-center gap-6">
            {globalNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-gold-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 border-l border-white/20 pl-6 cursor-pointer hover:text-gold-300 transition-colors">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container-wide">
        <div className="flex items-center justify-between gap-4 py-4 md:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative h-16 w-16 overflow-hidden rounded-full shadow-sm ring-1 ring-slate-100 group-hover:shadow-md transition-shadow">
              <Image src={logoImage} alt="National College logo" fill className="object-cover" priority />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold uppercase tracking-widest text-academic-900 leading-none group-hover:text-gold-600 transition-colors">
                The National College
              </h1>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {mainNavigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 py-2 text-[0.95rem] font-medium transition-colors',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-gold-600'
                      : 'text-slate-800 hover:text-academic-700'
                  )}
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown className="h-4 w-4 opacity-50" />}
                </Link>

                {/* Dropdown */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 pt-2 w-56 z-50 fade-in">
                    <div className="bg-white rounded-md shadow-xl border border-slate-100 py-2 overflow-hidden">
                      {item.items?.map((subItem) => (
                         <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-academic-900 hover:pl-5 transition-all"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-academic-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white h-screen overflow-y-auto pb-24">
          <div className="container-wide py-4 space-y-2">
            {mainNavigation.map((item) => (
              <div key={item.name} className="border-b border-slate-100 pb-2">
                <Link
                  href={item.href}
                  className={cn(
                    'block px-2 py-3 text-lg font-display font-medium',
                    pathname === item.href
                      ? 'text-gold-600'
                      : 'text-academic-900'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.hasDropdown && item.items && (
                  <div className="ml-4 space-y-1 mt-1 border-l-2 border-slate-100 pl-4">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block py-2 text-slate-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Global Links</h3>
              {globalNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-2 py-2 text-sm text-academic-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

