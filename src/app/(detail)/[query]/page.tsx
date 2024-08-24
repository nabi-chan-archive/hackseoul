import createTranslation from 'next-translate/createTranslation'
import { Tab } from '@/components/tab'
import Products from './components/Products'
import Reviews from './components/Reviews'

export default async function Page({
  params,
  searchParams,
}: {
  params: { query: string }
  searchParams: { brand: string }
}) {
  const query = decodeURIComponent(params.query)
  const { t } = createTranslation('common')

  return (
    <main>
      <Tab
        tabs={[
          {
            label: t('tab.reviews'),
            content: (
              <Reviews
                query={query}
                brand={searchParams.brand}
              />
            ),
          },
          {
            label: t('tab.products'),
            content: (
              <Products
                query={query}
                brand={searchParams.brand}
              />
            ),
          },
        ]}
      />
    </main>
  )
}
