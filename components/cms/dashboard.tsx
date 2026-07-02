'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  FileText
} from 'lucide-react'
import { TABLE_CONFIGS } from '@/lib/cms/tables'

const iconComponents: Record<string, any> = {}

// Sleek SaaS accents for cards instead of full pastel backgrounds
const cardAccents = [
  { text: 'text-blue-500', bg: 'bg-blue-500/10', ring: 'ring-blue-500/20' },
  { text: 'text-violet-500', bg: 'bg-violet-500/10', ring: 'ring-violet-500/20' },
  { text: 'text-emerald-500', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' },
  { text: 'text-amber-500', bg: 'bg-amber-500/10', ring: 'ring-amber-500/20' },
  { text: 'text-rose-500', bg: 'bg-rose-500/10', ring: 'ring-rose-500/20' },
  { text: 'text-sky-500', bg: 'bg-sky-500/10', ring: 'ring-sky-500/20' },
  { text: 'text-indigo-500', bg: 'bg-indigo-500/10', ring: 'ring-indigo-500/20' },
  { text: 'text-teal-500', bg: 'bg-teal-500/10', ring: 'ring-teal-500/20' },
  { text: 'text-orange-500', bg: 'bg-orange-500/10', ring: 'ring-orange-500/20' },
  { text: 'text-cyan-500', bg: 'bg-cyan-500/10', ring: 'ring-cyan-500/20' },
  { text: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', ring: 'ring-fuchsia-500/20' },
  { text: 'text-lime-600', bg: 'bg-lime-500/10', ring: 'ring-lime-500/20' },
]

const quickActions = [
  { label: 'Add News Article', desc: 'Publish a news or announcement', href: '/cms/news/new', color: 'text-blue-500' },
  { label: 'Add Event', desc: 'Schedule an upcoming event', href: '/cms/events/new', color: 'text-violet-500' },
  { label: 'Add Course', desc: 'Create a new program offering', href: '/cms/courses/new', color: 'text-emerald-500' },
  { label: 'Add Faculty', desc: 'Add a faculty member profile', href: '/cms/faculty/new', color: 'text-amber-500' },
  { label: 'Add Gallery Item', desc: 'Upload a campus photo', href: '/cms/gallery/new', color: 'text-rose-500' },
  { label: 'Upload Results', desc: 'Bulk upload exam results PDF', href: '/cms/results-upload', color: 'text-sky-500' },
]

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  created_at: string
  status: string
}

interface CountItem {
  slug: string
  label: string
  icon: string
  count: number
}

export function CmsDashboard({
  counts,
  messages,
  unreadCount,
}: {
  counts: CountItem[]
  messages: Message[]
  unreadCount: number
}) {
  const now = new Date()
  const greeting =
    now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-10 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">{greeting} 👋 Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Last updated: {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Stat cards */}
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Content Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {counts.map((item, i) => {
            const color = cardAccents[i % cardAccents.length]
            const IconComp = iconComponents[item.icon] || FileText
            return (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
              >
                <Link
                  href={`/cms/${item.slug}`}
                  className="group relative flex flex-col bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
                >
                  <div className="flex items-start justify-end mb-4">
                    <ArrowRight className="h-4 w-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-gray-900 mb-0.5">
                      {item.count}
                    </div>
                    <div className="text-xs font-medium text-gray-500 truncate">{item.label}</div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Recent messages */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-gray-900">Recent Messages</h2>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold tracking-wider uppercase rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <Link
              href="/cms/messages"
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
                <p className="text-sm font-semibold text-gray-600">No new messages</p>
                <p className="text-xs text-gray-500 mt-1">Your inbox is completely clear.</p>
              </div>
            ) : (
              messages.map((m) => (
                <Link
                  key={m.id}
                  href={`/cms/messages/${m.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300/50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-xs font-bold text-gray-600">
                      {m.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm truncate">{m.name}</span>
                      {m.status === 'unread' && (
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 shadow-sm" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      <span className="text-gray-400">{m.email}</span>
                      {m.subject && <span className="mx-1.5 text-gray-300">•</span>}
                      {m.subject && <span>{m.subject}</span>}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors">
                    {new Date(m.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3.5 p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm transition-all group"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900">{action.label}</div>
                  <div className="text-[11px] font-medium text-gray-500 mt-0.5 truncate">{action.desc}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
