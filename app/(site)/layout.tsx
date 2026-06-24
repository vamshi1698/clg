import { Header } from '@/components/navigation/main-nav'
import { Footer } from '@/components/navigation/footer'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[72px] md:pt-[120px]">{children}</main>
      <Footer />
    </>
  )
}
