import 'Styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
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
    <html
      lang="ko"
      className={inter.className}
    >
      <body className="p-8 h-screen">
        <ReactQueryProviders>
          <NiceModalProvider>
            <div className="max-w-lg mx-auto shadow-xl border-gray-50 border-[1px] border-solid h-full overflow-y-auto rounded-lg">
              {children}
              <Toaster position="bottom-center" />
            </div>
          </NiceModalProvider>
        </ReactQueryProviders>
      </body>
    </html>
  )
}
