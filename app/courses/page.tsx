"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Users, Award, BookOpen } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"

interface Course {
  id: number
  name: string
  description: string
  price: number
  durationHours: number
  maxParticipants: number
  pricingOptions: { hours: number; price: number }[]
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
    } catch (err) {
      setError("Unable to load courses")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HEADER */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold">Kite Sports Courses</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Select the perfect package for your kite experience. Group, private or semi-private.
            </p>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="p-6">
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-1/3 mb-6" />
                  {[...Array(4)].map((__, i) => (
                    <Skeleton key={i} className="h-4 w-full mb-2" />
                  ))}
                  <Skeleton className="h-10 w-full mt-4" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{error}</p>
              <Button onClick={fetchCourses} className="mt-4">Try Again</Button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
              <p className="text-muted-foreground">Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="rounded-2xl border border-white/10 shadow-lg bg-gradient-to-b from-card to-background hover:shadow-xl transition"
                >
                  
                  {/* HEADER */}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Award className="h-6 w-6 text-primary" />
                      {course.name}
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>

                  {/* CONTENT */}
                  <CardContent className="space-y-6">

                    {/* MAIN PRICE */}
                    <div>
                      <p className="text-4xl font-bold text-primary">€{course.price}</p>
                      <p className="text-xs text-muted-foreground">per person ({course.durationHours}h)</p>
                    </div>

                    {/* HOURS / PRICING TABLE */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                      {course.pricingOptions.map((opt, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm border-b border-white/10 pb-2"
                        >
                          <span className="text-muted-foreground">{opt.hours} H</span>
                          <span className="font-semibold">€{opt.price}</span>
                        </div>
                      ))}
                    </div>

                    {/* DETAILS */}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.durationHours}h lesson
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Max {course.maxParticipants}
                      </div>
                    </div>

                    {/* BOOKING BUTTON */}
                    <div className="pt-4">
                      <BookingModal courseId={course.id} courseName={course.name} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-card border-t mt-16">
        <div className="max-w-7xl mx-auto py-8 text-center text-sm text-muted-foreground">
          © 2025 Ola Y Lagona. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
