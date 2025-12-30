"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PriceTable } from "@/components/price-table"
import { BookingModal } from "@/components/booking-modal"
import { useCurrency } from "@/contexts/currency-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Package {
  id: number
  hours: number
  price: number
  description?: string | null
  isActive: boolean
}

interface CourseCategory {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  packages: Package[]
}

interface CourseCategoryCardProps {
  category: CourseCategory
}

export function CourseCategoryCard({ category }: CourseCategoryCardProps) {
  const { currency, setCurrency } = useCurrency()
  const activePackages = category.packages.filter((pkg) => pkg.isActive)

  return (

    <Card
      className="group hover:shadow-lg transition-shadow relative overflow-hidden rounded-lg"
      style={{
        backgroundImage: `url(${category.imageUrl || "/placeholder.svg?height=300&width=400"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
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
            {category.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {category.description && (
            <CardDescription className="text-white/90 drop-shadow-lg text-center pt-2 ">
              {category.description}
            </CardDescription>
          )}
          <PriceTable packages={category.packages} />

          <div className="flex justify-end pt-2">
            <BookingModal
              categoryId={category.id}
              categoryName={category.name}
              packages={activePackages}
            />
          </div>
        </CardContent>
      </div>
    </Card>

  )
}

