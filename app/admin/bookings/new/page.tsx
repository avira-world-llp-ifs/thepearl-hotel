"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, AlertCircle, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function NewBookingPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dataError, setDataError] = useState<string | null>(null)

  // Separate date states for check-in and check-out
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1)),
  )

  const [formData, setFormData] = useState({
    userId: "",
    roomId: "",
    checkInDate: format(new Date(), "yyyy-MM-dd"),
    checkOutDate: format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd"),
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

  // New user form state
  const [newUserOpen, setNewUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    role: "user",
  })
  const [creatingUser, setCreatingUser] = useState(false)

  // Fetch rooms and users data
  const fetchData = async () => {
    setIsLoadingData(true)
    setDataError(null)

    try {
      // Fetch rooms
      const roomsResponse = await fetch("/api/rooms")
      if (!roomsResponse.ok) {
        throw new Error(`Failed to fetch rooms: ${roomsResponse.status} ${roomsResponse.statusText}`)
      }
      const roomsData = await roomsResponse.json()

      if (!Array.isArray(roomsData)) {
        console.error("Rooms data is not an array:", roomsData)
        throw new Error("Invalid rooms data format")
      }

      // Log the raw room data to debug
      console.log("Raw room data:", roomsData)

      // Ensure room prices and capacity are numbers
      const processedRooms = roomsData.map((room: any) => {
        // Extract the price and ensure it's a number - check both price and pricePerNight fields
        let price =
          typeof room.price === "number"
            ? room.price
            : typeof room.pricePerNight === "number"
              ? room.pricePerNight
              : Number.parseFloat(room.price || room.pricePerNight || "0")

        // If price is NaN, try to extract it from a nested structure or default to 0
        if (isNaN(price)) {
          console.warn(`Invalid price for room ${room.roomNumber || room._id}:`, room.price || room.pricePerNight)
          price = 0
        }

        // Extract capacity and ensure it's a number
        let capacity = typeof room.capacity === "number" ? room.capacity : Number.parseInt(room.capacity || "1", 10)

        // If capacity is NaN, default to 1
        if (isNaN(capacity) || capacity < 1) {
          console.warn(`Invalid capacity for room ${room.roomNumber || room._id}:`, room.capacity)
          capacity = 1
        }

        console.log(`Processed room ${room.roomNumber || room._id}: price=${price}, capacity=${capacity}`)

        return {
          ...room,
          price: price,
          pricePerNight: price, // Set both fields for compatibility
          capacity: capacity,
        }
      })

      console.log("Processed rooms:", processedRooms)
      setRooms(processedRooms)

      // Fetch users instead of guests
      const usersResponse = await fetch("/api/users")
      if (!usersResponse.ok) {
        throw new Error(`Failed to fetch users: ${usersResponse.status} ${usersResponse.statusText}`)
      }
      const usersData = await usersResponse.json()

      if (!Array.isArray(usersData)) {
        console.error("Users data is not an array:", usersData)
        throw new Error("Invalid users data format")
      }

      console.log("Fetched users:", usersData)
      setUsers(usersData)
    } catch (error: any) {
      console.error("Error fetching data:", error)
      setDataError(error.message || "Failed to load data")
      toast.error("Failed to load data. Please try refreshing the page.")
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Update selected room when roomId changes
  useEffect(() => {
    if (formData.roomId && rooms.length > 0) {
      const room = rooms.find((r: any) => r._id === formData.roomId)

      if (room) {
        setSelectedRoom(room)

        // Ensure price is a number - check both price and pricePerNight fields
        const price =
          typeof room.price === "number"
            ? room.price
            : typeof room.pricePerNight === "number"
              ? room.pricePerNight
              : Number.parseFloat(room.price || room.pricePerNight || "0")

        if (isNaN(price)) {
          console.warn("Invalid price for selected room:", room.price || room.pricePerNight)
          setPricePerNight(0)
        } else {
          setPricePerNight(price)
          console.log(`Set price per night: ${price}`)
        }

        // Set number of guests to room capacity (or 1 if capacity is invalid)
        const capacity = typeof room.capacity === "number" ? room.capacity : Number.parseInt(room.capacity || "1", 10)

        if (isNaN(capacity) || capacity < 1) {
          console.warn("Invalid capacity for selected room:", room.capacity)
          setFormData((prev) => ({
            ...prev,
            numberOfGuests: 1,
          }))
        } else {
          setFormData((prev) => ({
            ...prev,
            numberOfGuests: capacity,
          }))
          console.log(`Set max guests to room capacity: ${capacity}`)
        }
      } else {
        setSelectedRoom(null)
        setPricePerNight(0)
      }
    } else {
      setSelectedRoom(null)
      setPricePerNight(0)
    }
  }, [formData.roomId, rooms])

  // Update check-in date
  const handleCheckInDateChange = (date: Date | undefined) => {
    if (date) {
      setCheckInDate(date)
      const formattedDate = format(date, "yyyy-MM-dd")
      setFormData((prev) => ({
        ...prev,
        checkInDate: formattedDate,
      }))

      // If check-out date is before check-in date, update it
      if (checkOutDate && date > checkOutDate) {
        const newCheckOutDate = new Date(date)
        newCheckOutDate.setDate(date.getDate() + 1)
        setCheckOutDate(newCheckOutDate)
        setFormData((prev) => ({
          ...prev,
          checkOutDate: format(newCheckOutDate, "yyyy-MM-dd"),
        }))
      }

      updateNumberOfNights(date, checkOutDate)
    }
  }

  // Update check-out date
  const handleCheckOutDateChange = (date: Date | undefined) => {
    if (date) {
      setCheckOutDate(date)
      const formattedDate = format(date, "yyyy-MM-dd")
      setFormData((prev) => ({
        ...prev,
        checkOutDate: formattedDate,
      }))

      updateNumberOfNights(checkInDate, date)
    }
  }

  // Calculate number of nights
  const updateNumberOfNights = (startDate: Date | undefined, endDate: Date | undefined) => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const nights = Math.max(1, diffDays)

      setNumberOfNights(nights)
      console.log(`Set number of nights: ${nights}`)
    }
  }

  // Recalculate prices whenever dependencies change
  useEffect(() => {
    // Calculate original price
    const calculatedOriginalPrice = pricePerNight * numberOfNights
    setOriginalPrice(calculatedOriginalPrice)
    console.log(`Original price calculated: ${calculatedOriginalPrice} from ${pricePerNight} x ${numberOfNights}`)

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
    console.log(`Total price calculated: ${calculatedTotalPrice}`)
  }, [pricePerNight, numberOfNights, discountType, discountValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "numberOfGuests") {
      // Ensure number of guests doesn't exceed room capacity
      if (selectedRoom && selectedRoom.capacity) {
        const maxCapacity = Number.parseInt(selectedRoom.capacity) || 1
        const numGuests = Number.parseInt(value) || 1

        if (numGuests > maxCapacity) {
          toast.warning(`Maximum capacity for this room is ${maxCapacity} guests`)
          setFormData((prev) => ({
            ...prev,
            [name]: maxCapacity,
          }))
          return
        }
      }
    }

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

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      // Handle nested objects (address fields)
      const [parent, child] = name.split(".")
      setNewUser((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      // Handle top-level fields
      setNewUser((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleCreateUser = async () => {
    setCreatingUser(true)

    try {
      // Validate required fields
      if (!newUser.name || !newUser.email || !newUser.password) {
        throw new Error("Name, email, and password are required")
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create user")
      }

      const createdUser = await response.json()

      // Add the new user to the users list
      setUsers((prev) => [...prev, createdUser])

      // Select the newly created user
      setFormData((prev) => ({
        ...prev,
        userId: createdUser._id,
      }))

      // Close the dialog
      setNewUserOpen(false)

      // Reset the new user form
      setNewUser({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        role: "user",
      })

      toast.success("User created successfully")
    } catch (error: any) {
      console.error("Error creating user:", error)
      toast.error(error.message || "Failed to create user")
    } finally {
      setCreatingUser(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.userId) throw new Error("Please select a user")
      if (!formData.roomId) throw new Error("Please select a room")
      if (!formData.checkInDate) throw new Error("Please select a check-in date")
      if (!formData.checkOutDate) throw new Error("Please select a check-out date")
      if (!formData.numberOfGuests || formData.numberOfGuests < 1)
        throw new Error("Please enter a valid number of guests")

      const bookingData = {
        ...formData,
        totalPrice,
        numberOfNights,
        discountType,
        discountValue,
        originalPrice,
      }

      console.log("Submitting booking data:", bookingData)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      const responseData = await response.json()
      console.log("Booking API response:", responseData)

      if (response.ok) {
        toast.success("Booking created successfully")
        router.push("/admin/bookings")
      } else {
        throw new Error(responseData.message || "Failed to create booking")
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

  // Refresh data handler
  const handleRefreshData = () => {
    fetchData()
    toast.info("Refreshing data...")
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
            {isLoadingData ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading data...</span>
              </div>
            ) : dataError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {dataError}
                  <Button variant="outline" size="sm" className="ml-2" onClick={handleRefreshData}>
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor="userId">Select User</Label>
                        <div className="flex space-x-2">
                          <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Add New User
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>
                                  Enter the user details below to create a new user account.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Full Name *</Label>
                                  <Input
                                    id="name"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleNewUserChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email">Email *</Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={handleNewUserChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="password">Password *</Label>
                                  <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={handleNewUserChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="phone">Phone</Label>
                                  <Input id="phone" name="phone" value={newUser.phone} onChange={handleNewUserChange} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="address.street">Street Address</Label>
                                  <Input
                                    id="address.street"
                                    name="address.street"
                                    value={newUser.address.street}
                                    onChange={handleNewUserChange}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="address.city">City</Label>
                                    <Input
                                      id="address.city"
                                      name="address.city"
                                      value={newUser.address.city}
                                      onChange={handleNewUserChange}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="address.state">State/Province</Label>
                                    <Input
                                      id="address.state"
                                      name="address.state"
                                      value={newUser.address.state}
                                      onChange={handleNewUserChange}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="address.zipCode">Zip/Postal Code</Label>
                                    <Input
                                      id="address.zipCode"
                                      name="address.zipCode"
                                      value={newUser.address.zipCode}
                                      onChange={handleNewUserChange}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="address.country">Country</Label>
                                    <Input
                                      id="address.country"
                                      name="address.country"
                                      value={newUser.address.country}
                                      onChange={handleNewUserChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setNewUserOpen(false)} disabled={creatingUser}>
                                  Cancel
                                </Button>
                                <Button onClick={handleCreateUser} disabled={creatingUser}>
                                  {creatingUser ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Creating...
                                    </>
                                  ) : (
                                    "Create User"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={handleRefreshData} disabled={isLoadingData}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                              <path d="M3 3v5h5" />
                              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                              <path d="M16 21h5v-5" />
                            </svg>
                            Refresh
                          </Button>
                        </div>
                      </div>
                      <Select onValueChange={(value) => handleSelectChange("userId", value)} value={formData.userId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.length === 0 ? (
                            <div className="p-2 text-center text-muted-foreground">
                              No users found. Please add a new user.
                            </div>
                          ) : (
                            users.map((user: any) => (
                              <SelectItem key={user._id} value={user._id}>
                                {user.name} {user.email ? `(${user.email})` : ""}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor="roomId">Select Room</Label>
                        <Button variant="ghost" size="sm" onClick={handleRefreshData} disabled={isLoadingData}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 21h5v-5" />
                          </svg>
                          Refresh
                        </Button>
                      </div>
                      <Select onValueChange={(value) => handleSelectChange("roomId", value)} value={formData.roomId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.length === 0 ? (
                            <div className="p-2 text-center text-muted-foreground">
                              No rooms found. Please check the database.
                            </div>
                          ) : (
                            rooms.map((room: any) => {
                              const capacity = Number.parseInt(room.capacity || "1", 10) || 1
                              const price =
                                typeof room.price === "number"
                                  ? room.price
                                  : typeof room.pricePerNight === "number"
                                    ? room.pricePerNight
                                    : Number.parseFloat(room.price || room.pricePerNight || "0")

                              return (
                                <SelectItem key={room._id} value={room._id}>
                                  {room.name || room.roomType || `Room ${room.roomNumber}`} - ₹{formatPrice(price)}
                                  /night
                                </SelectItem>
                              )
                            })
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Booking Dates</Label>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <div className="space-y-2">
                          <Label htmlFor="checkInDate">Check-in Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !checkInDate && "text-muted-foreground",
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={checkInDate}
                                onSelect={handleCheckInDateChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="checkOutDate">Check-out Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !checkOutDate && "text-muted-foreground",
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={checkOutDate}
                                onSelect={handleCheckOutDateChange}
                                disabled={(date) => (checkInDate ? date < checkInDate : false)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor="numberOfGuests">Number of Guests</Label>
                        {selectedRoom && selectedRoom.capacity && (
                          <span className="text-xs text-muted-foreground">
                            Max capacity: {selectedRoom.capacity} guests
                          </span>
                        )}
                      </div>
                      <Input
                        id="numberOfGuests"
                        name="numberOfGuests"
                        type="number"
                        min="1"
                        max={selectedRoom?.capacity || 10}
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
                      <TabsTrigger value="amount">Fixed Amount (₹)</TabsTrigger>
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
                          <span className="mr-2">₹</span>
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
                      <span>₹{formatPrice(pricePerNight)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of nights:</span>
                      <span>{numberOfNights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Original price:</span>
                      <span>₹{formatPrice(originalPrice)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Discount ({discountType === "percentage" ? `${discountValue}%` : `₹${discountValue}`}):
                        </span>
                        <span>-₹{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Total price:</span>
                      <span>₹{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isLoadingData || !formData.roomId || !formData.userId}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

