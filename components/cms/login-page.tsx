'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import logoImage from '@/public/icon.png'

export function CmsLoginPage({ from }: { from: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = step === 'credentials'
        ? { email, password }
        : { email, otp }

      const res = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Verification failed')
        return
      }

      if (data.requireOtp) {
        setStep('otp')
      } else {
        router.replace(from)
        router.refresh()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-academic-900 via-academic-800 to-academic-950 px-4 py-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-sm ring-1 ring-gray-900/10">
              <Image
                src={logoImage}
                alt="National College Logo"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <h1 className="font-display text-2xl font-bold text-academic-900 text-center">
              CMS Login
            </h1>
            <p className="text-gray-500 text-sm mt-1 text-center">
              National College Jayanagar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 'credentials' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="admin@nationalcollege.edu.in"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('credentials')
                        setOtp('')
                        setError(null)
                      }}
                      className="text-xs text-academic-700 hover:text-academic-900 hover:underline font-semibold"
                    >
                      Use different account
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent tracking-widest text-center font-bold text-lg"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    A One-Time Password was sent to <strong className="text-gray-700">{email}</strong>. Please check your inbox.
                  </p>
                </div>
              </>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-academic-900 text-white py-3 rounded-lg font-medium hover:bg-academic-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {step === 'credentials' ? 'Signing in...' : 'Verifying code...'}
                </>
              ) : (
                <>
                  {step === 'credentials' ? 'Sign In' : 'Verify Code'} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gold-600 transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Authorized personnel only. All actions are logged.
        </p>
      </motion.div>
    </div>
  )
}
