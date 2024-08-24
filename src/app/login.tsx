'use client'

import { ArrowRightIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/navigation'

export function GithubLogin() {
  const { t } = useTranslation('common')
  const { push } = useRouter()

  return (
    <button
      onClick={async () => {
        push('/search')
        toast.success(t('login.toast.success'))
      }}
      className="bg-[#2A3CE5] text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-between hover:bg-blue-700 focus:outline-none w-full"
    >
      <span className="flex-1 text-center">{t('login.provider.github')}</span>
      <ArrowRightIcon className="w-5" />
    </button>
  )
}
