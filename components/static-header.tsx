"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function StaticHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/rooms", label: "Rooms" },
    { href: "/gallery", label: "Gallery" },
    { href: "/tours", label: "Tour Packages" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-white py-2">
      <div className="container mx-auto px-4 pb-4">
        <div className="flex items-center justify-between">
          {/* Static Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-amber-500">The Pearl</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="text-gray-700 hover:text-blue-500 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="default" size="sm" className="bg-gray-700 hover:bg-blue-500 text-white">
                Login / Register
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-amber-500 hover:text-blue-500"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-amber-500/20">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-amber-500 hover:text-blue-500"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="text-sm font-medium text-amber-500 hover:text-blue-500">
                Login / Register
              </Link>
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

