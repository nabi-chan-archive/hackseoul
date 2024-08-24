import Image from 'next/image'
import { Suspense } from '@suspensive/react'
import createTranslation from 'next-translate/createTranslation'
import logo from '@/assets/logo.svg'
import { GithubLogin } from './login'

export default function Page() {
  const { t } = createTranslation('common')

  return (
    <main className="px-10 py-20 flex flex-col justify-between h-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold pl-3">{t('service.slogan')}</h1>
        <Image
          src={logo}
          alt=""
        />
      </div>

      <Suspense>
        <GithubLogin />
      </Suspense>
    </main>
  )
}
