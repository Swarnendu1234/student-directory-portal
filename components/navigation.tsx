"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, GraduationCap, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState('')
  const router = useRouter()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Directory", href: "/directory" },
    { name: "Register", href: "/register" },
    { name: "About", href: "https://www.gcetts.ac.in/", external: true },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVtUf4YPOTzjmAObMo3AFvR7GOA-YcOmhIOg&s" 
              alt="GCETT Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <div className="hidden sm:block">
              <h1 className="font-semibold text-lg">Government College of Engineering & Textile Technology</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <button
                  key={item.name}
                  onClick={() => {
                    setLoading(item.name)
                    router.push(item.href)
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  {loading === item.name && <Loader2 className="w-3 h-3 animate-spin" />}
                  {item.name}
                </button>
              ),
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => {
                        setLoading(item.name)
                        setIsOpen(false)
                        router.push(item.href)
                      }}
                      className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {loading === item.name && <Loader2 className="w-4 h-4 animate-spin" />}
                      {item.name}
                    </button>
                  ),
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
