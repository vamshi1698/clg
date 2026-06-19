'use client'

import { useTransition } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { SiteSettings, Department } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

interface ContactPageProps {
  settings: SiteSettings | null
  departments: Department[]
}

export function ContactPage({ settings, departments }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    department: ''
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    startTransition(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject || null,
            message: formData.message,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Request failed')
        }
        setStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          department: ''
        })
      } catch {
        setStatus('error')
      }
    })
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-academic-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={fadeIn}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Have questions? We are here to help. Reach out to us through any of the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-12"
          >
            {/* Contact Info */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-academic-900 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-academic-900 mb-1">Address</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {settings?.address || 'National College, Jayanagar, Bangalore - 560070, Karnataka, India'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-academic-900 mb-1">Phone</h3>
                    <p className="text-gray-600 text-sm">
                      <a href={`tel:${settings?.phone || '+918026631234'}`} className="hover:text-gold-600">
                        {settings?.phone || '+91-80-26631234'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-academic-900 mb-1">Email</h3>
                    <p className="text-gray-600 text-sm">
                      <a href={`mailto:${settings?.email || 'info@nationalcollege.edu.in'}`} className="hover:text-gold-600">
                        {settings?.email || 'info@nationalcollege.edu.in'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-academic-900 mb-1">Office Hours</h3>
                    <p className="text-gray-600 text-sm">
                      Monday - Saturday<br />
                      9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 h-64 bg-gray-100 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8186!2d77.5833!3d12.9301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzQ4LjQiTiA3N8KwMzUnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="College Location Map"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeIn} className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-academic-900 mb-8">Send us a Message</h2>

              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                    <p className="text-green-600 text-sm">We will get back to you soon.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Failed to send message</p>
                    <p className="text-red-600 text-sm">Please try again or contact us directly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Your message..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                  />
                </div>

                <Button type="submit" className="btn-primary" disabled={isPending}>
                  {isPending ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
