import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import createTranslation from 'next-translate/createTranslation'
import Link from 'next/link'
import { redirect, RedirectType } from 'next/navigation'
import type { ReactNode } from 'react'
import { supabase } from '@/utils/supabase/client'

export default async function DetailLayout({
  children,
}: {
  children: ReactNode
}) {
  const { t } = createTranslation('common')
  const categories = await supabase
    .from('category')
    .select('id, category')
    .throwOnError()

  return (
    <>
      <header className="sticky top-0 inset-x-0 p-4 bg-white flex items-center gap-8 z-50">
        <Link href="/">
          <ArrowLeftIcon className="w-8" />
        </Link>
        <form
          className="flex gap-2 flex-1"
          action={async (form: FormData) => {
            'use server'

            const query = form.get('query') as string
            if (!query) {
              return
            }

            redirect(`/${encodeURIComponent(query)}`, RedirectType.push)
          }}
        >
          <input
            name="category"
            list="categories"
            placeholder={t('search.placeholder')}
            className="border-2 rounded-md px-2 w-full flex-1"
          />
          <datalist id="categories">
            {categories.data?.map(({ id, category }) => (
              <option
                key={id}
                value={category}
              />
            ))}
          </datalist>
          <button
            type="submit"
            className="bg-green-400 p-2 rounded-md font-bold"
          >
            {t('search.button')}
          </button>
        </form>
      </header>
      {children}
    </>
  )
}
