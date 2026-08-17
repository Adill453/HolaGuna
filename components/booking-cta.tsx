"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

type ButtonVariant = VariantProps<typeof buttonVariants>

type BookingCTAProps = {
  href?: string
  label?: string
  variant?: ButtonVariant["variant"]
  size?: ButtonVariant["size"]
  className?: string
  onClick?: () => void
}

export function BookingCTA({
  href = "/courses",
  label,
  variant = "default",
  size = "lg",
  className,
  onClick,
}: BookingCTAProps) {
  const { t } = useLanguage()
  const text = label ?? t("bookNow")

  if (onClick) {
    return (
      <Button variant={variant} size={size} className={cn("min-h-11 px-6", className)} onClick={onClick}>
        {text}
      </Button>
    )
  }

  return (
    <Button asChild variant={variant} size={size} className={cn("min-h-11 px-6", className)}>
      <Link href={href}>{text}</Link>
    </Button>
  )
}
