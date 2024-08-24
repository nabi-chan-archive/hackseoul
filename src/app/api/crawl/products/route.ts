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
    const brand = new URL(request.url).searchParams.get('brand')!

    const html = await coupang('/np/search', {
      page,
      q: query,
      listSize: 100,
      brand: brand.replaceAll(/[^0-9]/g, '') || undefined,
    })

    const $ = load(html)

    $('#searchSdwAgingCarouselWidget').remove()

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
        images: [
          $(item)
            .find('.search-product-wrap-img')
            .attr('src')
            ?.replace(/^\/\//, 'https://'),
          $(item)
            .find('.search-product-wrap-img')
            .attr('data-img-src')
            ?.replace(/^\/\//, 'https://'),
        ].filter((v) => !!v && !v.includes('blank1x1')),
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
        brand,
      }))
      .filter((product) => product.images.length > 0)
      .filter((product) => Number.isSafeInteger(product.price))
      .filter(
        (product, index, self) =>
          self.findIndex((p) => p.id === product.id) === index
      )

    await supabase.from('brands').upsert(categories).throwOnError()
    await supabase.from('products').upsert(products).throwOnError()

    return NextResponse.json({
      message: 'success',
      products: products.length,
      categories: categories.length,
    })
  } catch (error) {
    console.log(error)
    console.log('crawl failed :', JSON.stringify(error, null, 2))
    return NextResponse.json({ message: 'error' })
  }
})

export const GET = (request: NextRequest, context: unknown) => {
  return router.run(request, context) as Promise<NextResponse>
}
