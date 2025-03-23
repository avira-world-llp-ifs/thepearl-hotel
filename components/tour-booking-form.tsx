"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Updated schema to include tour selection
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional(),
  travelDate: z.date().optional(),
  guests: z.string().min(1, { message: "Please enter the number of guests." }).optional(),
  specialRequests: z.string().optional(),
  tourTitle: z.string().min(1, { message: "Please select a tour." }),
})

type FormValues = z.infer<typeof formSchema>

export default function TourBookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tourTitles, setTourTitles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(undefined)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guests: "1",
      specialRequests: "",
      tourTitle: "",
    },
  })

  // Fetch tour titles from the database
  useEffect(() => {
    const fetchTourTitles = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/tours/titles")
        if (!response.ok) {
          throw new Error("Failed to fetch tour titles")
        }
        const data = await response.json()
        setTourTitles(data)
      } catch (error) {
        console.error("Error fetching tour titles:", error)
        toast({
          title: "Error",
          description: "Failed to load tours. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTourTitles()
  }, [toast])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tour-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          tourName: data.tourTitle, // Map tourTitle to tourName for API compatibility
          travelDate: data.travelDate ? data.travelDate.toISOString() : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit booking request")
      }

      toast({
        title: "Booking Request Submitted",
        description: "We have received your tour booking request and will contact you shortly.",
        variant: "default",
      })

      reset()
      setDate(undefined)
    } catch (error) {
      console.error("Error submitting booking request:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your booking request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book a Tour</CardTitle>
        <CardDescription>Fill out the form below to request a booking for a tour.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tourTitle">Select Tour</Label>
            <Select
              onValueChange={(value) => setValue("tourTitle", value, { shouldValidate: true })}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tour" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading tours...
                  </SelectItem>
                ) : tourTitles.length > 0 ? (
                  tourTitles.map((title, index) => (
                    <SelectItem key={index} value={title}>
                      {title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No tours available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.tourTitle && <p className="text-sm text-red-500">{errors.tourTitle.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelDate">Travel Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select your travel date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate)
                    if (newDate) {
                      setValue("travelDate", newDate, { shouldValidate: true })
                    }
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.travelDate && <p className="text-sm text-red-500">{errors.travelDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Input id="guests" type="number" min="1" {...register("guests")} />
            {errors.guests && <p className="text-sm text-red-500">{errors.guests.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea id="specialRequests" {...register("specialRequests")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

