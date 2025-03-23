import dbConnect from "./mongodb"
import User from "./models/User"
import Room from "./models/Room"
import Booking from "./models/Booking"
import Review from "./models/Review"
import { hash } from "bcryptjs"

export async function seedDatabase() {
  await dbConnect()

  console.log("Seeding database...")

  // Clear existing data
  await User.deleteMany({})
  await Room.deleteMany({})
  await Booking.deleteMany({})
  await Review.deleteMany({})

  // Create users
  const adminPassword = await hash("admin123", 10)
  const userPassword = await hash("password123", 10)

  const admin = await User.create({
    name: "Admin User",
    email: "admin@hotel.com",
    password: adminPassword,
    role: "admin",
  })

  const user = await User.create({
    name: "Test User",
    email: "user@example.com",
    password: userPassword,
    role: "user",
  })

  // Create rooms
  const room1 = await Room.create({
    name: "Deluxe King Room",
    description: "A spacious room with a king-sized bed and a beautiful view of the city.",
    price: 199.99,
    capacity: 2,
    size: 400, // square feet
    images: ["/rooms/deluxe-king-1.jpg", "/rooms/deluxe-king-2.jpg"],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Room Service"],
    featured: true,
  })

  const room2 = await Room.create({
    name: "Executive Suite",
    description: "An elegant suite with a separate living area and premium amenities.",
    price: 299.99,
    capacity: 2,
    size: 600, // square feet
    images: ["/rooms/executive-suite-1.jpg", "/rooms/executive-suite-2.jpg"],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Room Service", "Jacuzzi"],
    featured: true,
  })

  const room3 = await Room.create({
    name: "Family Room",
    description: "A comfortable room designed for families with children.",
    price: 249.99,
    capacity: 4,
    size: 500, // square feet
    images: ["/rooms/family-room-1.jpg", "/rooms/family-room-2.jpg"],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Room Service"],
    featured: false,
  })

  // Create bookings
  const booking = await Booking.create({
    userId: user._id,
    roomId: room1._id,
    checkIn: new Date("2023-12-20"),
    checkOut: new Date("2023-12-25"),
    guests: 2,
    totalPrice: 999.95,
    status: "completed",
  })

  // Create reviews
  await Review.create({
    userId: user._id,
    roomId: room1._id,
    bookingId: booking._id,
    rating: 5,
    comment: "Excellent stay! The room was clean and the staff was very friendly.",
  })

  console.log("Database seeded successfully!")
}

