import type { Metadata } from 'next'
import { FileText, Eye, Info, AlertTriangle, Scale, HelpCircle, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and Conditions of Use for National College Jayanagar portal.',
}

export default function TermsOfUsePage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      icon: Eye,
      content:
        'Welcome to the National College Jayanagar website (nationalcollege.edu.in). By accessing, browsing, or using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use, as well as all applicable laws and regulations. If you do not agree to these terms, please do not use this portal.',
    },
    {
      title: '2. Intellectual Property & Use of Content',
      icon: Info,
      content:
        'All materials published on this website (including articles, circulars, department details, images, course guides, results documents, and logos) are the intellectual property of National College Jayanagar or its content providers. \n\nYou are granted a limited, non-exclusive, non-transferable license to view, download, and print contents for personal, educational, and non-commercial informational use only. Modifying, republishing, or redistributing website content without our express written consent is strictly prohibited.',
    },
    {
      title: '3. Student Portal and Accounts',
      icon: Scale,
      content:
        'If you use restricted areas of this site, including the CMS admin portal or Student Results portal:\n\n• You are responsible for maintaining the confidentiality of your login credentials (usernames, passwords, and OTP codes).\n• You agree to accept responsibility for all activities that occur under your account.\n• You must notify administrative support immediately of any unauthorized account access or security breach.',
    },
    {
      title: '4. Accuracy of Information',
      icon: AlertTriangle,
      content:
        'We make every effort to ensure that the descriptions of academic programs, fees, course requirements, important dates, and announcements listed on this site are accurate and current. However, all curriculum options, admission eligibility requirements, and fees are subject to revision by the Academic Council. The college reserves the right to modify educational programs, fee structures, or policies without prior notice.',
    },
    {
      title: '5. Prohibited Activities',
      icon: AlertTriangle,
      content:
        'Users of this website agree not to engage in any activity that could disrupt or damage the portal, including:\n\n• Attempting to gain unauthorized access to our web servers, administrative databases, or CMS authentication endpoints.\n• Copying, scraping, or harvesting website data through bots, scrapers, or automated scripts.\n• Using the contact and enquiry form services to transmit spam, unsolicited emails, or malicious software.',
    },
    {
      title: '6. Limitation of Liability',
      icon: Scale,
      content:
        'The materials on this portal are provided on an "as is" and "as available" basis. National College Jayanagar makes no warranties, express or implied, regarding the continuous availability or error-free status of website services. We shall not be liable for any direct or indirect damages arising out of the use of, or the inability to use, the information or features on this site.',
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
            <FileText className="w-4 h-4" /> Legal Terms
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Terms of Use
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
            Please read these terms carefully before using our digital portals. Accessing the website constitutes your binding acceptance of these policies.
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
            <HelpCircle className="w-6 h-6 text-academic-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Need Clarification?</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                If you have questions about these Terms of Use or require permission for content reproduction, please reach out to the College Administration office.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
