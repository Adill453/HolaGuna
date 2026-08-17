"use client"

import type { ReactNode } from "react"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"

export function PageShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <Navigation />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
