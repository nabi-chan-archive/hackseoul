import { setTimeout } from 'timers/promises'
import { supabase } from '@/utils/supabase/client'
import { http } from '@/utils/http'
import { readProducts } from './products'

export async function readReviews(query: string, brand: string) {
  const { products } = await readProducts(query, brand)
  const productIds = products.map((product) => product.id)

  if (productIds.length === 0) {
    console.log('[review] no products %s (%s)', query, brand)
    return {
      reviews: [],
    }
  }

  let reviews = await Promise.all(
    Array.from({ length: Math.round(productIds.length / 25) }, (_, index) =>
      supabase
        .from('reviews')
        .select('*')
        .in('product_id', productIds.slice(index * 25, (index + 1) * 25))
        .throwOnError()
        .then((response) => response.data ?? [])
    )
  ).then((reviews) => reviews.flat())

  if (reviews.length === 0) {
    console.log('[review] no reviews %s (%s)', query, brand)
    await Promise.all(
      productIds.map(async (productId) => {
        await setTimeout(1000)
        return http.get('/api/crawl/reviews', {
          productId,
          page: 1,
        })
      })
    )

    reviews = await Promise.all(
      Array.from({ length: Math.round(productIds.length / 25) }, (_, index) =>
        supabase
          .from('reviews')
          .select('*')
          .in('product_id', productIds.slice(index * 25, (index + 1) * 25))
          .throwOnError()
          .then((response) => response.data ?? [])
      )
    ).then((reviews) => reviews.flat())
  }

  console.log(
    '[review] reviews length %d %s (%s)',
    reviews.length,
    query,
    brand
  )

  return { reviews }
}
