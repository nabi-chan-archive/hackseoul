'use client'

import { useRouter } from 'next/navigation'

export function Order({
  name,
  values,
}: {
  name: string
  values: Array<{ value: string; label: string }>
}) {
  const { push } = useRouter()

  return (
    <select
      name={name}
      onChange={(e) => {
        e.preventDefault()
        push(`?${name}=${e.target.value}`)
      }}
      className="py-2 px-8 border-2 rounded-md"
    >
      {values.map(({ value, label }) => (
        <option
          key={value}
          value={value}
        >
          {label}
        </option>
      ))}
    </select>
  )
}
