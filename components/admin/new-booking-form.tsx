"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { formatDate, calculateNights, calculateTotalPrice } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { CreateUserModal } from "./create-user-modal"

interface Room {
  _id: string
  name: string
  price: number
  capacity: number
}

interface User {
  _id: string
  name: string
  email: string
}

interface NewBookingFormProps {
  rooms: Room[]
  users: User[]
}

export function NewBookingForm({ rooms, users: initialUsers }: NewBookingFormProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [userId, setUserId] = useState("")
  const [roomId, setRoomId] = useState("")
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState("1")
  const [status, setStatus] = useState("pending")
  const [specialRequests, setSpecialRequests] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [bookingSummary, setBookingSummary] = useState<{
    nights: number
    pricePerNight: number
    totalPrice: number
  } | null>(null)

  // Effect to handle "new-user" selection
  useEffect(() => {
    if (userId === "new-user") {
      setIsCreateUserModalOpen(true)
    }
  }, [userId])

  // Effect to calculate booking summary when room, check-in, or check-out changes
  useEffect(() => {
    if (roomId && checkIn && checkOut) {
      const selectedRoom = rooms.find((room) => room._id.toString() === roomId)
      if (selectedRoom) {
        const nights = calculateNights(checkIn, checkOut)
        const pricePerNight = selectedRoom.price
        const totalPrice = calculateTotalPrice(pricePerNight, nights)

        setBookingSummary({
          nights,
          pricePerNight,
          totalPrice,
        })
      }
    } else {
      setBookingSummary(null)
    }
  }, [roomId, checkIn, checkOut, rooms])

  const validateForm = () => {
    if (!userId) {
      setError("Please select a guest")
      return false
    }

    if (!roomId) {
      setError("Please select a room")
      return false
    }

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates")
      return false
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("Check-out date must be after check-in date")
      return false
    }

    const selectedRoom = rooms.find((room) => room._id.toString() === roomId)
    if (!selectedRoom) {
      setError("Selected room not found")
      return false
    }

    const guestsCount = Number.parseInt(guests)
    if (guestsCount > selectedRoom.capacity) {
      setError(`Selected room can only accommodate ${selectedRoom.capacity} guests`)
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Find the selected room to get its price
      const selectedRoom = rooms.find((room) => room._id.toString() === roomId)
      if (!selectedRoom) {
        throw new Error("Selected room not found")
      }

      // Calculate number of nights
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      const nights = calculateNights(checkInDate, checkOutDate)

      // Calculate total price
      const totalPrice = calculateTotalPrice(selectedRoom.price, nights)

      const bookingData = {
        userId,
        roomId,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: Number.parseInt(guests),
        totalPrice,
        status,
        specialRequests,
      }

      console.log("Submitting booking data:", bookingData)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (!response.ok) {
        // Extract detailed error message
        const errorMessage = data.error || "Failed to create booking"

        // Check for specific error conditions
        if (errorMessage.includes("Room not found")) {
          throw new Error("The selected room is no longer available")
        } else if (errorMessage.includes("User not found")) {
          throw new Error("The selected guest account is no longer valid")
        } else if (errorMessage.includes("already booked")) {
          throw new Error("This room is already booked for the selected dates")
        } else {
          throw new Error(errorMessage)
        }
      }

      setSuccess("Booking created successfully!")
      setBookingId(data._id)

      // Don't redirect immediately so user can see the success message and invoice button
    } catch (err) {
      console.error("Error creating booking:", err)
      setError(err instanceof Error ? err.message : "An error occurred while creating the booking")
    } finally {
      setIsLoading(false)
    }
  }

  const viewInvoice = () => {
    if (bookingId) {
      router.push(`/admin/bookings/${bookingId}/invoice`)
    }
  }

  const viewAllBookings = () => {
    router.push("/admin/bookings")
    router.refresh()
  }

  const handleUserCreated = (newUser: User) => {
    // Add the new user to the users list
    setUsers((prevUsers) => [...prevUsers, newUser])

    // Select the newly created user
    setUserId(newUser._id)

    // Close the modal
    setIsCreateUserModalOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Booking</CardTitle>
        <CardDescription>Book a room for a guest</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {bookingId ? (
          <div className="flex flex-col space-y-4">
            <p>Booking has been created successfully. What would you like to do next?</p>
            <div className="flex gap-4">
              <Button onClick={viewInvoice}>View Invoice</Button>
              <Button variant="outline" onClick={viewAllBookings}>
                View All Bookings
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="userId">Guest</Label>
                <div className="flex gap-2">
                  <Select value={userId} onValueChange={setUserId} className="flex-1">
                    <SelectTrigger id="userId">
                      <SelectValue placeholder="Select guest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-user" className="text-primary font-medium">
                        <div className="flex items-center">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create New Guest
                        </div>
                      </SelectItem>
                      <div className="border-t my-1"></div>
                      {users.map((user) => (
                        <SelectItem key={user._id.toString()} value={user._id.toString()}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsCreateUserModalOpen(true)}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId">Room</Label>
                <Select value={roomId} onValueChange={setRoomId}>
                  <SelectTrigger id="roomId">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room._id.toString()} value={room._id.toString()}>
                        {room.name} - ${room.price}/night (Max: {room.capacity} guests)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? formatDate(checkIn) : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? formatDate(checkOut) : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      initialFocus
                      disabled={(date) => !checkIn || date <= checkIn}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger id="guests">
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select booking status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requests or notes"
              />
            </div>

            {bookingSummary && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Price per night:</span>
                    <span>${bookingSummary.pricePerNight.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of nights:</span>
                    <span>{bookingSummary.nights}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t mt-2">
                    <span>Total price:</span>
                    <span>${bookingSummary.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Booking"}
            </Button>
          </form>
        )}

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isCreateUserModalOpen || userId === "new-user"}
          onClose={() => {
            setIsCreateUserModalOpen(false)
            if (userId === "new-user") {
              setUserId("")
            }
          }}
          onUserCreated={handleUserCreated}
        />
      </CardContent>
    </Card>
  )
}

