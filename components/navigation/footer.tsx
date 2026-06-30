import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react'
import logoImage from '@/components/brand/channels4_profile.jpg'

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Departments', href: '/departments' },
  { name: 'Courses', href: '/courses' },
  { name: 'Faculty', href: '/faculty' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'Results', href: '/results' },
]

const resourceLinks = [
  { name: 'Campus Life', href: '/campus-life' },
  { name: 'Students', href: '/students' },
  { name: 'Alumni', href: '/alumni' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Research', href: '/research' },
  { name: 'Contact Us', href: '/contact' },
]

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-academic-950 text-white">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-gold-500 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-academic-500 blur-3xl" />
      </div>
      {/* Main footer */}
      <div className="relative container-wide section-padding">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* College Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full shadow-md ring-2 ring-gold-500/30 flex-shrink-0">
                <Image src={logoImage} alt="National College logo" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white">The National College Jayanagar</h2>
                <p className="text-xs text-gray-400">Bangalore, Karnataka</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              A premier autonomous institution committed to academic excellence, holistic development,
              and preparing students for successful careers since 1965.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition-colors hover:bg-gold-500 hover:text-academic-900"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display mb-6 text-lg font-semibold text-gold-500">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display mb-6 text-lg font-semibold text-gold-500">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display mb-6 text-lg font-semibold text-gold-500">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  National College, Jayanagar,<br />
                  Bangalore - 560070,<br />
                  Karnataka, India
                </span>
              </li>
              <li>
                <a
                  href="tel:+918026631234"
                  className="flex items-center gap-3 text-gray-400 hover:text-gold-500 transition-colors text-sm"
                >
                  <Phone className="h-5 w-5 text-gold-500" />
                  +91-80-26631234
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@nationalcollege.edu.in"
                  className="flex items-center gap-3 text-gray-400 hover:text-gold-500 transition-colors text-sm"
                >
                  <Mail className="h-5 w-5 text-gold-500" />
                  info@nationalcollege.edu.in
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock className="h-5 w-5 text-gold-500" />
                Mon - Sat: 9:00 AM - 5:00 PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-center text-sm text-white/55 md:text-left">
            © {currentYear} National College Jayanagar. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-gold-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gold-500 transition-colors">
              Terms of Use
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-gold-500 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
