import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { toNumber, toString, trim } from 'lodash-es'
import { load } from 'cheerio'
import router from '@/utils/next-connect'
import { coupang } from '@/utils/coupang'
import { supabase } from '@/utils/supabase/client'

router.get(async (request: NextRequest) => {
  try {
    const productId = new URL(request.url).searchParams.get('productId')!
    const page = new URL(request.url).searchParams.get('page') ?? 1

    const html = await coupang('/vp/product/reviews', {
      productId,
      page,
      size: 25,
      sortBy: 'ORDER_SCORE_ASC',
      viRoleCode: 3,
      ratingSummary: true,
    })

    const $ = load(html)

    const list = $('.sdp-review__article__list')
      .get()
      .map((item) => {
        const reviewedAt = new Date(
          $(item)
            .find('.sdp-review__article__list__info__product-info__reg-date')
            .text()
        )
        const score = toNumber(
          $(item).find('.js_reviewArticleRatingValue').attr('data-rating')
        )
        const content = trim(
          $(item)
            .find('.sdp-review__article__list__review__content')
            .text()
            .replace(/ +/g, ' ')
        )
        const images = $(item)
          .find('.sdp-review__article__list__attachment__img')
          .get()
          .map((image) => $(image).attr('src')!)

        return {
          id: [
            productId,
            $(item).find('.js_reviewArticleCrop').attr('data-member-id'),
          ].join('-'),
          crawl_at: new Date().toISOString(),
          reviewed_at: reviewedAt.toISOString(),
          title: content.split('\n')[0],
          product_id: toNumber(productId),
          product_name: $(item)
            .find('.sdp-review__article__list__info__product-info__name')
            .text(),
          score,
          content,
          images,
        }
      })
      .filter((item) => item.content.length > 0)
      .filter((item) => item.images.length > 0)

    await supabase.from('reviews').upsert(list).throwOnError()

    return NextResponse.json({
      message: 'success',
      created: list.length,
    })
  } catch {
    return NextResponse.json({ message: 'error' })
  }
})

export const GET = (request: NextRequest, context: unknown) => {
  return router.run(request, context) as Promise<NextResponse>
}
