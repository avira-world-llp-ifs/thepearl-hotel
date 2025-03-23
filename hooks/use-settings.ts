"use client"

import { useState, useEffect, createContext } from "react"
import type { Settings } from "@/contexts/settings-context"

const SettingsContext = createContext<{
  settings: Settings | null
  loading: boolean
}>({
  settings: null,
  loading: true,
})

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          setSettings(data.settings)
        } else {
          console.error("Failed to fetch settings")
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading }
}

