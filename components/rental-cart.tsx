"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCurrency } from "@/contexts/currency-context"
import { RentalBookingModal } from "@/components/rental-booking-modal"
import { CurrencySwitcher } from "@/components/currency-switcher"
import { useLanguage } from "@/contexts/language-context"

interface RentalPrice {
  id: number
  days: number
  isExtraDay: boolean
  fullGearPrice: number
  insurancePrice: number
}

const FALLBACK_PRICES: RentalPrice[] = [
  { id: 1, days: 1, isExtraDay: false, fullGearPrice: 85, insurancePrice: 10 },
  { id: 2, days: 2, isExtraDay: false, fullGearPrice: 160, insurancePrice: 17 },
  { id: 3, days: 3, isExtraDay: false, fullGearPrice: 220, insurancePrice: 20 },
  { id: 4, days: 4, isExtraDay: false, fullGearPrice: 280, insurancePrice: 28 },
  { id: 5, days: 5, isExtraDay: false, fullGearPrice: 380, insurancePrice: 35 },
  { id: 6, days: 6, isExtraDay: false, fullGearPrice: 380, insurancePrice: 45 },
  { id: 7, days: 7, isExtraDay: false, fullGearPrice: 450, insurancePrice: 50 },
  { id: 8, days: 1, isExtraDay: true, fullGearPrice: 50, insurancePrice: 5 },
]

export function RentalCart() {
  const { formatPriceWithSymbol } = useCurrency()
  const { t } = useLanguage()
  const [prices, setPrices] = useState<RentalPrice[]>(FALLBACK_PRICES)
  const [selectedId, setSelectedId] = useState<number>(1)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch("/api/rental/pricing")
        if (!response.ok) return
        const data = await response.json()
        if (Array.isArray(data.pricing) && data.pricing.length > 0) {
          setPrices(
            data.pricing.map((p: RentalPrice) => ({
              id: p.id,
              days: p.days,
              isExtraDay: p.isExtraDay,
              fullGearPrice: p.fullGearPrice,
              insurancePrice: p.insurancePrice,
            })),
          )
        }
      } catch {
        // keep fallback prices
      }
    }

    fetchPricing()
  }, [])

  const selected = prices.find((p) => p.id === selectedId) || prices.find((p) => !p.isExtraDay) || prices[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[16/7] overflow-hidden">
        <img src="/images/kitesurfing-22.jpg" alt="Kitesurfing rental" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20" />
        <div className="absolute bottom-4 left-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t("rental")}</p>
          <h2 className="text-display text-3xl">Kite surfing rental</h2>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex justify-end">
          <CurrencySwitcher />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("days")}</TableHead>
                <TableHead className="text-right">{t("fullGear")}</TableHead>
                <TableHead className="text-right">{t("insurance")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((rental) => (
                <TableRow
                  key={rental.id}
                  className={selectedId === rental.id ? "bg-secondary/60" : "cursor-pointer"}
                  onClick={() => setSelectedId(rental.id)}
                >
                  <TableCell className="font-medium">
                    {rental.isExtraDay ? t("extraDay") : `${rental.days} ${t("days")}`}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPriceWithSymbol(rental.fullGearPrice)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPriceWithSymbol(rental.insurancePrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {selected
              ? `${selected.isExtraDay ? t("extraDay") : `${selected.days} ${t("days")}`} · ${formatPriceWithSymbol(selected.fullGearPrice)}`
              : t("selectOffer")}
          </p>
          <RentalBookingModal
            initialDays={selected?.isExtraDay ? 1 : selected?.days || 1}
            includeInsurance
            triggerLabel={t("bookNow")}
          />
        </div>
      </div>
    </div>
  )
}
