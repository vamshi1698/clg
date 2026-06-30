'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import logoImage from '@/components/brand/channels4_profile.jpg'
import {
  LayoutDashboard,
  Settings,
  BarChart3,
  Building2,
  BookOpen,
  Users,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  Quote,
  Award,
  Briefcase,
  History,
  Medal,
  UserCog,
  GraduationCap,
  FileText,
  TrendingUp,
  Mail,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Upload,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TABLE_CONFIGS } from '@/lib/cms/tables'

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Settings,
  BarChart3,
  Building2,
  BookOpen,
  Users,
  Newspaper,
  Calendar,
  Image: ImageIcon,
  Quote,
  Award,
  Briefcase,
  History,
  Medal,
  UserCog,
  GraduationCap,
  FileText,
  TrendingUp,
  Mail,
  Upload,
}

const NAV_SECTIONS = [
  {
    title: 'Site',
    items: [
      { slug: '', label: 'Dashboard', icon: 'LayoutDashboard' },
      { slug: 'settings', label: 'Site Settings', icon: 'Settings' },
      { slug: 'statistics', label: 'Statistics', icon: 'BarChart3' },
      { slug: 'messages', label: 'Messages', icon: 'Mail' },
      { slug: 'admission-enquiries', label: 'Admission Enquiries', icon: 'FileText' },
    ],
  },
  {
    title: 'Academics',
    items: TABLE_CONFIGS.filter((t) =>
      ['departments', 'courses', 'faculty', 'leadership'].includes(t.slug)
    ).map((t) => ({ slug: t.slug, label: t.label, icon: t.icon })),
  },
  {
    title: 'Content',
    items: TABLE_CONFIGS.filter((t) =>
      ['news', 'events', 'gallery', 'testimonials', 'achievements', 'recruiters', 'milestones', 'accreditations'].includes(t.slug)
    ).map((t) => ({ slug: t.slug, label: t.label, icon: t.icon })),
  },
  {
    title: 'Examinations',
    items: [
      ...TABLE_CONFIGS.filter((t) =>
        ['students', 'results', 'result-summaries'].includes(t.slug)
      ).map((t) => ({ slug: t.slug, label: t.label, icon: t.icon })),
      { slug: 'results-upload', label: 'Upload Results', icon: 'Upload' },
    ],
  },
]

function fixItem(raw: { slug: string; label: string; icon: string }) {
  return { slug: raw.slug, label: raw.label, Icon: iconMap[raw.icon] || FileText }
}

const NAV = NAV_SECTIONS.map((s) => ({
  title: s.title,
  items: s.items.map(fixItem),
}))

function useBreadcrumb(pathname: string) {
  const parts = pathname.replace('/cms', '').split('/').filter(Boolean)
  const crumbs: { label: string; href: string }[] = [{ label: 'CMS', href: '/cms' }]
  parts.forEach((part, i) => {
    const href = '/cms/' + parts.slice(0, i + 1).join('/')
    const label = part === 'new' ? 'New' : part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    crumbs.push({ label, href })
  })
  return crumbs
}

export function CmsShell({
  session,
  children,
}: {
  session: { name: string; email: string; role: string }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const breadcrumbs = useBreadcrumb(pathname)

  async function handleLogout() {
    await fetch('/api/cms/logout', { method: 'POST' })
    window.location.href = '/cms/login'
  }

  const initials = session.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()

  return (
    <div className="h-screen bg-[#f5f6fa] flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 h-full flex-shrink-0',
          'bg-[#0e1726] text-white',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-white/8 flex-shrink-0">
          <Link href="/cms" className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full shadow-sm ring-1 ring-gold-400/40 flex-shrink-0">
              <Image src={logoImage} alt="National College logo" fill sizes="32px" className="object-cover" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white leading-tight">National CMS</div>
              <div className="text-[10px] text-white/40 leading-tight">Content Management</div>
            </div>
          </Link>
          <button
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35 select-none">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const href = item.slug ? `/cms/${item.slug}` : '/cms'
                  const active =
                    item.slug === ''
                      ? pathname === '/cms'
                      : pathname.startsWith(href)
                  return (
                    <li key={item.slug || 'dashboard'}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 overflow-hidden group',
                          active
                            ? 'bg-white/10 text-white font-semibold shadow-sm'
                            : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                        )}
                      >
                        {/* Active indicator */}
                        {active && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gold-400 rounded-r-full" />
                        )}
                        <item.Icon className={cn('h-4 w-4 flex-shrink-0 transition-colors', active ? 'text-gold-400' : 'text-white/40 group-hover:text-white/70')} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/8 p-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-[#0e1726] font-bold text-xs">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-tight">{session.name}</p>
              <p className="text-[11px] text-white/40 truncate leading-tight">{session.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-white/55 hover:text-white hover:bg-white/8 rounded-lg transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-white/55 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-gray-50/50">
        {/* Top bar */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-gray-900">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-gray-500 hover:text-gray-900 font-medium transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
              {session.role.replace('_', ' ')}
            </span>
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-gold-500/20">
              <span className="text-[#0e1726] font-bold text-xs">{initials}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
