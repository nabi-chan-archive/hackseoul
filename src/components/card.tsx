import Link from 'next/link'
import Image from 'next/image'
import type { PropsWithChildren } from 'react'

export function Card({
  image,
  href,
  children,
}: PropsWithChildren<{ image: string; href: string }>) {
  return (
    <Link
      href={href}
      className="grid grid-cols-[150px,1fr] gap-2 border-2 border-slate-200 p-2 rounded-xl"
    >
      <Image
        width={300}
        height={300}
        className="object-cover aspect-square w-full rounded-lg"
        src={image}
        alt=""
      />
      <div className="w-full flex flex-col justify-between overflow-hidden gap-2">
        {children}
      </div>
    </Link>
  )
}
