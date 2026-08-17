"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { PageHero } from "@/components/page-hero"
import { ActivityBookingModal } from "@/components/activity-booking-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, CheckCircle, XCircle, Waves } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import { useLanguage } from "@/contexts/language-context"
import { BookingCTA } from "@/components/booking-cta"
import { CurrencySwitcher } from "@/components/currency-switcher"
import { SectionHeading } from "@/components/section-heading"

interface Activity {
  id: number
  name: string
  description: string
  price: number
  durationHours: number
  equipmentIncluded: boolean
  activityType: string | null
  imageUrl: string | null
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { formatPriceWithSymbol } = useCurrency()
  const { t } = useLanguage()

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities")
      if (!response.ok) throw new Error("Failed to fetch activities")
      const data = await response.json()
      setActivities(data.activities)
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError("Unable to load activities")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <PageHero
        eyebrow={t("navActivities")}
        title="Activities & experiences"
        description="Discover kite sports experiences designed to complement your learning journey — or just to ride."
        image="/images/standuppaddle-1.jpg"
        compact
      />

      <section className="section-y">
        <div className="container-site">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">{error}</p>
              <Button onClick={fetchActivities} className="mt-4">
                {t("tryAgain")}
              </Button>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-12 text-center">
              <Waves className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No Activities Available</h3>
              <p className="text-muted-foreground">Check back soon for new activity offerings!</p>
            </div>
          ) : (
            <>
            <div className="mb-6 flex justify-end">
              <CurrencySwitcher />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {activities.map((activity, index) => (
                <article
                  key={activity.id}
                  className={`group overflow-hidden rounded-2xl border border-border bg-card ${
                    index === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-2" : ""
                  }`}
                >
                  <div className={`relative overflow-hidden ${index === 0 ? "aspect-[4/5] lg:aspect-[4/3] lg:min-h-0" : "aspect-[4/5]"}`}>
                    <img
                      src={activity.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={activity.name}
                      className="img-zoom absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                      }}
                    />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-background/90">
                        <Clock className="mr-1 h-3 w-3" />
                        {activity.durationHours}h
                      </Badge>
                      {activity.equipmentIncluded ? (
                        <Badge variant="secondary" className="bg-background/90 text-emerald-700">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {t("equipmentIncluded")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-background/90">
                          <XCircle className="mr-1 h-3 w-3" />
                          Bring your own equipment
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <h2 className="text-display text-3xl">{activity.name}</h2>
                      <p className="mt-3 text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <p className="text-lg font-semibold">{formatPriceWithSymbol(activity.price)}</p>
                      <ActivityBookingModal
                        activityId={activity.id}
                        activityName={activity.name}
                        activityPrice={activity.price}
                        maxParticipants={8}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </>
          )}
        </div>
      </section>

      <section className="section-y bg-sand-band">
        <div className="container-site text-center">
          <SectionHeading
            align="center"
            title="Ready for your next adventure?"
            description="Whether you're looking to learn something new or enhance your existing skills, we have the perfect activity for you."
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <BookingCTA href="/contact" label={t("contactUs")} />
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/gallery">{t("viewGallery")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
