import Link from 'next/link'
import Image from 'next/image'
import createTranslation from 'next-translate/createTranslation'
import { Rating } from '@/components/rating'
import { http } from '@/utils/http'
import { supabase } from '@/utils/supabase/client'

export default async function Products({
  query,
  brand = '',
}: {
  query: string
  brand: string
}) {
  const { t } = createTranslation('common')

  let brands = await supabase
    .from('brands')
    .select('id, label')
    .eq('query', query)
    .throwOnError()
    .then((response) => response.data ?? [])

  let products = await supabase
    .from('products')
    .select('*')
    .eq('query', query)
    .eq('brand', brand)
    .throwOnError()

  if (products.data?.length === 0) {
    await http.get('/api/crawl/products', {
      query,
      brand,
      page: 1,
    })

    products = await supabase
      .from('products')
      .select('*')
      .eq('query', query)
      .eq('brand', brand)
      .throwOnError()

    brands = await supabase
      .from('brands')
      .select('id, label')
      .eq('query', query)
      .throwOnError()
      .then((response) => response.data ?? [])
  }

  console.log('products length', products.data?.length, query)

  return (
    <>
      <nav className="flex flex-nowrap gap-2 p-4 overflow-auto">
        {brands.map((brand) => (
          <a
            key={brand.label}
            href={`/${query}?tab=${t('products')}&brand=${brand.id}`}
            className="p-2 border-2 border-slate-200 rounded-xl text-nowrap"
          >
            {brand.label}
          </a>
        ))}
      </nav>
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
    </>
  )
}
