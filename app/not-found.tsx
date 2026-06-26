'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, BookOpen, GraduationCap, Award, Mail, Phone, ArrowRight } from 'lucide-react'
import { Header } from '@/components/navigation/main-nav'
import { Footer } from '@/components/navigation/footer'

export default function NotFound() {
  const links = [
    {
      name: 'Latest Results',
      href: '/results',
      description: 'Check semester examination results and academic summaries.',
      icon: Award,
    },
    {
      name: 'Explore Courses',
      href: '/courses',
      description: 'Browse our undergraduate and postgraduate degree programs.',
      icon: BookOpen,
    },
    {
      name: 'Departments',
      href: '/departments',
      description: 'Learn about faculty, facilities, and research areas.',
      icon: GraduationCap,
    },
    {
      name: 'Contact Admissions',
      href: '/admissions',
      description: 'Submit an enquiry or learn about the admission process.',
      icon: Mail,
    },
  ]

  return (
    <>
      <Header />
      <main className="flex-1 pt-[72px] md:pt-[120px] bg-slate-50 min-h-[calc(100vh-120px)] flex flex-col justify-center relative overflow-hidden">
        {/* Ambient glowing background blobs */}
        <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-academic-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-wide relative py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* 404 Graphic Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center"
            >
              <span className="font-display text-8xl md:text-9xl font-extrabold text-academic-900 tracking-tighter relative select-none">
                4
                <span className="text-gold-500 relative inline-block mx-1">
                  0
                  <span className="absolute -inset-1 rounded-full bg-gold-500/10 animate-ping opacity-75" />
                </span>
                4
              </span>
            </motion.div>

            {/* Academic-themed heading */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-3xl md:text-5xl font-bold text-academic-900 mt-6 tracking-tight"
            >
              Out of Syllabus!
            </motion.h2>

            {/* Explanatory subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mt-4 leading-relaxed font-sans"
            >
              The page you are looking for has taken a recess, or is not included in our current course structure. Let's get you back on track.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <Link
                href="/"
                className="w-full sm:w-auto bg-academic-900 hover:bg-academic-800 text-white font-medium px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Home className="h-5 w-5" />
                <span>Return to Homepage</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-academic-900 font-medium px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                <span>Contact College Support</span>
              </Link>
            </motion.div>

            {/* Suggested Directory Resources */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 text-left border-t border-slate-200 pt-12"
            >
              <h3 className="font-display text-xl font-bold text-academic-900 mb-6 text-center sm:text-left">
                Suggested Resources
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 hover:border-gold-300 hover:shadow-xl hover:shadow-gold-500/5 transition-all group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 text-academic-900 flex items-center justify-center group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                      <link.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-base text-academic-900 group-hover:text-gold-600 transition-colors flex items-center gap-1.5">
                        <span>{link.name}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 leading-normal font-sans">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
