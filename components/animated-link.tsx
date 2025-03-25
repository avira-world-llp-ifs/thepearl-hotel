"use client"

import type React from "react"

import Link from "next/link"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

interface AnimatedLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function AnimatedLink({ href, children, className, onClick }: AnimatedLinkProps) {
  const pathname = usePathname()

  // Don't animate if it's the current page
  const isCurrent = pathname === href

  const handleClick = (e: React.MouseEvent) => {
    if (isCurrent) return

    // Let the navigation controller handle this
    if (onClick) onClick()
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}

