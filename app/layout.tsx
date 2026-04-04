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
  title: 'Parmeet Singh — Software Development Engineer',
  description:
    'Portfolio of Parmeet Singh — SDE with 3+ years building distributed systems, XR pipelines, and full-stack applications.',
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
