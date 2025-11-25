"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Users, Award } from "lucide-react"
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
      const response = await fetch("/api/courses")
      if (!response.ok) throw new Error("Failed to fetch courses")
      const data = await response.json()
      setCourses(data.courses)
    } catch {
      setError("Impossible de charger les cours. Vérifie ton endpoint /api/courses.")
    } finally {
      setLoading(false)
    }
  }

  const packs = [
    { key: "GROUP", title: "Group Lessons", color: "bg-primary/10", textColor: "text-primary" },
    { key: "SEMI_PRIVATE", title: "Semi-Private Lessons", color: "bg-secondary/10", textColor: "text-secondary" },
    { key: "PRIVATE", title: "Private Lessons", color: "bg-accent/10", textColor: "text-accent" },
  ]

  const formatPrice = (v: number) => `€${v}`

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-balance">Kite Sports Courses</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
            Master the art of kite sports with our comprehensive courses. From beginner-friendly lessons to advanced techniques.
          </p>
        </div>
      </section>

      {/* Packs Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 md:grid-cols-3">
          {loading
            ? [...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))
            : packs.map((pack) => {
                const packCourses = courses.filter((c) => c.courseType === pack.key)
                return (
                  <Card key={pack.key} className={`group hover:shadow-lg transition-shadow ${pack.color}`}>
                    <CardHeader>
                      <CardTitle className={`text-lg font-bold text-center ${pack.textColor}`}>{pack.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {packCourses.length === 0 ? (
                        <p className="text-muted-foreground text-center">Aucun cours disponible</p>
                      ) : (
                        packCourses.map((course) => (
                          <div key={course.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                            <div>
                              <p className="font-medium">{course.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" /> {course.durationHours}h
                                <Users className="h-4 w-4 ml-4" /> Max {course.maxParticipants}
                              </div>
                            </div>
                            <Badge className={`${pack.textColor} font-bold`}>{formatPrice(course.price)}</Badge>
                          </div>
                        ))
                      )}
                    </CardContent>
                    {packCourses.length > 0 && (
                      <div className="text-center mt-4">
                        <BookingModal courseId={packCourses[0].id} courseName={pack.title}>
                          <Button className="px-6">Réserver ce pack</Button>
                        </BookingModal>
                      </div>
                    )}
                  </Card>
                )
              })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          &copy; 2025 Ola Y Lagona. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
