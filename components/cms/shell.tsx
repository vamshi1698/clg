'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

export function CmsShell({
  session,
  children,
}: {
  session: { name: string; email: string; role: string }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/cms/logout', { method: 'POST' })
    window.location.href = '/cms/login'
  }

  const initials = session.name.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-72 bg-academic-900 text-white flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between gap-3 px-6 h-16 border-b border-white/10">
          <Link href="/cms" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
              <span className="text-academic-900 font-display font-bold text-lg">N</span>
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-tight">CMS</div>
              <div className="text-[10px] text-gray-400 leading-tight">National College</div>
            </div>
          </Link>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {NAV.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {section.title}
              </p>
              <ul className="space-y-0.5">
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
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          active
                            ? 'bg-gold-500 text-academic-900 font-medium'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <item.Icon className="h-4 w-4 flex-shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-academic-900 font-display font-bold text-sm">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.name}</p>
              <p className="text-xs text-gray-400 truncate">{session.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-white bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block">
            <span className="text-xs text-gray-400">Content Management System</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 bg-academic-50 text-academic-900 rounded-full font-medium capitalize">
              {session.role.replace('_', ' ')}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
