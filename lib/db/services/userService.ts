import { dbConnect } from "../dbConnect"
import User from "../models/User"

export const userService = {
  getAll: async () => {
    try {
      await dbConnect()
      const users = await User.find({}).lean()
      console.log(`Retrieved ${users.length} users from database`)
      return users
    } catch (error) {
      console.error("Error in userService.getAll:", error)
      throw error
    }
  },
  getById: async (id: string) => {
    try {
      await dbConnect()
      const user = await User.findById(id).lean()
      if (!user) {
        console.log(`User with ID ${id} not found`)
      } else {
        console.log(`Retrieved user with ID ${id}`)
      }
      return user
    } catch (error) {
      console.error(`Error in userService.getById for ID ${id}:`, error)
      throw error
    }
  },
  findByEmail: async (email: string) => {
    try {
      await dbConnect()
      console.log(`Looking for user with email: ${email}`)
      // Use the model's findOne method directly
      const user = await User.findOne({ email }).lean()
      if (!user) {
        console.log(`User with email ${email} not found`)
      } else {
        console.log(`Retrieved user with email ${email}`)
      }
      return user
    } catch (error) {
      console.error(`Error in userService.findByEmail for email ${email}:`, error)
      throw error
    }
  },
  getByEmail: async (email: string) => {
    return userService.findByEmail(email)
  },
  create: async (user: any) => {
    try {
      await dbConnect()
      console.log("Creating user with data:", user)

      // Validate required fields
      if (!user.name) throw new Error("Name is required")
      if (!user.email) throw new Error("Email is required")

      const newUser = await User.create(user)
      console.log("User created successfully:", newUser)
      return newUser
    } catch (error) {
      console.error("Error in userService.create:", error)
      throw error
    }
  },
  update: async (id: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating user with ID ${id} with data:`, data)
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).lean()
      if (!updatedUser) {
        console.log(`User with ID ${id} not found for update`)
      } else {
        console.log(`User with ID ${id} updated successfully`)
      }
      return updatedUser
    } catch (error) {
      console.error(`Error in userService.update for ID ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Deleting user with ID ${id}`)
      const deletedUser = await User.findByIdAndDelete(id).lean()
      if (!deletedUser) {
        console.log(`User with ID ${id} not found for deletion`)
      } else {
        console.log(`User with ID ${id} deleted successfully`)
      }
      return deletedUser
    } catch (error) {
      console.error(`Error in userService.delete for ID ${id}:`, error)
      throw error
    }
  },
}

