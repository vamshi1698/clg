import { Metadata } from 'next'
import { getSiteSettings, getDepartments } from '@/lib/data/public'
import { ContactPage } from '@/components/contact/contact-page'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with National College Jayanagar - Address, phone, email, and inquiry form.',
}

export default async function Contact() {
  const [settings, departments] = await Promise.all([
    getSiteSettings(),
    getDepartments(),
  ])
  return <ContactPage settings={settings} departments={departments} />
}
