import { MongoClient } from "mongodb"
import { bookingService } from "./services/bookingService"
import { categoryService } from "./services/categoryService"
import { enquiryService } from "./services/enquiryService"
import { facilityService } from "./services/facilityService"
import { roomService } from "./services/roomService"
import { settingsService } from "./services/settingsService"
import { tourService } from "./services/tourService"
import { tourEnquiryService } from "./services/tourEnquiryService"
import { userService } from "./services/userService"
import { generalEnquiryService } from "./services/generalEnquiryService"
import { reviewService } from "./services/reviewService"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export const connectToDatabase = async () => {
  const client = await clientPromise
  const db = client.db("hotel-booking")
  return { db, client }
}

export const db = {
  connect: connectToDatabase,
}

export {
  bookingService,
  categoryService,
  enquiryService,
  facilityService,
  roomService,
  settingsService,
  tourService,
  tourEnquiryService,
  userService,
  generalEnquiryService,
  reviewService,
}

