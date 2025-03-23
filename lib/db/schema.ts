// This is a mock schema to represent our database structure
// In a real application, you would use Prisma or another ORM

export type User = {
  id: string
  name: string
  email: string
  password: string // In reality, this would be hashed
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export type Room = {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  size: number
  images: string[]
  amenities: string[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export type Booking = {
  id: string
  userId: string
  roomId: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: Date
  updatedAt: Date
}

export type Review = {
  id: string
  userId: string
  roomId: string
  bookingId: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

// Collection names for MongoDB
export const collections = {
  users: "users",
  rooms: "rooms",
  bookings: "bookings",
  reviews: "reviews",
  settings: "settings",
}

// Export collections for use in the application
export const users = {
  collection: collections.users,
  schema: {} as User,
}

export const rooms = {
  collection: collections.rooms,
  schema: {} as Room,
}

export const bookings = {
  collection: collections.bookings,
  schema: {} as Booking,
}

export const reviews = {
  collection: collections.reviews,
  schema: {} as Review,
}

