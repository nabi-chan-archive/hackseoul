import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { toNumber, trim } from 'lodash-es'
import { load } from 'cheerio'
import router from '@/utils/next-connect'
import { supabase } from '@/utils/supabase/client'
import { coupang } from '@/utils/coupang'

router.get(async (request: NextRequest) => {
  try {
    const query = new URL(request.url).searchParams.get('query')!
    const page = new URL(request.url).searchParams.get('page')!

    const html = await coupang('/np/search', {
      page,
      q: query,
      listSize: 100,
    })

    const $ = load(html)

    const categories = $('#searchBrandFilter .search-option-item')
      .get()
      .map((item) => ({
        id: $(item).find('input').attr('id') ?? '',
        label: trim($(item).find('label').text()),
        query,
      }))

    const products = $('#productList li')
      .get()
      .map((item) => ({
        query,
        id: toNumber($(item).find('a').attr('data-product-id')),
        product_id: $(item).find('a').attr('data-product-id'),
        images: [$(item).find('dt.image img').attr('src')!],
        title: trim($(item).find('dd.descriptions .name').text()).replaceAll(
          /\s+/g,
          ' '
        ),
        original_price: toNumber(
          $(item)
            .find('dd.descriptions .base-price')
            .text()
            .replaceAll(/[^0-9]/g, '')
        ),
        shipping_price: 0,
        price: toNumber(
          $(item)
            .find('dd.descriptions .sale .price-value')
            .text()
            .replaceAll(/[^0-9]/g, '')
        ),
        rating: toNumber($(item).find('dd.descriptions .rating').text()),
        rating_count: toNumber(
          $(item)
            .find('dd.descriptions .rating-total-count')
            .text()
            .replaceAll(/[^0-9]/g, '')
        ),
      }))
      .filter((product) => Number.isSafeInteger(product.price))
      .filter(
        (product, index, self) =>
          self.findIndex((p) => p.id === product.id) === index
      )

    await supabase.from('categories').upsert(categories).throwOnError()
    await supabase.from('products').upsert(products).throwOnError()

    return new NextResponse('success')
  } catch (error) {
    console.log('crawl failed :', error)
    return new NextResponse('error')
  }
})

export const GET = (request: NextRequest, context: unknown) => {
  return router.run(request, context)
}
