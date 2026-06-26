'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X } from 'lucide-react'

export function LegalConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Access localStorage on client-side mount
    const consent = localStorage.getItem('nc_legal_agreement_accepted')
    if (!consent) {
      // Small delay to make the entrance feel deliberate and premium
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('nc_legal_agreement_accepted', 'true')
    setVisible(false)
  }

  const handleEssential = () => {
    localStorage.setItem('nc_legal_agreement_accepted', 'essential')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 bg-academic-950/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-5 text-white flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex w-9 h-9 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm tracking-wide text-white uppercase">
                Privacy & Terms Agreement
              </h3>
            </div>
            <button
              onClick={handleEssential}
              className="text-white/40 hover:text-white transition-colors p-1"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-white/75 leading-relaxed font-sans">
            We use essential site tools and cookies to optimize your administrative portal and results access. By browsing the National College Jayanagar website, you consent to our{' '}
            <Link
              href="/terms"
              className="text-gold-400 hover:text-gold-300 hover:underline font-semibold"
            >
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="text-gold-400 hover:text-gold-300 hover:underline font-semibold"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-1">
            <button
              onClick={handleEssential}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              Essential Cookies Only
            </button>
            <button
              onClick={handleAccept}
              className="bg-gold-500 hover:bg-gold-400 active:scale-95 text-academic-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-gold-500/10 transition-all"
            >
              Accept & Agree
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
