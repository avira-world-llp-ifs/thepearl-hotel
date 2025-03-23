"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  images: z.array(z.string()).optional(),
  highlights: z.array(z.string()).min(1, {
    message: "At least one highlight is required.",
  }),
  inclusions: z.array(z.string()).min(1, {
    message: "At least one inclusion is required.",
  }),
  exclusions: z.array(z.string()).min(1, {
    message: "At least one exclusion is required.",
  }),
  itinerary: z
    .array(
      z.object({
        day: z.coerce.number().positive({
          message: "Day must be a positive number.",
        }),
        title: z.string().min(2, {
          message: "Title must be at least 2 characters.",
        }),
        description: z.string().min(10, {
          message: "Description must be at least 10 characters.",
        }),
        accommodation: z.string().optional(),
        meals: z.array(z.string()).optional(),
      }),
    )
    .min(1, {
      message: "At least one itinerary day is required.",
    }),
  maxGroupSize: z.coerce.number().positive({
    message: "Group size must be a positive number.",
  }),
  difficulty: z.string({
    required_error: "Please select a difficulty level.",
  }),
  startDates: z.array(z.date()).min(1, {
    message: "At least one start date is required.",
  }),
  featured: z.boolean().default(false),
})

type TourFormValues = z.infer<typeof formSchema>

const defaultValues: Partial<TourFormValues> = {
  title: "",
  description: "",
  duration: "",
  price: 0,
  location: "",
  images: [],
  highlights: [""],
  inclusions: [""],
  exclusions: [""],
  itinerary: [
    {
      day: 1,
      title: "",
      description: "",
      accommodation: "",
      meals: [],
    },
  ],
  maxGroupSize: 15,
  difficulty: "medium",
  startDates: [],
  featured: false,
}

export function TourForm({ tour }: { tour?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TourFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: tour
      ? {
          ...tour,
          startDates: tour.startDates?.map((date: string) => new Date(date)),
        }
      : defaultValues,
  })

  async function onSubmit(values: TourFormValues) {
    setIsSubmitting(true)

    try {
      const url = tour ? `/api/tours/${tour._id}` : "/api/tours"
      const method = tour ? "PUT" : "POST"

      console.log(`Submitting form to ${url} with method ${method}`)
      console.log("Form values:", values)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const responseData = await response.json()
      console.log("API response:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to ${tour ? "update" : "create"} tour`)
      }

      toast({
        title: tour ? "Tour Updated" : "Tour Created",
        description: tour
          ? "The tour package has been successfully updated."
          : "The tour package has been successfully created.",
      })

      router.push("/admin/tours")
      router.refresh()
    } catch (error) {
      console.error(`Error ${tour ? "updating" : "creating"} tour:`, error)
      toast({
        title: "Error",
        description:
          error.message || `There was a problem ${tour ? "updating" : "creating"} the tour. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to add a new item to an array field
  const addArrayItem = (fieldName: string, defaultValue: any) => {
    const currentValues = form.getValues(fieldName as any) || []
    form.setValue(fieldName as any, [...currentValues, defaultValue])
  }

  // Function to remove an item from an array field
  const removeArrayItem = (fieldName: string, index: number) => {
    const currentValues = form.getValues(fieldName as any) || []
    form.setValue(
      fieldName as any,
      currentValues.filter((_: any, i: number) => i !== index),
    )
  }

  // Function to add a new date to startDates
  const addStartDate = (date: Date) => {
    const currentDates = form.getValues("startDates") || []
    // Check if date already exists
    if (!currentDates.some((d) => d.toDateString() === date.toDateString())) {
      form.setValue("startDates", [...currentDates, date])
    }
  }

  // Function to remove a date from startDates
  const removeStartDate = (index: number) => {
    const currentDates = form.getValues("startDates") || []
    form.setValue(
      "startDates",
      currentDates.filter((_: any, i: number) => i !== index),
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="dates">Dates & Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Golden Triangle Tour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Delhi, Agra, Jaipur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="6 Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxGroupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Group Size</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={50} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description of the tour..." className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Images</FormLabel>
              <FormDescription className="mb-2">
                Add image URLs for the tour. The first image will be used as the cover image.
              </FormDescription>

              {form.watch("images")?.map((image, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={image}
                    onChange={(e) => {
                      const newImages = [...(form.getValues("images") || [])]
                      newImages[index] = e.target.value
                      form.setValue("images", newImages)
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem("images", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("images", "")}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div>
              <FormLabel>Highlights</FormLabel>
              <FormDescription className="mb-2">Add key highlights of the tour.</FormDescription>

              {form.watch("highlights")?.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={highlight}
                    onChange={(e) => {
                      const newHighlights = [...(form.getValues("highlights") || [])]
                      newHighlights[index] = e.target.value
                      form.setValue("highlights", newHighlights)
                    }}
                    placeholder="Visit the iconic Taj Mahal at sunrise"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem("highlights", index)}
                    disabled={form.watch("highlights")?.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("highlights", "")}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Highlight
              </Button>
            </div>

            <div>
              <FormLabel>Inclusions</FormLabel>
              <FormDescription className="mb-2">Add what is included in the tour package.</FormDescription>

              {form.watch("inclusions")?.map((inclusion, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={inclusion}
                    onChange={(e) => {
                      const newInclusions = [...(form.getValues("inclusions") || [])]
                      newInclusions[index] = e.target.value
                      form.setValue("inclusions", newInclusions)
                    }}
                    placeholder="5 nights accommodation in 4-star hotels"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem("inclusions", index)}
                    disabled={form.watch("inclusions")?.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("inclusions", "")}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Inclusion
              </Button>
            </div>

            <div>
              <FormLabel>Exclusions</FormLabel>
              <FormDescription className="mb-2">Add what is not included in the tour package.</FormDescription>

              {form.watch("exclusions")?.map((exclusion, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={exclusion}
                    onChange={(e) => {
                      const newExclusions = [...(form.getValues("exclusions") || [])]
                      newExclusions[index] = e.target.value
                      form.setValue("exclusions", newExclusions)
                    }}
                    placeholder="International/domestic flights"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem("exclusions", index)}
                    disabled={form.watch("exclusions")?.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("exclusions", "")}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exclusion
              </Button>
            </div>

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="difficult">Difficult</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6 mt-6">
            <FormLabel>Itinerary</FormLabel>
            <FormDescription className="mb-4">Add the day-by-day itinerary for the tour.</FormDescription>

            {form.watch("itinerary")?.map((day, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Day {day.day}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeArrayItem("itinerary", index)}
                      disabled={form.watch("itinerary")?.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Day
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Day Number</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        value={day.day}
                        onChange={(e) => {
                          const newItinerary = [...(form.getValues("itinerary") || [])]
                          newItinerary[index].day = Number.parseInt(e.target.value)
                          form.setValue("itinerary", newItinerary)
                        }}
                      />
                    </div>

                    <div>
                      <FormLabel>Title</FormLabel>
                      <Input
                        value={day.title}
                        onChange={(e) => {
                          const newItinerary = [...(form.getValues("itinerary") || [])]
                          newItinerary[index].title = e.target.value
                          form.setValue("itinerary", newItinerary)
                        }}
                        placeholder="Arrival in Delhi"
                      />
                    </div>
                  </div>

                  <div>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={day.description}
                      onChange={(e) => {
                        const newItinerary = [...(form.getValues("itinerary") || [])]
                        newItinerary[index].description = e.target.value
                        form.setValue("itinerary", newItinerary)
                      }}
                      placeholder="Detailed description of the day's activities..."
                      className="min-h-20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Accommodation</FormLabel>
                      <Input
                        value={day.accommodation}
                        onChange={(e) => {
                          const newItinerary = [...(form.getValues("itinerary") || [])]
                          newItinerary[index].accommodation = e.target.value
                          form.setValue("itinerary", newItinerary)
                        }}
                        placeholder="4-star hotel in Delhi"
                      />
                    </div>

                    <div>
                      <FormLabel>Meals</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                          <div key={meal} className="flex items-center space-x-2">
                            <Checkbox
                              id={`meal-${index}-${meal}`}
                              checked={(day.meals || []).includes(meal)}
                              onCheckedChange={(checked) => {
                                const newItinerary = [...(form.getValues("itinerary") || [])]
                                const currentMeals = newItinerary[index].meals || []

                                if (checked) {
                                  newItinerary[index].meals = [...currentMeals, meal]
                                } else {
                                  newItinerary[index].meals = currentMeals.filter((m) => m !== meal)
                                }

                                form.setValue("itinerary", newItinerary)
                              }}
                            />
                            <label
                              htmlFor={`meal-${index}-${meal}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {meal}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentItinerary = form.getValues("itinerary") || []
                const nextDay =
                  currentItinerary.length > 0 ? Math.max(...currentItinerary.map((day) => day.day)) + 1 : 1

                addArrayItem("itinerary", {
                  day: nextDay,
                  title: "",
                  description: "",
                  accommodation: "",
                  meals: [],
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Day
            </Button>
          </TabsContent>

          <TabsContent value="dates" className="space-y-6 mt-6">
            <div>
              <FormLabel>Start Dates</FormLabel>
              <FormDescription className="mb-2">Add available start dates for the tour.</FormDescription>

              <div className="flex flex-wrap gap-2 mb-4">
                {form.watch("startDates")?.map((date, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                    {format(date, "PPP")}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => removeStartDate(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Add Start Date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => date && addStartDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {form.formState.errors.startDates && (
                <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.startDates.message}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Tour</FormLabel>
                    <FormDescription>This tour will be displayed prominently on the homepage.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/tours")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : tour ? "Update Tour" : "Create Tour"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

