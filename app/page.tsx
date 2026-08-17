"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Award, MapPin, MessageCircle, Shield } from "lucide-react"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { BookingCTA } from "@/components/booking-cta"
import { SectionHeading } from "@/components/section-heading"
import { MediaCard } from "@/components/media-card"
import { Reveal } from "@/components/reveal"
import { TestimonialSlider } from "@/components/testimonial-slider"
import { WindMark } from "@/components/wind-mark"
import WindguruOfficialEmbed from "@/components/WindguruOfficialEmbed"
import { useLanguage } from "@/contexts/language-context"

interface GalleryItem {
  id: number
  title: string
  imageUrl: string
  category: string
  isFeatured: boolean
}

const SPORTS = [
  {
    title: "Kitesurfing",
    description: "Ride the lagoon with power and control.",
    image: "/images/kitesurfing-3.jpg",
    href: "/courses",
  },
  {
    title: "Buggy",
    description: "Land-based thrills across the dunes.",
    image: "/images/buggy-3.jpg",
    href: "/courses",
  },
  {
    title: "Land Board",
    description: "All-terrain kiteboarding on sand.",
    image: "/images/landboard-2.jpg",
    href: "/courses",
  },
  {
    title: "Standup Paddle",
    description: "Glide the calm water of the lagoon.",
    image: "/images/standuppaddle-1.jpg",
    href: "/activities",
  },
]

const TEAM = [
  {
    name: "Ayoub Drissi",
    specialtie: "Kitesurf instructor IKO Certificate",
    Languages: ["English", "French", "Spanish"],
    image: "/instructor-AyoubDrissi.webp",
  },
  {
    name: "Oussama Haddach",
    specialtie: "Kitesurf instructor IKO Certificate",
    Languages: ["English", "French"],
    image: "/instructor-OussamaHaddach.webp",
  },
]

const TESTIMONIALS = [
  {
    name: "Emma Thompson",
    location: "London, UK",
    rating: 4,
    review:
      "Absolutely incredible experience! The instructors were patient and professional. Dakhla is the perfect place to learn kitesurfing.",
    course: "Beginner Kitesurfing",
  },
  {
    name: "Marco Silva",
    location: "Lisbon, Portugal",
    rating: 5,
    review:
      "Best kite buggy experience ever! The equipment is top-notch and the location is stunning. Will definitely come back.",
    course: "Kite Buggy Adventure",
  },
  {
    name: "Lisa Chen",
    location: "Toronto, Canada",
    rating: 5,
    review:
      "Perfect conditions, amazing instructors, and unforgettable memories. The team made me feel safe while pushing my limits.",
    course: "Advanced Kitesurfing",
  },
]

export default function HomePage() {
  const { t } = useLanguage()
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery?category=all")
        if (!response.ok) throw new Error("Failed to fetch gallery")
        const data = await response.json()
        setGallery(data.gallery || [])
      } catch (err) {
        console.error("Failed to fetch gallery:", err)
      }
    }
    fetchGallery()
  }, [])

  useEffect(() => {
    if (gallery.length === 0) return
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % gallery.length)
    }, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [gallery])

  const featured = gallery.filter((item) => item.isFeatured).slice(0, 5)
  const galleryPreview = featured.length ? featured : gallery.slice(0, 5)

  return (
    <PageShell>
      <section className="relative min-h-[92vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/HERO VIDEO.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

        <div className="relative container-site flex min-h-[92vh] flex-col justify-end pb-16 pt-28 lg:justify-center lg:pb-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl text-white">
              <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                <WindMark className="h-10 w-10 text-white/70" />
                {t("locationDakhla")}
              </div>
              <h1 className="text-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                Kitesurfing in Dakhla
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/80 sm:text-xl">
                Ola Y Lagona is a watersports academy on the lagoon — wind, ocean, and desert in one place.
                Learn with certified instructors, then ride.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <BookingCTA href="/courses" label={t("bookSession")} className="rounded-full bg-white text-neutral-900 hover:bg-white/90" />
                <Button asChild size="lg" variant="outline" className="min-h-11 rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link href="/courses">{t("exploreCourses")}</Link>
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-white/80 sm:flex sm:flex-wrap sm:gap-8">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-200" />
                  Lagoon · Speed spot · White dune
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-teal-200" />
                  {t("certifiedInstructors")}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-200" />
                  {t("equipmentIncluded")}
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative ml-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl">
                {gallery.length > 0 ? (
                  gallery.map((item, index) => (
                    <img
                      key={item.id}
                      src={item.imageUrl}
                      alt={item.title}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))
                ) : (
                  <img src="/images/kitesurfing-1.jpg" alt="Kitesurfing in Dakhla" className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-site grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {[
            { value: "3", label: "Teaching spots" },
            { value: "IKO", label: "Certified coaches" },
            { value: "Year-round", label: "Lagoon wind" },
            { value: "12+", label: "Buggy from age" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-display text-3xl lg:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y">
        <div className="container-site">
          <WindguruOfficialEmbed embedUrl="https://www.windguru.cz/widget-fcst-iframe.php?s=6454&m=100&uid=wg_fwdg_6454_100_1760973630770&wj=knots&tj=c&waj=m&tij=cm&odh=0&doh=24&fhours=240&hrsm=2&vt=forecasts&lng=en&idbs=1&p=WINDSPD,GUST,SMER,TMPE,FLHGT,CDC,APCP1s,RATING" />
        </div>
      </section>

      <section className="section-y bg-sand-band">
        <div className="container-site">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <SectionHeading
                eyebrow="The school"
                title="Four ways to ride Dakhla"
                description="Kitesurf the lagoon, fly a buggy on the dunes, landboard the flats, or paddle when the wind rests."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-xl text-muted-foreground lg:text-right">
                Lessons include full equipment and a walkie-talkie. Spots stay uncrowded, with flat water that works from first session to advanced riding.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SPORTS.map((sport, index) => (
              <Reveal key={sport.title} delay={index * 0.08}>
                <MediaCard
                  href={sport.href}
                  image={sport.image}
                  title={sport.title}
                  subtitle={sport.description}
                  aspect={index === 0 ? "aspect-[3/4] md:aspect-[4/5]" : "aspect-[4/5]"}
                />
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <BookingCTA href="/courses" label={t("viewAllCourses")} variant="outline" />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <img src="/images/kitesurfing-8.jpg" alt="Dakhla lagoon kitesurfing" className="h-[520px] w-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-4 hidden w-48 overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
                <img src="/images/kitesurfing-12.jpg" alt="" className="h-32 w-full object-cover" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow="Academy"
              title="A professional school, not a resort."
              description="Ola Y Lagona is built around the session: conditions, coaching, and the right spot. White Dune, Speed Spot, and the Lagoon give us options every day."
            />
            <ul className="mt-8 space-y-4 text-muted-foreground">
              <li>The lesson includes full equipment and a walkie-talkie for easy communication.</li>
              <li>Three teaching spots: White Dune, Speed Spot, and the Lagoon.</li>
              <li>Uncrowded water, flat for learning, interesting for every level.</li>
            </ul>
            <div className="mt-8">
              <BookingCTA href="/courses" label={t("bookSession")} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-sand-band">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Instructors"
              title="Meet the team"
              description="Certified instructors with years on the lagoon — and the languages to coach you clearly."
            />
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {TEAM.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.08}>
                <article className="grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-[200px_1fr]">
                  <img src={member.image} alt={member.name} className="h-64 w-full object-cover sm:h-full" />
                  <div className="flex flex-col justify-center p-6">
                    <h3 className="text-display text-3xl">{member.name}</h3>
                    <p className="mt-2 text-primary">{member.specialtie}</p>
                    <p className="mt-4 text-sm text-muted-foreground">{member.Languages.join(" · ")}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="On the water"
              title="What riders say"
              description="Stories from people who learned, progressed, and came back for the lagoon."
            />
          </Reveal>
          <div className="mt-12">
            <TestimonialSlider testimonials={TESTIMONIALS} />
          </div>
        </div>
      </section>

      {galleryPreview.length > 0 ? (
        <section className="pb-8">
          <div className="container-site mb-8">
            <SectionHeading eyebrow="Atmosphere" title="Dakhla, as it feels" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {galleryPreview.slice(0, 4).map((item, index) => (
              <Link
                key={item.id}
                href="/gallery"
                className={`group relative overflow-hidden bg-muted ${
                  index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5] md:aspect-[4/5]"
                }`}
              >
                <img src={item.imageUrl} alt={item.title} className="img-zoom absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden">
        <img src="/images/kitesurfing-20.jpg" alt="Dakhla lagoon" className="absolute inset-0 h-full w-full object-cover" />
        <div className="overlay-ocean absolute inset-0" />
        <div className="relative container-site grid gap-10 py-24 lg:grid-cols-2 lg:py-32">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Location</p>
            <h2 className="text-display mt-3 text-4xl sm:text-5xl">
              Visit us on the Dakhla lagoon
            </h2>
            <p className="mt-4 max-w-lg text-white/80">
              Located in Morocco&apos;s premier kite sports destination, our center offers easy access to both lagoon and ocean conditions.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/85">
              <p>{t("lagoonSpots")}</p>
              <p>Perfect wind conditions year-round</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/contact">{t("getInTouch")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <a href="https://wa.me/212762767559?text=Hello%20I%20would%20like%20more%20information" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/20 min-h-[280px]">
            <iframe
              title="Dakhla Lagoon map"
              src="https://www.google.com/maps?q=Dakhla+Lagoon+Morocco&output=embed"
              className="h-full min-h-[280px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </PageShell>
  )
}
