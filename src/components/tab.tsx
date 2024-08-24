'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'

interface TabItem {
  label: string
  content: ReactNode
}

export function Tab({ tabs }: { tabs: TabItem[] }) {
  const rest = useSearchParams()
  const [activeTab, setActiveTab] = useState(rest.get('tab') ?? tabs[0].label)
  const { push } = useRouter()

  return (
    <section className="flex-col flex gap-2">
      <nav className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.label)
              push(`?tab=${tab.label}&brand=${rest.get('brand')}`)
            }}
            className="flex-1 p-4 bg-slate-200 truncate"
            style={{
              fontWeight: activeTab === tab.label ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <article>{tabs.find((tab) => tab.label === activeTab)?.content}</article>
    </section>
  )
}
