import { Header } from '@/components/navigation/main-nav'
import { Footer } from '@/components/navigation/footer'
import { LegalConsentBanner } from '@/components/navigation/legal-consent-banner'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[96px] md:pt-[144px]">{children}</main>
      <Footer />
      <LegalConsentBanner />
    </>
  )
}
