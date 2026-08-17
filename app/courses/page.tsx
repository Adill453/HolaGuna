"use client"

import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"
import { PageShell } from "@/components/page-shell"
import { PageHero } from "@/components/page-hero"
import { PricingExperience } from "@/components/pricing-experience"
import { SectionHeading } from "@/components/section-heading"
import { BookingCTA } from "@/components/booking-cta"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Award, Clock, Users } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { CourseCategory } from "@/lib/course-taxonomy"

export default function CoursesPage() {
  const { t } = useLanguage()
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/courses/categories")
      if (!response.ok) throw new Error("Failed to fetch course categories")
      const data = await response.json()
      setCategories(data)
    } catch {
      setError("Unable to load course categories")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Tarifs"
        title="Kite sports courses in Dakhla"
        description="Master kite sports with certified instructors. Switch between kitesurf, buggy, landboard and rental — then pick duration and format."
        image="/images/kitesurfing-5.jpg"
        compact
      >
        <BookingCTA href="#tarifs" label={t("bookSession")} className="rounded-full bg-white text-neutral-900 hover:bg-white/90" />
      </PageHero>

      <section id="tarifs" className="section-y">
        <div className="container-site space-y-10">
          <SectionHeading
            eyebrow="Choose your session"
            title="Find a course, then book it"
            description="Use the tabs to move between activities and lesson formats. Prices update instantly. Select a duration to start booking with that package."
          />

          {loading ? (
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="grid lg:grid-cols-2">
                <Skeleton className="h-[320px] lg:h-[520px]" />
                <div className="space-y-4 p-8">
                  <Skeleton className="h-10 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">{error}</p>
              <Button onClick={fetchCategories} className="mt-4">
                {t("tryAgain")}
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No Course Categories Available</h3>
              <p className="text-muted-foreground">Check back soon for new course offerings!</p>
            </div>
          ) : (
            <PricingExperience categories={categories} />
          )}
        </div>
      </section>

      <section className="section-y bg-sand-band">
        <div className="container-site">
          <SectionHeading
            align="center"
            title="Why choose our courses?"
            description="Comprehensive training with certified instructors and top-quality equipment."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Award,
                title: "Certified Instructors",
                description: "Learn from IKO certified professionals with years of experience in kite sports.",
              },
              {
                icon: Users,
                title: "Small Groups",
                description: "Maximum 8 students per class ensures personalized attention and faster learning.",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description: "Choose from morning, afternoon, or sunset sessions to fit your schedule.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-card p-6">
                <feature.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="text-display text-2xl">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
