"use client"

import { useEffect, useMemo, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Users } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"

type CourseType = "GROUP" | "SEMI_PRIVATE" | "PRIVATE"

interface RawCourse {
  id: number
  name?: string
  description?: string
  price?: number
  price_eur?: number
  duration_hours?: number
  durationHours?: number
  max_participants?: number
  maxParticipants?: number
  courseType?: CourseType | string
  course_type?: CourseType | string
  image_url?: string
  imageUrl?: string
}

interface Course {
  id: number
  name: string
  description: string
  price: number
  durationHours: number
  maxParticipants: number
  courseType: CourseType
  imageUrl?: string | null
}

export default function CoursesPage(): JSX.Element {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/courses")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload = await res.json()

      // payload may be { courses: [...] } or an array
      const raw: RawCourse[] = Array.isArray(payload) ? payload : payload.courses ?? []

      const normalized: Course[] = raw.map((r) => {
        const duration =
          typeof r.durationHours === "number"
            ? r.durationHours
            : typeof r.duration_hours === "number"
            ? r.duration_hours
            : 0

        const price =
          typeof r.price === "number"
            ? r.price
            : typeof (r as any).price_eur === "number"
            ? (r as any).price_eur
            : 0

        const courseType =
          (r.courseType ?? r.course_type ?? "GROUP") as CourseType

        return {
          id: r.id,
          name: r.name ?? `Course #${r.id}`,
          description: r.description ?? "",
          price,
          durationHours: duration,
          maxParticipants:
            typeof r.maxParticipants === "number"
              ? r.maxParticipants
              : typeof r.max_participants === "number"
              ? r.max_participants
              : 8,
          courseType: (courseType as CourseType) || "GROUP",
          imageUrl: r.imageUrl ?? r.image_url ?? null,
        }
      })

      setCourses(normalized)
    } catch (err) {
      console.error(err)
      setError("Impossible de charger les cours. Vérifie ton endpoint /api/courses.")
    } finally {
      setLoading(false)
    }
  }

  // Regroupement par type + tri par durée (asc)
  const grouped = useMemo(() => {
    const groups: Record<CourseType, Course[]> = {
      GROUP: [],
      SEMI_PRIVATE: [],
      PRIVATE: [],
    }

    for (const c of courses) {
      const key = (c.courseType ?? "GROUP") as CourseType
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    }

    // sort each by duration then by price
    for (const k of Object.keys(groups) as CourseType[]) {
      groups[k].sort((a, b) => {
        if (a.durationHours !== b.durationHours) return a.durationHours - b.durationHours
        return a.price - b.price
      })
    }

    return groups
  }, [courses])

  const packs: { key: CourseType; title: string; subtitle?: string }[] = [
    { key: "GROUP", title: "Group Lessons", subtitle: "4–8 persons — meilleur rapport qualité/prix" },
    { key: "SEMI_PRIVATE", title: "Semi-Private", subtitle: "2 persons — attention personnalisée" },
    { key: "PRIVATE", title: "Private Lessons", subtitle: "1:1 — coaching dédié" },
  ]

  const formatPrice = (v: number) =>
    v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Header */}
      <header className="bg-gradient-to-br from-primary/8 to-secondary/6 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Nos formules de cours</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisis la formule qui te convient — affichage dynamique depuis la base de données.
          </p>
        </div>
      </header>

      {/* Packs */}
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 mb-6 text-sm text-red-800">
              {error} — <button onClick={fetchCourses} className="underline">Réessayer</button>
            </div>
          )}

          <section className="grid gap-6 md:grid-cols-3">
            {packs.map((pack) => {
              const list = grouped[pack.key] || []
              return (
                <Card key={pack.key} className="flex flex-col border hover:shadow-lg transition-shadow">
                  <CardHeader className="px-6 pt-6 pb-0">
                    <CardTitle className="text-xl font-semibold">{pack.title}</CardTitle>
                    {pack.subtitle && <p className="text-sm text-muted-foreground mt-1">{pack.subtitle}</p>}
                  </CardHeader>

                  <CardContent className="px-6 pb-6 pt-4 flex-1 flex flex-col">
                    {/* loading */}
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full mt-2" />
                      </div>
                    ) : list.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-8">Aucun cours disponible</div>
                    ) : (
                      <div className="space-y-4">
                        {list.map((c) => (
                          <div key={c.id} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-md bg-primary/10 p-2">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{c.durationHours}h</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{c.name}</div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-semibold text-primary">{formatPrice(c.price)}</div>
                              <div className="text-xs text-muted-foreground">par personne</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* footer area inside card: small info */}
                    <div className="mt-6 border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {list.length > 0 ? `${list[0].maxParticipants} max` : "Capacité variable"}
                        </span>
                      </div>

                      <div className="text-xs">Durées & prix: extraits de la base</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </section>

          {/* Single Reservation Button */}
          <div className="mt-10 flex justify-center">
            <BookingModal courseId={0} courseName="Réservation générale">
              <Button size="lg" className="px-10">
                Réserver maintenant
              </Button>
            </BookingModal>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/60 border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ola Y Lagona — Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
