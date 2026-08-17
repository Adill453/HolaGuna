"use client"

import { useEffect, useRef, useState } from "react"
import { PageShell } from "@/components/page-shell"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Filter, Star, ChevronLeft, ChevronRight, Play, Pause, X } from "lucide-react"
import { MobileTabScroller, TabButton } from "@/components/mobile-tab-scroller"
import { BookingCTA } from "@/components/booking-cta"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

interface GalleryItem {
  id: number
  title: string
  imageUrl: string
  category: string
  isFeatured: boolean
}

const categories = [
  { value: "all", label: "All Photos" },
  { value: "KITESURFING", label: "Kitesurfing" },
  { value: "BUGGY", label: "Buggy" },
  { value: "LAND_BOARD", label: "Land board" },
  { value: "STANDUP_PADDLE", label: "Standup Paddle" },
]

export default function GalleryPage() {
  const { t } = useLanguage()
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [selectedCategory])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/gallery?category=${selectedCategory}`)
      if (!response.ok) throw new Error("Failed to fetch gallery")
      const data = await response.json()
      setGallery(data.gallery)
    } catch {
      setError("Unable to load gallery")
    } finally {
      setLoading(false)
    }
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length)
    setProgress(0)
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
    setProgress(0)
  }

  const openDialog = (index: number) => {
    setCurrentImageIndex(index)
    setIsDialogOpen(true)
    setProgress(0)
    setIsPlaying(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setIsPlaying(false)
    setProgress(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    setProgress(0)
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 100 / 30))
    }, 100)
    intervalRef.current = setInterval(() => {
      goToNext()
    }, 3000)
  }

  const pauseTimer = () => {
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  const resumeTimer = () => {
    setIsPlaying(true)
    startTimer()
  }

  useEffect(() => {
    if (isDialogOpen && isPlaying) startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [isDialogOpen, isPlaying, currentImageIndex])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isDialogOpen) return
      if (e.key === "ArrowLeft") goToPrevious()
      else if (e.key === "ArrowRight") goToNext()
      else if (e.key === " ") {
        e.preventDefault()
        isPlaying ? pauseTimer() : resumeTimer()
      } else if (e.key === "Escape") closeDialog()
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isDialogOpen, isPlaying])

  const aspectForIndex = (index: number) => {
    const pattern = index % 5
    if (pattern === 0) return "aspect-[4/5] md:col-span-2 md:aspect-[16/10]"
    if (pattern === 3) return "aspect-[4/5] md:aspect-[16/10]"
    return "aspect-[4/5]"
  }

  return (
    <PageShell>
      <PageHero
        eyebrow={t("navGallery")}
        title="The lagoon, the dunes, the ride"
        description="Explore kite sports in Dakhla — water, wind, and desert in the same frame."
        video="/videos/HERO VIDEO.mp4"
        compact
      />

      <section className="sticky top-[4.25rem] z-20 border-b border-border bg-background/90 py-4 backdrop-blur-xl">
        <div className="container-site flex items-center gap-3">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          <MobileTabScroller className="flex-1">
            {categories.map((category) => (
              <TabButton
                key={category.value}
                active={selectedCategory === category.value}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </TabButton>
            ))}
          </MobileTabScroller>
        </div>
      </section>

      <section className="section-y pt-8">
        <div className="container-site">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">{error}</p>
              <Button onClick={fetchGallery} className="mt-4">
                {t("tryAgain")}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openDialog(index)}
                  className={`group relative overflow-hidden rounded-xl bg-muted ${aspectForIndex(index)}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="img-zoom absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  {item.isFeatured && (
                    <Badge className="absolute right-2 top-2 bg-[#c4a574] text-foreground">
                      <Star className="mr-1 h-3 w-3" /> Featured
                    </Badge>
                  )}
                  <div className="absolute bottom-3 left-3 text-left text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-y bg-sand-band">
        <div className="container-site max-w-3xl text-center">
          <h2 className="text-display text-4xl md:text-5xl">Ready to create your own memories?</h2>
          <p className="mt-4 text-muted-foreground">
            Join us for an unforgettable kite sports adventure in the lagoons of Dakhla.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <BookingCTA href="/courses" />
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/contact">{t("contactUs")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="flex w-[min(92vw,calc(90vh*4/5))] max-w-[min(92vw,calc(90vh*4/5))] gap-0 overflow-hidden border-0 bg-black p-0 [&>button]:hidden">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden"
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart == null) return
              const delta = e.changedTouches[0].clientX - touchStart
              if (delta > 40) goToPrevious()
              if (delta < -40) goToNext()
              setTouchStart(null)
            }}
          >
            <div
              className="flex h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ transform: `translate3d(-${currentImageIndex * 100}%, 0, 0)` }}
            >
              {gallery.map((item) => (
                <div key={item.id} className="relative h-full w-full min-w-full shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="absolute left-0 right-0 top-0 z-20 h-1 bg-black/20">
              <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
            </div>
            <div className="absolute left-4 top-4 z-20 rounded bg-black/50 px-2 py-1 text-sm text-white">
              {currentImageIndex + 1} / {gallery.length}
            </div>
            <Button variant="ghost" size="sm" className="absolute right-16 top-4 z-20 bg-black/50 text-white hover:bg-black/70" onClick={isPlaying ? pauseTimer : resumeTimer}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="absolute right-4 top-4 z-20 bg-black/50 text-white hover:bg-black/70" onClick={closeDialog}>
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="absolute left-4 top-1/2 z-20 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70" onClick={goToPrevious}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70" onClick={goToNext}>
              <ChevronRight className="h-6 w-6" />
            </Button>
            {gallery[currentImageIndex]?.title ? (
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <p>{gallery[currentImageIndex]?.title}</p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
