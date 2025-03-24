import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ContactForm from "@/components/contact-form"
import { settingsService } from "@/lib/db"

export const metadata: Metadata = {
  title: "Contact Us | The Pearl Hotel",
  description: "Get in touch with The Pearl Hotel. We're here to answer your questions and help you plan your stay.",
}

export default async function ContactPage() {
  // Fetch settings from the database
  let contactInfo = {
    siteName: "The Pearl Hotel",
    contactEmail: "hotelthepearl55@gmail.com",
    contactPhone: "+91 (11) 23633363, 23634363",
    address: "8721/1, Desh Bandhu Gupta Road, Pahar Ganj, New Delhi-110055(INDIA)",
  }

  try {
    const settings = await settingsService.get()

    // Only override default values if settings data exists
    if (settings) {
      contactInfo = {
        siteName: settings.siteName || contactInfo.siteName,
        contactEmail: settings.contactEmail || contactInfo.contactEmail,
        contactPhone: settings.contactPhone || contactInfo.contactPhone,
        address: settings.address || contactInfo.address,
      }
    }
  } catch (error) {
    console.error("Error fetching settings:", error)
    // Use the default values defined above
  }

  // Format address for display
  const addressParts = contactInfo.address.split(",")
  const addressLine1 = addressParts[0]
  const addressLine2 = addressParts.slice(1).join(",")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're here to answer any questions you may have about our hotel, services, or booking process. Feel free to
          reach out to us using any of the methods below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Phone</CardTitle>
            <CardDescription>Call us directly</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium text-lg">{contactInfo.contactPhone.split(",")[0]}</p>
            {contactInfo.contactPhone.includes(",") && (
              <p className="font-medium text-lg">{contactInfo.contactPhone.split(",")[1]}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">Available 24/7 for reservations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Email</CardTitle>
            <CardDescription>Send us an email</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium text-lg">{contactInfo.contactEmail}</p>
            <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Address</CardTitle>
            <CardDescription>Visit us in person</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium text-lg">{addressLine1}</p>
            <p className="text-sm text-muted-foreground mt-1">{addressLine2}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <ContactForm />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Our Location</h2>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4924854870114!2d77.21180747528953!3d28.644969075658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd679c9500a5%3A0x7a61b946bf5f7e8c!2sHotel%20The%20Pearl!5e0!3m2!1sen!2sin!4v1742744532602!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Getting Here</h3>
            <div className="space-y-2">
              <p className="font-medium">From Indira Gandhi International Airport:</p>
              <p className="text-muted-foreground">
                The hotel is approximately 16 km from the airport. A taxi ride takes about 30-45 minutes depending on
                traffic.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">From New Delhi Railway Station:</p>
              <p className="text-muted-foreground">
                The hotel is just 2 km from the railway station, about a 10-minute drive.
              </p>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

