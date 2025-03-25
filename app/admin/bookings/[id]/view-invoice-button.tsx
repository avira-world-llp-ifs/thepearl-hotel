"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface ViewInvoiceButtonProps {
  bookingId: string
}

export function ViewInvoiceButton({ bookingId }: ViewInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleViewInvoice = async () => {
    setIsLoading(true)

    try {
      // Navigate to the invoice page
      router.push(`/admin/bookings/${bookingId}/invoice`)
    } catch (error) {
      console.error("Error viewing invoice:", error)
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleViewInvoice} disabled={isLoading} variant="outline" size="sm">
      <FileText className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "View Invoice"}
    </Button>
  )
}

