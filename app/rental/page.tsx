"use client"

import { Navigation } from "@/components/navigation"
import { RentalCart } from "@/components/rental-cart"

export default function RentalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-balance">Kitesurfing Equipment Rental</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Rent high-quality kitesurfing gear with flexible pricing for 1 to 7 days, plus extra days. Choose your
              duration, add insurance, and you&apos;re ready to ride.
            </p>
          </div>
        </div>
      </section>

      {/* Rental Card */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <RentalCart />

          {/* How it works */}
          <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 to-cyan-400" />

            <h2 className="mb-3 text-2xl font-bold tracking-tight">
              How it works
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              To rent kitesurfing equipment, riders must be independent and have at least
              Level 3 or be able to improve their skills. Riders are responsible for taking
              care of the gear and using it carefully. If you are not sure about your level
              or have any questions, don&apos;t hesitate to ask — we&apos;re happy to help or
              recommend lessons.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}


