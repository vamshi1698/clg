import { Header, NavItem } from '@/components/navigation/main-nav'
import { Footer } from '@/components/navigation/footer'
import { LegalConsentBanner } from '@/components/navigation/legal-consent-banner'
import { getNavigationLinks } from '@/lib/data/public'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const rawLinks = await getNavigationLinks()
  
  // Build nested hierarchy: 1 level deep
  let navItems: NavItem[] = []
  if (rawLinks && rawLinks.length > 0) {
    navItems = rawLinks
      .filter((link) => !link.parent_id)
      .map((parent) => {
        const children = rawLinks.filter((link) => link.parent_id === parent.id)
        return {
          name: parent.name,
          href: parent.href,
          hasDropdown: children.length > 0,
          items: children.length > 0 
            ? children.map((child) => ({ name: child.name, href: child.href }))
            : undefined,
        }
      })
  }

  return (
    <>
      <Header navItems={navItems} />
      <main className="flex-1">{children}</main>
      <Footer />
      <LegalConsentBanner />
    </>
  )
}
