import mongoose from "mongoose"

const SettingsSchema = new mongoose.Schema(
  {
    // General Settings
    siteName: { type: String, default: "Luxury Hotel & Resort" },
    tagline: { type: String, default: "Experience Luxury Like Never Before" },
    contactEmail: { type: String, default: "info@luxuryhotel.com" },
    contactPhone: { type: String, default: "+1 (555) 123-4567" },
    address: { type: String, default: "123 Luxury Avenue, Beverly Hills, CA 90210" },

    // Social Media
    socialLinks: {
      facebook: { type: String, default: "https://facebook.com/luxuryhotel" },
      instagram: { type: String, default: "https://instagram.com/luxuryhotel" },
      twitter: { type: String, default: "https://twitter.com/luxuryhotel" },
      linkedin: { type: String, default: "https://linkedin.com/company/luxuryhotel" },
    },

    // Appearance Settings
    theme: { type: String, default: "light" },
    primaryColor: { type: String, default: "#1e40af" }, // deep blue
    secondaryColor: { type: String, default: "#f59e0b" }, // amber
    logo: { type: String, default: "/logo.png" },
    favicon: { type: String, default: "/favicon.ico" },
    heroImage: { type: String, default: "/hero.jpg" },

    // Footer Settings
    footerText: { type: String, default: "© 2023 Luxury Hotel & Resort. All rights reserved." },
    footerLinks: [
      {
        title: { type: String },
        url: { type: String },
      },
    ],

    // Notification Settings
    emailNotifications: { type: Boolean, default: true },
    bookingConfirmationEmail: { type: Boolean, default: true },
    bookingReminderEmail: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
    adminNewBookingNotification: { type: Boolean, default: true },

    // Security Settings
    requireEmailVerification: { type: Boolean, default: true },
    enableTwoFactorAuth: { type: Boolean, default: false },
    passwordExpiryDays: { type: Number, default: 90 },
    sessionTimeoutMinutes: { type: Number, default: 60 },
  },
  { timestamps: true },
)

// Make sure there's only one settings document
SettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({})
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema)

