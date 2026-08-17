"use client"

import type React from "react"
import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { SectionHeading } from "@/components/section-heading"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        })
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <PageHero
        eyebrow={t("navContact")}
        title="Get in touch"
        description="Ready to start your kite sports adventure? Have questions about our courses? We're here to help you plan the session."
        image="/images/kitesurfing-16.jpg"
        compact
      />

      <section className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-2xl">
              <img src="/images/kitesurfing-20.jpg" alt="Dakhla lagoon" className="h-64 w-full object-cover" />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-muted-foreground">Dakhla Lagoon, Morocco</p>
                  <p className="text-sm text-muted-foreground">
                    Located at the heart of Morocco&apos;s premier kite sports destination
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold">WhatsApp</h4>
                  <a
                    href="https://wa.me/212762767559?text=Hello%20I%20would%20like%20more%20information"
                    className="text-muted-foreground hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +212 762 767 559
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-muted-foreground">+212 528 93 XX XX</p>
                  <p className="text-sm text-muted-foreground">Available 9 AM - 7 PM (GMT+1)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-muted-foreground">info@kitedakhla.com</p>
                  <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold">Operating Hours</h4>
                  <p className="text-muted-foreground">Monday - Sunday: 8:00 AM - 6:00 PM</p>
                  <p className="text-sm text-muted-foreground">Best wind conditions: 10 AM - 4 PM</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-display text-2xl">Why Ola Y Lagona?</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>The lesson includes full equipment and a walkie-talkie for easy communication</li>
                <li>We have three teaching spots: White Dune, Speed Spot, and the Lagoon.</li>
                <li>These spots are not crowded and offer very flat water, making them perfect for learning.</li>
                <li>They are ideal for all levels — from complete beginners to advanced riders.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-display text-3xl">Send us a message</h2>
            <p className="mt-2 text-muted-foreground">Fill out the form and we&apos;ll get back to you as soon as possible.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+212 XXX XXX XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required placeholder="What's this about?" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us about your kite sports interests, experience level, or any questions you have..."
                  rows={6}
                />
              </div>
              <Button type="submit" disabled={loading} className="min-h-11 w-full rounded-full">
                {loading ? "Sending..." : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-site overflow-hidden rounded-2xl border border-border">
          <iframe
            title="Dakhla Lagoon map"
            src="https://www.google.com/maps?q=Dakhla+Lagoon+Morocco&output=embed"
            className="h-[380px] w-full"
            loading="lazy"
          />
        </div>
      </section>

      <section className="section-y bg-sand-band">
        <div className="container-site">
          <SectionHeading
            align="center"
            title="Frequently asked questions"
            description="Quick answers to common questions about our services."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                question: "Do I need experience to start?",
                answer: "Not at all! Our beginner courses are designed for complete newcomers to kite sports.",
              },
              {
                question: "What's included in the lessons?",
                answer: "All equipment, safety gear, and professional instruction are included in our course prices.",
              },
              {
                question: "What are the best months to visit?",
                answer: "Dakhla has excellent wind conditions year-round, with peak season from October to April.",
              },
              {
                question: "Can I book last minute?",
                answer: "Yes! While advance booking is recommended, we often have availability for same-day lessons.",
              },
            ].map((faq) => (
              <div key={faq.question} className="rounded-xl border border-border bg-card p-6">
                <h4 className="font-semibold">{faq.question}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
