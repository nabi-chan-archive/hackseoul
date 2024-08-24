import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/utils/supabase/client'
import { Rating } from '@/components/rating'

export default async function Reviews({ query }: { query: string }) {
  const products = await supabase
    .from('products')
    .select('id')
    .eq('query', query)
    .throwOnError()
    .then((response) => response.data ?? [])
    .then((products) => products.map((product) => product.id as string))

  const reviews = await Promise.all(
    Array.from({ length: Math.round(products.length / 25) }, (_, index) =>
      supabase
        .from('reviews')
        .select('*')
        .in('product_id', products.slice(index * 25, (index + 1) * 25))
        .throwOnError()
        .then((response) => response.data ?? [])
    )
  ).then((responses) => responses.flat())

  return (
    <div className="p-4 flex flex-col gap-4">
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/review/${review.id}`}
          className="p-4 bg-slate-50 rounded-md flex gap-4"
        >
          {review.images.length > 0 ? (
            <Image
              className="aspect-square flex-1 bg-slate-600 rounded-md object-cover w-36"
              src={review.images[0]}
              alt=""
              width={300}
              height={300}
            />
          ) : (
            <div className="aspect-square flex-1 bg-slate-600 rounded-md object-cover w-36" />
          )}
          <div className="flex-2 flex flex-col justify-between w-[calc(100%-16px-144px)]">
            <div className="flex flex-col">
              <span className="block truncate text-xs text-slate-600">
                {review.product_name}
              </span>
              <h1 className="font-bold truncate">{review.title}</h1>
              <p className="line-clamp-3">{review.content}</p>
            </div>
            <Rating score={review.rating} />
          </div>
        </Link>
      ))}
    </div>
  )
}
