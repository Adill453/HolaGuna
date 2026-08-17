"use client"

import type { ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"
import { PricingTable, type PricingColumn } from "@/components/pricing-table"
import { useCurrency } from "@/contexts/currency-context"
import { useLanguage } from "@/contexts/language-context"
import type { CourseCategory, CoursePackage } from "@/lib/course-taxonomy"

type CourseShowcaseProps = {
  title: string
  description?: string | null
  image: string
  label?: string
  includes?: string[]
  hours: number[]
  columns: PricingColumn[]
  footnoteRows?: { label: string; values: (number | null)[] }[]
  selectedHours?: number
  selectedColumn?: string
  onSelect?: (hours: number, columnKey: string, pkg?: CoursePackage | null) => void
  bookingCategory?: CourseCategory | null
  bookingPackages?: CoursePackage[]
  selectedPackageId?: number
  customCta?: React.ReactNode
  durationLabel?: (value: number) => string
}

export function CourseShowcase({
  title,
  description,
  image,
  label,
  includes = [],
  hours,
  columns,
  footnoteRows,
  selectedHours,
  selectedColumn,
  onSelect,
  bookingCategory,
  bookingPackages = [],
  selectedPackageId,
  customCta,
  durationLabel,
}: CourseShowcaseProps) {
  const reduce = useReducedMotion()
  const { t } = useLanguage()
  const { formatPriceWithSymbol } = useCurrency()
  const selectedPkg = bookingPackages.find((pkg) => pkg.id === selectedPackageId)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="relative min-h-0 overflow-hidden aspect-[4/5] lg:aspect-auto lg:min-h-[560px] lg:h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={image}
              src={image}
              alt={title}
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          {label ? (
            <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              {label}
            </span>
          ) : null}
          <div className="absolute bottom-5 left-5 right-5 text-white lg:hidden">
            <h3 className="text-display text-3xl">{title}</h3>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-5 sm:p-8">
          <div className="hidden lg:block">
            <h3 className="text-display text-4xl leading-tight">{title}</h3>
            {description ? (
              <p className="mt-3 text-muted-foreground leading-relaxed">{description}</p>
            ) : null}
          </div>
          {description ? (
            <p className="text-muted-foreground leading-relaxed lg:hidden">{description}</p>
          ) : null}

          {includes.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {t("included")}
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <PricingTable
            hours={hours}
            columns={columns}
            selectedHours={selectedHours}
            selectedColumn={selectedColumn}
            onSelect={onSelect}
            footnoteRows={footnoteRows}
            durationLabel={durationLabel}
          />

          <div className="mt-auto flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedPkg ? (
                <p>
                  <span className="font-semibold text-foreground">
                    {selectedPkg.hours}h · {formatPriceWithSymbol(selectedPkg.price)}
                  </span>
                </p>
              ) : (
                <p>{t("selectOffer")}</p>
              )}
            </div>
            {customCta ? (
              customCta
            ) : bookingCategory ? (
              <BookingModal
                key={`${bookingCategory.id}-${selectedPackageId || "default"}`}
                categoryId={bookingCategory.id}
                categoryName={bookingCategory.name}
                packages={bookingPackages}
                selectedPackageId={selectedPackageId}
                triggerLabel={t("bookNow")}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
