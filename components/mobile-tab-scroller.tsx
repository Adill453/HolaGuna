"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MobileTabScroller({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "no-scrollbar flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch]",
        className,
      )}
    >
      {children}
    </div>
  )
}

type TabButtonProps = {
  active?: boolean
  children: React.ReactNode
  onClick: () => void
  className?: string
}

export function TabButton({ active, children, onClick, className }: TabButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm font-medium",
        !active && "bg-background/70",
        className,
      )}
    >
      {children}
    </Button>
  )
}
