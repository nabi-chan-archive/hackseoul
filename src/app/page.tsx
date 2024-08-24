'use client'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { supabase } from '@/utils/supabase/client'
import logo from '@/assets/logo.png'

export default function Page() {
  const handleGitHubLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_HOMEPAGE_URL}/search`,
        },
      })
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  return (
    <div className="px-10 py-20 flex flex-col justify-between h-full">
      <Image
        src={logo}
        alt="프리뷰 로고"
      />
      <button
        onClick={handleGitHubLogin}
        className="bg-[#2A3CE5] text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-between hover:bg-blue-700 focus:outline-none w-full"
      >
        <span className="flex-1 text-center">GitHub 로 시작하기</span>
        <ArrowRightIcon className="w-5" />
      </button>
    </div>
  )
}
