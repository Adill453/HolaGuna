"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen } from "lucide-react"
import { CourseCategoryCard } from "@/components/course-category-card"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Award, Users, Clock } from "lucide-react"

interface Package {
  id: number
  hours: number
  price: number
  description?: string | null
  isActive: boolean
}

interface CourseCategory {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  packages: Package[]
}

export default function CoursesPage() {
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/courses/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch course categories")
      }
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError("Unable to load course categories")
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
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index}>
                  <div className="relative">
                    <Skeleton className="w-full h-48 rounded-lg" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{error}</p>
              <button onClick={fetchCategories} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Try Again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Course Categories Available</h3>
              <p className="text-muted-foreground">Check back soon for new course offerings!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.sort((a, b) => a.id - b.id).map((category) => (
                <CourseCategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Courses */}
      <section className="py-8 bg-card/50">
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
