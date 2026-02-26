"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X, Wind } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Ola Y Lagona" className="hidden lg:block h-8 w-8" />
              <span className="font-bold text-xl text-foreground">Ola Y Lagona</span>
            </Link>
            <div className="md:hidden p-2">
              
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/courses" className="text-foreground hover:text-primary transition-colors">
                Courses
              </Link>
              <Link href="/rental" className="text-foreground hover:text-primary transition-colors">
                Rental
              </Link>
              <Link href="/activities" className="text-foreground hover:text-primary transition-colors">
                Activities
              </Link>
              <Link href="/gallery" className="text-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>

              <div className="flex items-center space-x-2">
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center space-x-4">
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <Button variant="outline" size="sm">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" className="flex items-center space-x-2" onClick={closeSidebar}>
            <img src="/logo.png" alt="Ola Y Lagona" className="h-9 w-9" />
            <span className="font-bold text-xl text-foreground">Ola Y Lagona</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={closeSidebar}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className="block px-3 py-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={closeSidebar}
          >
            Courses
          </Link>
          <Link
            href="/rental"
            className="block px-3 py-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={closeSidebar}
          >
            Rental
          </Link>
          <Link
            href="/activities"
            className="block px-3 py-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={closeSidebar}
          >
            Activities
          </Link>
          <Link
            href="/gallery"
            className="block px-3 py-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={closeSidebar}
          >
            Gallery
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={closeSidebar}
          >
            Contact
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">

          <div className="mb-4 justify-self-center">
            {
              user && (<p className="text-sm font-medium">Hi, {user.name}</p>)
            }
          </div>
          {user ? (
            <div className="flex gap-2">
              <>
                {user.role === "admin" && (
                  <Link href="/admin" onClick={closeSidebar} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Admin
                    </Button>
                  </Link>
                )}
              </>
              <div className="justify-center">
                <ThemeToggle />
              </div>
              <Link href="/login" className="flex-1" onClick={closeSidebar}>
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                  Logout
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" onClick={closeSidebar}>
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <div className="justify-center">
                <ThemeToggle />
              </div>
              <Link href="/register" onClick={closeSidebar}>
                <Button size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
