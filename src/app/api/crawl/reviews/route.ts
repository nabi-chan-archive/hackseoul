import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { toNumber, trim } from 'lodash-es'
import { load } from 'cheerio'
import router from '@/utils/next-connect'
import { coupang } from '@/utils/coupang'
import { supabase } from '@/utils/supabase/client'
import { client } from '@/utils/openai'

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
          ai_title: '',
          ai_summary: '',
        }
      })
      .filter((item) => item.content.length > 0)
      .filter((item) => item.images.length > 0)

    await supabase.from('reviews').upsert(list).throwOnError()
    await Promise.all(
      list.map(async (item) => {
        const ai = await client.chat.completions.create({
          n: 1,
          seed: 20240825,
          model: 'gpt-4o-mini-2024-07-18',
          messages: [
            {
              role: 'system',
              content:
                '당신은 작성자의 리뷰를 요약해주는 AI 입니다. 다음 조건에 맞추어 리뷰를 가공하세요.' +
                '1. 리뷰 제목은 ai_title 이라는 이름의 key 를 가져야 하고, 제목의 형태로 작성되어야 합니다.' +
                '2. 리뷰 내용은 ai_summary 이라는 이름의 key 를 가져야 하고, 작성자가 말한 내용을 요약하여 작성자가 이러한 내용을 말했다고 설명해야 합니다.' +
                '3. 모든 응답은 JSON 형태로 작성하세요' +
                '4. JSON 형식 이외의 아무런 응답도 하지 마세요.' +
                '5. 딱딱한 말투지만 존댓말로 사용해주세요.' +
                '6. 이 리뷰를 남긴 사람이 어떤 주요주장을 작성했고 그렇게 생각한 원인까지 사실 위주로 함께 브리프해주어야 합니다.',
            },
            {
              role: 'user',
              content: item.content,
            },
          ],
        })

        await supabase
          .from('reviews')
          .update(
            JSON.parse(
              ai.choices[0].message.content
                ?.replace('```json', '')
                .replace('```', '') ?? '{}'
            )
          )
          .eq('id', item.id)
      })
    )

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
