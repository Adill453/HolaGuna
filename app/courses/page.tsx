"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  imageUrl: string | null
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
      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }
      const data = await response.json()
      setCourses(data.courses)
    } catch (err) {
      setError("Unable to load courses")
    } finally {
      setLoading(false)
    }
  }

  // Booking is now handled by theee BookingModal component

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-balance">Kite Sports Courses</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Master the art of kite sports with our comprehensive courses. From beginner-friendly lessons to advanced
              techniques, we have something for every skill level.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-10">
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    {loading ? (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    ) : error ? (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{error}</p>
        <Button onClick={fetchCourses} className="mt-4">
          Try Again
        </Button>
      </div>
    ) : courses.length === 0 ? (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
        <p className="text-muted-foreground">Check back soon for new course offerings!</p>
      </div>
    ) : (
      <div className="space-y-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group border rounded-2xl p-6 bg-card/40 backdrop-blur-sm hover:bg-card shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            {/* Top part: name + price */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  {course.name}
                </h3>
                <p className="text-muted-foreground mt-1">{course.description}</p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold text-primary">€{course.price}</p>
                <p className="text-xs text-muted-foreground">per person</p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t my-4"></div>

            {/* Info list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{course.durationHours}h lesson</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Max {course.maxParticipants}</span>
              </div>

              <div className="flex justify-start sm:justify-end">
                <BookingModal courseId={course.id} courseName={course.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

      {/* Why Choose Our Courses */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Why Choose Our Courses?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive training with certified instructors and top-quality equipment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-pretty">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Ola Y Lagona. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
