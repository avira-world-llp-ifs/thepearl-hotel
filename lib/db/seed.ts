import { dbConnect } from "./dbConnect"
import User from "./models/User"
import bcrypt from "bcryptjs"

export async function seedUsers() {
  try {
    await dbConnect()

    // Check if we already have users
    const userCount = await User.countDocuments()

    if (userCount === 0) {
      console.log("No users found, seeding database...")

      // Create admin user
      const adminPassword = await bcrypt.hash("admin123", 10)
      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin",
      })

      // Create regular user
      const userPassword = await bcrypt.hash("user123", 10)
      await User.create({
        name: "Regular User",
        email: "user@example.com",
        password: userPassword,
        role: "user",
      })

      console.log("Database seeded with test users!")
    } else {
      console.log(`Found ${userCount} existing users, skipping seed.`)
    }
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

