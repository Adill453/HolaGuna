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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrency } from "@/contexts/currency-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart } from "lucide-react"
import { RentalBookingModal } from "@/components/rental-booking-modal"

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
  const { currency, setCurrency, formatPriceWithSymbol } = useCurrency()
  const [prices, setPrices] = useState<RentalPrice[]>(FALLBACK_PRICES)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch("/api/rental/pricing")
        if (!response.ok) return
        const data = await response.json()
        if (Array.isArray(data.pricing) && data.pricing.length > 0) {
          setPrices(
            data.pricing.map((p: any) => ({
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

  return (
    <Card
      className="group hover:shadow-lg transition-shadow relative overflow-hidden rounded-lg"
      style={{
        backgroundImage: "url(/images/kitesurfing-22.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      <div className="absolute inset-0 bg-black/50" />
      <br />

      {/* Currency Selector */}
      <div className="absolute top-4 right-4 z-20">
        <Select value={currency} onValueChange={(value) => setCurrency(value as "EUR" | "USD" | "MAD")}>
          <SelectTrigger className="w-[90px] h-8 text-xs justify-center bg-background/90 text-foreground border-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EUR">EUR (€)</SelectItem>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="MAD">MAD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-white drop-shadow-lg">
            Kite Surfing Rental
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-md text-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Days</TableHead>
                  <TableHead className="text-right">Full Gear</TableHead>
                  <TableHead className="text-right">Insurance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">
                      {rental.isExtraDay ? "Extra Day" : `${rental.days} Day${rental.days > 1 ? "s" : ""}`}
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

          <div className="flex justify-end pt-2">
            <RentalBookingModal />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}



