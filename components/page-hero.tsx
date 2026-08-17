import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageHeroProps = {
  eyebrow?: string
  title: string
  description?: string
  image?: string
  video?: string
  children?: ReactNode
  compact?: boolean
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  video,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden", compact ? "min-h-[42vh]" : "min-h-[58vh]")}>
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <img
          src={image || "/images/kitesurfing-1.jpg"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="overlay-ocean absolute inset-0" />
      <div className="relative container-site flex items-end py-16 lg:py-20" style={{ minHeight: compact ? "42vh" : "58vh" }}>
        <div className={cn("max-w-3xl text-white", compact ? "pt-16" : "pt-24")}>
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{description}</p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
