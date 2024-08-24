import { redirect, RedirectType } from 'next/navigation'
import createTranslation from 'next-translate/createTranslation'
import { supabase } from '@/utils/supabase/client'

export default async function Home() {
  const { t } = createTranslation('common')
  const categories = await supabase
    .from('category')
    .select('id, category')
    .throwOnError()

  return (
    <form
      action={async (formData: FormData) => {
        'use server'
        await supabase
          .from('category')
          .upsert(
            {
              category: formData.get('category') as string,
            },
            {
              onConflict: 'category',
            }
          )
          .throwOnError()
        redirect(
          `${encodeURIComponent(formData.get('category') as string)}`,
          RedirectType.push
        )
      }}
      className="flex flex-col items-center justify-center h-full p-8 gap-4"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">{t('service.description')}</h1>
      </div>
      <input
        required
        name="category"
        list="categories"
        placeholder={t('search.placeholder')}
        className="border-2 rounded-md p-4 w-full"
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
        className="bg-[#2A3CE5] text-white px-6 py-3 rounded-md w-full font-bold"
      >
        {t('search.button')}
      </button>
    </form>
  )
}
