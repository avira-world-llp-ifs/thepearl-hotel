"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Filter } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function RoomFilter() {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState<string>("1")

  const handleSearch = () => {
    // In a real app, this would update the URL with query parameters
    // or dispatch an action to fetch filtered rooms
    console.log("Search with:", { checkIn, checkOut, guests })
  }

  return (
    <div className="w-full md:w-auto bg-background p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Check-in Date */}
          <div>
            <label className="text-sm font-medium mb-1 block">Check-in</label>
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

          {/* Check-out Date */}
          <div>
            <label className="text-sm font-medium mb-1 block">Check-out</label>
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

          {/* Guests */}
          <div>
            <label className="text-sm font-medium mb-1 block">Guests</label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger>
                <SelectValue placeholder="Number of guests" />
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
        </div>

        <Button onClick={handleSearch} className="w-full">
          <Filter className="mr-2 h-4 w-4" />
          Filter Rooms
        </Button>
      </div>
    </div>
  )
}

