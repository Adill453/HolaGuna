"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/booking-modal"

interface Course {
  id: number
  name: string
  description: string
  price: number
  durationHours: number
  maxParticipants: number
  courseType: "PRIVATE" | "SEMI_PRIVATE" | "GROUP"
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

  // Fonction pour filtrer par type
  const getCoursesByType = (type: Course["courseType"]) =>
    courses.filter((course) => course.courseType === type)

  const courseSections = [
    { title: "Private Courses", type: "PRIVATE" as const },
    { title: "Semi-Private Courses", type: "SEMI_PRIVATE" as const },
    { title: "Group Courses", type: "GROUP" as const },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">Kite Sports Courses</h1>
          <p className="text-lg text-muted-foreground">
            Master the art of kite sports with our comprehensive courses.
          </p>
        </div>
      </section>

      {/* Courses List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading courses...</p>
          ) : error ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={fetchCourses}>Try Again</Button>
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center text-muted-foreground">No courses available.</p>
          ) : (
            courseSections.map((section) => {
              const filteredCourses = getCoursesByType(section.type)
              if (filteredCourses.length === 0) return null

              return (
                <div key={section.type}>
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {filteredCourses.map((course) => (
                      <li
                        key={course.id}
                        className="flex justify-between items-center p-4 rounded-lg bg-card/30 hover:bg-card/50 transition"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-lg">{course.name}</p>
                          <p className="text-sm text-muted-foreground">{course.durationHours}h lesson</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-primary font-bold text-lg">€{course.price}</p>
                          <BookingModal courseId={course.id} courseName={course.name} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
