import Image from 'next/image'
import { format } from 'date-fns'
import createTranslation from 'next-translate/createTranslation'
import people from '@/assets/people.png'
import wallet from '@/assets/wallet.png'
import plusOne from '@/assets/+1.png'
import folder from '@/assets/folder.png'
import { supabase } from '@/utils/supabase/client'
import { Card } from '@/components/card'
import { Rating } from '@/components/rating'

export default async function Page() {
  const { t } = createTranslation('common')
  const reviews = await supabase
    .from('reviews')
    .select('*')
    .limit(10)
    .throwOnError()
    .then((r) => r.data ?? [])

  return (
    <main>
      <section
        id="banner"
        className="h-80 relative"
      >
        <div className="bg-gradient-to-b from-white/5 to-white h-full">
          <Image
            src="https://images.unsplash.com/photo-1543201245-c9031909fe6f"
            alt=""
            className="object-cover absolute inset-0 -z-10 w-full h-full"
            width={300}
            height={300}
          />
        </div>
        <div className="absolute inset-0 p-4 flex gap-2 flex-col justify-end">
          <h1 className="text-3xl font-bold">Hello Nabi!</h1>
          <h3 className="text-slate-700 font-bold">
            Product review : 234 reviews
          </h3>
        </div>
      </section>
      <section
        id="badges"
        className="py-4 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold px-4">My Activity</h2>
        <div className="flex flex-nowrap gap-4 px-4 pb-4 overflow-x-auto overflow-y-visible snap-x snap-start">
          <dl className="aspect-square rounded-lg shadow-lg min-w-48 p-4 flex flex-col gap-2">
            <dt className="font-bold text-lg text-[#2A3CE5]">
              {t('my_page.badges.views.label')}
            </dt>
            <dd className="whitespace-pre-wrap font-bold text-lg">
              {t('my_page.badges.views.value')}
            </dd>
            <div className="flex justify-end">
              <Image
                className="w-10"
                src={people}
                alt=""
              />
            </div>
          </dl>

          <dl className="aspect-square rounded-lg shadow-lg min-w-48 p-4 flex flex-col gap-2">
            <dt className="font-bold text-lg text-[#2A3CE5]">
              {t('my_page.badges.points.label')}
            </dt>
            <dd className="whitespace-pre-wrap font-bold text-lg">
              {t('my_page.badges.points.value')}
            </dd>
            <div className="flex justify-end">
              <Image
                className="w-10"
                src={wallet}
                alt=""
              />
            </div>
          </dl>

          <dl className="aspect-square rounded-lg shadow-lg min-w-48 p-4 flex flex-col gap-2">
            <dt className="font-bold text-lg text-[#2A3CE5]">
              {t('my_page.badges.likes.label')}
            </dt>
            <dd className="whitespace-pre-wrap font-bold text-lg">
              {t('my_page.badges.likes.value')}
            </dd>
            <div className="flex justify-end">
              <Image
                className="w-10"
                src={plusOne}
                alt=""
              />
            </div>
          </dl>

          <dl className="aspect-square rounded-lg shadow-lg min-w-48 p-4 flex flex-col gap-2">
            <dt className="font-bold text-lg text-[#2A3CE5]">
              {t('my_page.badges.bookmarks.label')}
            </dt>
            <dd className="whitespace-pre-wrap font-bold text-lg">
              {t('my_page.badges.bookmarks.value')}
            </dd>
            <div className="flex justify-end">
              <Image
                className="w-10"
                src={folder}
                alt=""
              />
            </div>
          </dl>
        </div>
      </section>
      <hr />
      <section id="reviews">
        <h2 className="px-4 pt-6 font-bold text-xl">See My Reviews</h2>
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
    </main>
  )
}
