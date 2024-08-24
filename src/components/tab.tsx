'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { stringify } from 'qs'
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
      <nav className="flex p-4">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.label)
              push(
                `?${stringify({
                  ...Object.fromEntries(Array.from(rest.entries())),
                  tab: tab.label,
                })}`
              )
            }}
            className="flex-1 px-4 py-2 truncate border-b-2"
            style={{
              fontWeight: activeTab === tab.label ? 'bold' : 'normal',
              borderColor: activeTab === tab.label ? '#2A3CE5' : 'gray',
              color: activeTab === tab.label ? '#2A3CE5' : 'gray',
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
