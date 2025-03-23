import { dbConnect } from "../dbConnect"
import Settings from "../models/Settings"

export const settingsService = {
  get: async () => {
    try {
      await dbConnect()
      const settings = await Settings.getSettings()
      console.log("Retrieved settings from database")
      return settings
    } catch (error) {
      console.error("Error in settingsService.get:", error)
      throw error
    }
  },
  update: async (section: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating ${section} settings with data:`, data)

      // Get current settings
      let settings = await Settings.findOne({})
      if (!settings) {
        settings = await Settings.create({})
      }

      // Handle different sections
      if (section === "general") {
        if (data.siteName) settings.siteName = data.siteName
        if (data.tagline) settings.tagline = data.tagline
        if (data.contactEmail) settings.contactEmail = data.contactEmail
        if (data.contactPhone) settings.contactPhone = data.contactPhone
        if (data.address) settings.address = data.address

        // Update social links if provided
        if (data.socialLinks) {
          if (data.socialLinks.facebook) settings.socialLinks.facebook = data.socialLinks.facebook
          if (data.socialLinks.instagram) settings.socialLinks.instagram = data.socialLinks.instagram
          if (data.socialLinks.twitter) settings.socialLinks.twitter = data.socialLinks.twitter
          if (data.socialLinks.linkedin) settings.socialLinks.linkedin = data.socialLinks.linkedin
        }
      } else if (section === "appearance") {
        if (data.theme) settings.theme = data.theme
        if (data.primaryColor) settings.primaryColor = data.primaryColor
        if (data.secondaryColor) settings.secondaryColor = data.secondaryColor
        if (data.logo) settings.logo = data.logo
        if (data.favicon) settings.favicon = data.favicon
        if (data.heroImage) settings.heroImage = data.heroImage
      } else if (section === "notifications") {
        if (data.emailNotifications !== undefined) settings.emailNotifications = data.emailNotifications
        if (data.bookingConfirmationEmail !== undefined)
          settings.bookingConfirmationEmail = data.bookingConfirmationEmail
        if (data.bookingReminderEmail !== undefined) settings.bookingReminderEmail = data.bookingReminderEmail
        if (data.marketingEmails !== undefined) settings.marketingEmails = data.marketingEmails
        if (data.adminNewBookingNotification !== undefined)
          settings.adminNewBookingNotification = data.adminNewBookingNotification
      } else if (section === "security") {
        if (data.requireEmailVerification !== undefined)
          settings.requireEmailVerification = data.requireEmailVerification
        if (data.enableTwoFactorAuth !== undefined) settings.enableTwoFactorAuth = data.enableTwoFactorAuth
        if (data.passwordExpiryDays !== undefined) settings.passwordExpiryDays = data.passwordExpiryDays
        if (data.sessionTimeoutMinutes !== undefined) settings.sessionTimeoutMinutes = data.sessionTimeoutMinutes
      } else if (section === "footer") {
        if (data.footerText) settings.footerText = data.footerText
        if (data.footerLinks) settings.footerLinks = data.footerLinks
      }

      await settings.save()
      console.log(`${section} settings updated successfully`)
      return settings
    } catch (error) {
      console.error(`Error in settingsService.update for section ${section}:`, error)
      throw error
    }
  },
}

