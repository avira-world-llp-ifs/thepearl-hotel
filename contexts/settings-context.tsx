"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SocialLinks = {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
}

export type Settings = {
  siteName: string
  tagline: string
  description: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  address: string
  contactEmail: string
  contactPhone: string
  footerText: string
  socialLinks: SocialLinks
  enableRegistration: boolean
  enableBookingNotifications: boolean
  enableReviewNotifications: boolean
  enableMarketingEmails: boolean
  requireEmailVerification: boolean
  passwordMinLength: number
  sessionTimeout: number
  enableTwoFactorAuth: boolean
}

const defaultSettings: Settings = {
  siteName: "Luxury Hotel",
  tagline: "Experience Luxury Like Never Before",
  description: "Welcome to our luxury hotel, where comfort meets elegance.",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  primaryColor: "#0f766e",
  secondaryColor: "#f59e0b",
  address: "123 Luxury Avenue, Beverly Hills, CA 90210",
  contactEmail: "info@luxuryhotel.com",
  contactPhone: "+1 (555) 123-4567",
  footerText: "© 2023 Luxury Hotel & Resort. All rights reserved.",
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
  enableRegistration: true,
  enableBookingNotifications: true,
  enableReviewNotifications: true,
  enableMarketingEmails: false,
  requireEmailVerification: true,
  passwordMinLength: 8,
  sessionTimeout: 30,
  enableTwoFactorAuth: false,
}

type SettingsContextType = {
  settings: Settings
  setSettings: (settings: Settings) => void
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  loading: true,
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.settings) {
            // Merge with default settings to ensure all properties exist
            setSettings({ ...defaultSettings, ...data.settings })
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return <SettingsContext.Provider value={{ settings, setSettings, loading }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}

