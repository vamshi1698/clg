import { Header } from '@/components/navigation/main-nav'
import { Footer } from '@/components/navigation/footer'
import { LegalConsentBanner } from '@/components/navigation/legal-consent-banner'
import { getActiveResultsPdfs } from '@/lib/actions/public-actions'
import Link from 'next/link'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <LegalConsentBanner />
    </>
  )
}
