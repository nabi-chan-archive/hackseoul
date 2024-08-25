import { Suspense, type ReactNode } from 'react'
import { Footer } from './nav'

export default function DetailLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Suspense>
        <Footer />
      </Suspense>
    </>
  )
}
