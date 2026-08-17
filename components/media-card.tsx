"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

type MediaCardProps = {
  href?: string
  image: string
  title: string
  subtitle?: string
  className?: string
  aspect?: string
  overlay?: boolean
}

export function MediaCard({
  href,
  image,
  title,
  subtitle,
  className,
  aspect = "aspect-[4/5]",
  overlay = true,
}: MediaCardProps) {
  const inner = (
    <div className={cn("group relative overflow-hidden rounded-xl bg-muted", aspect, className)}>
      <img
        src={image}
        alt={title}
        className="img-zoom absolute inset-0 h-full w-full object-cover"
      />
      {overlay ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      ) : null}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="text-display text-2xl leading-tight">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-white/80">{subtitle}</p> : null}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    )
  }

  return inner
}
