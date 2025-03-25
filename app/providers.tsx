"use client"

import type { ReactNode } from "react"
import { NavigationEvents } from "./navigation-events"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <NavigationEvents />
      {children}
    </>
  )
}

