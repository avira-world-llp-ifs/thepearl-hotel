import { AnimatedPearlLogo } from "@/components/animated-pearl-logo"

export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center">
        <AnimatedPearlLogo />
        <p className="mt-4 text-amber-500 dark:text-amber-400 animate-pulse">Loading contact page...</p>
      </div>
    </div>
  )
}

