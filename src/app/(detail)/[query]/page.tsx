import createTranslation from 'next-translate/createTranslation'
import Link from 'next/link'
import Image from 'next/image'
import { setTimeout } from 'timers/promises'
import { supabase } from '@/utils/supabase/client'
import { Tab } from '@/components/tab'
import { http } from '@/utils/http'
import { Rating } from '@/components/rating'

export default async function Page({ params }: { params: { query: string } }) {
  const query = decodeURIComponent(params.query)
  const { t } = createTranslation('common')

  let products = await supabase
    .from('products')
    .select('*')
    .eq('query', query)
    .throwOnError()

  if (products.data?.length === 0) {
    await http.get('/api/crawl/products', {
      query,
      page: 1,
    })

    products = await supabase
      .from('products')
      .select('*')
      .eq('query', query)
      .throwOnError()
  }

  console.log('products length', products.data?.length, query)

  const productIds = products.data?.map((product) => product.id) ?? []

  let reviews = await supabase
    .from('reviews')
    .select('*')
    .in('product_id', productIds.slice(20))
    .throwOnError()

  if (reviews.data?.length === 0) {
    await Promise.all(
      productIds.slice(20).map(async (productId) => {
        await http.get('/api/crawl/reviews', {
          productId,
          page: 1,
        })
        await setTimeout(1000)
      }) ?? []
    )

    reviews = await supabase
      .from('reviews')
      .select('*')
      .in('product_id', productIds.slice(20))
      .throwOnError()
  }
  console.log('reviews length', reviews.data?.length, query)

  return (
    <main>
      <Tab
        tabs={[
          {
            label: t('reviews'),
            content: (
              <div className="p-4 flex flex-col gap-4">
                {reviews.data?.map((review) => (
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
            ),
          },
          {
            label: t('products'),
            content: (
              <div className="p-4 flex flex-col gap-4">
                {products.data?.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="p-4 bg-slate-50 rounded-md grid grid-cols-[80px,calc(100%-1rem-5rem)] gap-4"
                  >
                    {product.images.length > 0 ? (
                      <Image
                        className="bg-slate-600 rounded-md object-cover w-20 aspect-square"
                        src={product.images[0]}
                        alt=""
                        width={300}
                        height={300}
                      />
                    ) : (
                      <div className="aspect-square flex-1 bg-slate-600 rounded-md object-cover w-4" />
                    )}
                    <div className="flex flex-col">
                      <h1 className="font-bold truncate">{product.title}</h1>
                      <p>{Number(product.price).toLocaleString('ko')} 원</p>
                      <Rating score={product.score} />
                    </div>
                  </Link>
                ))}
              </div>
            ),
          },
        ]}
      />
    </main>
  )
}
