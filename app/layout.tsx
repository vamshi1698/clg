import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'National College Jayanagar | Excellence in Education Since 1965',
    template: '%s | National College Jayanagar',
  },
  description: 'National College Jayanagar - A premier autonomous institution committed to academic excellence, holistic development, and preparing students for successful careers.',
  keywords: ['National College', 'Jayanagar', 'Bangalore', 'Higher Education', 'Autonomous College', 'Science', 'Commerce', 'Management'],
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  )
}
