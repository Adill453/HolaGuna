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

  // Booking is now handled by the BookingModal component

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
      <div className="space-y-8">
  {courses.map((course) => (
    <div
      key={course.id}
      className="bg-gradient-to-b from-[#061a35] to-[#020b18] p-6 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden"
    >
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            {course.name}
          </h3>

          <p className="text-gray-300 text-sm mt-1 max-w-md">
            {course.description}
          </p>
        </div>

        {/* Big Price */}
        <div className="text-right">
          <p className="text-4xl font-extrabold text-white tracking-tight">
            €{course.price}
          </p>
          <p className="text-gray-400 text-xs">per person ({course.durationHours}h)</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 my-5" />

      {/* List like the provided image */}
      <div className="space-y-3">
        {course.pricingOptions?.map((opt, idx) => (
          <div
            key={idx}
            className="flex justify-between text-gray-200 text-sm border-b border-white/10 pb-2"
          >
            <span className="font-medium">{opt.hours} H</span>
            <span className="font-semibold">€{opt.price}</span>
          </div>
        ))}
      </div>

      {/* Extra information */}
      <div className="flex items-center gap-6 text-sm text-gray-400 mt-5">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" /> Max {course.maxParticipants}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" /> {course.durationHours} hours
        </span>
      </div>

      {/* Booking */}
      <div className="mt-6 flex justify-end">
        <BookingModal courseId={course.id} courseName={course.name} />
      </div>
    </div>
  ))}
</div>


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
