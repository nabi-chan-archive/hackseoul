import Image from 'next/image'
import { Suspense } from '@suspensive/react'
import logo from '@/assets/logo.png'
import { GithubLogin } from './login'

export default function Page() {
  return (
    <main className="px-10 py-20 flex flex-col justify-between h-full">
      <Image
        src={logo}
        alt="프리뷰 로고"
      />

      <Suspense>
        <GithubLogin />
      </Suspense>
    </main>
  )
}
