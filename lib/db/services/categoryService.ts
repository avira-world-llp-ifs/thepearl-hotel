import { dbConnect } from "../dbConnect"
import Category from "../models/Category"

export const categoryService = {
  getAll: async () => {
    try {
      await dbConnect()
      const categories = await Category.find({}).lean()
      console.log(`Retrieved ${categories.length} categories from database`)
      return categories
    } catch (error) {
      console.error("Error in categoryService.getAll:", error)
      throw error
    }
  },
  getById: async (id: string) => {
    try {
      await dbConnect()
      const category = await Category.findById(id).lean()
      if (!category) {
        console.log(`Category with ID ${id} not found`)
      } else {
        console.log(`Retrieved category with ID ${id}`)
      }
      return category
    } catch (error) {
      console.error(`Error in categoryService.getById for ID ${id}:`, error)
      throw error
    }
  },
  create: async (category: any) => {
    try {
      await dbConnect()
      console.log("Creating category with data:", category)

      // Validate required fields
      if (!category.name) throw new Error("Category name is required")

      const newCategory = await Category.create(category)
      console.log("Category created successfully:", newCategory)
      return newCategory
    } catch (error) {
      console.error("Error in categoryService.create:", error)
      throw error
    }
  },
  update: async (id: string, data: any) => {
    try {
      await dbConnect()
      console.log(`Updating category with ID ${id} with data:`, data)
      const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true }).lean()
      if (!updatedCategory) {
        console.log(`Category with ID ${id} not found for update`)
      } else {
        console.log(`Category with ID ${id} updated successfully`)
      }
      return updatedCategory
    } catch (error) {
      console.error(`Error in categoryService.update for ID ${id}:`, error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      await dbConnect()
      console.log(`Deleting category with ID ${id}`)
      const deletedCategory = await Category.findByIdAndDelete(id).lean()
      if (!deletedCategory) {
        console.log(`Category with ID ${id} not found for deletion`)
      } else {
        console.log(`Category with ID ${id} deleted successfully`)
      }
      return deletedCategory
    } catch (error) {
      console.error(`Error in categoryService.delete for ID ${id}:`, error)
      throw error
    }
  },
}

