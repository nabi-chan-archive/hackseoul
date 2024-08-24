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
          className="grid grid-cols-[100px,1fr] gap-4 border-2 border-slate-200 p-2 rounded-xl"
        >
          <Image
            width={300}
            height={300}
            className="object-cover aspect-square w-full rounded-lg"
            src={product.images[0]}
            alt=""
          />
          <div className="w-full flex flex-col justify-center overflow-hidden gap-2">
            <h1 className="font-bold truncate">{product.title}</h1>
            <p>{Number(product.price).toLocaleString('ko')} 원</p>
            <Rating score={product.rating} />
          </div>
        </Link>
      ))}
    </div>
  )
}
