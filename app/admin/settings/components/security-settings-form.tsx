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
import { Switch } from "@/components/ui/switch"
import { updateSettings } from "@/app/actions/settings"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  requireEmailVerification: z.boolean(),
  enableTwoFactorAuth: z.boolean(),
  passwordExpiryDays: z.number().int().positive().max(365),
  sessionTimeoutMinutes: z.number().int().positive().max(1440),
})

export default function SecuritySettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requireEmailVerification: initialSettings.requireEmailVerification ?? true,
      enableTwoFactorAuth: initialSettings.enableTwoFactorAuth ?? false,
      passwordExpiryDays: initialSettings.passwordExpiryDays ?? 90,
      sessionTimeoutMinutes: initialSettings.sessionTimeoutMinutes ?? 60,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const result = await updateSettings("security", values)

      if (result.success) {
        toast({
          title: "Settings updated",
          description: "Security settings have been updated successfully.",
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
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Configure security options for your website.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="requireEmailVerification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Verification</FormLabel>
                    <FormDescription>Require users to verify their email address.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableTwoFactorAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                    <FormDescription>Enable two-factor authentication for admin accounts.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordExpiryDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Expiry (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 90)}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of days before users need to change their passwords. Set to 0 to disable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionTimeoutMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Timeout (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="1440"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 60)}
                    />
                  </FormControl>
                  <FormDescription>Inactive session timeout duration in minutes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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

