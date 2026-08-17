"use client"

import { useCurrency } from "@/contexts/currency-context"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import type { CoursePackage } from "@/lib/course-taxonomy"

export type PricingColumn = {
  key: string
  label: string
  getPrice: (hours: number) => number | null
  getPackage?: (hours: number) => CoursePackage | null
}

type PricingTableProps = {
  hours: number[]
  columns: PricingColumn[]
  selectedHours?: number
  selectedColumn?: string
  onSelect?: (hours: number, columnKey: string, pkg?: CoursePackage | null) => void
  footnoteRows?: { label: string; values: (number | null)[] }[]
  durationLabel?: (value: number) => string
}

export function PricingTable({
  hours,
  columns,
  selectedHours,
  selectedColumn,
  onSelect,
  footnoteRows = [],
  durationLabel,
}: PricingTableProps) {
  const { formatPriceWithSymbol } = useCurrency()
  const { t } = useLanguage()

  if (!hours.length && !footnoteRows.length) {
    return (
      <p className="py-6 text-sm text-muted-foreground">{t("selectOffer")}</p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[320px] text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 font-medium text-muted-foreground">{t("duration")}</th>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 text-right font-medium text-muted-foreground">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour} className="border-b border-border/70 last:border-0">
              <td className="px-4 py-3 font-medium">{durationLabel ? durationLabel(hour) : `${hour}h`}</td>
              {columns.map((column) => {
                const price = column.getPrice(hour)
                const pkg = column.getPackage?.(hour)
                const selected = selectedHours === hour && selectedColumn === column.key
                return (
                  <td key={column.key} className="px-2 py-2 text-right">
                    {price == null ? (
                      <span className="px-2 text-muted-foreground">—</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelect?.(hour, column.key, pkg)}
                        className={cn(
                          "min-h-10 min-w-[5.5rem] rounded-md px-3 py-2 font-semibold transition-colors",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary",
                        )}
                      >
                        {formatPriceWithSymbol(price)}
                      </button>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
          {footnoteRows.map((row) => (
            <tr key={row.label} className="bg-secondary/40">
              <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
              {row.values.map((value, index) => (
                <td key={`${row.label}-${index}`} className="px-4 py-3 text-right font-semibold">
                  {value == null ? "—" : formatPriceWithSymbol(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
