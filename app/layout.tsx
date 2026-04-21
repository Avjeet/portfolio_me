import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Avjeet Singh — Multiplatform Mobile Architect | Android Engineer',
  description:
    'Portfolio of Avjeet Singh — Android & KMP/CMP Engineer with 6+ years building mobile apps, GSoC Mentor, and Hackathon Winner.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
