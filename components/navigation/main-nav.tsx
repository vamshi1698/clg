'use client'

import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChevronDown, ShieldCheck, BookOpenText, Atom, GraduationCap, CornerDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import logoImage from '@/public/icon.png'

const SEARCH_INDEX = [
  // Core Pages
  { title: 'Home', category: 'Page', href: '/', description: 'Welcome to National College Jayanagar homepage.' },
  { title: 'About the College', category: 'Page', href: '/about', description: 'History, leadership, principal message, vision, mission, and achievements.' },
  { title: 'Admissions & Eligibility', category: 'Page', href: '/admissions', description: 'Apply online, check deadlines, fees, selection process, and guidelines.' },
  { title: 'Contact Us', category: 'Page', href: '/contact', description: 'Get in touch with departments, administration, or find our campus location.' },
  
  // Academics & Departments
  { title: 'Academics Overview', category: 'Page', href: '/academics', description: 'Explore our academic programs, calendar, and educational framework.' },
  { title: 'Undergraduate Programs (UG)', category: 'Page', href: '/academics/undergraduate', description: 'Arts, Science, Commerce, and Technology degree offerings (BCA, BSc, BCom, BA).' },
  { title: 'Graduate Programs (PG)', category: 'Page', href: '/academics/graduate', description: 'Specialized 2-year masters degrees and research pathways (MCA, MBA, MSc, MCom).' },
  { title: 'Departments Portal', category: 'Page', href: '/departments', description: 'Explore our major streams: CS, Science, Commerce, and Arts.' },
  { title: 'Courses & Programs', category: 'Page', href: '/courses', description: 'Comprehensive list of all courses offered by the college.' },
  { title: 'Faculty & Staff', category: 'Page', href: '/faculty-staff', description: 'Meet our experienced teaching faculty and administrative staff.' },
  { title: 'Research & Innovation', category: 'Page', href: '/research', description: 'Our research culture, published journals, labs, and projects.' },
  { title: 'Examination Results', category: 'Page', href: '/results', description: 'Check individual semester sheets and download official result bulletins.' },

  // Campus Life & Student Portals
  { title: 'Campus Life & Hostels', category: 'Page', href: '/campus-life', description: 'Residential hostels, sports grounds, cafeteria, and cultural clubs.' },
  { title: 'NCC (National Cadet Corps)', category: 'Page', href: '/campus-life/ncc', description: 'Join NCC for discipline, leadership, and military training.' },
  { title: 'NSS (National Service Scheme)', category: 'Page', href: '/campus-life/nss', description: 'Participate in community service, social work, and rural development.' },
  { title: 'Events', category: 'Page', href: '/events', description: 'Upcoming college events, seminars, workshops, and cultural fests.' },
  { title: 'News & Announcements', category: 'Page', href: '/news', description: 'Latest college news, circulars, updates, and press releases.' },
  { title: 'Gallery', category: 'Page', href: '/gallery', description: 'Photos and videos of campus, events, and student activities.' },
  
  // Portals & Stakeholders
  { title: 'Students Portal', category: 'Page', href: '/students', description: 'Resources, guidelines, anti-ragging policies, and support for current students.' },
  { title: 'Parents Portal', category: 'Page', href: '/parents', description: 'Information for parents regarding PTA, attendance, and student progress.' },
  { title: 'Alumni Portal', category: 'Page', href: '/alumni', description: 'Connect with our worldwide alumni network, meets, and success stories.' },
  { title: 'Visitors Guide', category: 'Page', href: '/visitors', description: 'Campus tour booking, directions, metro routes, and parking information.' },

  // Legal
  { title: 'Privacy Policy', category: 'Page', href: '/privacy', description: 'Data handling guidelines and consent statements.' },
  { title: 'Terms & Conditions', category: 'Page', href: '/terms', description: 'Usage guidelines and rules of the college portal.' },

  // Specific Courses
  { title: 'BCA (Computer Applications)', category: 'Course', href: '/academics/undergraduate', description: '3-year undergraduate program in computer applications and AI.' },
  { title: 'B.Sc. (Bachelor of Science)', category: 'Course', href: '/academics/undergraduate', description: '3-year programs in physical sciences, maths, electronics.' },
  { title: 'B.Com. (Bachelor of Commerce)', category: 'Course', href: '/academics/undergraduate', description: 'General and professional streams in finance, taxation.' },
  { title: 'B.A. (Bachelor of Arts)', category: 'Course', href: '/academics/undergraduate', description: 'Humanities, languages, psychology, and social sciences.' },
  { title: 'M.Sc. (Master of Science)', category: 'Course', href: '/academics/graduate', description: 'Advanced physics, math, and electronics specializations.' },
  { title: 'M.Com. (Master of Commerce)', category: 'Course', href: '/academics/graduate', description: '2-year post-graduation in finance, accounting, and business.' },
  { title: 'MCA (Computer Applications)', category: 'Course', href: '/academics/graduate', description: '2-year postgraduate professional course in tech/engineering.' },
  { title: 'MBA (Business Administration)', category: 'Course', href: '/academics/graduate', description: 'Postgraduate management course with finance/marketing.' },

  // Specific Departments
  { title: 'Computer Science Department', category: 'Department', href: '/departments/cs', description: 'Programming labs, advanced incubation centers.' },
  { title: 'Physics Department', category: 'Department', href: '/departments/ph', description: 'Modern physics labs, research and astronomy studies.' },
  { title: 'Chemistry Department', category: 'Department', href: '/departments/ch', description: 'Organic/inorganic laboratories, advanced materials projects.' },
  { title: 'Mathematics Department', category: 'Department', href: '/departments/ma', description: 'Applied mathematics, data analysis, modeling.' },
  { title: 'Electronics Department', category: 'Department', href: '/departments/ec', description: 'Analog/digital labs, embedded systems engineering.' },
  { title: 'Commerce & Management Department', category: 'Department', href: '/departments/co', description: 'Business studies, finance seminars, accounting.' },
  { title: 'English Department', category: 'Department', href: '/departments/en', description: 'Language labs, literature studies, public speaking.' },
]

const globalNavigation = [
  { name: 'Visitors', href: '/visitors' },
  { name: 'Parents', href: '/parents' },
  { name: 'Alumni', href: '/alumni' },
  { name: 'Students', href: '/students' },
  { name: 'Results', href: '/results' },
]

const mainNavigation = [
  { name: 'Admissions', href: '/admissions' },
  {
    name: 'Academics', href: '/academics', hasDropdown: true, items: [
      { name: 'Departments', href: '/departments' },
      { name: 'Undergraduate Programs', href: '/academics/undergraduate' },
      { name: 'Graduate Programs', href: '/academics/graduate' },
    ]
  },
  { name: 'Research', href: '/research' },
  { name: 'Campus Life', href: '/campus-life' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setSearchQuery('')
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isSearchOpen])

  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  }, [searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href || (href === '/academics' && pathname === '/academics/undergraduate')) {
      e.preventDefault()
    }
  }

  const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href || (href === '/academics' && pathname === '/academics/undergraduate')) {
      e.preventDefault()
    } else {
      setMobileMenuOpen(false)
    }
  }

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
                onClick={(e) => handleLinkClick(e, item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 border-l border-white/20 pl-6 cursor-pointer hover:text-gold-300 transition-colors"
          >
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
              <Image src={logoImage} alt="National College logo" fill sizes="64px" className="object-cover" priority />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold uppercase tracking-widest text-academic-900 leading-none group-hover:text-gold-600 transition-colors">
                The National College Jayanagar
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
                  onClick={(e) => handleLinkClick(e, item.href)}
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
                          onClick={(e) => handleLinkClick(e, subItem.href)}
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

          {/* Mobile search button */}
          <button
            type="button"
            className="lg:hidden p-2 text-academic-900 mr-1"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search overlay"
          >
            <Search className="h-6 w-6" />
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-academic-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" aria-hidden="true" /> : <Menu className="h-7 w-7" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-slate-200 bg-white h-screen overflow-y-auto pb-24">
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
                  onClick={(e) => handleMobileLinkClick(e, item.href)}
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
                        onClick={(e) => handleMobileLinkClick(e, subItem.href)}
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
                  onClick={(e) => handleMobileLinkClick(e, item.href)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 md:pt-28 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, departments, or pages..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-base focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results Content Area */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
              {searchQuery.trim() === '' ? (
                // Quick Links when query is empty
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Navigation</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Home', href: '/' },
                      { name: 'Admissions', href: '/admissions' },
                      { name: 'Undergraduate Programs', href: '/academics/undergraduate' },
                      { name: 'Graduate Programs', href: '/academics/graduate' },
                      { name: 'Results Portal', href: '/results' },
                      { name: 'Academic Departments', href: '/departments' },
                    ].map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={(e) => {
                          handleLinkClick(e, link.href)
                          setIsSearchOpen(false)
                        }}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-gold-500 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all group"
                      >
                        <span>{link.name}</span>
                        <CornerDownRight className="h-4 w-4 text-slate-450 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : filteredSearchResults.length > 0 ? (
                // Search Results list
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Search Results ({filteredSearchResults.length})
                  </h4>
                  <div className="space-y-2.5">
                    {filteredSearchResults.map((result: any) => {
                      const IconComponent =
                        result.category === 'Page' ? BookOpenText :
                          result.category === 'Course' ? GraduationCap : Atom;
                      return (
                        <Link
                          key={result.title}
                          href={result.href}
                          onClick={(e) => {
                            handleLinkClick(e, result.href)
                            setIsSearchOpen(false)
                          }}
                          className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-gold-500 hover:bg-slate-50/50 bg-white transition-all group shadow-sm hover:shadow"
                        >
                          <div className="w-10 h-10 bg-slate-100/80 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gold-50 transition-colors">
                            <IconComponent className="h-5 w-5 text-academic-900 group-hover:text-gold-650 transition-colors" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-sm leading-snug">{result.title}</span>
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full shrink-0">
                                {result.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{result.description}</p>
                          </div>
                          <CornerDownRight className="h-4 w-4 text-slate-450 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // No Results fallback
                <div className="text-center py-10 text-slate-450">
                  <Search className="h-8 w-8 mx-auto text-slate-350 mb-3" />
                  <p className="text-sm">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for other terms like 'admissions', 'bca', or 'physics'.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </header>
  )
}
