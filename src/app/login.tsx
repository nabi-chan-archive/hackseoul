'use client'

import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { supabase } from '@/utils/supabase/client'

export function GithubLogin() {
  return (
    <button
      onClick={async () => {
        await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_HOMEPAGE_URL}/search`,
          },
        })
      }}
      className="bg-[#2A3CE5] text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-between hover:bg-blue-700 focus:outline-none w-full"
    >
      <span className="flex-1 text-center">GitHub 로 시작하기</span>
      <ArrowRightIcon className="w-5" />
    </button>
  )
}
