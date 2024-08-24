import Link from 'next/link'
import Image from 'next/image'
import type { PropsWithChildren } from 'react'

export function Card({
  image,
  href,
  external = false,
  children,
}: PropsWithChildren<{ image: string; href: string; external?: boolean }>) {
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="grid grid-cols-[150px,1fr] gap-2 border-2 border-slate-200 p-2 rounded-xl"
    >
      <Image
        width={300}
        height={300}
        className="object-cover aspect-square w-full rounded-lg"
        src={image}
        alt=""
      />
      <div className="w-full flex flex-col justify-center overflow-hidden gap-1">
        {children}
      </div>
    </Link>
  )
}
