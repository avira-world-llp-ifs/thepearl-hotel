"use client"

import { useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PaperPlaneLoader } from "./paper-plane-loader"

interface NavigationControllerProps {
  children: ReactNode
}

export function NavigationController({ children }: NavigationControllerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const [showExitAnimation, setShowExitAnimation] = useState(false)
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(false)
  const [showContent, setShowContent] = useState(true)

  // Handle navigation
  useEffect(() => {
    if (!isNavigating || !targetPath) return

    // Step 1: Hide content and show exit animation
    setShowContent(false)
    setShowExitAnimation(true)

    // Step 2: After exit animation, navigate and show entrance animation
    const exitTimer = setTimeout(() => {
      setShowExitAnimation(false)

      // Actually navigate
      window.location.href = targetPath

      // Show entrance animation
      setShowEntranceAnimation(true)

      // Step 3: After entrance animation, show content
      const entranceTimer = setTimeout(() => {
        setShowEntranceAnimation(false)
        setShowContent(true)
        setIsNavigating(false)
        setTargetPath(null)
      }, 2000) // Entrance animation + buffer

      return () => clearTimeout(entranceTimer)
    }, 2000) // Exit animation + buffer

    return () => clearTimeout(exitTimer)
  }, [isNavigating, targetPath])

  // Override Link component
  useEffect(() => {
    // Find all links and add click handlers
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement
      const href = target.getAttribute("href")

      // Only handle internal links
      if (href && href.startsWith("/") && href !== pathname) {
        e.preventDefault()
        setIsNavigating(true)
        setTargetPath(href)
      }
    }

    const links = document.querySelectorAll('a[href^="/"]')
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick as EventListener)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick as EventListener)
      })
    }
  }, [pathname])

  return (
    <>
      {/* Exit animation */}
      <PaperPlaneLoader show={showExitAnimation} phase="exit" onComplete={() => setShowExitAnimation(false)} />

      {/* Entrance animation */}
      <PaperPlaneLoader
        show={showEntranceAnimation}
        phase="entrance"
        onComplete={() => {
          setShowEntranceAnimation(false)
          setShowContent(true)
        }}
      />

      {/* Page content */}
      <div style={{ opacity: showContent ? 1 : 0, transition: "opacity 0.3s" }}>{children}</div>
    </>
  )
}

