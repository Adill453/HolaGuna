"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, Award } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"

/* --------------------------------------
   🔒 SAFE LOCAL COURSES (NO ERRORS)
---------------------------------------*/
const sampleCourses = [
  {
    id: 1,
    name: "Group Lesson (Beginner)",
    description: "Perfect for beginners who want to learn in a group.",
    price: 35,
    durationHours: 2,
    maxParticipants: 10,
    category: "group",
  },
  {
    id: 2,
    name: "Group Lesson (Intermediate)",
    description: "Improve your skills with our certified coach.",
    price: 45,
    durationHours: 2,
    maxParticipants: 10,
    category: "group",
  },
  {
    id: 3,
    name: "Semi-Private (2 Persons)",
    description: "More attention, better progression.",
    price: 60,
    durationHours: 2,
    maxParticipants: 2,
    category: "semi",
  },
  {
    id: 4,
    name: "Private Lesson (1 to 1)",
    description: "Get personal coaching with maximum focus.",
    price: 90,
    durationHours: 2,
    maxParticipants: 1,
    category: "private",
  },
]

export default function CoursesPage() {
  const [category, setCategory] = useState("group")

  const categories = [
    { key: "group", label: "Group" },
    { key: "semi", label: "Semi-Private" },
    { key: "private", label: "Private" },
  ]

  const courses = sampleCourses.filter((c) => c.category === category)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto text-center px-4 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold">Kite Sports Courses</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your preferred learning style: Group, Semi-Private, or Private.
          </p>
        </div>
      </section>

      {/* CATEGORY SWITCHER */}
      <div className="flex justify-center mt-10 mb-6">
        <div className="flex bg-card border rounded-full p-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all 
                ${
                  category === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* COURSES LIST */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="border border-border hover:border-primary transition-all p-4"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  {course.name}
                </CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* INFO */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.durationHours}h lesson</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max {course.maxParticipants}</span>
                  </div>
                </div>

                {/* PRICE + BUTTON */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-2xl font-bold text-primary">€{course.price}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>

                  <BookingModal
                    courseId={course.id}
                    courseName={course.name}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Ola Y Lagona. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
