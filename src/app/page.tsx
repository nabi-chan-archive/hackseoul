import createTranslation from 'next-translate/createTranslation'

export default function Home() {
  const { t } = createTranslation('common')

  return (
    <main>
      <h1 className="text-2xl font-bold">{t('hello')}</h1>
    </main>
  )
}
