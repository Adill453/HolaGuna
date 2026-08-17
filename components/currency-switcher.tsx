"use client"

import { useCurrency, type Currency } from "@/contexts/currency-context"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

const OPTIONS: { value: Currency; label: string }[] = [
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
  { value: "MAD", label: "MAD" },
]

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency()
  const { t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t("currency")}
      className={cn("inline-flex items-center rounded-md border border-border/80 bg-background/40 p-0.5 text-xs font-semibold tracking-wide", className)}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setCurrency(option.value)}
          className={cn(
            "min-h-8 rounded-[5px] px-2 transition-colors",
            currency === option.value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
