import './globals.css'
import type { Metadata } from 'next'
import { Lato, Bebas_Neue } from 'next/font/google'

// Load fonts via next/font for zero render-blocking, automatic preloading & self-hosting
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  variable: '--font-lato',
  preload: true,
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bebas-neue',
  preload: false, // only used for display headings — not needed for FCP
})

export const metadata: Metadata = {
  title: {
    default: 'National College Jayanagar | Excellence in Education Since 1965',
    template: '%s | National College Jayanagar',
  },
  description: 'National College Jayanagar — a premier NAAC A++ autonomous institution committed to academic excellence, holistic development, and preparing students for successful careers since 1965.',
  keywords: ['National College', 'Jayanagar', 'Bangalore', 'Higher Education', 'Autonomous College', 'NAAC A++', 'Science', 'Commerce', 'Management', 'Arts', 'UG PG programs Bangalore'],
  authors: [{ name: 'National College Jayanagar' }],
  creator: 'National College Jayanagar',
  publisher: 'National College Jayanagar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nationalcollege.edu.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'National College Jayanagar | Excellence in Education Since 1965',
    description: 'A premier autonomous institution committed to academic excellence, holistic development, and preparing students for successful careers.',
    url: 'https://nationalcollege.edu.in',
    siteName: 'National College Jayanagar',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'National College Jayanagar Campus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'National College Jayanagar | Excellence in Education Since 1965',
    description: 'A premier autonomous institution committed to academic excellence and holistic development.',
    images: ['/og-image.jpg'],
    creator: '@NationalColl',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-search-console-token', // Replace with actual token after adding to Google Search Console
  },
}

// JSON-LD structured data for rich search results
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'National College Jayanagar',
  alternateName: 'National College (Autonomous)',
  url: 'https://nationalcollege.edu.in',
  logo: 'https://nationalcollege.edu.in/icon.png',
  image: 'https://nationalcollege.edu.in/og-image.jpg',
  description: 'National College Jayanagar is a premier NAAC A++ autonomous institution offering UG and PG programs in Science, Commerce, Management and Arts, established in 1965.',
  foundingDate: '1965',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 36th B Cross, 2nd Main Road, 7th Block, Jayanagar',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560070',
    addressCountry: 'IN',
  },
  telephone: '+91-80-12345678',
  email: 'info@nationalcollege.edu.in',
  sameAs: [
    'https://www.facebook.com/NationalCollegeJayanagar',
    'https://www.instagram.com/nationalcollege',
    'https://www.linkedin.com/school/national-college-jayanagar',
    'https://twitter.com/NationalColl',
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'NAAC A Accredited' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'UGC Recognized' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Autonomous Institution' },
  ],
}

import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`scroll-smooth ${lato.variable} ${bebasNeue.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}

