"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage, type Lang } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

const FLAGS: { code: Lang; src: string; alt: string }[] = [
  { code: "fr", src: "/flags/fr.png", alt: "Français" },
  { code: "en", src: "/flags/en.png", alt: "English" },
]

function FlagButton({
  src,
  alt,
  onClick,
  active = false,
}: {
  src: string
  alt: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={alt}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative h-8 w-8 overflow-hidden rounded-full shadow-sm ring-1 ring-black/10 transition-transform hover:scale-105",
        active && "ring-2 ring-foreground/30",
      )}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
    </button>
  )
}

export function LanguageSwitcher({
  className,
  drop = "down",
}: {
  className?: string
  drop?: "down" | "up"
}) {
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current = FLAGS.find((flag) => flag.code === lang) ?? FLAGS[0]
  const others = FLAGS.filter((flag) => flag.code !== lang)

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [])

  return (
    <div
      ref={rootRef}
      className={cn("relative z-50 flex flex-col items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <FlagButton
        src={current.src}
        alt={current.alt}
        active
        onClick={() => setOpen((value) => !value)}
      />
      <div
        className={cn(
          "absolute flex flex-col items-center gap-2 transition-all duration-200",
          drop === "down" ? "top-full pt-2" : "bottom-full pb-2",
          open ? "visible translate-y-0 opacity-100" : "invisible opacity-0",
          !open && drop === "down" && "-translate-y-1",
          !open && drop === "up" && "translate-y-1",
        )}
      >
        {others.map((flag) => (
          <FlagButton
            key={flag.code}
            src={flag.src}
            alt={flag.alt}
            onClick={() => {
              setLang(flag.code)
              setOpen(false)
            }}
          />
        ))}
      </div>
      <span className="sr-only">{t("language")}</span>
    </div>
  )
}
