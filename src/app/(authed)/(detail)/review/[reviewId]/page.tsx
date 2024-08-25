import createTranslation from 'next-translate/createTranslation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/utils/supabase/client'
import { Rating } from '@/components/rating'
import { Card } from '@/components/card'

export default async function Page({
  params,
}: {
  params: { reviewId: string }
}) {
  const { reviewId } = params
  const { t } = createTranslation('common')

  const review = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('id', reviewId)
    .single()
    .throwOnError()
    .then((review) => review.data)

  if (!review) {
    return notFound()
  }

  const product = await supabase
    .from('products')
    .select('title, images, price, rating, rating_count')
    .eq('id', review.product_id)
    .single()
    .throwOnError()
    .then((product) => product.data)

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
            className="w-full h-full object-cover rounded-lg shadow-lg"
            src={review.images[0]}
            alt=""
          />
        </div>
        <h1 className="font-bold text-xl whitespace-pre-wrap mt-6 mb-2">
          {review.title}
        </h1>

        <dl className="grid grid-cols-3 items-center">
          <dt className="text-lg font-bold">{t('product.score.label')}</dt>
          <dd className="col-span-2 flex items-baseline gap-1">
            <Rating score={review.score} />
          </dd>
        </dl>

        <dl className="grid grid-cols-3 items-center">
          <dt className="text-lg font-bold">{t('product.keywords.label')}</dt>
          <dd className="col-span-2 flex items-baseline gap-1">
            {review.ai_keywords?.map((keyword: string) => (
              <span
                className="px-2 py-1 bg-slate-300 rounded-md"
                key={keyword}
              >
                {keyword}
              </span>
            ))}
          </dd>
        </dl>
      </header>
      <main className="p-4">
        <h3 className="font-bold">AI 요약</h3>
        <p className="whitespace-pre-wrap break-keep">{review.ai_summary}</p>
        <hr className="my-2" />
        <h3 className="font-bold">리뷰 내용</h3>
        <p className="whitespace-pre-wrap break-keep">{review.content}</p>
      </main>
      <footer className="p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold">{t('review.card.label')}</h1>
        <div className="p-4 rounded-md shadow-md flex flex-col gap-4">
          <Card
            href="#"
            image={product.images[0]}
          >
            <dl>
              <dt className="hidden" />
              <dd className="line-clamp-2 text-lg font-bold">
                {product.title}
              </dd>
            </dl>
            <dl>
              <dt className="hidden" />
              <dd className="line-clamp-2 text-lg font-bold">
                {product.price.toLocaleString()}
                {t('product.price.suffix')}
              </dd>
            </dl>
            <Rating score={product.rating} />
          </Card>

          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.coupang.com/vp/products/${review.product_id}`}
            className="block text-center bg-[#2A3CE5] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none w-full"
          >
            {t('product.purchase')}
          </Link>
        </div>
      </footer>
    </>
  )
}
