"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ActivityBookingModal } from "@/components/activity-booking-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, CheckCircle, XCircle, Camera, Waves } from "lucide-react"

interface Activity {
  id: number
  name: string
  description: string
  price: number
  durationHours: number
  equipmentIncluded: boolean
  activityType: string | null
  imageUrl: string | null
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities")
      if (!response.ok) {
        throw new Error("Failed to fetch activities")
      }
      const data = await response.json()
      console.log("Activities data:", data.activities) // Debug log
      setActivities(data.activities)
    } catch (err) {
      console.error("Error fetching activities:", err) // Debug log
      setError("Unable to load activities")
    } finally {
      setLoading(false)
    }
  }

  const renderBookingButton = (activity: Activity) => {
    return (
      <ActivityBookingModal
        activityId={activity.id}
        activityName={activity.name}
        activityPrice={activity.price}
        maxParticipants={8}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-balance">Activities & Experiences</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Discover unique kite sports experiences and activities designed to complement your learning journey or
              provide exciting adventures for all skill levels.
            </p>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Button onClick={fetchActivities} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <Waves className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Activities Available</h3>
              <p className="text-muted-foreground">Check back soon for new activity offerings!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <div key={activity.id} className="group hover:shadow-lg transition-shadow">

                  <div className="relative overflow-hidden rounded-lg group">
                    <img
                      src={activity.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.log("Image failed to load:", activity.imageUrl, "Activity:", activity.name)
                        e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                      }}
                    />

                    {/* Duration */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-background/90 text-foreground">
                        <Clock className="h-4 w-4" />
                        {activity.durationHours}h
                      </Badge>
                    </div>

                    {/* Equipment */}
                    <div className="absolute top-4 left-4">
                      {activity.equipmentIncluded ? (
                        <Badge variant="default" className="bg-background/90 text-green-600">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Equipment Included
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-background/90 text-orange-600">
                          <XCircle className="h-4 w-4 text-orange-600" />
                          Bring Your Own Equipment
                        </Badge>
                      )}
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 
                              group-hover:bg-black/50 backdrop-blur-xs text-white
                                px-4 pt-3 pb-2 
                                transition-all duration-300 
                                
                                overflow-hidden
                                rounded-t-xl">

                      <CardTitle className="flex items-center gap-2">
                        <Waves className="h-5 w-5 text-primary" />
                        {activity.name}
                      </CardTitle>

                      <CardDescription className="text-zinc-300">
                        {activity.description}
                      </CardDescription>

                      {/* Booking button - only visible on hover */}
                      <div className="justify-self-end">
                        {renderBookingButton(activity)}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Activity Categories */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Activity Categories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From equipment rentals to unique experiences, find the perfect activity for your adventure.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Waves,
                title: "Water Activities",
                description: "Paddleboard rentals and water-based adventures",
                color: "text-blue-600",
              },
              {
                icon: Camera,
                title: "Photography",
                description: "Professional action shots and memories",
                color: "text-purple-600",
              },
              {
                icon: CheckCircle,
                title: "Equipment Rental",
                description: "High-quality gear for independent practice",
                color: "text-green-600",
              },
              {
                icon: Clock,
                title: "Flexible Duration",
                description: "From 1-hour sessions to full-day adventures",
                color: "text-orange-600",
              },
            ].map((category, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <category.icon className={`h-12 w-12 mx-auto mb-4 ${category.color}`} />
                  <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Ready for Your Next Adventure?</h2>
            <p className="text-xl text-muted-foreground">
              Whether you're looking to learn something new or enhance your existing skills, we have the perfect
              activity for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Contact Us</Button>
              <Button variant="outline" size="lg" className="bg-transparent">
                View Gallery
              </Button>
            </div>
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
