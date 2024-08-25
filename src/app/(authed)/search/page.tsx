import { redirect, RedirectType } from 'next/navigation'
import createTranslation from 'next-translate/createTranslation'
import { format } from 'date-fns'
import Image from 'next/image'
import { supabase } from '@/utils/supabase/client'
import { Card } from '@/components/card'
import { Rating } from '@/components/rating'

export default async function Home() {
  const { t } = createTranslation('common')
  const categories = await supabase
    .from('category')
    .select('id, category')
    .throwOnError()

  const reviews = await supabase
    .from('reviews')
    .select('*')
    .limit(3)
    .throwOnError()
    .then((r) => r.data ?? [])

  return (
    <div>
      <section
        id="banner"
        className="h-80 relative"
      >
        <div className="bg-gradient-to-b from-white/5 to-white h-full">
          <Image
            src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7"
            alt=""
            className="object-cover absolute inset-0 -z-10 w-full h-full"
            width={300}
            height={300}
          />
        </div>
        <div className="absolute inset-0 p-4 flex gap-2 flex-col justify-end">
          <div className="text-3xl font-bold">나비 님,</div>
          <div className="text-3xl font-bold text-[#2A3CE5]">커피머신</div>
          <div className="text-3xl font-bold">한 번 둘러보실래요?</div>
        </div>
      </section>
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
      <section id="reviews">
        <h2 className="px-4 pt-6 font-bold text-xl">Trending Reviews</h2>
        <div className="flex flex-col gap-4 px-4 pt-6 py-12">
          {reviews.map((review) => (
            <Card
              key={review.id}
              href={`/review/${review.id}`}
              image={review.images[0]}
            >
              {/* 상품명 / 리뷰 제목 */}
              <div className="flex flex-col">
                <dl>
                  <dt className="hidden" />
                  <dd className="truncate text-sm text-slate-500">
                    {review.product_name}
                  </dd>
                </dl>
                <dl>
                  <dt className="hidden" />
                  <dd className="text-lg font-bold line-clamp-2">
                    {review.title}
                  </dd>
                </dl>
              </div>
              {/* 별점 */}
              <div className="flex gap-2 items-center justify-between">
                <Rating score={review.score} />
                <span className="text-sm text-slate-500">
                  {format(review.reviewed_at, 'yyyy-MM-dd')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
