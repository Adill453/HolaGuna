"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X, User, LogIn, UserPlus, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookingCTA } from "@/components/booking-cta"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LINKS = [
  { href: "/", key: "navHome" as const },
  { href: "/courses", key: "navTarifs" as const },
  { href: "/rental", key: "navRental" as const },
  { href: "/activities", key: "navActivities" as const },
  { href: "/gallery", key: "navGallery" as const },
  { href: "/contact", key: "navContact" as const },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  const accountMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={user ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full",
            !user && "border-border/80 bg-background/60",
          )}
          aria-label={user ? user.name : t("navLogin")}
        >
          {user ? (
            <span className="flex h-full w-full items-center justify-center text-xs font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <p className="text-xs text-muted-foreground">{t("hi")}</p>
              <p className="truncate font-medium">{user.name}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.role === "admin" ? (
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/admin">
                  <Shield className="h-4 w-4" />
                  {t("navAdmin")}
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem className="cursor-pointer rounded-lg" onSelect={() => handleLogout()}>
              <LogOut className="h-4 w-4" />
              {t("navLogout")}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {t("navLogin")} / {t("navSignup")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                {t("navLogin")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
              <Link href="/register">
                <UserPlus className="h-4 w-4" />
                {t("navSignup")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled || isOpen
            ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-background/40 backdrop-blur-md",
        )}
      >
        <div className="container-site">
          <div className="grid h-[4.25rem] grid-cols-[auto_1fr_auto] items-center gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-2.5">
              <img src="/logo.png" alt="" className="h-8 w-8 shrink-0" />
              <span className="text-display truncate text-xl leading-none tracking-tight">
                Ola Y Lagona
              </span>
            </Link>

            <nav className="hidden items-center justify-center gap-1 lg:flex">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(link.key)}
                  {isActive(link.href) ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-primary" />
                  ) : null}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-end gap-2">
              <LanguageSwitcher />
              <div className="hidden items-center xl:flex">
                <ThemeToggle />
              </div>
              {accountMenu}
              <BookingCTA href="/courses" size="default" className="h-10 min-h-10 rounded-full px-4 sm:px-5" />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={isOpen ? t("close") : t("menu")}
                onClick={() => setIsOpen((open) => !open)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-background transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src="/images/kitesurfing-1.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-black/20" />
            <div className="absolute bottom-4 left-5">
              <p className="text-xs uppercase tracking-[0.22em] text-primary">{t("locationDakhla")}</p>
              <p className="text-display text-3xl">Ola Y Lagona</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <div className="space-y-1">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-2xl font-medium tracking-tight transition-colors",
                    isActive(link.href) ? "text-primary" : "text-foreground hover:bg-secondary",
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </nav>

          <div className="space-y-4 border-t border-border p-5">
            <div className="flex flex-wrap items-center gap-2">
              <LanguageSwitcher drop="up" />
              <ThemeToggle />
            </div>
            <BookingCTA href="/courses" className="w-full rounded-full" />
          </div>
        </div>
      </div>
    </>
  )
}
