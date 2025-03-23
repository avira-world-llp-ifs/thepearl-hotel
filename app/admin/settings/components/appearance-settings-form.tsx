"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSettings } from "@/app/actions/settings"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
    message: "Please enter a valid hex color code.",
  }),
  secondaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
    message: "Please enter a valid hex color code.",
  }),
  logo: z.string().min(1, {
    message: "Please enter a logo URL.",
  }),
  favicon: z.string().min(1, {
    message: "Please enter a favicon URL.",
  }),
  heroImage: z.string().min(1, {
    message: "Please enter a hero image URL.",
  }),
})

export default function AppearanceSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: initialSettings.theme || "light",
      primaryColor: initialSettings.primaryColor || "#1e40af",
      secondaryColor: initialSettings.secondaryColor || "#f59e0b",
      logo: initialSettings.logo || "/logo.png",
      favicon: initialSettings.favicon || "/favicon.ico",
      heroImage: initialSettings.heroImage || "/hero.jpg",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const result = await updateSettings("appearance", values)

      if (result.success) {
        toast({
          title: "Settings updated",
          description: "Appearance settings have been updated successfully.",
        })
      } else {
        throw new Error(result.message || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize the look and feel of your website.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the default theme for your website.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="#1e40af" {...field} />
                        </FormControl>
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: field.value }} />
                      </div>
                      <FormDescription>Main color for buttons and highlights.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="#f59e0b" {...field} />
                        </FormControl>
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: field.value }} />
                      </div>
                      <FormDescription>Accent color for secondary elements.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Brand Assets</h3>

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/logo.png" {...field} />
                    </FormControl>
                    <FormDescription>The main logo displayed in the header.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/favicon.ico" {...field} />
                    </FormControl>
                    <FormDescription>The small icon displayed in browser tabs.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/hero.jpg" {...field} />
                    </FormControl>
                    <FormDescription>The main background image on the homepage.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="ml-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

