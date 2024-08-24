import 'Styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import ReactQueryProviders from '@/providers/react-query'
import NiceModalProvider from '@/providers/nice-modal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SERVICE_NAME',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ReactQueryProviders>
          <NiceModalProvider>{children}</NiceModalProvider>
        </ReactQueryProviders>
      </body>
    </html>
  )
}
