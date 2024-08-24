import createTranslation from 'next-translate/createTranslation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { min } from 'lodash-es'
import { format } from 'date-fns'
import { setTimeout } from 'timers/promises'
import { supabase } from '@/utils/supabase/client'
import { http } from '@/utils/http'
import { Rating } from '@/components/rating'
import { Order } from '@/components/order'
import { Card } from '@/components/card'

export default async function Page({
  params,
  searchParams,
}: {
  params: { productId: string }
  searchParams: { order: string }
}) {
  const { productId } = params
  const { order = 'reviewed_at' } = searchParams
  const { t } = createTranslation('common')

  const product = await supabase
    .from('products')
    .select('title, rating, rating_count, images, price')
    .eq('id', productId)
    .single()
    .throwOnError()
    .then((product) => product.data)

  let reviews = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('product_id', productId)
    .order(order, { ascending: false })
    .throwOnError()
    .then((reviews) => reviews.data ?? [])

  if (reviews.length === 0) {
    await Promise.all(
      Array.from({ length: min([product?.rating_count / 25, 10]) ?? 1 }).map(
        async (_, index) => {
          await setTimeout(1000)
          return await http.get<{ created: number }>('/api/crawl/reviews', {
            productId,
            page: index + 1,
          })
        }
      )
    )

    reviews = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', productId)
      .throwOnError()
      .then((reviews) => reviews.data ?? [])
  }

  if (!product) {
    return notFound()
  }

  return (
    <>
      <header className="px-4 pt-4">
        <div className="relative w-full aspect-square">
          <Image
            width={1024}
            height={1024}
            className="w-full object-cover rounded-lg shadow-lg"
            src={product.images[0]}
            alt=""
          />
        </div>
        <h1 className="font-bold text-xl whitespace-pre-wrap mt-6">
          {product.title.split(' ').slice(0, 6).join(' ')}
        </h1>
        <div className="pt-4 flex flex-col gap-2">
          <dl className="grid grid-cols-3 items-center">
            <dt className="text-lg font-bold">{t('product.price.label')}</dt>
            <dd className="col-span-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {product.price.toLocaleString()}
              </span>
              <span className="text-sm">{t('product.price.suffix')}</span>
            </dd>
          </dl>
          <dl className="grid grid-cols-3 items-center">
            <dt className="text-lg font-bold">{t('product.review.label')}</dt>
            <dd className="col-span-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {product.rating_count.toLocaleString()}
              </span>
              <span className="text-sm">{t('product.review.suffix')}</span>
            </dd>
          </dl>
          <dl className="grid grid-cols-3 items-center">
            <dt className="text-lg font-bold">{t('product.score.label')}</dt>
            <dd className="col-span-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold">{product.rating * 20}</span>
              <span className="text-sm">{t('product.score.suffix')}</span>
            </dd>
          </dl>
        </div>
      </header>
      <nav className="px-4 pt-4 flex justify-end">
        <Order
          name="order"
          values={[
            {
              value: 'created_at',
              label: t('product.sort.created_at'),
            },
            {
              value: 'score',
              label: t('product.sort.score'),
            },
          ]}
        />
      </nav>
      <main className="px-4 pt-6 pb-12 flex flex-col gap-4">
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
                <dd className="text-lg font-bold truncate">{review.title}</dd>
              </dl>
              <dl>
                <dt className="hidden" />
                <dd className="line-clamp-3">{review.content}</dd>
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
      </main>
    </>
  )
}
