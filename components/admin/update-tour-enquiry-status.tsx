"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const statuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "cancelled", label: "Cancelled" },
]

export default function UpdateTourEnquiryStatus({ enquiry }: { enquiry: any }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(enquiry.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (value: string) => {
    if (value === status) {
      setOpen(false)
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/tour-enquiries/${enquiry._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: value }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      setStatus(value)
      toast({
        title: "Status Updated",
        description: `Enquiry status has been updated to ${value}.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : statuses.find((s) => s.value === status)?.label || "Select status"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((s) => (
                <CommandItem key={s.value} value={s.value} onSelect={() => handleStatusChange(s.value)}>
                  <Check className={cn("mr-2 h-4 w-4", status === s.value ? "opacity-100" : "opacity-0")} />
                  {s.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

