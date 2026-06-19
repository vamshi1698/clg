'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Mail, MapPin, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about', hasDropdown: true, items: [
    { name: 'History', href: '/about#history' },
    { name: 'Vision & Mission', href: '/about#vision-mission' },
    { name: 'Leadership', href: '/about#leadership' },
    { name: 'Accreditation', href: '/about#accreditation' },
  ]},
  { name: 'Departments', href: '/departments' },
  { name: 'Courses', href: '/courses', hasDropdown: true, items: [
    { name: 'UG Programs', href: '/courses?level=ug' },
    { name: 'PG Programs', href: '/courses?level=pg' },
    { name: 'Diploma Programs', href: '/courses?level=diploma' },
  ]},
  { name: 'Faculty', href: '/faculty' },
  { name: 'News & Events', href: '/news' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Results', href: '/results' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    )}>
      {/* Top bar */}
      <div className="bg-academic-900 text-white py-2 hidden md:block">
        <div className="container-wide flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+918026631234" className="flex items-center gap-2 hover:text-gold-500 transition-colors">
              <Phone className="h-3.5 w-3.5" />
              +91-80-26631234
            </a>
            <a href="mailto:info@nationalcollege.edu.in" className="flex items-center gap-2 hover:text-gold-500 transition-colors">
              <Mail className="h-3.5 w-3.5" />
              info@nationalcollege.edu.in
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Jayanagar, Bangalore
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cms" className="hover:text-gold-500 transition-colors">
              CMS Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container-wide">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-academic-900 rounded-lg flex items-center justify-center">
              <span className="text-gold-500 font-display font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-academic-900 leading-tight">
                National College
              </h1>
              <p className="text-xs text-muted-foreground">Jayanagar, Bangalore</p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded-lg',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-gold-600'
                      : 'text-academic-900 hover:text-gold-600 hover:bg-academic-50'
                  )}
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </Link>

                {/* Dropdown */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 fade-in">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-academic-50 hover:text-academic-900"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search and CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/admissions" className="btn-primary px-5 py-2.5 rounded-lg text-sm font-medium">
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-academic-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container-wide py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'block px-4 py-3 text-base font-medium rounded-lg',
                    pathname === item.href
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-academic-900 hover:bg-academic-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.hasDropdown && item.items && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-academic-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t mt-4">
              <Link
                href="/admissions"
                className="btn-primary block text-center px-5 py-3 rounded-lg text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
