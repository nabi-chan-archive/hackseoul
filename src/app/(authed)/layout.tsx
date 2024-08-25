'use client'

import { HomeIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function DetailLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { t } = useTranslation('common')

  return (
    <>
      {children}
      <footer className="sticky bottom-0 inset-x-0 bg-white z-50 flex gap-2">
        <Link
          href="/search"
          className="flex-1 flex flex-col gap-1 justify-center items-center py-4"
          style={{
            color: pathname !== '/mypage' ? '#2A3CE5' : 'gray',
          }}
        >
          <HomeIcon width={24} />
          <span>{t('nav.home')}</span>
        </Link>
        <Link
          href="/mypage"
          className="flex-1 flex flex-col gap-1 justify-center items-center py-4"
          style={{
            color: pathname === '/mypage' ? '#2A3CE5' : 'gray',
          }}
        >
          <UserCircleIcon width={24} />
          <span>{t('nav.my_page')}</span>
        </Link>
      </footer>
    </>
  )
}
