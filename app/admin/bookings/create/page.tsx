"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-picker"
import type { DateRange } from "react-day-picker"
import { differenceInDays, format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function CreateBookingPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<any[]>([])
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1)),
  })

  const [formData, setFormData] = useState({
    guestId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    specialRequests: "",
    paymentStatus: "pending",
    bookingStatus: "confirmed",
  })

  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [discountType, setDiscountType] = useState("percentage") // 'percentage' or 'amount'
  const [discountValue, setDiscountValue] = useState<number>(0)

  // Simplified price calculation state
  const [pricePerNight, setPricePerNight] = useState<number>(0)
  const [numberOfNights, setNumberOfNights] = useState<number>(1)
  const [originalPrice, setOriginalPrice] = useState<number>(0)
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  // Fetch rooms and guests data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await fetch("/api/rooms")
        const roomsData = await roomsResponse.json()

        // Ensure room prices are numbers
        const processedRooms = roomsData.map((room: any) => {
          let price = 0
          try {
            price = Number.parseFloat(room.pricePerNight)
            if (isNaN(price)) price = 0
          } catch (e) {
            price = 0
          }
          return {
            ...room,
            pricePerNight: price,
          }
        })

        setRooms(processedRooms)

        const guestsResponse = await fetch("/api/guests")
        const guestsData = await guestsResponse.json()
        setGuests(guestsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      }
    }

    fetchData()
  }, [])

  // Update selected room when roomId changes
  useEffect(() => {
    if (formData.roomId && rooms.length > 0) {
      const room = rooms.find((r: any) => r._id === formData.roomId)

      if (room) {
        setSelectedRoom(room)
        // Ensure price is a number
        const price =
          typeof room.pricePerNight === "number" ? room.pricePerNight : Number.parseFloat(room.pricePerNight) || 0

        setPricePerNight(price)
        console.log("Set price per night:", price)
      } else {
        setSelectedRoom(null)
        setPricePerNight(0)
      }
    } else {
      setSelectedRoom(null)
      setPricePerNight(0)
    }
  }, [formData.roomId, rooms])

  // Update check-in and check-out dates when dateRange changes
  useEffect(() => {
    if (dateRange?.from) {
      setFormData((prev) => ({
        ...prev,
        checkInDate: format(dateRange.from as Date, "yyyy-MM-dd"),
      }))
    }

    if (dateRange?.to) {
      setFormData((prev) => ({
        ...prev,
        checkOutDate: format(dateRange.to as Date, "yyyy-MM-dd"),
      }))
    }

    // Calculate number of nights
    if (dateRange?.from && dateRange?.to) {
      const nights = Math.max(1, differenceInDays(dateRange.to, dateRange.from))
      setNumberOfNights(nights)
      console.log("Set number of nights:", nights)
    } else {
      setNumberOfNights(1)
    }
  }, [dateRange])

  // Recalculate prices whenever dependencies change
  useEffect(() => {
    // Calculate original price
    const calculatedOriginalPrice = pricePerNight * numberOfNights
    setOriginalPrice(calculatedOriginalPrice)
    console.log("Original price calculated:", calculatedOriginalPrice, "from", pricePerNight, "x", numberOfNights)

    // Calculate discount
    let calculatedDiscountAmount = 0
    if (discountType === "percentage") {
      calculatedDiscountAmount = calculatedOriginalPrice * (discountValue / 100)
    } else {
      // amount
      calculatedDiscountAmount = discountValue
    }

    // Ensure discount doesn't exceed original price and is not negative
    calculatedDiscountAmount = Math.min(Math.max(0, calculatedDiscountAmount), calculatedOriginalPrice)
    setDiscountAmount(calculatedDiscountAmount)

    // Calculate total price
    const calculatedTotalPrice = calculatedOriginalPrice - calculatedDiscountAmount
    setTotalPrice(calculatedTotalPrice)
    console.log("Total price calculated:", calculatedTotalPrice)
  }, [pricePerNight, numberOfNights, discountType, discountValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Ensure it's a valid number
    const numValue = value === "" ? 0 : Number.parseFloat(value)
    setDiscountValue(isNaN(numValue) ? 0 : numValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const bookingData = {
        ...formData,
        totalPrice,
        numberOfNights,
        discountType,
        discountValue,
        originalPrice,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        toast.success("Booking created successfully")
        router.push("/admin/bookings")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to create booking")
      }
    } catch (error: any) {
      console.error("Error creating booking:", error)
      toast.error(error.message || "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return isNaN(price) ? "0.00" : price.toFixed(2)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Booking</CardTitle>
          <CardDescription>Enter the booking details below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guestId">Select Guest</Label>
                  <Select onValueChange={(value) => handleSelectChange("guestId", value)} value={formData.guestId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a guest" />
                    </SelectTrigger>
                    <SelectContent>
                      {guests.map((guest: any) => (
                        <SelectItem key={guest._id} value={guest._id}>
                          {guest.firstName} {guest.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="roomId">Select Room</Label>
                  <Select onValueChange={(value) => handleSelectChange("roomId", value)} value={formData.roomId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room: any) => (
                        <SelectItem key={room._id} value={room._id}>
                          {room.roomNumber} - {room.roomType} (${formatPrice(room.pricePerNight)}/night)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Booking Dates</Label>
                  <div className="mt-1">
                    <DateRangePicker date={dateRange} setDate={setDateRange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="numberOfGuests">Number of Guests</Label>
                  <Input
                    id="numberOfGuests"
                    name="numberOfGuests"
                    type="number"
                    min="1"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows={3}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.specialRequests}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("paymentStatus", value)}
                    value={formData.paymentStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bookingStatus">Booking Status</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("bookingStatus", value)}
                    value={formData.bookingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select booking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Discount Section */}
            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="text-lg font-medium mb-3">Apply Discount</h3>

              <Tabs defaultValue="percentage" onValueChange={(value) => setDiscountType(value)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="percentage">Percentage (%)</TabsTrigger>
                  <TabsTrigger value="amount">Fixed Amount ($)</TabsTrigger>
                </TabsList>

                <TabsContent value="percentage" className="space-y-4">
                  <div>
                    <Label htmlFor="discountPercentage">Discount Percentage</Label>
                    <div className="flex items-center">
                      <Input
                        id="discountPercentage"
                        type="number"
                        min="0"
                        max="100"
                        value={discountValue}
                        onChange={handleDiscountValueChange}
                        className="max-w-[150px]"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amount" className="space-y-4">
                  <div>
                    <Label htmlFor="discountAmount">Discount Amount</Label>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input
                        id="discountAmount"
                        type="number"
                        min="0"
                        value={discountValue}
                        onChange={handleDiscountValueChange}
                        className="max-w-[150px]"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Price Calculation */}
            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="text-lg font-medium mb-3">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price per night:</span>
                  <span>${formatPrice(pricePerNight)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of nights:</span>
                  <span>{numberOfNights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Original price:</span>
                  <span>${formatPrice(originalPrice)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountType === "percentage" ? `${discountValue}%` : `$${discountValue}`}):</span>
                    <span>-${formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Total price:</span>
                  <span>${formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedRoom || !formData.guestId}>
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

