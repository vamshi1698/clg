import type { Metadata } from 'next'
import { ShieldCheck, Mail, FileText, Lock, Eye, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and data protection terms for National College Jayanagar website users.',
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. Introduction',
      icon: Eye,
      content:
        'National College Jayanagar ("we", "us", or "our") is committed to protecting the privacy and personal data of our students, faculty, staff, parents, and visitors. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you visit our website (nationalcollege.edu.in) and use our online systems including the admission enquiry portal and the semester results portal.',
    },
    {
      title: '2. Information We Collect',
      icon: FileText,
      content:
        'We collect information directly from you when you interact with our website. This includes:\n\n• **Admissions & Enquiries**: Name, email address, telephone number, academic level of interest, courses of interest, exam percentage scores, and optional text queries.\n• **Student & Results Portal**: Registered student roll numbers, date of birth, and examination records.\n• **Contact Forms**: Name, email, phone number, subject, and messages submitted to our administrative offices.\n• **Technical Data**: IP addresses, browser types, operating systems, and basic usage logs collected for security and performance purposes.',
    },
    {
      title: '3. How We Use Your Information',
      icon: ShieldCheck,
      content:
        'All collected information is processed solely for academic, administrative, and security purposes: \n\n• To register, evaluate, and follow up on admission enquiries.\n• To display and generate academic transcripts/results in the student portal.\n• To respond to query submissions, contact form messages, and support tickets.\n• To issue security notifications, alerts, and login verifications (such as CMS admin OTP codes).\n• To maintain, monitor, and optimize the security and stability of our website infrastructure.',
    },
    {
      title: '4. Information Security & Protection',
      icon: Lock,
      content:
        'We employ robust administrative, technical, and physical security measures designed to protect your personal data from unauthorized access, alteration, disclosure, or destruction. We do not sell or lease your personal information to third parties. Access to sensitive data is restricted to authorized personnel who require it to perform specific academic or administrative duties.',
    },
    {
      title: '5. Sharing and Third Parties',
      icon: ShieldCheck,
      content:
        'We only share information with third parties in limited circumstances essential for our operations:\n\n• **Service Providers**: We share data with reliable hosting, database, and email distribution services (such as Postgres DB and Resend API) to send automated transactional updates and warnings.\n• **Legal Requirements**: We may disclose information if required to do so by applicable law, regulatory bodies, or a valid court order.',
    },
    {
      title: '6. Your Rights & Access',
      icon: Mail,
      content:
        'You have the right to request access to the personal data we hold about you, request corrections to incorrect details, or ask for the deletion of non-regulatory information. For any privacy-related requests, questions, or concerns, please contact our administrative desk at admissions@nationalcollege.edu or call our campus office.',
    },
  ]

  return (
    <article className="min-h-screen bg-slate-50 font-sans">
      {/* Header Banner */}
      <header className="relative bg-academic-950 text-white overflow-hidden py-16 md:py-20 border-b border-slate-200">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold-500 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-academic-500 blur-3xl" />
        </div>
        <div className="relative container-wide px-4 text-center">
          <span className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-bold uppercase tracking-[0.24em] mb-3">
            <Lock className="w-4 h-4" /> Data Protection
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-gray-300 max-w-lg mx-auto flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span>Effective Date: June 26, 2026</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="container-wide py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Thank you for visiting the National College Jayanagar portal. This policy describes how we handle information collected on our website and through portals to help you make informed decisions when interacting with our digital campus.
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title} className="border-b border-slate-100 pb-8 last:border-b-0 last:pb-0">
                <h2 className="font-display text-xl md:text-2xl font-bold text-academic-950 flex items-center gap-3">
                  <span className="flex w-9 h-9 items-center justify-center rounded-xl bg-slate-50 text-academic-700">
                    <section.icon className="w-5 h-5 text-academic-600" />
                  </span>
                  <span>{section.title}</span>
                </h2>
                <div className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed space-y-4 whitespace-pre-line pl-12 font-sans">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
            <Mail className="w-6 h-6 text-academic-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Contact Information</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                National College Jayanagar Campus Administration Office<br/>
                Jayanagar, Bangalore, Karnataka - 560011<br/>
                Email: admissions@nationalcollege.edu
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
