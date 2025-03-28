import type { Metadata } from 'next'

import './globals.css'

import { Open_Sans } from 'next/font/google'

import { TRPCReactProvider } from '@rhu-ii/api/client'

import { Main } from '../components/main'
import { NavigationMenu } from '../components/navigation-menu'

const openSans = Open_Sans({
  variable: '--font-open-sans',
  display: 'swap',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    template: `%s - RHU II System`,
    default: 'RHU II System'
  },
  description:
    'A comprehensive management system for Rural Health Units providing free healthcare services including checkups, medicine, and more.',
  keywords:
    'RHU, rural health unit, healthcare management, patient management, medicine inventory, government healthcare, free medical services',
  authors: [
    {
      name: 'Ivan Gregor Tabalno'
    }
  ],
  creator: 'Ivan Gregor Tabalno',
  publisher: 'Ivan Gregor Tabalno',
  applicationName: 'RHU II System',
  category: 'Healthcare',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rhu-ii-system.gov.ph/',
    title: 'RHU II System',
    description:
      'Comprehensive healthcare management system for Rural Health Units offering free medical services, patient management, and inventory tracking.',
    siteName: 'RHU II System',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RHU II System'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RHU II System',
    description:
      'Government healthcare management system for Rural Health Units providing free medical services.',
    images: ['/images/twitter-image.jpg']
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { url: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  appleWebApp: {
    title: 'RHU II System',
    statusBarStyle: 'black-translucent',
    capable: true
  },
  verification: {
    google: 'google-site-verification-code'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${openSans.variable} antialiased`}>
        <TRPCReactProvider>
          <NavigationMenu />
          <Main>{children}</Main>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
