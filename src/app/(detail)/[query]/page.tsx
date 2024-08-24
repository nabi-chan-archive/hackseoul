import createTranslation from 'next-translate/createTranslation'
import { Tab } from '@/components/tab'
import Products from './components/Products'
import Reviews from './components/Reviews'

export default async function Page({ params }: { params: { query: string } }) {
  const query = decodeURIComponent(params.query)
  const { t } = createTranslation('common')

  return (
    <main>
      <Tab
        tabs={[
          {
            label: t('reviews'),
            content: <Reviews query={query} />,
          },
          {
            label: t('products'),
            content: <Products query={query} />,
          },
        ]}
      />
    </main>
  )
}
