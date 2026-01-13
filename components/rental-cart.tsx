"use client"

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
import { ShoppingCart } from "lucide-react"
import { RentalBookingModal } from "@/components/rental-booking-modal"

interface RentalPrice {
  days: number | string
  fullGear: number
  insurance: number
}

const rentalPrices: RentalPrice[] = [
  { days: 1, fullGear: 85, insurance: 10 },
  { days: 2, fullGear: 160, insurance: 17 },
  { days: 3, fullGear: 220, insurance: 20 },
  { days: 4, fullGear: 280, insurance: 28 },
  { days: 5, fullGear: 380, insurance: 35 },
  { days: 6, fullGear: 380, insurance: 45 },
  { days: 7, fullGear: 450, insurance: 50 },
  { days: "Extra Day", fullGear: 50, insurance: 5 },
]

const rentalDescription = "To rent kitesurfing equipment, riders must be independent and have at least Level 3 or be able to improve their skills. Riders are responsible for taking care of the gear and using it carefully. If you are not sure about your level or have any questions, don't hesitate to ask — we're happy to help or recommend lessons."

export function RentalCart() {
  const { formatPriceWithSymbol } = useCurrency()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Kite Surfing Rental
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {rentalDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Days</TableHead>
                <TableHead className="text-right">Full Gear</TableHead>
                <TableHead className="text-right">Insurance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentalPrices.map((rental, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {typeof rental.days === "number" ? `${rental.days} Day${rental.days > 1 ? "s" : ""}` : rental.days}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPriceWithSymbol(rental.fullGear)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPriceWithSymbol(rental.insurance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end pt-4">
          <RentalBookingModal />
        </div>
      </CardContent>
    </Card>
  )
}

