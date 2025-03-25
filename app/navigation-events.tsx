"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}${searchParams ? "?" + searchParams : ""}`

    // You can dispatch custom events here
    const navigationEvent = new CustomEvent("navigationStart", {
      detail: { url },
    })
    window.dispatchEvent(navigationEvent)

    // This runs on route change
    console.log("Navigation to:", url)
  }, [pathname, searchParams])

  return null
}

