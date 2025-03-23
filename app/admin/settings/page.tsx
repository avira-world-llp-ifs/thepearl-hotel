import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GeneralSettingsForm from "./components/general-settings-form"
import AppearanceSettingsForm from "./components/appearance-settings-form"
import NotificationSettingsForm from "./components/notification-settings-form"
import SecuritySettingsForm from "./components/security-settings-form"
import SettingsLoading from "./components/settings-loading"
import { getSettings } from "@/app/actions/settings"

export const metadata = {
  title: "Admin Settings",
}

export default async function SettingsPage() {
  const { success, settings } = await getSettings()

  if (!success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load settings. Please try again later.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="container p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Suspense fallback={<SettingsLoading />}>
            <GeneralSettingsForm initialSettings={settings} />
          </Suspense>
        </TabsContent>

        <TabsContent value="appearance">
          <Suspense fallback={<SettingsLoading />}>
            <AppearanceSettingsForm initialSettings={settings} />
          </Suspense>
        </TabsContent>

        <TabsContent value="notifications">
          <Suspense fallback={<SettingsLoading />}>
            <NotificationSettingsForm initialSettings={settings} />
          </Suspense>
        </TabsContent>

        <TabsContent value="security">
          <Suspense fallback={<SettingsLoading />}>
            <SecuritySettingsForm initialSettings={settings} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

