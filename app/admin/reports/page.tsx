"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/date-range-picker"
import { formatPrice } from "@/lib/utils"
import { BookingChart } from "@/components/admin/booking-chart"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { OccupancyChart } from "@/components/admin/occupancy-chart"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ReportsPage() {
  // State for filters
  const [bookingPeriod, setBookingPeriod] = useState("month")
  const [bookingStatus, setBookingStatus] = useState("all")
  const [revenuePeriod, setRevenuePeriod] = useState("month")
  const [occupancyPeriod, setOccupancyPeriod] = useState("month")
  const [roomType, setRoomType] = useState("all")

  // State for date ranges
  const [bookingDateRange, setBookingDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [revenueDateRange, setRevenueDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [occupancyDateRange, setOccupancyDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  // State for data
  const [bookingData, setBookingData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [occupancyData, setOccupancyData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summaryStats, setSummaryStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    averageOccupancy: 0,
  })

  // Effect to fetch data based on filters
  useEffect(() => {
    fetchData()
  }, [
    bookingPeriod,
    bookingStatus,
    revenuePeriod,
    occupancyPeriod,
    roomType,
    bookingDateRange,
    revenueDateRange,
    occupancyDateRange,
  ])

  // Function to fetch data
  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch booking data
      const bookingResponse = await fetch(
        `/api/reports/bookings?period=${bookingPeriod}&status=${bookingStatus}${
          bookingDateRange?.from ? `&from=${bookingDateRange.from.toISOString()}` : ""
        }${bookingDateRange?.to ? `&to=${bookingDateRange.to.toISOString()}` : ""}`,
      )

      if (!bookingResponse.ok) {
        throw new Error("Failed to fetch booking data")
      }

      const bookingResult = await bookingResponse.json()
      setBookingData(bookingResult.data)

      // Fetch revenue data
      const revenueResponse = await fetch(
        `/api/reports/revenue?period=${revenuePeriod}${
          revenueDateRange?.from ? `&from=${revenueDateRange.from.toISOString()}` : ""
        }${revenueDateRange?.to ? `&to=${revenueDateRange.to.toISOString()}` : ""}`,
      )

      if (!revenueResponse.ok) {
        throw new Error("Failed to fetch revenue data")
      }

      const revenueResult = await revenueResponse.json()
      setRevenueData(revenueResult.data)

      // Fetch occupancy data
      const occupancyResponse = await fetch(
        `/api/reports/occupancy?period=${occupancyPeriod}&roomType=${roomType}${
          occupancyDateRange?.from ? `&from=${occupancyDateRange.from.toISOString()}` : ""
        }${occupancyDateRange?.to ? `&to=${occupancyDateRange.to.toISOString()}` : ""}`,
      )

      if (!occupancyResponse.ok) {
        throw new Error("Failed to fetch occupancy data")
      }

      const occupancyResult = await occupancyResponse.json()
      setOccupancyData(occupancyResult.data)

      // Set summary stats
      setSummaryStats({
        totalBookings: bookingResult.totalBookings,
        totalRevenue: revenueResult.totalRevenue,
        averageOccupancy: occupancyResult.averageOccupancy,
      })
    } catch (err) {
      console.error("Error fetching report data:", err)
      setError(err instanceof Error ? err.message : "An error occurred while fetching data")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle export
  const handleExport = async (reportType: string) => {
    try {
      let endpoint = ""
      let filename = ""

      switch (reportType) {
        case "bookings":
          endpoint = `/api/reports/export/bookings?period=${bookingPeriod}&status=${bookingStatus}${
            bookingDateRange?.from ? `&from=${bookingDateRange.from.toISOString()}` : ""
          }${bookingDateRange?.to ? `&to=${bookingDateRange.to.toISOString()}` : ""}`
          filename = `bookings-report-${new Date().toISOString().split("T")[0]}.csv`
          break
        case "revenue":
          endpoint = `/api/reports/export/revenue?period=${revenuePeriod}${
            revenueDateRange?.from ? `&from=${revenueDateRange.from.toISOString()}` : ""
          }${revenueDateRange?.to ? `&to=${revenueDateRange.to.toISOString()}` : ""}`
          filename = `revenue-report-${new Date().toISOString().split("T")[0]}.csv`
          break
        case "occupancy":
          endpoint = `/api/reports/export/occupancy?period=${occupancyPeriod}&roomType=${roomType}${
            occupancyDateRange?.from ? `&from=${occupancyDateRange.from.toISOString()}` : ""
          }${occupancyDateRange?.to ? `&to=${occupancyDateRange.to.toISOString()}` : ""}`
          filename = `occupancy-report-${new Date().toISOString().split("T")[0]}.csv`
          break
        default:
          endpoint = `/api/reports/export/all`
          filename = `hotel-report-${new Date().toISOString().split("T")[0]}.csv`
      }

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error("Failed to export report")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error exporting report:", err)
      setError(err instanceof Error ? err.message : "An error occurred while exporting data")
    }
  }

  // Function to update date range based on period selection
  const updateDateRange = (period: string, setDateRange: (range: DateRange | undefined) => void) => {
    const now = new Date()
    let from: Date

    switch (period) {
      case "today":
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        setDateRange({ from, to: now })
        break
      case "week":
        from = new Date(now)
        from.setDate(now.getDate() - 7)
        setDateRange({ from, to: now })
        break
      case "month":
        from = new Date(now.getFullYear(), now.getMonth(), 1)
        setDateRange({ from, to: now })
        break
      case "year":
        from = new Date(now.getFullYear(), 0, 1)
        setDateRange({ from, to: now })
        break
      case "custom":
        // Don't change the date range for custom
        break
    }
  }

  return (
    <div className="md:pt-0 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button onClick={() => handleExport("all")}>
          <FileDown className="h-4 w-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Bookings</p>
              <p className="text-2xl font-bold">{summaryStats.totalBookings}</p>
              <p className="text-sm text-muted-foreground mt-1">For the selected period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">{formatPrice(summaryStats.totalRevenue)}</p>
              <p className="text-sm text-muted-foreground mt-1">For the selected period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Average Occupancy</p>
              <p className="text-2xl font-bold">{summaryStats.averageOccupancy}%</p>
              <p className="text-sm text-muted-foreground mt-1">For the selected period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="mb-6">
          <TabsTrigger value="bookings">Booking Reports</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Reports</CardTitle>
              <CardDescription>View and analyze booking data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-auto">
                  <Select
                    value={bookingPeriod}
                    onValueChange={(value) => {
                      setBookingPeriod(value)
                      updateDateRange(value, setBookingDateRange)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {bookingPeriod === "custom" && (
                  <div className="w-full md:w-auto">
                    <DateRangePicker value={bookingDateRange} onChange={setBookingDateRange} />
                  </div>
                )}

                <div className="w-full md:w-auto">
                  <Select value={bookingStatus} onValueChange={setBookingStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto">
                  <Button onClick={() => handleExport("bookings")}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="h-[400px] w-full">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Loading booking data...</p>
                  </div>
                ) : bookingData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No booking data available for the selected filters</p>
                  </div>
                ) : (
                  <BookingChart data={bookingData} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Reports</CardTitle>
              <CardDescription>View and analyze revenue data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-auto">
                  <Select
                    value={revenuePeriod}
                    onValueChange={(value) => {
                      setRevenuePeriod(value)
                      updateDateRange(value, setRevenueDateRange)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {revenuePeriod === "custom" && (
                  <div className="w-full md:w-auto">
                    <DateRangePicker value={revenueDateRange} onChange={setRevenueDateRange} />
                  </div>
                )}

                <div className="ml-auto">
                  <Button onClick={() => handleExport("revenue")}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="h-[400px] w-full">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Loading revenue data...</p>
                  </div>
                ) : revenueData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No revenue data available for the selected filters</p>
                  </div>
                ) : (
                  <RevenueChart data={revenueData} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Reports</CardTitle>
              <CardDescription>View and analyze room occupancy data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-auto">
                  <Select
                    value={occupancyPeriod}
                    onValueChange={(value) => {
                      setOccupancyPeriod(value)
                      updateDateRange(value, setOccupancyDateRange)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {occupancyPeriod === "custom" && (
                  <div className="w-full md:w-auto">
                    <DateRangePicker value={occupancyDateRange} onChange={setOccupancyDateRange} />
                  </div>
                )}

                <div className="w-full md:w-auto">
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      <SelectItem value="deluxe">Deluxe Rooms</SelectItem>
                      <SelectItem value="executive">Executive Suites</SelectItem>
                      <SelectItem value="family">Family Rooms</SelectItem>
                      <SelectItem value="standard">Standard Rooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto">
                  <Button onClick={() => handleExport("occupancy")}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="h-[400px] w-full">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Loading occupancy data...</p>
                  </div>
                ) : occupancyData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No occupancy data available for the selected filters</p>
                  </div>
                ) : (
                  <OccupancyChart data={occupancyData} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

