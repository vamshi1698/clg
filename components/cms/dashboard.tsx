'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Plus, ArrowRight, Inbox } from 'lucide-react'
import { TABLE_CONFIGS } from '@/lib/cms/tables'

const iconComponents = {
  Mail,
}

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
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-academic-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all college website content and data.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {counts.map((item, i) => {
          const config = TABLE_CONFIGS.find((t) => t.slug === item.slug)
          return (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/cms/${item.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gold-300 transition-all group"
              >
                <div className="text-2xl font-display font-bold text-academic-900">
                  {item.count}
                </div>
                <div className="text-xs text-gray-500 mt-1 group-hover:text-gold-600 transition-colors">
                  {item.label}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent messages */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-gold-600" />
              <h2 className="font-display font-semibold text-academic-900">Recent Messages</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <Link
              href="/cms/messages"
              className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {messages.length === 0 ? (
              <p className="p-8 text-center text-gray-400 text-sm">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <Link
                  key={m.id}
                  href={`/cms/messages/${m.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm truncate">{m.name}</span>
                      {m.status === 'unread' && (
                        <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {m.subject || '(no subject)'} · {m.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
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
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-display font-semibold text-academic-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/cms/news/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gold-600" />
              <span className="text-sm font-medium text-gray-700">Add News</span>
            </Link>
            <Link
              href="/cms/events/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gold-600" />
              <span className="text-sm font-medium text-gray-700">Add Event</span>
            </Link>
            <Link
              href="/cms/courses/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gold-600" />
              <span className="text-sm font-medium text-gray-700">Add Course</span>
            </Link>
            <Link
              href="/cms/faculty/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gold-600" />
              <span className="text-sm font-medium text-gray-700">Add Faculty</span>
            </Link>
            <Link
              href="/cms/gallery/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gold-600" />
              <span className="text-sm font-medium text-gray-700">Add Gallery Item</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
