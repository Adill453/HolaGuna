"use client"

import { useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Testimonial = {
  name: string
  location: string
  rating?: number
  review: string
  course?: string
  image?: string
}

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: testimonials.length > 1 })
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  if (!testimonials.length) return null

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((item) => (
            <blockquote
              key={`${item.name}-${item.course}`}
              className="min-w-0 shrink-0 grow-0 basis-full pr-0 md:basis-1/2 md:pr-6 lg:basis-1/2"
            >
              <div className="flex h-full flex-col justify-between border-l-2 border-primary/40 py-2 pl-6 md:pl-8">
                <p className="text-display text-2xl leading-snug text-foreground sm:text-3xl">
                  “{item.review}”
                </p>
                <footer className="mt-8">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.location}
                    {item.course ? ` · ${item.course}` : ""}
                  </p>
                </footer>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="ml-2 flex gap-1.5">
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-1.5 bg-border",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
