import { StaticHeader } from "@/components/static-header"
import type React from "react"

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <StaticHeader />

      <main className="flex-grow flex items-center justify-center p-6">{children}</main>

      <footer className="w-full py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} The Pearl Hotel. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

