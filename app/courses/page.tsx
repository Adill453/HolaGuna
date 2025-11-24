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
  const groupOptions = [
    { hours: 4, price: 140 },
    { hours: 6, price: 210 },
    { hours: 8, price: 280 },
    { hours: 10, price: 350 },
    { hours: 12, price: 420 },
    { hours: 20, price: 700 },
  ];
  
  const privateOptions = [
    { hours: 2, price: 120 },
    { hours: 4, price: 220 },
    { hours: 6, price: 320 },
  ];
  
  const semiOptions = [
    { hours: 2, price: 95 },
    { hours: 4, price: 180 },
    { hours: 6, price: 260 },
  ];
  
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
      <section className="py-10">
  <div className="max-w-4xl mx-auto px-4">

    <div className="bg-[#061a35] rounded-2xl p-6 shadow-xl border border-white/10">

      {/* Header */}
      <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">PACKAGES</h2>

      {/* Select currency (optional) */}
      <div className="flex justify-end mb-6">
        <select className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20">
          <option>EUR</option>
          <option>MAD</option>
          <option>USD</option>
        </select>
      </div>

      {/* GRID 3 COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* GROUP */}
        <div className="bg-gradient-to-b from-[#0b2348] to-[#051529] p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">GROUP</h3>

          <p className="text-4xl font-bold text-white">70€</p>
          <p className="text-gray-300 text-sm mb-4">/person (2H)</p>

          {/* Group Prices */}
          <div className="space-y-2">
            {groupOptions.map((opt, i) => (
              <div key={i} className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-200">{opt.hours} H</span>
                <span className="text-white font-medium">{opt.price} €</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRIVATE */}
        <div className="bg-gradient-to-b from-[#0b2348] to-[#051529] p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">PRIVATE</h3>

          <p className="text-4xl font-bold text-white">120€</p>
          <p className="text-gray-300 text-sm mb-4">/person (2H)</p>

          {privateOptions.map((opt, i) => (
            <div key={i} className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-200">{opt.hours} H</span>
              <span className="text-white font-medium">{opt.price} €</span>
            </div>
          ))}
        </div>

        {/* SEMI PRIVATE */}
        <div className="bg-gradient-to-b from-[#0b2348] to-[#051529] p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">SEMI-PRIVATE</h3>

          <p className="text-4xl font-bold text-white">95€</p>
          <p className="text-gray-300 text-sm mb-4">/person (2H)</p>

          {semiOptions.map((opt, i) => (
            <div key={i} className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-200">{opt.hours} H</span>
              <span className="text-white font-medium">{opt.price} €</span>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <p className="text-gray-400 text-xs text-center mt-6">
        Prices shown are approximate. Accurate pricing is in EUR.
      </p>
    </div>
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
