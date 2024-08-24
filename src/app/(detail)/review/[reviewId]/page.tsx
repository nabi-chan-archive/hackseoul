import createTranslation from 'next-translate/createTranslation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/utils/supabase/client'
import { Rating } from '@/components/rating'

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
        <Rating score={review.score} />
      </header>
      <main className="p-4">
        <p className="whitespace-pre-wrap break-keep">{review.content}</p>
      </main>
      <footer className="p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold">구매한 제품</h1>
        <Link
          href={`/product/${review.product_id}`}
          className="grid grid-cols-[150px,1fr] gap-2 border-2 border-slate-200 p-2 rounded-xl"
        >
          <Image
            width={300}
            height={300}
            className="object-cover aspect-square w-full rounded-lg"
            src={product.images[0]}
            alt=""
          />
          <div className="w-full flex flex-col justify-center overflow-hidden gap-2">
            <dl>
              <dt className="hidden">상품명</dt>
              <dd className="line-clamp-2 text-lg font-bold">
                {product.title}
              </dd>
            </dl>
            <dl>
              <dt className="hidden">가격</dt>
              <dd className="line-clamp-2 text-lg font-bold">
                {product.price.toLocaleString()}
                {t('product.price.suffix')}
              </dd>
            </dl>
            <Rating score={product.rating} />
          </div>
        </Link>
      </footer>
    </>
  )
}
