import Link from 'next/link'
import Image from 'next/image'
import { Rating } from '@/components/rating'
import { http } from '@/utils/http'
import { supabase } from '@/utils/supabase/client'

export default async function Products({ query }: { query: string }) {
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

  return (
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
  )
}
