import { StarIcon as StarFilledIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import createTranslation from 'next-translate/createTranslation'

export function Rating({ score = 5 }: { score: number }) {
  const { t } = createTranslation('common')

  return (
    <dl>
      <dt className="hidden">{t('formatted.score', { score })}</dt>
      <dd className="flex items-center">
        {Array.from({ length: Math.floor(score) }).map((_, index) => (
          <StarFilledIcon
            key={index}
            className="text-yellow-300 w-6"
          />
        ))}
        {!score.toFixed(1).endsWith('.0') && (
          <StarFilledIcon className="text-slate-300 w-6" />
        )}
        {Array.from({ length: 5 - Math.ceil(score) }).map((_, index) => (
          <StarOutlineIcon
            key={index}
            className="text-slate-300 w-6"
          />
        ))}
        <span className="text-sm text-slate-700 ml-1">
          ({score.toFixed(1)})
        </span>
      </dd>
    </dl>
  )
}
