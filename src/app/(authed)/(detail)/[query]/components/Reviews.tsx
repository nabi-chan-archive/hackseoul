import createTranslation from 'next-translate/createTranslation'
import { Rating } from '@/components/rating'
import { Card } from '@/components/card'
import { readProducts } from '@/db/products'
import { readReviews } from '@/db/reviews'

export default async function Reviews({
  query,
  brand = '',
}: {
  query: string
  brand: string
}) {
  const { t } = createTranslation('common')

  const { brands } = await readProducts(query, brand)
  const { reviews } = await readReviews(query, brand)

  return (
    <>
      <nav className="flex flex-nowrap gap-2 p-4 overflow-auto">
        {brands.map((brand) => (
          <a
            key={brand.label}
            href={`/${query}?tab=${t('tab.reviews')}&brand=${brand.id}`}
            className="p-2 border-2 border-slate-200 rounded-xl text-nowrap"
          >
            {brand.label}
          </a>
        ))}
      </nav>
      <div className="p-4 flex flex-col gap-4">
        {reviews.map((review) => (
          <Card
            key={review.id}
            href={`/review/${review.id}`}
            image={review.images[0]}
          >
            <div className="flex flex-col">
              <span className="block truncate text-xs text-slate-600">
                {review.product_name}
              </span>
              <h1 className="font-bold truncate">{review.title}</h1>
              <p className="line-clamp-3">{review.content}</p>
            </div>
            <Rating score={review.score} />
          </Card>
        ))}
      </div>
    </>
  )
}
