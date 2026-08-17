"use client"

import { PageShell } from "@/components/page-shell"
import { PageHero } from "@/components/page-hero"
import { RentalCart } from "@/components/rental-cart"
import { BookingCTA } from "@/components/booking-cta"
import { useLanguage } from "@/contexts/language-context"

export default function RentalPage() {
  const { t } = useLanguage()

  return (
    <PageShell>
      <PageHero
        eyebrow={t("rental")}
        title="Kitesurfing equipment rental"
        description="Rent high-quality kitesurfing gear with flexible pricing for 1 to 7 days, plus extra days. Choose your duration, add insurance, and you’re ready to ride."
        image="/images/kitesurfing-22.jpg"
        compact
      >
        <BookingCTA href="#rental" label={t("bookNow")} className="rounded-full bg-white text-neutral-900 hover:bg-white/90" />
      </PageHero>

      <section id="rental" className="section-y">
        <div className="container-site grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <RentalCart />
          <div className="self-start rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h2 className="text-display text-3xl">How it works</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              To rent kitesurfing equipment, riders must be independent and have at least
              Level 3 or be able to improve their skills. Riders are responsible for taking
              care of the gear and using it carefully. If you are not sure about your level
              or have any questions, don&apos;t hesitate to ask — we&apos;re happy to help or
              recommend lessons.
            </p>
            <div className="mt-8">
              <BookingCTA href="/courses" label={t("exploreCourses")} variant="outline" />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
