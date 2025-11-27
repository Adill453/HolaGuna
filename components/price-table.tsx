"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Package {
  id: number
  hours: number
  price: number
  description?: string | null
  isActive: boolean
}

interface PriceTableProps {
  packages: Package[]
}

export function PriceTable({ packages }: PriceTableProps) {
  const activePackages = packages.filter((pkg) => pkg.isActive)

  if (activePackages.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No packages available
      </div>
    )
  }

  const hasDescriptions = activePackages.some((pkg) => pkg.description)

  return (
    <div className="rounded-md text-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Hours</TableHead>
            {hasDescriptions && <TableHead>Description</TableHead>}
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activePackages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell className="font-medium">{pkg.hours}H</TableCell>
              {hasDescriptions && (
                <TableCell className="text-sm text-white/90">
                  {pkg.description || "-"}
                </TableCell>
              )}
              <TableCell className="text-right">
                <Badge variant="secondary" className="text-base font-semibold">
                  €{pkg.price}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

