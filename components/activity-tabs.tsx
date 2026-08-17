"use client"

import { MobileTabScroller, TabButton } from "@/components/mobile-tab-scroller"

export type ActivityTabItem = {
  key: string
  label: string
}

export function ActivityTabs({
  items,
  value,
  onChange,
}: {
  items: ActivityTabItem[]
  value: string
  onChange: (key: string) => void
}) {
  return (
    <MobileTabScroller>
      {items.map((item) => (
        <TabButton key={item.key} active={value === item.key} onClick={() => onChange(item.key)}>
          {item.label}
        </TabButton>
      ))}
    </MobileTabScroller>
  )
}

export function PricingTabs(props: {
  items: ActivityTabItem[]
  value: string
  onChange: (key: string) => void
}) {
  return <ActivityTabs {...props} />
}
