'use client'

import Link from 'next/link'
import { useState, useTransition, useRef } from 'react'
import { Mail, Phone, Calendar, Trash2, CheckCircle, Reply } from 'lucide-react'
import { updateMessageStatus, deleteMessage } from '@/lib/cms/actions'
import { toast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface MessageRow {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  created_at: string
  status: string
}

const STATUS_STYLES: Record<string, string> = {
  unread: 'bg-gold-100 text-gold-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
}

export function CmsMessageList({ messages }: { messages: MessageRow[] }) {
  const [list, setList] = useState(messages)
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<MessageRow | null>(null)
  const processingIds = useRef<Set<string>>(new Set())

  function updateStatus(m: MessageRow, status: 'read' | 'replied') {
    const key = `${m.id}-${status}`
    if (m.status === status || processingIds.current.has(key)) return
    processingIds.current.add(key)
    startTransition(async () => {
      const result = await updateMessageStatus(m.id, status)
      if (!('error' in result)) {
        setSelected((prev) => (prev && prev.id === m.id ? { ...prev, status } : prev))
        setList((prev) => prev.map((row) => (row.id === m.id ? { ...row, status } : row)))
      } else {
        processingIds.current.delete(key)
        toast({
          title: 'Error',
          description: result.error || `Failed to mark as ${status}`,
          variant: 'destructive',
        })
      }
    })
  }

  const [messageToDelete, setMessageToDelete] = useState<MessageRow | null>(null)

  function remove(m: MessageRow) {
    setMessageToDelete(m)
  }

  // Detail view
  if (selected) {
    return (
      <>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_STYLES[selected.status] || ''}`}>
                  {selected.status}
                </span>
                <h2 className="font-display text-xl font-semibold text-academic-900">
                  {selected.subject || '(no subject)'}
                </h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">From {selected.name}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-gray-500 hover:text-academic-900"
            >
              ← Back to list
            </button>
          </div>

          <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <a href={`mailto:${selected.email}`} className="text-academic-900 hover:text-gold-600">
                {selected.email}
              </a>
            </div>
            {selected.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${selected.phone}`} className="text-gray-700">{selected.phone}</a>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">
                {new Date(selected.created_at).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Message Body */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Message Content</h4>
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
              {selected.message}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 pt-6 border-t border-gray-100">
            {selected.status === 'unread' && (
              <button
                onClick={() => updateStatus(selected, 'read')}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <CheckCircle className="h-4 w-4" /> Mark as Read
              </button>
            )}
            <a
              href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || '')}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-academic-900 text-white rounded-lg hover:bg-academic-800 transition-colors"
            >
              <Reply className="h-4 w-4" /> Reply via Email
            </a>
            <button
              onClick={() => updateStatus(selected, 'replied')}
              disabled={isPending || selected.status === 'replied'}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4" /> Mark Replied
            </button>
            <button
              onClick={() => remove(selected)}
              disabled={isPending}
              className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      </div>
      {messageToDelete && (
        <AlertDialog open={!!messageToDelete} onOpenChange={(open) => { if (!open) setMessageToDelete(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the message from &quot;{messageToDelete.name}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={() => {
                  const m = messageToDelete
                  setMessageToDelete(null)
                  startTransition(async () => {
                    const result = await deleteMessage(m.id)
                    if (result && 'error' in result) {
                      toast({
                        title: 'Error',
                        description: `Failed to delete message: ${result.error}`,
                        variant: 'destructive',
                      })
                    } else {
                      toast({
                        title: 'Success',
                        description: 'Message deleted successfully.',
                      })
                      setSelected(null)
                      setList((prev) => prev.filter((row) => row.id !== m.id))
                    }
                  })
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      </>
    )
  }

  // List view
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {list.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <Mail className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {list.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelected(m)
                const key = `${m.id}-read`
                if (m.status === 'unread' && !processingIds.current.has(key)) {
                  processingIds.current.add(key)
                  setList((prev) =>
                    prev.map((row) => (row.id === m.id ? { ...row, status: 'read' } : row))
                  )
                  startTransition(async () => {
                    const result = await updateMessageStatus(m.id, 'read')
                    if (result && 'error' in result) {
                      setList((prev) =>
                        prev.map((row) => (row.id === m.id ? { ...row, status: 'unread' } : row))
                      )
                      processingIds.current.delete(key)
                      toast({
                        title: 'Error',
                        description: result.error || 'Failed to mark as read',
                        variant: 'destructive',
                      })
                    }
                  })
                }
              }}
              className={`w-full text-left flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                m.status === 'unread' ? 'bg-gold-50/40' : ''
              }`}
            >
              <div className="w-10 h-10 bg-academic-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-academic-900 font-display font-bold text-sm">
                  {m.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {m.status === 'unread' && (
                    <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-sm truncate ${m.status === 'unread' ? 'font-semibold text-academic-900' : 'font-medium text-gray-700'}`}>
                    {m.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {m.subject || '(no subject)'} · {m.email}
                </p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_STYLES[m.status] || ''} flex-shrink-0`}>
                {m.status}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {new Date(m.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </button>
          ))}
        </div>
      )}
      {messageToDelete && (
        <AlertDialog open={!!messageToDelete} onOpenChange={(open) => { if (!open) setMessageToDelete(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the message from &quot;{messageToDelete.name}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={() => {
                  const m = messageToDelete
                  setMessageToDelete(null)
                  startTransition(async () => {
                    const result = await deleteMessage(m.id)
                    if (result && 'error' in result) {
                      toast({
                        title: 'Error',
                        description: `Failed to delete message: ${result.error}`,
                        variant: 'destructive',
                      })
                    } else {
                      toast({
                        title: 'Success',
                        description: 'Message deleted successfully.',
                      })
                      setSelected(null)
                      setList((prev) => prev.filter((row) => row.id !== m.id))
                    }
                  })
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
