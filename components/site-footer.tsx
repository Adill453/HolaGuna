"use client"

import Link from "next/link"
import { Instagram, MessageCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const SPORTS = ["Kitesurfing", "Buggy", "Land board", "Standup paddle"]

export function SiteFooter() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="" className="h-8 w-8" />
              <span className="text-display text-xl">Ola Y Lagona</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footerTagline")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em]">{t("quickLinks")}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/courses" className="block text-muted-foreground transition-colors hover:text-primary">
                {t("navTarifs")}
              </Link>
              <Link href="/activities" className="block text-muted-foreground transition-colors hover:text-primary">
                {t("navActivities")}
              </Link>
              <Link href="/gallery" className="block text-muted-foreground transition-colors hover:text-primary">
                {t("navGallery")}
              </Link>
              <Link href="/contact" className="block text-muted-foreground transition-colors hover:text-primary">
                {t("navContact")}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em]">{t("sports")}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {SPORTS.map((sport) => (
                <p key={sport}>{sport}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em]">{t("contactInfo")}</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Dakhla: {t("lagoonSpots")}</p>
              <a
                href="https://wa.me/212762767559?text=Hello%20I%20would%20like%20more%20information"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                <span>+212 762 767 559</span>
              </a>
              <a
                href="https://www.instagram.com/olaylagona"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
                <span>Olaylagona</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {year} {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
