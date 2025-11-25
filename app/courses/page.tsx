"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Users } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"

interface Course {
  id: number
  name: string
  description: string
  price: number
  durationHours: number
  maxParticipants: number
  courseType: "GROUP" | "SEMI_PRIVATE" | "PRIVATE"
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/courses")

      if (!res.ok) {
        throw new Error("API error")
      }

      const data = await res.json()

      // Normalisation automatique des champs venant de Prisma
      const normalized = data.courses.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        price: c.price,
        durationHours: c.duration_hours,     // RESTE EN snake_case = OK
        maxParticipants: c.max_participants, // RESTE snake_case
        courseType: c.courseType,            // TON CHAMP EXACT PRISMA
      }))

      setCourses(normalized)
    } catch (err) {
      setError("Impossible de charger les cours. Vérifie ton endpoint /api/courses.")
    } finally {
      setLoading(false)
    }
  }

  const packs = [
    { key: "GROUP", title: "Group Lesson" },
    { key: "SEMI_PRIVATE", title: "Semi-Private" },
    { key: "PRIVATE", title: "Private Lesson" },
  ]

  // Group by courseType
  const grouped = {
    GROUP: courses.filter((c) => c.courseType === "GROUP"),
    SEMI_PRIVATE: courses.filter((c) => c.courseType === "SEMI_PRIVATE"),
    PRIVATE: courses.filter((c) => c.courseType === "PRIVATE"),
  }

  const formatPrice = (v: number) =>
    v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HERO */}
      <header className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
        <h1 className="text-4xl font-bold">Kite Lesson Packs</h1>
        <p className="text-muted-foreground text-lg mt-2">
          Toutes les formules disponibles selon votre niveau.
        </p>
      </header>

      {/* PACKS */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {packs.map((pack) => {
          const list = grouped[pack.key as keyof typeof grouped]

          return (
            <Card key={pack.key} className="border-2 border-primary/20 hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-semibold">{pack.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                {loading && (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                )}

                {!loading && list.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm">Aucun cours disponible</p>
                )}

                {list.map((course) => (
                  <div key={course.id} className="border-b pb-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">{course.durationHours}h</span>
                    </div>
                    <p className="text-primary font-semibold">{formatPrice(course.price)}</p>
                  </div>
                ))}

                {/* Participants */}
                {list[0] && (
                  <div className="flex items-center gap-2 pt-3 text-muted-foreground text-sm">
                    <Users className="h-4 w-4" />
                    Max {list[0].maxParticipants} participants
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* ONE BUTTON */}
      <div className="flex justify-center mt-6 mb-16">
        <BookingModal courseId={0} courseName="General Booking">
          <Button size="lg" className="px-10 text-lg">Réserver Maintenant</Button>
        </BookingModal>
      </div>
    </div>
  )
}
